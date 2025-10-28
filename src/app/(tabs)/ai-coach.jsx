import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import {
  Bot,
  Send,
  Sparkles,
  MessageCircle,
  User,
  Calendar,
  TrendingUp,
  Utensils,
  Save,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import useAivyTheme from "@/utils/theme";
import { askAI } from "@/utils/openrouter";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";

export default function AICoachScreen() {
  const theme = useAivyTheme();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef(null);
  const textInputRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadUserData();
    initializeChat();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem("aivy_user_data");
      if (data) {
        setUserData(JSON.parse(data));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const initializeChat = () => {
    const welcomeMessage = {
      id: Date.now(),
      role: "assistant",
      content:
        "Hi there! I'm Aivy, your AI health coach. I'm here to help you with nutrition advice, workout planning, and achieving your fitness goals. What would you like to know today?",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  const handleFinishMessage = (content) => {
    const newMessage = {
      id: Date.now(),
      role: "assistant",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setStreamingMessage("");
    setIsLoading(false);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: inputText.trim(),
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText("");
    setIsLoading(true);
    scrollToBottom();

    try {
      // Prepare messages for AI with system context
      const systemPrompt = `You are Aivy, an AI health and fitness coach. You are helpful, encouraging, and knowledgeable about nutrition, fitness, and wellness. 

User Information:
- Name: ${userData?.name || "User"}
- Age: ${userData?.age || "Not provided"}
- Height: ${userData?.height || "Not provided"} cm
- Weight: ${userData?.weight || "Not provided"} kg
- Gender: ${userData?.gender || "Not provided"}
- Goal: ${userData?.goal === "lose" ? "Lose weight" : userData?.goal === "gain" ? "Gain weight" : userData?.goal === "maintain" ? "Maintain weight" : "Not set"}

When creating diet plans:
1. Ask about dietary preferences, allergies, cooking time, and budget
2. Provide detailed, practical meal plans with recipes
3. Include nutritional information and alternatives
4. Make it actionable and easy to follow

Provide personalized advice based on this information. Be conversational, supportive, and practical. Keep responses informative but not overwhelming.`;

      const conversationHistory = [
        { role: "system", content: systemPrompt },
        ...newMessages.slice(-8).map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ];

      const aiResponse = await askAI(conversationHistory, {
        temperature: 0.7,
        maxTokens: 1000,
      });

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };

      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);

      // Save conversation history
      await AsyncStorage.setItem(
        "aivy_chat_history",
        JSON.stringify(finalMessages),
      );
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "I'm having trouble connecting right now. Please try again in a moment! 🤖",
        timestamp: new Date(),
      };

      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const handleQuickAction = (action) => {
    let message = "";
    switch (action) {
      case "diet":
        message = "Can you generate a personalized weekly diet plan for me?";
        break;
      case "progress":
        message = "Show me my health progress and what I should focus on next.";
        break;
      case "workout":
        message = "Suggest a workout routine that fits my goals.";
        break;
      case "nutrition":
        message = "What foods should I eat to reach my fitness goals?";
        break;
    }
    setInputText(message);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const MessageBubble = ({ message }) => {
    const isUser = message.role === "user";

    return (
      <MotiView
        from={{ opacity: 0, translateY: 20, scale: 0.9 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{ duration: 300 }}
        style={{
          flexDirection: "row",
          justifyContent: isUser ? "flex-end" : "flex-start",
          marginBottom: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
        }}
      >
        {!isUser && (
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: theme.colors.primary,
              alignItems: "center",
              justifyContent: "center",
              marginRight: theme.spacing.sm,
              alignSelf: "flex-end",
            }}
          >
            <Bot size={18} color={theme.colors.textInverse} />
          </View>
        )}

        <View
          style={{
            maxWidth: "80%",
            backgroundColor: isUser
              ? theme.colors.primary
              : theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.md,
            ...(isUser ? {} : theme.shadows.sm),
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "400",
              color: isUser ? theme.colors.textInverse : theme.colors.text,
              fontFamily: "Inter_400Regular",
              lineHeight: 22,
            }}
          >
            {message.content}
          </Text>

          <Text
            style={{
              fontSize: 12,
              fontWeight: "400",
              color: isUser
                ? `${theme.colors.textInverse}80`
                : theme.colors.textTertiary,
              fontFamily: "Inter_400Regular",
              marginTop: 4,
              textAlign: isUser ? "right" : "left",
            }}
          >
            {formatTime(message.timestamp)}
          </Text>
        </View>

        {isUser && (
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: theme.colors.surface,
              alignItems: "center",
              justifyContent: "center",
              marginLeft: theme.spacing.sm,
              alignSelf: "flex-end",
            }}
          >
            <Text style={{ fontSize: 16 }}>{userData?.avatar || "🧑‍💻"}</Text>
          </View>
        )}
      </MotiView>
    );
  };

  const StreamingBubble = () => (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      style={{
        flexDirection: "row",
        justifyContent: "flex-start",
        marginBottom: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: theme.colors.primary,
          alignItems: "center",
          justifyContent: "center",
          marginRight: theme.spacing.sm,
          alignSelf: "flex-end",
        }}
      >
        <Bot size={18} color={theme.colors.textInverse} />
      </View>

      <View
        style={{
          maxWidth: "80%",
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.md,
          ...theme.shadows.sm,
        }}
      >
        {streamingMessage ? (
          <Text
            style={{
              fontSize: 16,
              fontWeight: "400",
              color: theme.colors.text,
              fontFamily: "Inter_400Regular",
              lineHeight: 22,
            }}
          >
            {streamingMessage}
          </Text>
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MotiView
              from={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "timing",
                duration: 600,
                loop: true,
              }}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: theme.colors.primary,
                marginHorizontal: 2,
              }}
            />
            <MotiView
              from={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "timing",
                duration: 600,
                delay: 200,
                loop: true,
              }}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: theme.colors.primary,
                marginHorizontal: 2,
              }}
            />
            <MotiView
              from={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "timing",
                duration: 600,
                delay: 400,
                loop: true,
              }}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: theme.colors.primary,
                marginHorizontal: 2,
              }}
            />
          </View>
        )}
      </View>
    </MotiView>
  );

  const quickActions = [
    {
      key: "diet",
      title: "Generate Diet Plan",
      icon: Calendar,
      color: theme.colors.nutrition,
    },
    {
      key: "progress",
      title: "Show Progress",
      icon: TrendingUp,
      color: theme.colors.success,
    },
    {
      key: "workout",
      title: "Suggest Workout",
      icon: Sparkles,
      color: theme.colors.primary,
    },
    {
      key: "nutrition",
      title: "Nutrition Tips",
      icon: Utensils,
      color: theme.colors.calories,
    },
  ];

  return (
    <KeyboardAvoidingAnimatedView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      {/* Header */}
      <LinearGradient
        colors={[
          theme.colors.primaryGradientStart,
          theme.colors.primaryGradientEnd,
        ]}
        style={{
          paddingTop: insets.top + theme.spacing.lg,
          paddingBottom: theme.spacing.lg,
          paddingHorizontal: theme.spacing.lg,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: theme.colors.secondary,
              alignItems: "center",
              justifyContent: "center",
              marginRight: theme.spacing.md,
            }}
          >
            <Bot size={28} color={theme.colors.primary} />
          </View>

          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: theme.colors.secondary,
                fontFamily: "Inter_700Bold",
              }}
            >
              Aivy Coach
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "400",
                color: theme.colors.secondary,
                fontFamily: "Inter_400Regular",
                opacity: 0.9,
              }}
            >
              Your AI Health Assistant
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <View
          style={{
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.md,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: theme.colors.text,
              fontFamily: "Inter_600SemiBold",
              marginBottom: theme.spacing.md,
            }}
          >
            Quick Actions
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: theme.spacing.sm,
            }}
          >
            {quickActions.map((action, index) => (
              <MotiView
                key={action.key}
                from={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 100, duration: 600 }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: theme.colors.surface,
                    borderRadius: theme.borderRadius.lg,
                    padding: theme.spacing.md,
                    flexDirection: "row",
                    alignItems: "center",
                    ...theme.shadows.sm,
                  }}
                  onPress={() => handleQuickAction(action.key)}
                >
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: `${action.color}20`,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: theme.spacing.sm,
                    }}
                  >
                    <action.icon size={14} color={action.color} />
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: theme.colors.text,
                      fontFamily: "Inter_500Medium",
                    }}
                  >
                    {action.title}
                  </Text>
                </TouchableOpacity>
              </MotiView>
            ))}
          </View>
        </View>
      )}

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingVertical: theme.spacing.md,
          paddingBottom: theme.spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isLoading && <StreamingBubble />}
      </ScrollView>

      {/* Input Area */}
      <View
        style={{
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          paddingBottom: insets.bottom + theme.spacing.md,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            backgroundColor: theme.colors.background,
            borderRadius: theme.borderRadius.lg,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            minHeight: 48,
            maxHeight: 120,
          }}
        >
          <TextInput
            ref={textInputRef}
            style={{
              flex: 1,
              fontSize: 16,
              fontWeight: "400",
              color: theme.colors.text,
              fontFamily: "Inter_400Regular",
              maxHeight: 100,
              paddingVertical: Platform.OS === "ios" ? 8 : 4,
            }}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me anything about health and fitness..."
            placeholderTextColor={theme.colors.textTertiary}
            multiline
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />

          <TouchableOpacity
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: inputText.trim()
                ? theme.colors.primary
                : theme.colors.border,
              alignItems: "center",
              justifyContent: "center",
              marginLeft: theme.spacing.sm,
            }}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Send
              size={18}
              color={
                inputText.trim()
                  ? theme.colors.textInverse
                  : theme.colors.textTertiary
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}
