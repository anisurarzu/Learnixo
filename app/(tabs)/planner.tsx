import { StyleSheet, Text, View } from 'react-native';
import { Screen, Card, EmptyState, Badge, ProgressBar } from '@/components/ui';
import { useTheme } from '@/providers';
import { usePlannerStore } from '@/store';
import { spacing } from '@/theme';

export default function PlannerScreen() {
  const { theme } = useTheme();
  const tasks = usePlannerStore((s) => s.tasks);
  const selectedDate = usePlannerStore((s) => s.selectedDate);

  return (
    <Screen title="Planner" subtitle="Organize study sessions and stay consistent.">
      <Card elevated style={styles.todayCard}>
        <Badge label="Today" variant="primary" />
        <Text style={[styles.date, { color: theme.colors.text }]}>{selectedDate}</Text>
        <Text style={{ color: theme.colors.textSecondary }}>
          Weekly focus: 8 / 12 hours
        </Text>
        <ProgressBar
          progress={0.66}
          color={theme.colors.accent}
          style={styles.progress}
        />
      </Card>

      {tasks.length === 0 ? (
        <EmptyState
          icon="calendar-outline"
          title="No tasks planned"
          description="Your study schedule will appear here once planner logic is connected."
        />
      ) : (
        <View />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  todayCard: { gap: spacing.sm, marginBottom: spacing.lg },
  date: { fontSize: 24, fontWeight: '700' },
  progress: { marginTop: spacing.sm },
});
