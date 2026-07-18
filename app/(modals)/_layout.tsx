import { Stack } from 'expo-router';
import { useTheme } from '@/providers';
import { defaultStackOptions, transitions } from '@/navigation';

export default function ModalsLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        ...defaultStackOptions,
        contentStyle: { backgroundColor: theme.colors.background },
        ...transitions.scaleModal,
      }}
    >
      <Stack.Screen name="upload" options={{ presentation: 'modal' }} />
      <Stack.Screen name="share-document" options={{ presentation: 'modal' }} />
      <Stack.Screen
        name="delete-confirmation"
        options={{ presentation: 'transparentModal', animation: 'fade' }}
      />
      <Stack.Screen name="premium-upgrade" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
