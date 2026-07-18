import { StyleSheet, Text, View } from 'react-native';
import { ROUTES } from '@/constants/routes';
import { goBack, push } from '@/navigation';
import { Screen, Card, Badge, Button, Skeleton, EmptyState } from '@/components/ui';
import { useTheme } from '@/providers';
import { spacing } from '@/theme';

const KEY_POINTS = [
  'Core concepts and definitions',
  'Important formulas and theorems',
  'Exam-focused takeaways',
];

export default function SummaryScreen() {
  const { theme } = useTheme();
  const loading = false;

  return (
    <Screen
      title="Summary"
      subtitle="AI-generated overview of your document."
      headerRight={<Button title="Close" variant="ghost" size="sm" onPress={goBack} />}
    >
      {loading ? (
        <Skeleton height={180} />
      ) : (
        <>
          <Card elevated style={styles.card}>
            <Badge label="Ready" variant="success" />
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Intro to Machine Learning
            </Text>
            <Text style={[styles.body, { color: theme.colors.textSecondary }]}>
              Placeholder summary content. Connect document analysis to populate this view
              with structured insights, citations, and section breakdowns.
            </Text>
          </Card>

          <Text style={[styles.section, { color: theme.colors.text }]}>Key points</Text>
          <Card elevated style={styles.card}>
            {KEY_POINTS.map((point) => (
              <View key={point} style={styles.pointRow}>
                <View
                  style={[styles.bullet, { backgroundColor: theme.colors.primary }]}
                />
                <Text
                  style={{ color: theme.colors.textSecondary, flex: 1, lineHeight: 22 }}
                >
                  {point}
                </Text>
              </View>
            ))}
          </Card>

          <View style={styles.actions}>
            <Button
              title="Generate quiz"
              onPress={() => push(ROUTES.app.quiz)}
              style={styles.btn}
            />
            <Button
              title="Flashcards"
              variant="outline"
              onPress={() => push(ROUTES.app.flashcards)}
              style={styles.btn}
            />
          </View>
        </>
      )}

      <EmptyState
        icon="sparkles-outline"
        title="Deeper analysis coming soon"
        description="Section-by-section summaries and source citations will live here."
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm, marginBottom: spacing.lg },
  title: { fontSize: 22, fontWeight: '700' },
  body: { fontSize: 15, lineHeight: 23 },
  section: { fontSize: 18, fontWeight: '700', marginBottom: spacing.sm },
  pointRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  bullet: { width: 8, height: 8, borderRadius: 4, marginTop: 7 },
  actions: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  btn: { flex: 1 },
});
