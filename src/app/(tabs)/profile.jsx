import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { 
  User,
  Edit3,
  Palette,
  Shield,
  FileText,
  HelpCircle,
  LogOut,
  ChevronRight,
  Bell,
  Moon,
  Sun,
  Mail,
  MessageCircle,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAivyTheme from '@/utils/theme';

export default function ProfileScreen() {
  const theme = useAivyTheme();
  const insets = useSafeAreaInsets();
  
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('aivy_user_data');
      if (data) {
        setUserData(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out of your Aivy account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['aivy_user_data', 'aivy_onboarding_complete']);
              // In a real app, you'd navigate back to login/onboarding
              Alert.alert('Logged Out', 'You have been logged out successfully.');
            } catch (error) {
              console.error('Error during logout:', error);
            }
          }
        }
      ]
    );
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
    // In a real app, you'd update notification settings
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, you'd update theme settings
    Alert.alert('Theme', 'Theme switching will be available in a future update!');
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing will be available soon!');
  };

  const handleSupport = () => {
    Alert.alert(
      'Customer Support',
      'Choose how you\'d like to get help:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Email Support', onPress: () => Alert.alert('Email', 'support@aivy.app') },
        { text: 'Live Chat', onPress: () => Alert.alert('Live Chat', 'Chat support coming soon!') },
      ]
    );
  };

  const calculateBMI = () => {
    if (userData?.height && userData?.weight) {
      const heightInM = parseFloat(userData.height) / 100;
      const weightInKg = parseFloat(userData.weight);
      return (weightInKg / (heightInM * heightInM)).toFixed(1);
    }
    return 'N/A';
  };

  const getGoalText = (goal) => {
    switch (goal) {
      case 'lose': return 'Lose Weight';
      case 'maintain': return 'Maintain Weight';
      case 'gain': return 'Gain Weight';
      default: return 'Not Set';
    }
  };

  const MenuSection = ({ title, children }) => (
    <View style={{ marginBottom: theme.spacing.lg }}>
      <Text
        style={{
          fontSize: 14,
          fontWeight: '600',
          color: theme.colors.textSecondary,
          fontFamily: 'Inter_600SemiBold',
          marginLeft: theme.spacing.lg,
          marginBottom: theme.spacing.md,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        {title}
      </Text>
      <View
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          marginHorizontal: theme.spacing.lg,
          overflow: 'hidden',
          ...theme.shadows.sm,
        }}
      >
        {children}
      </View>
    </View>
  );

  const MenuItem = ({ icon: Icon, title, subtitle, onPress, showChevron = true, rightComponent }) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.lg,
        borderBottomWidth: 0.5,
        borderBottomColor: theme.colors.border,
      }}
      onPress={onPress}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: `${theme.colors.primary}20`,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: theme.spacing.md,
        }}
      >
        <Icon size={20} color={theme.colors.primary} />
      </View>
      
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '500',
            color: theme.colors.text,
            fontFamily: 'Inter_500Medium',
            marginBottom: subtitle ? 2 : 0,
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={{
              fontSize: 14,
              fontWeight: '400',
              color: theme.colors.textTertiary,
              fontFamily: 'Inter_400Regular',
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>
      
      {rightComponent || (showChevron && (
        <ChevronRight size={20} color={theme.colors.textTertiary} />
      ))}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 800 }}
          style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.xl }}
        >
          <LinearGradient
            colors={[theme.colors.primaryGradientStart, theme.colors.primaryGradientEnd]}
            style={{
              borderRadius: theme.borderRadius.xl,
              padding: theme.spacing.lg,
              alignItems: 'center',
              ...theme.shadows.glow,
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: theme.colors.secondary,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: theme.spacing.md,
              }}
            >
              <Text style={{ fontSize: 40 }}>{userData?.avatar || '🧑‍💻'}</Text>
            </View>
            
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: theme.colors.secondary,
                fontFamily: 'Inter_700Bold',
                marginBottom: theme.spacing.sm,
              }}
            >
              {userData?.name || 'User'}
            </Text>
            
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '400',
                  color: theme.colors.secondary,
                  fontFamily: 'Inter_400Regular',
                  opacity: 0.9,
                }}
              >
                {userData?.age ? `${userData.age} years old` : 'Age not set'} • BMI {calculateBMI()}
              </Text>
            </View>
            
            <TouchableOpacity
              style={{
                backgroundColor: theme.colors.secondary,
                paddingHorizontal: theme.spacing.lg,
                paddingVertical: theme.spacing.sm,
                borderRadius: theme.borderRadius.lg,
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: theme.spacing.md,
              }}
              onPress={handleEditProfile}
            >
              <Edit3 size={16} color={theme.colors.primary} />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: theme.colors.primary,
                  fontFamily: 'Inter_600SemiBold',
                  marginLeft: theme.spacing.sm,
                }}
              >
                Edit Profile
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </MotiView>

        {/* Health Stats */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200, duration: 800 }}
        >
          <MenuSection title="Health Overview">
            <View style={{ flexDirection: 'row', padding: theme.spacing.lg }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: theme.colors.text,
                    fontFamily: 'Inter_700Bold',
                  }}
                >
                  {userData?.weight || '--'}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '400',
                    color: theme.colors.textTertiary,
                    fontFamily: 'Inter_400Regular',
                  }}
                >
                  Weight (kg)
                </Text>
              </View>
              
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: theme.colors.text,
                    fontFamily: 'Inter_700Bold',
                  }}
                >
                  {userData?.height || '--'}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '400',
                    color: theme.colors.textTertiary,
                    fontFamily: 'Inter_400Regular',
                  }}
                >
                  Height (cm)
                </Text>
              </View>
              
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: theme.colors.text,
                    fontFamily: 'Inter_700Bold',
                  }}
                >
                  {getGoalText(userData?.goal).split(' ')[0]}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '400',
                    color: theme.colors.textTertiary,
                    fontFamily: 'Inter_400Regular',
                  }}
                >
                  Goal
                </Text>
              </View>
            </View>
          </MenuSection>
        </MotiView>

        {/* Preferences */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 400, duration: 800 }}
        >
          <MenuSection title="Preferences">
            <MenuItem
              icon={Bell}
              title="Notifications"
              subtitle="Meal reminders and health tips"
              onPress={toggleNotifications}
              showChevron={false}
              rightComponent={
                <Switch
                  value={notifications}
                  onValueChange={toggleNotifications}
                  trackColor={{
                    false: theme.colors.border,
                    true: theme.colors.primary,
                  }}
                  thumbColor={notifications ? theme.colors.secondary : theme.colors.textTertiary}
                />
              }
            />
            
            <MenuItem
              icon={darkMode ? Moon : Sun}
              title="Theme"
              subtitle={darkMode ? 'Dark mode' : 'Light mode'}
              onPress={toggleDarkMode}
              showChevron={false}
              rightComponent={
                <Switch
                  value={darkMode}
                  onValueChange={toggleDarkMode}
                  trackColor={{
                    false: theme.colors.border,
                    true: theme.colors.primary,
                  }}
                  thumbColor={darkMode ? theme.colors.secondary : theme.colors.textTertiary}
                />
              }
            />
          </MenuSection>
        </MotiView>

        {/* Support */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 600, duration: 800 }}
        >
          <MenuSection title="Support & Legal">
            <MenuItem
              icon={HelpCircle}
              title="Customer Support"
              subtitle="Get help and contact us"
              onPress={handleSupport}
            />
            
            <MenuItem
              icon={Shield}
              title="Privacy Policy"
              subtitle="How we protect your data"
              onPress={() => Alert.alert('Privacy Policy', 'Privacy policy content would be shown here.')}
            />
            
            <MenuItem
              icon={FileText}
              title="Terms & Conditions"
              subtitle="Terms of service"
              onPress={() => Alert.alert('Terms & Conditions', 'Terms and conditions would be shown here.')}
            />
          </MenuSection>
        </MotiView>

        {/* Account */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 800, duration: 800 }}
        >
          <MenuSection title="Account">
            <MenuItem
              icon={LogOut}
              title="Logout"
              subtitle="Sign out of your account"
              onPress={handleLogout}
            />
          </MenuSection>
        </MotiView>

        {/* App Info */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 1000, duration: 800 }}
          style={{ 
            alignItems: 'center', 
            paddingHorizontal: theme.spacing.lg,
            marginTop: theme.spacing.lg,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: '400',
              color: theme.colors.textTertiary,
              fontFamily: 'Inter_400Regular',
              textAlign: 'center',
              marginBottom: theme.spacing.sm,
            }}
          >
            Aivy - AI Health Companion
          </Text>
          <Text
            style={{
              fontSize: 10,
              fontWeight: '400',
              color: theme.colors.textTertiary,
              fontFamily: 'Inter_400Regular',
              textAlign: 'center',
            }}
          >
            Version 1.0.0 • Made with ❤️
          </Text>
        </MotiView>
      </ScrollView>
    </View>
  );
}