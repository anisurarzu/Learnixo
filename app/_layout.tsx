import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { AppProviders, useTheme } from '@/providers';
import { defaultStackOptions, transitions } from '@/navigation';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

function RootNavigator() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        ...defaultStackOptions,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="index" options={transitions.fade} />
      <Stack.Screen name="splash" options={transitions.fade} />
      <Stack.Screen name="(onboarding)" options={transitions.slideFromRight} />
      <Stack.Screen name="(auth)" options={transitions.slideFromRight} />
      <Stack.Screen name="(app)" options={transitions.fade} />
      <Stack.Screen name="(modals)" options={transitions.scaleModal} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
