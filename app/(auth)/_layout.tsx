import { Stack } from 'expo-router';
import { useTheme } from '@/providers';
import { AuthGuard, defaultStackOptions, transitions } from '@/navigation';

/**
 * Auth group — guest-only. Signed-in users bounce to main tabs.
 */
export default function AuthLayout() {
  const { theme } = useTheme();

  return (
    <AuthGuard guestOnly>
      <Stack
        screenOptions={{
          ...defaultStackOptions,
          contentStyle: { backgroundColor: theme.colors.background },
          ...transitions.slideFromRight,
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="verify-email" />
        <Stack.Screen name="reset-password" />
      </Stack>
    </AuthGuard>
  );
}
