import { StyleSheet, Text } from 'react-native';
import { Screen, Card, Button } from '@/components/ui';
import { useTheme } from '@/providers';
import { goBack } from '@/navigation';
import { spacing } from '@/theme';

export default function ShareDocumentModal() {
  const { theme } = useTheme();

  return (
    <Screen title="Share document" subtitle="Choose how to share this study material.">
      <Card elevated style={styles.card}>
        <Text style={{ color: theme.colors.textSecondary, lineHeight: 22 }}>
          Share sheet shell — wire native share and invite links later.
        </Text>
        <Button title="Close" variant="outline" fullWidth onPress={goBack} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
});
