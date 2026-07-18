import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { Button } from '@/components/ui';
import { useTheme } from '@/providers';
import { goBack } from '@/navigation';
import { radius, spacing } from '@/theme';

export default function DeleteConfirmationModal() {
  const { theme } = useTheme();
  const params = useLocalSearchParams<{ title?: string; message?: string }>();

  return (
    <View style={[styles.overlay, { backgroundColor: theme.colors.overlay }]}>
      <Pressable style={StyleSheet.absoluteFill} onPress={goBack} />
      <Animated.View
        entering={ZoomIn.springify().damping(16)}
        style={[styles.sheet, { backgroundColor: theme.colors.surfaceElevated }]}
      >
        <Animated.Text
          entering={FadeIn}
          style={[styles.title, { color: theme.colors.text }]}
        >
          {params.title ?? 'Delete item?'}
        </Animated.Text>
        <Text style={{ color: theme.colors.textSecondary, lineHeight: 22 }}>
          {params.message ?? 'This action cannot be undone. Navigation shell only.'}
        </Text>
        <View style={styles.actions}>
          <Button title="Cancel" variant="ghost" style={styles.btn} onPress={goBack} />
          <Button title="Delete" variant="danger" style={styles.btn} onPress={goBack} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  sheet: {
    borderRadius: radius['2xl'],
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: { fontSize: 20, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: spacing.sm },
  btn: { flex: 1 },
});
