import { Redirect } from 'expo-router';
import type { Href } from 'expo-router';
import { Loading } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { STORAGE_KEYS } from '@/constants';
import { useAuthStore } from '@/store';
import { cache } from '@/utils/storage';

/**
 * Entry redirect — splash → onboarding / auth / main based on state.
 */
export default function Index() {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isHydrated) {
    return <Loading fullScreen message="Starting Learnixo…" />;
  }

  const onboardingComplete = cache.getJSON<boolean>(STORAGE_KEYS.onboardingComplete);

  if (!onboardingComplete) {
    return <Redirect href={ROUTES.splash as Href} />;
  }

  if (!isAuthenticated) {
    return <Redirect href={ROUTES.auth.login as Href} />;
  }

  return <Redirect href={ROUTES.tabs.home as Href} />;
}
