import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui';
import { useTheme } from '@/providers';
import { spacing } from '@/theme';

export default function NotFoundScreen() {
  const { theme } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!', headerShown: true }} />
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Screen not found</Text>
        <Text style={{ color: theme.colors.textSecondary, marginBottom: spacing.lg }}>
          This route does not exist in the StudyAI navigator.
        </Text>
        <Link href="/(tabs)" asChild>
          <Button title="Go home" />
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: { fontSize: 24, fontWeight: '700', marginBottom: spacing.sm },
});
