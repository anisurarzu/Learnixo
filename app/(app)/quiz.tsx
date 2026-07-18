import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { goBack } from '@/navigation';
import { Screen, Card, Button, Badge, ProgressBar, EmptyState } from '@/components/ui';
import { useTheme } from '@/providers';
import { spacing } from '@/theme';

const SAMPLE = {
  prompt: 'What is supervised learning?',
  options: [
    'Learning without labels',
    'Learning from labeled examples',
    'Learning only from rewards',
    'Clustering unlabeled data',
  ],
};

export default function QuizScreen() {
  const { theme } = useTheme();
  const [selected, setSelected] = useState<number | null>(null);
  const [index] = useState(0);
  const total = 5;

  return (
    <Screen
      title="Quiz"
      subtitle="Test your understanding with AI-generated questions."
      headerRight={<Button title="Close" variant="ghost" size="sm" onPress={goBack} />}
    >
      <View style={styles.meta}>
        <Badge label={`Question ${index + 1}/${total}`} />
        <ProgressBar progress={(index + 1) / total} style={styles.progress} />
      </View>

      <Card elevated style={styles.card}>
        <Text style={[styles.prompt, { color: theme.colors.text }]}>{SAMPLE.prompt}</Text>
        {SAMPLE.options.map((option, i) => {
          const active = selected === i;
          return (
            <Button
              key={option}
              title={option}
              variant={active ? 'primary' : 'outline'}
              fullWidth
              onPress={() => setSelected(i)}
              style={styles.option}
            />
          );
        })}
      </Card>

      <Button
        title="Check answer"
        fullWidth
        size="lg"
        disabled={selected === null}
        onPress={() => undefined}
      />

      <EmptyState
        icon="help-circle-outline"
        title="Quiz engine placeholder"
        description="Scoring, explanations, and adaptive difficulty will be added with the quiz API."
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  meta: { gap: spacing.sm, marginBottom: spacing.lg },
  progress: { marginTop: spacing.xs },
  card: { gap: spacing.sm, marginBottom: spacing.lg },
  prompt: { fontSize: 20, fontWeight: '700', marginBottom: spacing.sm, lineHeight: 28 },
  option: { alignSelf: 'stretch' },
});
