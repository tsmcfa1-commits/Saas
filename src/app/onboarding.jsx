import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  FlatList,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView, AnimatePresence } from "moti";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { User, Target, ChevronRight, ChevronLeft } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAivyTheme from "@/utils/theme";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";

const { width: screenWidth } = Dimensions.get("window");

export default function OnboardingScreen() {
  const theme = useAivyTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    gender: "",
    goal: "",
    avatar: "🧑‍💻",
  });

  const progressAnimation = useSharedValue(0);
  const totalSteps = 4;

  const avatarOptions = [
    "🧑‍💻",
    "👨‍💼",
    "👩‍💼",
    "🧑‍⚕️",
    "👨‍🎓",
    "👩‍🎓",
    "🧑‍🍳",
    "👨‍🎨",
    "👩‍🎨",
    "🧑‍🚀",
  ];
  const genderOptions = ["Male", "Female", "Other"];
  const goalOptions = [
    {
      key: "lose",
      title: "Lose Weight",
      description: "Create a calorie deficit",
    },
    {
      key: "maintain",
      title: "Maintain Weight",
      description: "Stay at current weight",
    },
    { key: "gain", title: "Gain Weight", description: "Build muscle and mass" },
  ];

  const updateProgress = (step) => {
    progressAnimation.value = withTiming((step + 1) / totalSteps, {
      duration: 300,
    });
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
      updateProgress(nextStepIndex);
      scrollViewRef.current?.scrollTo({
        x: nextStepIndex * screenWidth,
        animated: true,
      });
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const prevStepIndex = currentStep - 1;
      setCurrentStep(prevStepIndex);
      updateProgress(prevStepIndex);
      scrollViewRef.current?.scrollTo({
        x: prevStepIndex * screenWidth,
        animated: true,
      });
    }
  };

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem("aivy_user_data", JSON.stringify(userData));
      await AsyncStorage.setItem("aivy_onboarding_complete", "true");
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return (
          userData.name.trim() &&
          userData.age &&
          userData.height &&
          userData.weight
        );
      case 1:
        return userData.gender;
      case 2:
        return userData.goal;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const progressBarStyle = useAnimatedStyle(() => {
    return {
      width: `${interpolate(progressAnimation.value, [0, 1], [0, 100])}%`,
    };
  });

  // Step 1: Personal Info
  const PersonalInfoStep = () => (
    <KeyboardAvoidingAnimatedView
      style={{ width: screenWidth, paddingHorizontal: theme.spacing.lg }}
    >
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 800 }}
        style={{ alignItems: "center", marginBottom: theme.spacing.xl }}
      >
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: theme.colors.surface,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: theme.spacing.lg,
            ...theme.shadows.md,
          }}
        >
          <User size={40} color={theme.colors.primary} />
        </View>

        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: theme.colors.text,
            fontFamily: "Inter_700Bold",
            textAlign: "center",
            marginBottom: theme.spacing.sm,
          }}
        >
          Tell us about yourself
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontWeight: "400",
            color: theme.colors.textSecondary,
            fontFamily: "Inter_400Regular",
            textAlign: "center",
          }}
        >
          Help us personalize your health journey
        </Text>
      </MotiView>

      <View style={{ gap: theme.spacing.md }}>
        <View>
          <Text style={inputLabelStyle}>Name</Text>
          <TextInput
            style={inputStyle}
            value={userData.name}
            onChangeText={(text) =>
              setUserData((prev) => ({ ...prev, name: text }))
            }
            placeholder="Enter your name"
            placeholderTextColor={theme.colors.textTertiary}
            autoCorrect={false}
            autoCapitalize="words"
            returnKeyType="next"
            blurOnSubmit={false}
          />
        </View>

        <View style={{ flexDirection: "row", gap: theme.spacing.md }}>
          <View style={{ flex: 1 }}>
            <Text style={inputLabelStyle}>Age</Text>
            <TextInput
              style={inputStyle}
              value={userData.age}
              onChangeText={(text) =>
                setUserData((prev) => ({ ...prev, age: text }))
              }
              placeholder="25"
              placeholderTextColor={theme.colors.textTertiary}
              keyboardType="numeric"
              returnKeyType="next"
              maxLength={3}
              blurOnSubmit={false}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={inputLabelStyle}>Height (cm)</Text>
            <TextInput
              style={inputStyle}
              value={userData.height}
              onChangeText={(text) =>
                setUserData((prev) => ({ ...prev, height: text }))
              }
              placeholder="175"
              placeholderTextColor={theme.colors.textTertiary}
              keyboardType="numeric"
              returnKeyType="next"
              maxLength={3}
              blurOnSubmit={false}
            />
          </View>
        </View>

        <View>
          <Text style={inputLabelStyle}>Weight (kg)</Text>
          <TextInput
            style={inputStyle}
            value={userData.weight}
            onChangeText={(text) =>
              setUserData((prev) => ({ ...prev, weight: text }))
            }
            placeholder="70"
            placeholderTextColor={theme.colors.textTertiary}
            keyboardType="numeric"
            returnKeyType="done"
            maxLength={3}
          />
        </View>
      </View>
    </KeyboardAvoidingAnimatedView>
  );

  // Step 2: Gender Selection
  const GenderStep = () => (
    <View style={{ width: screenWidth, paddingHorizontal: theme.spacing.lg }}>
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 800 }}
        style={{ alignItems: "center", marginBottom: theme.spacing.xl }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: theme.colors.text,
            fontFamily: "Inter_700Bold",
            textAlign: "center",
            marginBottom: theme.spacing.sm,
          }}
        >
          Select your gender
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontWeight: "400",
            color: theme.colors.textSecondary,
            fontFamily: "Inter_400Regular",
            textAlign: "center",
          }}
        >
          This helps us calculate accurate metrics
        </Text>
      </MotiView>

      <View style={{ gap: theme.spacing.md }}>
        {genderOptions.map((option, index) => (
          <MotiView
            key={option}
            from={{ opacity: 0, translateX: -50 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: index * 100, duration: 600 }}
          >
            <TouchableOpacity
              style={[
                {
                  backgroundColor:
                    userData.gender === option
                      ? theme.colors.primary
                      : theme.colors.surface,
                  padding: theme.spacing.lg,
                  borderRadius: theme.borderRadius.lg,
                  borderWidth: userData.gender === option ? 0 : 1,
                  borderColor: theme.colors.border,
                },
                userData.gender === option && theme.shadows.md,
              ]}
              onPress={() =>
                setUserData((prev) => ({ ...prev, gender: option }))
              }
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color:
                    userData.gender === option
                      ? theme.colors.textInverse
                      : theme.colors.text,
                  fontFamily: "Inter_600SemiBold",
                  textAlign: "center",
                }}
              >
                {option}
              </Text>
            </TouchableOpacity>
          </MotiView>
        ))}
      </View>
    </View>
  );

  // Step 3: Goal Selection
  const GoalStep = () => (
    <View style={{ width: screenWidth, paddingHorizontal: theme.spacing.lg }}>
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 800 }}
        style={{ alignItems: "center", marginBottom: theme.spacing.xl }}
      >
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: theme.colors.surface,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: theme.spacing.lg,
            ...theme.shadows.md,
          }}
        >
          <Target size={40} color={theme.colors.primary} />
        </View>

        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: theme.colors.text,
            fontFamily: "Inter_700Bold",
            textAlign: "center",
            marginBottom: theme.spacing.sm,
          }}
        >
          What's your goal?
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontWeight: "400",
            color: theme.colors.textSecondary,
            fontFamily: "Inter_400Regular",
            textAlign: "center",
          }}
        >
          Choose your primary fitness objective
        </Text>
      </MotiView>

      <View style={{ gap: theme.spacing.md }}>
        {goalOptions.map((option, index) => (
          <MotiView
            key={option.key}
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 150, duration: 600 }}
          >
            <TouchableOpacity
              style={[
                {
                  backgroundColor:
                    userData.goal === option.key
                      ? theme.colors.primary
                      : theme.colors.surface,
                  padding: theme.spacing.lg,
                  borderRadius: theme.borderRadius.lg,
                  borderWidth: userData.goal === option.key ? 0 : 1,
                  borderColor: theme.colors.border,
                },
                userData.goal === option.key && theme.shadows.md,
              ]}
              onPress={() =>
                setUserData((prev) => ({ ...prev, goal: option.key }))
              }
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color:
                    userData.goal === option.key
                      ? theme.colors.textInverse
                      : theme.colors.text,
                  fontFamily: "Inter_600SemiBold",
                  marginBottom: 4,
                }}
              >
                {option.title}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  color:
                    userData.goal === option.key
                      ? theme.colors.textInverse
                      : theme.colors.textSecondary,
                  fontFamily: "Inter_400Regular",
                }}
              >
                {option.description}
              </Text>
            </TouchableOpacity>
          </MotiView>
        ))}
      </View>
    </View>
  );

  // Step 4: Avatar Selection
  const AvatarStep = () => (
    <View style={{ width: screenWidth, paddingHorizontal: theme.spacing.lg }}>
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 800 }}
        style={{ alignItems: "center", marginBottom: theme.spacing.xl }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: theme.colors.text,
            fontFamily: "Inter_700Bold",
            textAlign: "center",
            marginBottom: theme.spacing.sm,
          }}
        >
          Choose your avatar
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontWeight: "400",
            color: theme.colors.textSecondary,
            fontFamily: "Inter_400Regular",
            textAlign: "center",
          }}
        >
          Pick an avatar that represents you
        </Text>
      </MotiView>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: theme.spacing.md,
        }}
      >
        {avatarOptions.map((avatar, index) => (
          <MotiView
            key={avatar}
            from={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 100, duration: 500 }}
          >
            <TouchableOpacity
              style={[
                {
                  width: 70,
                  height: 70,
                  borderRadius: 35,
                  backgroundColor:
                    userData.avatar === avatar
                      ? theme.colors.primary
                      : theme.colors.surface,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: userData.avatar === avatar ? 0 : 1,
                  borderColor: theme.colors.border,
                },
                userData.avatar === avatar && theme.shadows.md,
              ]}
              onPress={() => setUserData((prev) => ({ ...prev, avatar }))}
            >
              <Text style={{ fontSize: 32 }}>{avatar}</Text>
            </TouchableOpacity>
          </MotiView>
        ))}
      </View>
    </View>
  );

  const inputLabelStyle = {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 8,
  };

  const inputStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    fontFamily: "Inter_400Regular",
    borderWidth: 1,
    borderColor: theme.colors.border,
  };

  const steps = [PersonalInfoStep, GenderStep, GoalStep, AvatarStep];

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.backgroundGradientEnd]}
      style={{ flex: 1 }}
    >
      {/* Header with Progress */}
      <View
        style={{
          paddingTop: insets.top + theme.spacing.lg,
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: theme.spacing.lg,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: theme.spacing.lg,
          }}
        >
          <TouchableOpacity
            onPress={prevStep}
            disabled={currentStep === 0}
            style={{
              opacity: currentStep === 0 ? 0.3 : 1,
              padding: 8,
            }}
          >
            <ChevronLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: theme.colors.text,
              fontFamily: "Inter_600SemiBold",
            }}
          >
            {currentStep + 1} of {totalSteps}
          </Text>

          <View style={{ width: 40 }} />
        </View>

        {/* Progress Bar */}
        <View
          style={{
            height: 4,
            backgroundColor: theme.colors.border,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Animated.View
            style={[
              {
                height: "100%",
                backgroundColor: theme.colors.primary,
                borderRadius: 2,
              },
              progressBarStyle,
            ]}
          />
        </View>
      </View>

      {/* Steps Content */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={{ flex: 1 }}
      >
        {steps.map((StepComponent, index) => (
          <StepComponent key={index} />
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View
        style={{
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: insets.bottom + theme.spacing.lg,
          paddingTop: theme.spacing.lg,
        }}
      >
        <TouchableOpacity
          style={[
            {
              backgroundColor: canProceed()
                ? theme.colors.primary
                : theme.colors.border,
              paddingVertical: theme.spacing.md,
              borderRadius: theme.borderRadius.lg,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            },
            canProceed() && theme.shadows.glow,
          ]}
          onPress={nextStep}
          disabled={!canProceed()}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: canProceed()
                ? theme.colors.textInverse
                : theme.colors.textTertiary,
              fontFamily: "Inter_600SemiBold",
              marginRight: 8,
            }}
          >
            {currentStep === totalSteps - 1 ? "Complete" : "Continue"}
          </Text>
          <ChevronRight
            size={20}
            color={
              canProceed()
                ? theme.colors.textInverse
                : theme.colors.textTertiary
            }
          />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
