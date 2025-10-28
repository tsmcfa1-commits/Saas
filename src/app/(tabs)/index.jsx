import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
} from "react-native-reanimated";
import {
  Flame,
  Droplet,
  Target,
  Activity,
  TrendingUp,
  Plus,
  MoreHorizontal,
  Heart,
  Utensils,
  Calendar,
  BarChart3,
  Lightbulb,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import useAivyTheme from "@/utils/theme";
import WeeklyCaloriesChart from "@/components/WeeklyCaloriesChart";
import WeightProgressChart from "@/components/WeightProgressChart";

const { width: screenWidth } = Dimensions.get("window");

export default function DashboardScreen() {
  const theme = useAivyTheme();
  const insets = useSafeAreaInsets();

  const [userData, setUserData] = useState(null);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);

  // Animation values
  const calorieProgress = useSharedValue(0);
  const waterProgress = useSharedValue(0);
  const bmiAnimation = useSharedValue(0);
  const floatingMenuScale = useSharedValue(0);
  const pulseAnimation = useSharedValue(1);

  // Load user data
  useEffect(() => {
    loadUserData();
    animateCards();
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

  const animateCards = () => {
    // Animate progress cards with delays
    setTimeout(() => {
      calorieProgress.value = withTiming(0.68, { duration: 1200 }); // 68% of daily goal
    }, 300);

    setTimeout(() => {
      waterProgress.value = withTiming(0.54, { duration: 1200 }); // 54% of water goal
    }, 600);

    setTimeout(() => {
      bmiAnimation.value = withTiming(1, { duration: 800 });
    }, 900);

    // Pulse animation for floating button
    pulseAnimation.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 }),
      ),
      -1,
      true,
    );
  };

  const toggleFloatingMenu = () => {
    setShowFloatingMenu(!showFloatingMenu);
    floatingMenuScale.value = withTiming(showFloatingMenu ? 0 : 1, {
      duration: 300,
    });
  };

  // Animated styles
  const calorieProgressStyle = useAnimatedStyle(() => {
    return {
      width: `${interpolate(calorieProgress.value, [0, 1], [0, 100])}%`,
    };
  });

  const waterWaveStyle = useAnimatedStyle(() => {
    return {
      height: `${interpolate(waterProgress.value, [0, 1], [0, 100])}%`,
    };
  });

  const bmiCounterStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(bmiAnimation.value, [0, 1], [0.5, 1]),
        },
      ],
      opacity: bmiAnimation.value,
    };
  });

  const floatingMenuStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: floatingMenuScale.value }],
      opacity: floatingMenuScale.value,
    };
  });

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseAnimation.value }],
    };
  });

  // Calculate BMI
  const calculateBMI = () => {
    if (userData?.height && userData?.weight) {
      const heightInM = parseFloat(userData.height) / 100;
      const weightInKg = parseFloat(userData.weight);
      return (weightInKg / (heightInM * heightInM)).toFixed(1);
    }
    return "22.5";
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { text: "Underweight", color: theme.colors.info };
    if (bmi < 25) return { text: "Normal", color: theme.colors.success };
    if (bmi < 30) return { text: "Overweight", color: theme.colors.warning };
    return { text: "Obese", color: theme.colors.error };
  };

  // Stats cards data
  const dailyCalories = 1850;
  const targetCalories = 2200;
  const waterIntake = 1350; // ml
  const targetWater = 2500; // ml
  const currentBMI = parseFloat(calculateBMI());
  const bmiCategory = getBMICategory(currentBMI);

  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 60,
          paddingBottom: insets.bottom + 120, // Space for tab bar + floating button
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color: theme.colors.primary,
                  fontFamily: "Inter_500Medium",
                  marginBottom: 2,
                }}
              >
                Hey {userData?.name || "there"}! 👋
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  color: theme.colors.textSecondary,
                  fontFamily: "Inter_400Regular",
                  lineHeight: 18,
                }}
              >
                You're doing amazing! Keep pushing towards your goals.
              </Text>
            </View>

            <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: theme.colors.surface,
                  alignItems: "center",
                  justifyContent: "center",
                  ...theme.shadows.md,
                }}
              >
                <Text style={{ fontSize: 24 }}>
                  {userData?.avatar || "🧑‍💻"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </MotiView>

        {/* Weekly Calories Chart */}
        <WeeklyCaloriesChart
          onPress={() => {
            // TODO: Navigate to detailed chart view
            console.log("Navigate to calorie trends");
          }}
        />

        {/* Weight Progress Chart */}
        <WeightProgressChart
          onPress={() => {
            // TODO: Navigate to weight tracking view
            console.log("Navigate to weight progress");
          }}
        />

        {/* AI Insights */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 400, duration: 800 }}
          style={{
            paddingHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing.lg,
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing.lg,
              ...theme.shadows.md,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: theme.spacing.md,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: `${theme.colors.primary}20`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Lightbulb size={20} color={theme.colors.primary} />
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: theme.colors.text,
                  fontFamily: "Inter_600SemiBold",
                }}
              >
                AI Insights
              </Text>
            </View>

            <Text
              style={{
                fontSize: 14,
                fontWeight: "400",
                color: theme.colors.text,
                fontFamily: "Inter_400Regular",
                lineHeight: 20,
                marginBottom: theme.spacing.md,
              }}
            >
              Based on your recent activity, you're 12% ahead of your weekly
              calorie goal! Consider adding more protein to maintain muscle mass
              during weight loss.
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: `${theme.colors.primary}10`,
                paddingVertical: theme.spacing.sm,
                paddingHorizontal: theme.spacing.md,
                borderRadius: theme.borderRadius.md,
                alignSelf: "flex-start",
              }}
              onPress={() => router.push("/(tabs)/ai-coach")}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: theme.colors.primary,
                  fontFamily: "Inter_600SemiBold",
                }}
              >
                Ask AI Coach
              </Text>
            </TouchableOpacity>
          </View>
        </MotiView>

        {/* Daily Log */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 500, duration: 800 }}
          style={{
            paddingHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing.lg,
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing.lg,
              ...theme.shadows.md,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: theme.spacing.md,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: `${theme.colors.success}20`,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Calendar size={20} color={theme.colors.success} />
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: theme.colors.text,
                    fontFamily: "Inter_600SemiBold",
                  }}
                >
                  Daily Log
                </Text>
              </View>

              <TouchableOpacity>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: theme.colors.primary,
                    fontFamily: "Inter_600SemiBold",
                  }}
                >
                  View All
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ gap: theme.spacing.sm }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: theme.spacing.sm,
                }}
              >
                <Text style={{ fontSize: 16, marginRight: theme.spacing.sm }}>
                  🍎
                </Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: theme.colors.text,
                      fontFamily: "Inter_500Medium",
                    }}
                  >
                    Breakfast - Oatmeal & Fruits
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "400",
                      color: theme.colors.textSecondary,
                      fontFamily: "Inter_400Regular",
                    }}
                  >
                    8:30 AM • 420 cal
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: theme.spacing.sm,
                }}
              >
                <Text style={{ fontSize: 16, marginRight: theme.spacing.sm }}>
                  💧
                </Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: theme.colors.text,
                      fontFamily: "Inter_500Medium",
                    }}
                  >
                    Water Intake
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "400",
                      color: theme.colors.textSecondary,
                      fontFamily: "Inter_400Regular",
                    }}
                  >
                    10:15 AM • 500ml
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: theme.spacing.sm,
                }}
              >
                <Text style={{ fontSize: 16, marginRight: theme.spacing.sm }}>
                  🥗
                </Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: theme.colors.text,
                      fontFamily: "Inter_500Medium",
                    }}
                  >
                    Lunch - Caesar Salad
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "400",
                      color: theme.colors.textSecondary,
                      fontFamily: "Inter_400Regular",
                    }}
                  >
                    1:45 PM • 380 cal
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </MotiView>

        {/* Health Summary Card */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 200, duration: 800 }}
          style={{
            paddingHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing.lg,
          }}
        >
          <LinearGradient
            colors={[
              theme.colors.primaryGradientStart,
              theme.colors.primaryGradientEnd,
            ]}
            style={{
              borderRadius: theme.borderRadius.xl,
              padding: theme.spacing.lg,
              ...theme.shadows.glow,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: theme.spacing.md,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: theme.colors.secondary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Heart size={24} color={theme.colors.primary} />
              </View>
              <TouchableOpacity>
                <MoreHorizontal size={20} color={theme.colors.secondary} />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: theme.colors.secondary,
                fontFamily: "Inter_600SemiBold",
                marginBottom: 8,
              }}
            >
              Health Score
            </Text>

            <Text
              style={{
                fontSize: 48,
                fontWeight: "700",
                color: theme.colors.secondary,
                fontFamily: "Inter_700Bold",
                marginBottom: 8,
              }}
            >
              87%
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
              Great progress! Keep up the healthy habits.
            </Text>
          </LinearGradient>
        </MotiView>

        {/* Stats Cards Row 1 */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing.md,
            gap: theme.spacing.md,
          }}
        >
          {/* Daily Calories Card */}
          <MotiView
            from={{ opacity: 0, translateX: -50 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 400, duration: 800 }}
            style={{ flex: 1 }}
          >
            <View
              style={{
                backgroundColor: theme.colors.surface,
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing.lg,
                ...theme.shadows.md,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: theme.spacing.md,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: `${theme.colors.calories}20`,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Flame size={20} color={theme.colors.calories} />
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color: theme.colors.text,
                    fontFamily: "Inter_500Medium",
                  }}
                >
                  Calories
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "700",
                  color: theme.colors.text,
                  fontFamily: "Inter_700Bold",
                  marginBottom: 8,
                }}
              >
                {dailyCalories}
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "400",
                  color: theme.colors.textSecondary,
                  fontFamily: "Inter_400Regular",
                  marginBottom: 12,
                }}
              >
                of {targetCalories} goal
              </Text>

              {/* Progress Bar */}
              <View
                style={{
                  height: 6,
                  backgroundColor: theme.colors.border,
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <Animated.View
                  style={[
                    {
                      height: "100%",
                      backgroundColor: theme.colors.calories,
                      borderRadius: 3,
                    },
                    calorieProgressStyle,
                  ]}
                />
              </View>
            </View>
          </MotiView>

          {/* Water Intake Card */}
          <MotiView
            from={{ opacity: 0, translateX: 50 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 500, duration: 800 }}
            style={{ flex: 1 }}
          >
            <View
              style={{
                backgroundColor: theme.colors.surface,
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing.lg,
                ...theme.shadows.md,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: theme.spacing.md,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: `${theme.colors.hydration}20`,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Droplet size={20} color={theme.colors.hydration} />
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color: theme.colors.text,
                    fontFamily: "Inter_500Medium",
                  }}
                >
                  Water
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "700",
                  color: theme.colors.text,
                  fontFamily: "Inter_700Bold",
                  marginBottom: 8,
                }}
              >
                {waterIntake}ml
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "400",
                  color: theme.colors.textSecondary,
                  fontFamily: "Inter_400Regular",
                  marginBottom: 12,
                }}
              >
                of {targetWater}ml goal
              </Text>

              {/* Wave Progress */}
              <View
                style={{
                  height: 6,
                  backgroundColor: theme.colors.border,
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <Animated.View
                  style={[
                    {
                      backgroundColor: theme.colors.hydration,
                      borderRadius: 3,
                    },
                    waterWaveStyle,
                  ]}
                />
              </View>
            </View>
          </MotiView>
        </View>

        {/* BMI Card */}
        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 600, duration: 800 }}
          style={{
            paddingHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing.lg,
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing.lg,
              ...theme.shadows.md,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: `${bmiCategory.color}20`,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Target size={20} color={bmiCategory.color} />
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color: theme.colors.text,
                    fontFamily: "Inter_500Medium",
                  }}
                >
                  BMI Index
                </Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Animated.Text
                  style={[
                    {
                      fontSize: 24,
                      fontWeight: "700",
                      color: theme.colors.text,
                      fontFamily: "Inter_700Bold",
                    },
                    bmiCounterStyle,
                  ]}
                >
                  {currentBMI}
                </Animated.Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "500",
                    color: bmiCategory.color,
                    fontFamily: "Inter_500Medium",
                  }}
                >
                  {bmiCategory.text}
                </Text>
              </View>
            </View>
          </View>
        </MotiView>

        {/* Coming Soon Section */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 800, duration: 800 }}
          style={{ paddingHorizontal: theme.spacing.lg }}
        >
          <View
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing.xl,
              alignItems: "center",
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderStyle: "dashed",
            }}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: `${theme.colors.primary}20`,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: theme.spacing.md,
              }}
            >
              <TrendingUp size={28} color={theme.colors.primary} />
            </View>

            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: theme.colors.text,
                fontFamily: "Inter_600SemiBold",
                marginBottom: 8,
              }}
            >
              Advanced Analytics
            </Text>

            <Text
              style={{
                fontSize: 14,
                fontWeight: "400",
                color: theme.colors.textSecondary,
                fontFamily: "Inter_400Regular",
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              Detailed charts, trends, and insights coming soon. Track your
              progress with beautiful visualizations.
            </Text>

            <View
              style={{
                backgroundColor: theme.colors.primary,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: 6,
                borderRadius: theme.borderRadius.md,
                marginTop: theme.spacing.md,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: theme.colors.textInverse,
                  fontFamily: "Inter_600SemiBold",
                }}
              >
                COMING SOON
              </Text>
            </View>
          </View>
        </MotiView>
      </ScrollView>

      {/* Floating Action Button */}
      <Animated.View
        style={[
          {
            position: "absolute",
            bottom: insets.bottom + 120,
            right: theme.spacing.lg,
            alignItems: "center",
          },
          pulseStyle,
        ]}
      >
        {/* Floating Menu Options */}
        {showFloatingMenu && (
          <Animated.View
            style={[
              {
                position: "absolute",
                bottom: 80,
                right: 0,
                alignItems: "flex-end",
                gap: theme.spacing.md,
              },
              floatingMenuStyle,
            ]}
          >
            <TouchableOpacity
              style={{
                backgroundColor: theme.colors.surface,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.sm,
                borderRadius: theme.borderRadius.lg,
                flexDirection: "row",
                alignItems: "center",
                ...theme.shadows.md,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: theme.colors.text,
                  fontFamily: "Inter_600SemiBold",
                  marginRight: 8,
                }}
              >
                Add Meal
              </Text>
              <Utensils size={16} color={theme.colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: theme.colors.surface,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.sm,
                borderRadius: theme.borderRadius.lg,
                flexDirection: "row",
                alignItems: "center",
                ...theme.shadows.md,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: theme.colors.text,
                  fontFamily: "Inter_600SemiBold",
                  marginRight: 8,
                }}
              >
                Add Water
              </Text>
              <Droplet size={16} color={theme.colors.hydration} />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Main FAB */}
        <TouchableOpacity
          onPress={toggleFloatingMenu}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: theme.colors.primary,
            alignItems: "center",
            justifyContent: "center",
            ...theme.shadows.glow,
          }}
        >
          <Plus size={28} color={theme.colors.textInverse} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
