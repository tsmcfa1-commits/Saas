import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import useAivyTheme from '@/utils/theme';

export default function LoginScreen() {
  const theme = useAivyTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement Supabase login
      // const { data, error } = await supabase.auth.signInWithPassword({
      //   email,
      //   password,
      // });

      // Temporary mock login
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

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
            Welcome Back
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
              Sign In to Aivy
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
              Continue your health journey
            </Text>
          </MotiView>

          {/* Form */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 300, duration: 800 }}
            style={{ marginBottom: theme.spacing.xl }}
          >
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
                  value={email}
                  onChangeText={setEmail}
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
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
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

            {/* Forgot Password */}
            <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: theme.spacing.xl }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: theme.colors.primary,
                  fontFamily: 'Inter_500Medium',
                }}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
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
              onPress={handleLogin}
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
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '400',
                  color: theme.colors.textSecondary,
                  fontFamily: 'Inter_400Regular',
                }}
              >
                Don't have an account? 
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/auth/register')}
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
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </MotiView>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}