import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import * as Notifications from "expo-notifications";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Bell, Camera as CameraIcon, Image, Shield } from "lucide-react-native";
import useAivyTheme from "@/utils/theme";

export default function PermissionsScreen() {
  const theme = useAivyTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [permissions, setPermissions] = useState({
    notifications: false,
    camera: false,
    media: false,
  });

  const permissionItems = [
    {
      key: "notifications",
      title: "Notifications",
      description: "Get reminders for meals, water intake, and workouts",
      icon: Bell,
      required: true,
    },
    {
      key: "camera",
      title: "Camera",
      description: "Scan food items for instant nutrition analysis",
      icon: CameraIcon,
      required: true,
    },
    {
      key: "media",
      title: "Photo Library",
      description: "Upload food photos from your gallery",
      icon: Image,
      required: false,
    },
  ];

  const requestPermission = async (type) => {
    try {
      let granted = false;

      switch (type) {
        case "notifications":
          const notificationResult =
            await Notifications.requestPermissionsAsync();
          granted = notificationResult.status === "granted";
          break;
        case "camera":
          const cameraResult = await Camera.requestCameraPermissionsAsync();
          granted = cameraResult.status === "granted";
          break;
        case "media":
          const mediaResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          granted = mediaResult.status === "granted";
          break;
      }

      setPermissions((prev) => ({
        ...prev,
        [type]: granted,
      }));

      if (!granted) {
        Alert.alert(
          "Permission Denied",
          `${permissionItems.find((item) => item.key === type)?.title} permission is needed for the best Aivy experience.`,
          [{ text: "OK" }],
        );
      }
    } catch (error) {
      console.error(`Error requesting ${type} permission:`, error);
    }
  };

  const handleContinue = () => {
    const requiredPermissions = permissionItems.filter((item) => item.required);
    const hasAllRequired = requiredPermissions.every(
      (item) => permissions[item.key],
    );

    if (!hasAllRequired) {
      Alert.alert(
        "Required Permissions",
        "Please enable all required permissions to continue.",
        [{ text: "OK" }],
      );
      return;
    }

    router.replace("/onboarding");
  };

  const PermissionCard = ({ item, index }) => (
    <MotiView
      from={{ opacity: 0, translateY: 50, scale: 0.9 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{
        type: "spring",
        damping: 15,
        stiffness: 100,
        delay: index * 200,
      }}
    >
      <View
        style={[
          {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.lg,
            marginBottom: theme.spacing.md,
            borderWidth: permissions[item.key] ? 2 : 1,
            borderColor: permissions[item.key]
              ? theme.colors.primary
              : theme.colors.border,
          },
          permissions[item.key] && theme.shadows.md,
        ]}
      >
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          {/* Icon */}
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: permissions[item.key]
                ? theme.colors.primary
                : theme.colors.surfaceElevated,
              alignItems: "center",
              justifyContent: "center",
              marginRight: theme.spacing.md,
            }}
          >
            <item.icon
              size={24}
              color={
                permissions[item.key]
                  ? theme.colors.textInverse
                  : theme.colors.primary
              }
            />
          </View>

          {/* Content */}
          <View style={{ flex: 1, marginRight: theme.spacing.md }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: theme.colors.text,
                  fontFamily: "Inter_600SemiBold",
                }}
              >
                {item.title}
              </Text>
              {item.required && (
                <View
                  style={{
                    backgroundColor: theme.colors.error,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 4,
                    marginLeft: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "600",
                      color: theme.colors.secondary,
                      fontFamily: "Inter_600SemiBold",
                    }}
                  >
                    REQUIRED
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "400",
                color: theme.colors.textSecondary,
                fontFamily: "Inter_400Regular",
                lineHeight: 20,
              }}
            >
              {item.description}
            </Text>
          </View>

          {/* Switch */}
          <Switch
            value={permissions[item.key]}
            onValueChange={() => {
              if (!permissions[item.key]) {
                requestPermission(item.key);
              } else {
                setPermissions((prev) => ({
                  ...prev,
                  [item.key]: false,
                }));
              }
            }}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary,
            }}
            thumbColor={
              permissions[item.key]
                ? theme.colors.secondary
                : theme.colors.textTertiary
            }
            ios_backgroundColor={theme.colors.border}
          />
        </View>
      </View>
    </MotiView>
  );

  const allRequiredGranted = permissionItems
    .filter((item) => item.required)
    .every((item) => permissions[item.key]);

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.backgroundGradientEnd]}
      style={{
        flex: 1,
        paddingTop: insets.top + theme.spacing.lg,
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: insets.bottom + theme.spacing.lg,
      }}
    >
      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
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
          <Shield size={40} color={theme.colors.primary} />
        </View>

        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: theme.colors.text,
            fontFamily: "Inter_700Bold",
            textAlign: "center",
            marginBottom: theme.spacing.sm,
          }}
        >
          App Permissions
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontWeight: "400",
            color: theme.colors.textSecondary,
            fontFamily: "Inter_400Regular",
            textAlign: "center",
            lineHeight: 24,
          }}
        >
          Enable permissions to unlock Aivy's full potential
        </Text>
      </MotiView>

      {/* Permissions List */}
      <View style={{ flex: 1 }}>
        {permissionItems.map((item, index) => (
          <PermissionCard key={item.key} item={item} index={index} />
        ))}
      </View>

      {/* Continue Button */}
      <MotiView
        from={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 600, duration: 800 }}
      >
        <TouchableOpacity
          style={[
            {
              backgroundColor: allRequiredGranted
                ? theme.colors.primary
                : theme.colors.border,
              paddingVertical: theme.spacing.md,
              borderRadius: theme.borderRadius.lg,
              alignItems: "center",
              marginTop: theme.spacing.lg,
            },
            allRequiredGranted && theme.shadows.glow,
          ]}
          onPress={handleContinue}
          disabled={!allRequiredGranted}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: allRequiredGranted
                ? theme.colors.textInverse
                : theme.colors.textTertiary,
              fontFamily: "Inter_600SemiBold",
            }}
          >
            Continue to Onboarding
          </Text>
        </TouchableOpacity>
      </MotiView>
    </LinearGradient>
  );
}
