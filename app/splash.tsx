import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/providers';
import { APP_NAME, APP_TAGLINE, STORAGE_KEYS } from '@/constants';
import { cache } from '@/utils/storage';
import { spacing } from '@/theme';

export default function SplashScreen() {
  const { theme } = useTheme();
  const scale = useSharedValue(0.8);

  useEffect(() => {
    scale.value = withDelay(100, withSpring(1, { damping: 12, stiffness: 120 }));

    const timer = setTimeout(() => {
      const done = cache.getJSON<boolean>(STORAGE_KEYS.onboardingComplete);
      if (done) {
        router.replace('/(auth)/login');
      } else {
        router.replace('/(onboarding)');
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [scale]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Animated.View style={[styles.logoMark, logoStyle]}>
        <Text style={styles.logoLetter}>S</Text>
      </Animated.View>
      <Animated.Text entering={FadeInUp.delay(200).springify()} style={styles.title}>
        {APP_NAME}
      </Animated.Text>
      <Animated.Text entering={FadeIn.delay(450)} style={styles.tagline}>
        {APP_TAGLINE}
      </Animated.Text>
      <View style={styles.footer}>
        <Animated.View
          entering={FadeIn.delay(700)}
          style={[styles.dot, { backgroundColor: 'rgba(255,255,255,0.85)' }]}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  logoMark: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  logoLetter: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  tagline: {
    marginTop: spacing.sm,
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  footer: { position: 'absolute', bottom: 64 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
