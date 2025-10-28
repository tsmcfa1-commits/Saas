import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Mail, Lock, ArrowLeft, Eye, EyeOff, User, Check } from 'lucide-react-native';
import useAivyTheme from '@/utils/theme';

export default function RegisterScreen() {
  const theme = useAivyTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleRegister = async () => {
    const { name, email, password, confirmPassword } = formData;
    
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement Supabase registration
      // const { data, error } = await supabase.auth.signUp({
      //   email,
      //   password,
      //   options: {
      //     data: {
      //       name,
      //     }
      //   }
      // });

      // Simulate email verification process
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVerificationSent(true);
    } catch (error) {
      Alert.alert('Registration Failed', error.message || 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationComplete = () => {
    // Simulate email verification completion
    router.replace('/onboarding');
  };

  if (verificationSent) {
    return (
      <LinearGradient
        colors={[theme.colors.background, theme.colors.backgroundGradientEnd]}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            paddingTop: insets.top + theme.spacing.lg,
            paddingHorizontal: theme.spacing.lg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 800 }}
            style={{ alignItems: 'center' }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: theme.colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: theme.spacing.lg,
                ...theme.shadows.glow,
              }}
            >
              <Check size={40} color={theme.colors.textInverse} />
            </View>
            
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: theme.colors.text,
                fontFamily: 'Inter_700Bold',
                textAlign: 'center',
                marginBottom: theme.spacing.sm,
              }}
            >
              Check Your Email
            </Text>
            
            <Text
              style={{
                fontSize: 16,
                fontWeight: '400',
                color: theme.colors.textSecondary,
                fontFamily: 'Inter_400Regular',
                textAlign: 'center',
                marginBottom: theme.spacing.xl,
                lineHeight: 24,
              }}
            >
              We've sent a verification link to{'\n'}{formData.email}
            </Text>

            <TouchableOpacity
              style={[
                {
                  backgroundColor: theme.colors.primary,
                  paddingVertical: theme.spacing.md,
                  paddingHorizontal: theme.spacing.lg,
                  borderRadius: theme.borderRadius.lg,
                  marginBottom: theme.spacing.md,
                },
                theme.shadows.glow,
              ]}
              onPress={handleVerificationComplete}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: theme.colors.textInverse,
                  fontFamily: 'Inter_600SemiBold',
                }}
              >
                I've Verified My Email
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setVerificationSent(false)}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: theme.colors.primary,
                  fontFamily: 'Inter_500Medium',
                }}
              >
                Didn't receive the email? Try again
              </Text>
            </TouchableOpacity>
          </MotiView>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.backgroundGradientEnd]}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View
          style={{
            paddingTop: insets.top + theme.spacing.lg,
            paddingHorizontal: theme.spacing.lg,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme.spacing.xl,
          }}
        >
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: theme.colors.surface,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: theme.spacing.md,
            }}
            onPress={() => router.back()}
          >
            <ArrowLeft size={20} color={theme.colors.text} />
          </TouchableOpacity>
          
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: theme.colors.text,
              fontFamily: 'Inter_700Bold',
            }}
          >
            Join Aivy
          </Text>
        </View>

        <View style={{ flex: 1, paddingHorizontal: theme.spacing.lg }}>
          {/* Logo and Title */}
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 800 }}
            style={{ alignItems: 'center', marginBottom: theme.spacing.xl }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: theme.colors.surface,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: theme.spacing.lg,
                ...theme.shadows.glow,
              }}
            >
              <Text
                style={{
                  fontSize: 36,
                  fontWeight: '700',
                  color: theme.colors.primary,
                  fontFamily: 'Inter_700Bold',
                }}
              >
                A
              </Text>
            </View>
            
            <Text
              style={{
                fontSize: 28,
                fontWeight: '700',
                color: theme.colors.text,
                fontFamily: 'Inter_700Bold',
                marginBottom: theme.spacing.sm,
              }}
            >
              Create Account
            </Text>
            
            <Text
              style={{
                fontSize: 16,
                fontWeight: '400',
                color: theme.colors.textSecondary,
                fontFamily: 'Inter_400Regular',
                textAlign: 'center',
              }}
            >
              Start your AI-powered health journey
            </Text>
          </MotiView>

          {/* Form */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 300, duration: 800 }}
            style={{ marginBottom: theme.spacing.xl }}
          >
            {/* Name Input */}
            <View style={{ marginBottom: theme.spacing.lg }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: theme.colors.text,
                  fontFamily: 'Inter_600SemiBold',
                  marginBottom: theme.spacing.sm,
                }}
              >
                Full Name
              </Text>
              
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.borderRadius.lg,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  paddingHorizontal: theme.spacing.md,
                }}
              >
                <User size={20} color={theme.colors.textTertiary} />
                <TextInput
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: theme.colors.text,
                    fontFamily: 'Inter_400Regular',
                    marginLeft: theme.spacing.sm,
                    paddingVertical: theme.spacing.md,
                  }}
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                  placeholder="Enter your full name"
                  placeholderTextColor={theme.colors.textTertiary}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={{ marginBottom: theme.spacing.lg }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: theme.colors.text,
                  fontFamily: 'Inter_600SemiBold',
                  marginBottom: theme.spacing.sm,
                }}
              >
                Email
              </Text>
              
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.borderRadius.lg,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  paddingHorizontal: theme.spacing.md,
                }}
              >
                <Mail size={20} color={theme.colors.textTertiary} />
                <TextInput
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: theme.colors.text,
                    fontFamily: 'Inter_400Regular',
                    marginLeft: theme.spacing.sm,
                    paddingVertical: theme.spacing.md,
                  }}
                  value={formData.email}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.colors.textTertiary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={{ marginBottom: theme.spacing.lg }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: theme.colors.text,
                  fontFamily: 'Inter_600SemiBold',
                  marginBottom: theme.spacing.sm,
                }}
              >
                Password
              </Text>
              
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.borderRadius.lg,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  paddingHorizontal: theme.spacing.md,
                }}
              >
                <Lock size={20} color={theme.colors.textTertiary} />
                <TextInput
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: theme.colors.text,
                    fontFamily: 'Inter_400Regular',
                    marginLeft: theme.spacing.sm,
                    paddingVertical: theme.spacing.md,
                  }}
                  value={formData.password}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                  placeholder="Create a password"
                  placeholderTextColor={theme.colors.textTertiary}
                  secureTextEntry={!showPassword}
                />
                
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{ marginLeft: theme.spacing.sm }}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={theme.colors.textTertiary} />
                  ) : (
                    <Eye size={20} color={theme.colors.textTertiary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={{ marginBottom: theme.spacing.lg }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: theme.colors.text,
                  fontFamily: 'Inter_600SemiBold',
                  marginBottom: theme.spacing.sm,
                }}
              >
                Confirm Password
              </Text>
              
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.borderRadius.lg,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  paddingHorizontal: theme.spacing.md,
                }}
              >
                <Lock size={20} color={theme.colors.textTertiary} />
                <TextInput
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: theme.colors.text,
                    fontFamily: 'Inter_400Regular',
                    marginLeft: theme.spacing.sm,
                    paddingVertical: theme.spacing.md,
                  }}
                  value={formData.confirmPassword}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
                  placeholder="Confirm your password"
                  placeholderTextColor={theme.colors.textTertiary}
                  secureTextEntry={!showConfirmPassword}
                />
                
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ marginLeft: theme.spacing.sm }}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={theme.colors.textTertiary} />
                  ) : (
                    <Eye size={20} color={theme.colors.textTertiary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[
                {
                  backgroundColor: theme.colors.primary,
                  paddingVertical: theme.spacing.md,
                  borderRadius: theme.borderRadius.lg,
                  alignItems: 'center',
                  marginBottom: theme.spacing.lg,
                },
                theme.shadows.glow,
              ]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: theme.colors.textInverse,
                  fontFamily: 'Inter_600SemiBold',
                }}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            {/* Sign In Link */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '400',
                  color: theme.colors.textSecondary,
                  fontFamily: 'Inter_400Regular',
                }}
              >
                Already have an account? 
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/auth/login')}
                style={{ marginLeft: 4 }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: theme.colors.primary,
                    fontFamily: 'Inter_600SemiBold',
                  }}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </MotiView>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}