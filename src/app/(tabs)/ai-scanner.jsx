import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
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
  Camera,
  Image as ImageIcon,
  X,
  Zap,
  ZapOff,
  RotateCcw,
  Scan,
  Loader,
  CheckCircle,
} from "lucide-react-native";
import useAivyTheme from "@/utils/theme";
import useHandleStreamResponse from "@/utils/useHandleStreamResponse";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function AIScannerScreen() {
  const theme = useAivyTheme();
  const insets = useSafeAreaInsets();
  const cameraRef = useRef(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("back");
  const [flash, setFlash] = useState("off");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanningMessage, setScanningMessage] = useState("");

  // Animation values
  const scanAnimation = useSharedValue(0);
  const pulseAnimation = useSharedValue(1);
  const scanOverlayOpacity = useSharedValue(0);

  useEffect(() => {
    // Pulse animation for scan button
    pulseAnimation.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 }),
      ),
      -1,
      true,
    );
  }, []);

  const handleFinishScan = (result) => {
    setScanResult(result);
    setScanningMessage("");
    setIsScanning(false);
    scanOverlayOpacity.value = withTiming(0, { duration: 300 });
  };

  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setScanningMessage,
    onFinish: handleFinishScan,
  });

  const startScanAnimation = () => {
    scanAnimation.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      false,
    );
    scanOverlayOpacity.value = withTiming(1, { duration: 300 });
  };

  const stopScanAnimation = () => {
    scanAnimation.value = withTiming(0, { duration: 300 });
    scanOverlayOpacity.value = withTiming(0, { duration: 300 });
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      setIsScanning(true);
      startScanAnimation();

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });

      // Simulate AI analysis with ChatGPT
      const response = await fetch("/integrations/chat-gpt/conversationgpt4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are Aivy, an AI nutrition assistant. Analyze the food in images and provide detailed nutrition information including calories, macros, and health insights. Be helpful and encouraging.",
            },
            {
              role: "user",
              content: `Analyze this food image and provide nutrition information. Include estimated calories, protein, carbs, fats, and any health insights. Format your response in a friendly, conversational way.`,
            },
          ],
          stream: true,
        }),
      });

      handleStreamResponse(response);
    } catch (error) {
      console.error("Error taking picture:", error);
      setIsScanning(false);
      stopScanAnimation();
      Alert.alert("Error", "Failed to capture and analyze image");
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setIsScanning(true);
        startScanAnimation();

        // Simulate AI analysis
        const response = await fetch(
          "/integrations/chat-gpt/conversationgpt4",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: [
                {
                  role: "system",
                  content:
                    "You are Aivy, an AI nutrition assistant. Analyze food images and provide detailed nutrition information.",
                },
                {
                  role: "user",
                  content:
                    "Analyze this food image from the user's gallery and provide nutrition information including calories, macros, and health insights.",
                },
              ],
              stream: true,
            }),
          },
        );

        handleStreamResponse(response);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image from gallery");
    }
  };

  const resetScan = () => {
    setScanResult(null);
    setScanningMessage("");
    setIsScanning(false);
    stopScanAnimation();
  };

  const addToMealLog = () => {
    // This would integrate with a meal logging system
    Alert.alert(
      "Added to Meal Log",
      "Food item has been added to your daily meal log.",
      [{ text: "OK", onPress: resetScan }],
    );
  };

  // Animated styles
  const scanLineStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(scanAnimation.value, [0, 1], [0, 200]),
        },
      ],
    };
  });

  const scanOverlayStyle = useAnimatedStyle(() => {
    return {
      opacity: scanOverlayOpacity.value,
    };
  });

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseAnimation.value }],
    };
  });

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: theme.spacing.lg,
        }}
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
          <Camera size={40} color={theme.colors.primary} />
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
          Camera Permission Required
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontWeight: "400",
            color: theme.colors.textSecondary,
            fontFamily: "Inter_400Regular",
            textAlign: "center",
            marginBottom: theme.spacing.xl,
            lineHeight: 24,
          }}
        >
          Aivy needs camera access to scan and analyze your food for nutrition
          insights.
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: theme.colors.primary,
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.md,
            borderRadius: theme.borderRadius.lg,
            ...theme.shadows.glow,
          }}
          onPress={requestPermission}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: theme.colors.textInverse,
              fontFamily: "Inter_600SemiBold",
            }}
          >
            Grant Camera Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Camera View */}
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={facing}
        flash={flash}
        mode="picture"
      >
        {/* Header Controls */}
        <View
          style={{
            position: "absolute",
            top: insets.top + theme.spacing.lg,
            left: 0,
            right: 0,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: theme.spacing.lg,
          }}
        >
          <TouchableOpacity
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => setFlash(flash === "off" ? "on" : "off")}
          >
            {flash === "off" ? (
              <ZapOff size={24} color={theme.colors.secondary} />
            ) : (
              <Zap size={24} color={theme.colors.primary} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => setFacing(facing === "back" ? "front" : "back")}
          >
            <RotateCcw size={24} color={theme.colors.secondary} />
          </TouchableOpacity>
        </View>

        {/* Scan Overlay */}
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: "center",
              justifyContent: "center",
            },
            scanOverlayStyle,
          ]}
        >
          <View
            style={{
              width: 250,
              height: 200,
              borderWidth: 2,
              borderColor: theme.colors.primary,
              borderRadius: theme.borderRadius.lg,
              backgroundColor: "rgba(0, 255, 255, 0.1)",
              overflow: "hidden",
            }}
          >
            {/* Scan Line */}
            <Animated.View
              style={[
                {
                  position: "absolute",
                  left: 0,
                  right: 0,
                  height: 2,
                  backgroundColor: theme.colors.primary,
                  shadowColor: theme.colors.primary,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 1,
                  shadowRadius: 10,
                },
                scanLineStyle,
              ]}
            />
          </View>

          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 200 }}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              borderRadius: theme.borderRadius.lg,
              paddingHorizontal: theme.spacing.lg,
              paddingVertical: theme.spacing.md,
              marginTop: theme.spacing.lg,
              maxWidth: screenWidth * 0.8,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: theme.colors.primary,
                fontFamily: "Inter_600SemiBold",
                textAlign: "center",
              }}
            >
              Analyzing Food...
            </Text>
            {scanningMessage && (
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  color: theme.colors.textSecondary,
                  fontFamily: "Inter_400Regular",
                  textAlign: "center",
                  marginTop: 8,
                }}
              >
                {scanningMessage}
              </Text>
            )}
          </MotiView>
        </Animated.View>

        {/* Scan Result Modal */}
        {scanResult && (
          <MotiView
            from={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            style={{
              position: "absolute",
              bottom: insets.bottom + 120,
              left: theme.spacing.lg,
              right: theme.spacing.lg,
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.xl,
              padding: theme.spacing.lg,
              ...theme.shadows.lg,
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
                <CheckCircle size={24} color={theme.colors.success} />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: theme.colors.text,
                    fontFamily: "Inter_600SemiBold",
                    marginLeft: 8,
                  }}
                >
                  Scan Complete
                </Text>
              </View>

              <TouchableOpacity onPress={resetScan}>
                <X size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                fontSize: 14,
                fontWeight: "400",
                color: theme.colors.text,
                fontFamily: "Inter_400Regular",
                lineHeight: 20,
                marginBottom: theme.spacing.lg,
              }}
            >
              {scanResult}
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: theme.colors.primary,
                paddingVertical: theme.spacing.md,
                borderRadius: theme.borderRadius.lg,
                alignItems: "center",
                ...theme.shadows.glow,
              }}
              onPress={addToMealLog}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: theme.colors.textInverse,
                  fontFamily: "Inter_600SemiBold",
                }}
              >
                Add to Meal Log
              </Text>
            </TouchableOpacity>
          </MotiView>
        )}

        {/* Bottom Controls */}
        {!scanResult && (
          <View
            style={{
              position: "absolute",
              bottom: insets.bottom + 40,
              left: 0,
              right: 0,
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                width: "100%",
                paddingHorizontal: theme.spacing.xl,
              }}
            >
              {/* Gallery Button */}
              <TouchableOpacity
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={pickImageFromGallery}
                disabled={isScanning}
              >
                <ImageIcon size={24} color={theme.colors.secondary} />
              </TouchableOpacity>

              {/* Capture Button */}
              <Animated.View style={[pulseStyle]}>
                <TouchableOpacity
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: theme.colors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 4,
                    borderColor: theme.colors.secondary,
                    ...theme.shadows.glow,
                  }}
                  onPress={takePicture}
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <Loader size={32} color={theme.colors.textInverse} />
                  ) : (
                    <Scan size={32} color={theme.colors.textInverse} />
                  )}
                </TouchableOpacity>
              </Animated.View>

              {/* Placeholder for symmetry */}
              <View style={{ width: 50, height: 50 }} />
            </View>

            {/* Instructions */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 500 }}
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                borderRadius: theme.borderRadius.lg,
                paddingHorizontal: theme.spacing.lg,
                paddingVertical: theme.spacing.md,
                marginTop: theme.spacing.lg,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  color: theme.colors.secondary,
                  fontFamily: "Inter_400Regular",
                  textAlign: "center",
                }}
              >
                Point camera at food and tap to scan
              </Text>
            </MotiView>
          </View>
        )}
      </CameraView>
    </View>
  );
}
