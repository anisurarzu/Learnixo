import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/providers';
import { APP_NAME, APP_TAGLINE, STORAGE_KEYS } from '@/constants';
import { ROUTES } from '@/constants/routes';
import { replace } from '@/navigation';
import { useAuthStore } from '@/store';
import { cache } from '@/utils/storage';
import { spacing } from '@/theme';

/**
 * Animated splash — checks onboarding + auth, then routes automatically.
 */
export default function SplashScreen() {
  const { theme } = useTheme();
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const scale = useSharedValue(0.8);
  const pulse = useSharedValue(0.4);
  const navigated = useRef(false);

  useEffect(() => {
    scale.value = withDelay(80, withSpring(1, { damping: 12, stiffness: 120 }));
    pulse.value = withRepeat(
      withSequence(withTiming(1, { duration: 700 }), withTiming(0.35, { duration: 700 })),
      -1,
      false,
    );
  }, [pulse, scale]);

  useEffect(() => {
    if (!isHydrated || navigated.current) return;

    const timer = setTimeout(() => {
      navigated.current = true;
      const onboardingDone = cache.getJSON<boolean>(STORAGE_KEYS.onboardingComplete);

      if (!onboardingDone) {
        replace(ROUTES.onboarding);
        return;
      }

      if (isAuthenticated) {
        replace(ROUTES.tabs.home);
        return;
      }

      replace(ROUTES.auth.login);
    }, 1600);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isHydrated]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const loaderStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Animated.View style={[styles.logoMark, logoStyle]}>
        <Text style={styles.logoLetter}>L</Text>
      </Animated.View>
      <Animated.Text entering={FadeInUp.delay(180).springify()} style={styles.title}>
        {APP_NAME}
      </Animated.Text>
      <Animated.Text entering={FadeIn.delay(400)} style={styles.tagline}>
        {APP_TAGLINE}
      </Animated.Text>
      <View style={styles.footer}>
        <Animated.View style={[styles.loaderDot, loaderStyle]} />
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
  loaderDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
});
