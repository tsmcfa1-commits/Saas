import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [onboardingComplete, setOnboardingComplete] = useState(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const completed = await AsyncStorage.getItem("aivy_onboarding_complete");
      setOnboardingComplete(completed === "true");
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      setOnboardingComplete(false);
    }
  };

  if (onboardingComplete === null) {
    return null; // Loading
  }

  if (onboardingComplete) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/splash" />;
}
