import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { 
  Sparkles, 
  Clock,
  Calendar,
  ChefHat,
  Plus,
  Utensils,
  Apple,
  Beef,
  Wheat,
} from 'lucide-react-native';
import useAivyTheme from '@/utils/theme';
import useHandleStreamResponse from '@/utils/useHandleStreamResponse';

export default function DietPlanScreen() {
  const theme = useAivyTheme();
  const insets = useSafeAreaInsets();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingMessage, setGeneratingMessage] = useState('');
  const [dietPlan, setDietPlan] = useState(null);
  const [savedPlans, setSavedPlans] = useState([]);

  const handleFinishGeneration = (result) => {
    setDietPlan(result);
    setGeneratingMessage('');
    setIsGenerating(false);
  };

  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setGeneratingMessage,
    onFinish: handleFinishGeneration,
  });

  const generateDietPlan = async () => {
    try {
      setIsGenerating(true);
      setDietPlan(null);

      const response = await fetch('/integrations/chat-gpt/conversationgpt4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are Aivy, an AI nutrition expert. Generate comprehensive, personalized diet plans that are practical and achievable. Format your response in a clear, structured way with meal breakdowns, nutrition tips, and encouragement.'
            },
            {
              role: 'user',
              content: 'Generate a personalized weekly diet plan for me. Include breakfast, lunch, dinner, and snacks for each day. Consider my fitness goals and provide calorie estimates and macronutrient information. Make it practical and delicious!'
            }
          ],
          stream: true,
        }),
      });

      handleStreamResponse(response);
    } catch (error) {
      console.error('Error generating diet plan:', error);
      setIsGenerating(false);
      Alert.alert('Error', 'Failed to generate diet plan. Please try again.');
    }
  };

  const saveDietPlan = () => {
    if (!dietPlan) return;
    
    const newPlan = {
      id: Date.now(),
      title: 'Custom Diet Plan',
      content: dietPlan,
      createdAt: new Date(),
    };
    
    setSavedPlans(prev => [newPlan, ...prev]);
    Alert.alert(
      'Diet Plan Saved',
      'Your personalized diet plan has been saved successfully!',
      [{ text: 'OK' }]
    );
  };

  const PlanCard = ({ plan }) => (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        ...theme.shadows.md,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm }}>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: `${theme.colors.nutrition}20`,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: theme.spacing.sm,
          }}
        >
          <ChefHat size={18} color={theme.colors.nutrition} />
        </View>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
            fontFamily: 'Inter_600SemiBold',
          }}
        >
          {plan.title}
        </Text>
      </View>
      
      <Text
        style={{
          fontSize: 12,
          fontWeight: '400',
          color: theme.colors.textTertiary,
          fontFamily: 'Inter_400Regular',
          marginBottom: theme.spacing.sm,
        }}
      >
        Created {plan.createdAt.toLocaleDateString()}
      </Text>
      
      <Text
        style={{
          fontSize: 14,
          fontWeight: '400',
          color: theme.colors.text,
          fontFamily: 'Inter_400Regular',
          lineHeight: 20,
        }}
        numberOfLines={3}
      >
        {plan.content}
      </Text>
      
      <TouchableOpacity
        style={{
          backgroundColor: theme.colors.primary,
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
          borderRadius: theme.borderRadius.md,
          alignSelf: 'flex-start',
          marginTop: theme.spacing.md,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: '600',
            color: theme.colors.textInverse,
            fontFamily: 'Inter_600SemiBold',
          }}
        >
          View Full Plan
        </Text>
      </TouchableOpacity>
    </MotiView>
  );

  const quickMealIdeas = [
    { title: 'High Protein Breakfast', icon: Apple, color: theme.colors.success },
    { title: 'Lean Lunch Options', icon: Beef, color: theme.colors.calories },
    { title: 'Healthy Dinner Recipes', icon: Utensils, color: theme.colors.nutrition },
    { title: 'Snack Ideas', icon: Wheat, color: theme.colors.primary },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 60,
          paddingBottom: insets.bottom + 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 800 }}
          style={{
            paddingHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing.xl,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: '700',
              color: theme.colors.text,
              fontFamily: 'Inter_700Bold',
              marginBottom: theme.spacing.sm,
            }}
          >
            Diet Plans
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '400',
              color: theme.colors.textSecondary,
              fontFamily: 'Inter_400Regular',
            }}
          >
            Personalized nutrition plans powered by AI
          </Text>
        </MotiView>

        {/* Generate Diet Plan Card */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 200, duration: 800 }}
          style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.lg }}
        >
          <LinearGradient
            colors={[theme.colors.primaryGradientStart, theme.colors.primaryGradientEnd]}
            style={{
              borderRadius: theme.borderRadius.xl,
              padding: theme.spacing.lg,
              ...theme.shadows.glow,
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: theme.colors.secondary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: theme.spacing.md,
                }}
              >
                <Sparkles size={32} color={theme.colors.primary} />
              </View>
              
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '700',
                  color: theme.colors.secondary,
                  fontFamily: 'Inter_700Bold',
                  textAlign: 'center',
                  marginBottom: theme.spacing.sm,
                }}
              >
                Generate AI Diet Plan
              </Text>
              
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '400',
                  color: theme.colors.secondary,
                  fontFamily: 'Inter_400Regular',
                  textAlign: 'center',
                  opacity: 0.9,
                  marginBottom: theme.spacing.lg,
                }}
              >
                Let Aivy create a personalized weekly meal plan tailored to your goals and preferences
              </Text>
              
              <TouchableOpacity
                style={{
                  backgroundColor: theme.colors.secondary,
                  paddingVertical: theme.spacing.md,
                  paddingHorizontal: theme.spacing.lg,
                  borderRadius: theme.borderRadius.lg,
                  flexDirection: 'row',
                  alignItems: 'center',
                  ...theme.shadows.md,
                }}
                onPress={generateDietPlan}
                disabled={isGenerating}
              >
                <Sparkles size={20} color={theme.colors.primary} />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: theme.colors.primary,
                    fontFamily: 'Inter_600SemiBold',
                    marginLeft: theme.spacing.sm,
                  }}
                >
                  {isGenerating ? 'Generating...' : 'Generate Plan'}
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </MotiView>

        {/* Generation Progress */}
        {isGenerating && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing.lg,
              marginHorizontal: theme.spacing.lg,
              marginBottom: theme.spacing.lg,
              ...theme.shadows.md,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.md }}>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: theme.colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: theme.spacing.sm,
                }}
              >
                <Clock size={14} color={theme.colors.textInverse} />
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: theme.colors.text,
                  fontFamily: 'Inter_600SemiBold',
                }}
              >
                Creating Your Diet Plan
              </Text>
            </View>
            
            {generatingMessage && (
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '400',
                  color: theme.colors.text,
                  fontFamily: 'Inter_400Regular',
                  lineHeight: 20,
                }}
              >
                {generatingMessage}
              </Text>
            )}
          </MotiView>
        )}

        {/* Generated Diet Plan */}
        {dietPlan && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing.lg,
              marginHorizontal: theme.spacing.lg,
              marginBottom: theme.spacing.lg,
              ...theme.shadows.md,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: theme.colors.text,
                  fontFamily: 'Inter_600SemiBold',
                }}
              >
                Your Personalized Diet Plan
              </Text>
              
              <TouchableOpacity
                style={{
                  backgroundColor: theme.colors.primary,
                  paddingVertical: theme.spacing.sm,
                  paddingHorizontal: theme.spacing.md,
                  borderRadius: theme.borderRadius.md,
                }}
                onPress={saveDietPlan}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: theme.colors.textInverse,
                    fontFamily: 'Inter_600SemiBold',
                  }}
                >
                  Save Plan
                </Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView
              style={{ maxHeight: 300 }}
              showsVerticalScrollIndicator={false}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '400',
                  color: theme.colors.text,
                  fontFamily: 'Inter_400Regular',
                  lineHeight: 20,
                }}
              >
                {dietPlan}
              </Text>
            </ScrollView>
          </MotiView>
        )}

        {/* Quick Meal Ideas */}
        <View style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.lg }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: theme.colors.text,
              fontFamily: 'Inter_600SemiBold',
              marginBottom: theme.spacing.md,
            }}
          >
            Quick Meal Ideas
          </Text>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
            {quickMealIdeas.map((idea, index) => (
              <MotiView
                key={idea.title}
                from={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 300 + index * 100, duration: 600 }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: theme.colors.surface,
                    borderRadius: theme.borderRadius.lg,
                    padding: theme.spacing.md,
                    flexDirection: 'row',
                    alignItems: 'center',
                    minWidth: '47%',
                    ...theme.shadows.sm,
                  }}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: `${idea.color}20`,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: theme.spacing.sm,
                    }}
                  >
                    <idea.icon size={18} color={idea.color} />
                  </View>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '500',
                      color: theme.colors.text,
                      fontFamily: 'Inter_500Medium',
                      flex: 1,
                    }}
                  >
                    {idea.title}
                  </Text>
                </TouchableOpacity>
              </MotiView>
            ))}
          </View>
        </View>

        {/* Saved Plans */}
        {savedPlans.length > 0 && (
          <View style={{ paddingHorizontal: theme.spacing.lg }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: theme.colors.text,
                fontFamily: 'Inter_600SemiBold',
                marginBottom: theme.spacing.md,
              }}
            >
              Saved Diet Plans
            </Text>
            
            {savedPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}