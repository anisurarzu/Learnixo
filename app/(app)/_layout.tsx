import { Stack } from 'expo-router';
import { useTheme } from '@/providers';
import { AuthGuard, defaultStackOptions, transitions } from '@/navigation';

/**
 * Protected app shell — AuthGuard + Stack.
 * Drawer wraps tabs only; feature screens push onto this stack.
 */
export default function AppLayout() {
  const { theme } = useTheme();

  return (
    <AuthGuard>
      <Stack
        screenOptions={{
          ...defaultStackOptions,
          contentStyle: { backgroundColor: theme.colors.background },
          ...transitions.slideFromRight,
        }}
      >
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="settings" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="subscription" />
        <Stack.Screen name="summary" />
        <Stack.Screen name="quiz" />
        <Stack.Screen name="quiz-result" />
        <Stack.Screen name="flashcards" />
        <Stack.Screen name="pdf-viewer" />
        <Stack.Screen name="study-session" />
        <Stack.Screen name="search" />
        <Stack.Screen name="edit-profile" />
        <Stack.Screen name="account" />
        <Stack.Screen name="help" />
        <Stack.Screen name="about" />
        <Stack.Screen name="privacy" />
        <Stack.Screen name="terms" />
      </Stack>
    </AuthGuard>
  );
}
