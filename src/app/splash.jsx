import React, { useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { MotiView } from 'moti';
import useAivyTheme from '@/utils/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function SplashScreen() {
  const theme = useAivyTheme();
  const router = useRouter();
  
  // Animation values
  const logoScale = useSharedValue(0);
  const logoRotation = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const particleAnimation = useSharedValue(0);

  const navigateToNext = () => {
    router.replace('/permissions');
  };

  useEffect(() => {
    // Logo entrance animation
    logoScale.value = withSequence(
      withTiming(1.2, { duration: 800 }),
      withTiming(1, { duration: 400 })
    );

    // Glow pulse animation
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1000 }),
        withTiming(0.3, { duration: 1000 })
      ),
      -1,
      true
    );

    // Subtle rotation animation
    logoRotation.value = withRepeat(
      withTiming(360, { duration: 8000 }),
      -1,
      false
    );

    // Particle animation
    particleAnimation.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      true
    );

    // Navigate after 2 seconds
    const timer = setTimeout(() => {
      runOnJS(navigateToNext)();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: logoScale.value },
        { rotate: `${logoRotation.value}deg` }
      ],
    };
  });

  const glowAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
    };
  });

  const ParticleComponent = ({ delay = 0 }) => (
    <MotiView
      from={{
        opacity: 0,
        scale: 0,
        translateY: 50,
      }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        translateY: [-50, -100, -150],
      }}
      transition={{
        type: 'timing',
        duration: 3000,
        delay,
        loop: true,
      }}
      style={{
        position: 'absolute',
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: theme.colors.primary,
      }}
    />
  );

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.backgroundGradientEnd]}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Particle Background */}
      <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
        {[...Array(20)].map((_, i) => {
          const left = Math.random() * screenWidth;
          const top = screenHeight * 0.3 + Math.random() * screenHeight * 0.4;
          return (
            <View
              key={i}
              style={{
                position: 'absolute',
                left,
                top,
              }}
            >
              <ParticleComponent delay={i * 100} />
            </View>
          );
        })}
      </View>

      {/* Main Logo Container */}
      <View style={{ alignItems: 'center' }}>
        {/* Outer Glow Ring */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: 200,
              height: 200,
              borderRadius: 100,
              borderWidth: 2,
              borderColor: theme.colors.primary,
            },
            glowAnimatedStyle,
            theme.shadows.glow,
          ]}
        />

        {/* Logo Container */}
        <Animated.View
          style={[
            {
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: theme.colors.surface,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 40,
            },
            logoAnimatedStyle,
            theme.shadows.lg,
          ]}
        >
          {/* AI Icon - Stylized A */}
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
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
            {/* Underline accent */}
            <View
              style={{
                width: 30,
                height: 3,
                backgroundColor: theme.colors.primary,
                borderRadius: 2,
                marginTop: -5,
              }}
            />
          </View>
        </Animated.View>

        {/* App Name */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 500, duration: 800 }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: '700',
              color: theme.colors.text,
              fontFamily: 'Inter_700Bold',
              marginBottom: 8,
              textShadowColor: theme.colors.primary,
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 15,
            }}
          >
            Aivy
          </Text>
        </MotiView>

        {/* Tagline */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 800, duration: 800 }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: '400',
              color: theme.colors.textSecondary,
              fontFamily: 'Inter_400Regular',
              textAlign: 'center',
            }}
          >
            AI-Powered Health Companion
          </Text>
        </MotiView>

        {/* Loading Indicator */}
        <MotiView
          from={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1200, duration: 600 }}
          style={{ marginTop: 60 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {[0, 1, 2].map((i) => (
              <MotiView
                key={i}
                from={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1.2, opacity: 1 }}
                transition={{
                  type: 'timing',
                  duration: 600,
                  delay: i * 200,
                  loop: true,
                }}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: theme.colors.primary,
                  marginHorizontal: 4,
                }}
              />
            ))}
          </View>
        </MotiView>
      </View>
    </LinearGradient>
  );
}