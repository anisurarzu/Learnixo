import { Redirect } from 'expo-router';
import { Loading } from '@/components/ui';
import { useAuthStore } from '@/store';
import { STORAGE_KEYS } from '@/constants';
import { cache } from '@/utils/storage';

/**
 * Entry redirect — routes to splash → onboarding/auth/tabs based on state.
 */
export default function Index() {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isHydrated) {
    return <Loading fullScreen message="Starting StudyAI…" />;
  }

  const onboardingComplete = cache.getJSON<boolean>(STORAGE_KEYS.onboardingComplete);

  if (!onboardingComplete) {
    return <Redirect href="/splash" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)" />;
}
