import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Sparkles, ArrowRight } from 'lucide-react-native';
import useAivyTheme from '@/utils/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function WelcomeScreen() {
  const theme = useAivyTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.backgroundGradientEnd]}
      style={{ flex: 1 }}
    >
      <View
        style={{
          flex: 1,
          paddingTop: insets.top + theme.spacing.xl,
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: insets.bottom + theme.spacing.lg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Logo and Branding */}
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1000 }}
          style={{ alignItems: 'center', marginBottom: theme.spacing.xl }}
        >
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: theme.colors.surface,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: theme.spacing.lg,
              ...theme.shadows.glow,
            }}
          >
            <Text
              style={{
                fontSize: 48,
                fontWeight: '700',
                color: theme.colors.primary,
                fontFamily: 'Inter_700Bold',
                textShadowColor: theme.colors.primary,
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 10,
              }}
            >
              A
            </Text>
          </View>
          
          <Text
            style={{
              fontSize: 36,
              fontWeight: '700',
              color: theme.colors.text,
              fontFamily: 'Inter_700Bold',
              marginBottom: theme.spacing.sm,
              textAlign: 'center',
            }}
          >
            Welcome to Aivy
          </Text>
          
          <Text
            style={{
              fontSize: 18,
              fontWeight: '400',
              color: theme.colors.textSecondary,
              fontFamily: 'Inter_400Regular',
              textAlign: 'center',
              lineHeight: 26,
            }}
          >
            Your AI-powered health companion{'\n'}for a better lifestyle
          </Text>
        </MotiView>

        {/* Features */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 500, duration: 800 }}
          style={{ marginBottom: theme.spacing.xl }}
        >
          <View style={{ gap: theme.spacing.lg }}>
            {[
              { icon: '🤖', title: 'AI Coach', desc: 'Personalized health advice' },
              { icon: '📊', title: 'Smart Analytics', desc: 'Track your progress' },
              { icon: '🔍', title: 'Food Scanner', desc: 'Instant nutrition analysis' },
            ].map((feature, index) => (
              <MotiView
                key={index}
                from={{ opacity: 0, translateX: -30 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ delay: 700 + index * 200, duration: 600 }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: theme.colors.surface,
                  padding: theme.spacing.lg,
                  borderRadius: theme.borderRadius.lg,
                  ...theme.shadows.sm,
                }}
              >
                <Text style={{ fontSize: 32, marginRight: theme.spacing.md }}>
                  {feature.icon}
                </Text>
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: theme.colors.text,
                      fontFamily: 'Inter_600SemiBold',
                      marginBottom: 4,
                    }}
                  >
                    {feature.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '400',
                      color: theme.colors.textSecondary,
                      fontFamily: 'Inter_400Regular',
                    }}
                  >
                    {feature.desc}
                  </Text>
                </View>
              </MotiView>
            ))}
          </View>
        </MotiView>

        {/* Action Buttons */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 1300, duration: 800 }}
          style={{ width: '100%', gap: theme.spacing.md }}
        >
          <TouchableOpacity
            style={[
              {
                backgroundColor: theme.colors.primary,
                paddingVertical: theme.spacing.md,
                borderRadius: theme.borderRadius.lg,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              },
              theme.shadows.glow,
            ]}
            onPress={() => router.push('/auth/register')}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: theme.colors.textInverse,
                fontFamily: 'Inter_600SemiBold',
                marginRight: theme.spacing.sm,
              }}
            >
              Get Started
            </Text>
            <ArrowRight size={20} color={theme.colors.textInverse} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.surface,
              paddingVertical: theme.spacing.md,
              borderRadius: theme.borderRadius.lg,
              borderWidth: 1,
              borderColor: theme.colors.border,
              alignItems: 'center',
            }}
            onPress={() => router.push('/auth/login')}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: theme.colors.text,
                fontFamily: 'Inter_600SemiBold',
              }}
            >
              I Already Have an Account
            </Text>
          </TouchableOpacity>
        </MotiView>
      </View>
    </LinearGradient>
  );
}