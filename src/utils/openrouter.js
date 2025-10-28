import AsyncStorage from '@react-native-async-storage/async-storage';

// OpenRouter API Keys with automatic rotation
const OPENROUTER_KEYS = [
  process.env.EXPO_PUBLIC_OPENROUTER_API_KEY_1,
  process.env.EXPO_PUBLIC_OPENROUTER_API_KEY_2,
  process.env.EXPO_PUBLIC_OPENROUTER_API_KEY_3,
  process.env.EXPO_PUBLIC_OPENROUTER_API_KEY_4,
  process.env.EXPO_PUBLIC_OPENROUTER_API_KEY_5,
].filter(key => key && key !== 'your_openrouter_key_1' && key !== 'your_openrouter_key_2' && key !== 'your_openrouter_key_3' && key !== 'your_openrouter_key_4' && key !== 'your_openrouter_key_5');

const STORAGE_KEYS = {
  CURRENT_KEY_INDEX: 'openrouter_current_key_index',
  KEY_USAGE_COUNT: 'openrouter_key_usage_count',
  LAST_RESET_DATE: 'openrouter_last_reset_date',
  FAILED_KEYS: 'openrouter_failed_keys',
};

// Free model configuration
const FREE_MODEL = 'meta-llama/llama-3.2-3b-instruct:free';
const DAILY_LIMIT_PER_KEY = 200; // Conservative limit for free tier

class OpenRouterManager {
  constructor() {
    this.baseURL = 'https://openrouter.ai/api/v1';
    this.currentKeyIndex = 0;
    this.usageCount = 0;
    this.failedKeys = new Set();
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      const [keyIndex, usageCount, lastResetDate, failedKeys] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.CURRENT_KEY_INDEX),
        AsyncStorage.getItem(STORAGE_KEYS.KEY_USAGE_COUNT),
        AsyncStorage.getItem(STORAGE_KEYS.LAST_RESET_DATE),
        AsyncStorage.getItem(STORAGE_KEYS.FAILED_KEYS),
      ]);

      this.currentKeyIndex = keyIndex ? parseInt(keyIndex, 10) : 0;
      this.usageCount = usageCount ? parseInt(usageCount, 10) : 0;
      this.failedKeys = new Set(failedKeys ? JSON.parse(failedKeys) : []);

      // Reset daily usage if it's a new day
      const today = new Date().toDateString();
      if (lastResetDate !== today) {
        await this.resetDailyUsage();
      }

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize OpenRouter manager:', error);
      this.initialized = true; // Continue with defaults
    }
  }

  async resetDailyUsage() {
    const today = new Date().toDateString();
    this.usageCount = 0;
    this.currentKeyIndex = 0;
    this.failedKeys.clear();

    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.CURRENT_KEY_INDEX, '0'),
      AsyncStorage.setItem(STORAGE_KEYS.KEY_USAGE_COUNT, '0'),
      AsyncStorage.setItem(STORAGE_KEYS.LAST_RESET_DATE, today),
      AsyncStorage.setItem(STORAGE_KEYS.FAILED_KEYS, '[]'),
    ]);
  }

  async rotateKey() {
    // Mark current key as failed
    this.failedKeys.add(this.currentKeyIndex);
    
    // Find next available key
    let nextIndex = (this.currentKeyIndex + 1) % OPENROUTER_KEYS.length;
    let attempts = 0;
    
    while (this.failedKeys.has(nextIndex) && attempts < OPENROUTER_KEYS.length) {
      nextIndex = (nextIndex + 1) % OPENROUTER_KEYS.length;
      attempts++;
    }

    // If all keys are failed, reset failed keys and try again
    if (attempts >= OPENROUTER_KEYS.length) {
      this.failedKeys.clear();
      nextIndex = (this.currentKeyIndex + 1) % OPENROUTER_KEYS.length;
    }

    this.currentKeyIndex = nextIndex;
    this.usageCount = 0; // Reset usage count for new key

    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.CURRENT_KEY_INDEX, this.currentKeyIndex.toString()),
      AsyncStorage.setItem(STORAGE_KEYS.KEY_USAGE_COUNT, '0'),
      AsyncStorage.setItem(STORAGE_KEYS.FAILED_KEYS, JSON.stringify([...this.failedKeys])),
    ]);
  }

  async incrementUsage() {
    this.usageCount++;
    await AsyncStorage.setItem(STORAGE_KEYS.KEY_USAGE_COUNT, this.usageCount.toString());
    
    // Auto-rotate if we hit the daily limit
    if (this.usageCount >= DAILY_LIMIT_PER_KEY) {
      await this.rotateKey();
    }
  }

  getCurrentKey() {
    if (OPENROUTER_KEYS.length === 0) {
      throw new Error('No OpenRouter API keys configured');
    }
    return OPENROUTER_KEYS[this.currentKeyIndex];
  }

  async makeRequest(endpoint, options = {}) {
    await this.initialize();

    const maxRetries = OPENROUTER_KEYS.length;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const apiKey = this.getCurrentKey();
        const response = await fetch(`${this.baseURL}${endpoint}`, {
          ...options,
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.EXPO_PUBLIC_BASE_URL || 'https://aivy-app.com',
            'X-Title': 'Aivy Health App',
            ...options.headers,
          },
        });

        // Handle rate limiting (429) or unauthorized (401)
        if (response.status === 429 || response.status === 401) {
          console.warn(`OpenRouter API key ${this.currentKeyIndex} hit limit or unauthorized, rotating...`);
          await this.rotateKey();
          attempt++;
          continue;
        }

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`OpenRouter API error: ${response.status} ${error}`);
        }

        // Success - increment usage
        await this.incrementUsage();
        return response;

      } catch (error) {
        console.error(`OpenRouter request failed (attempt ${attempt + 1}):`, error);
        
        if (attempt < maxRetries - 1) {
          await this.rotateKey();
          attempt++;
        } else {
          throw error;
        }
      }
    }
  }

  async chatCompletion(messages, options = {}) {
    const response = await this.makeRequest('/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        model: FREE_MODEL,
        messages: messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1000,
        stream: options.stream || false,
        ...options,
      }),
    });

    if (options.stream) {
      return response; // Return response for streaming
    }

    return await response.json();
  }

  async streamChatCompletion(messages, options = {}) {
    return await this.chatCompletion(messages, {
      ...options,
      stream: true,
    });
  }
}

// Export singleton instance
export const openrouter = new OpenRouterManager();

// Convenience functions
export async function askAI(messages, options = {}) {
  try {
    const response = await openrouter.chatCompletion(messages, options);
    return response.choices?.[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenRouter AI request failed:', error);
    throw new Error('Failed to get AI response. Please try again.');
  }
}

export async function streamAI(messages, options = {}) {
  try {
    return await openrouter.streamChatCompletion(messages, options);
  } catch (error) {
    console.error('OpenRouter streaming request failed:', error);
    throw new Error('Failed to stream AI response. Please try again.');
  }
}

export default openrouter;