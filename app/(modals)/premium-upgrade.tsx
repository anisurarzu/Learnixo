import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen, Card, Button, Badge } from '@/components/ui';
import { useTheme } from '@/providers';
import { goBack, navigate } from '@/navigation';
import { ROUTES } from '@/constants/routes';
import { spacing } from '@/theme';

export default function PremiumUpgradeModal() {
  const { theme } = useTheme();
  const { feature } = useLocalSearchParams<{ feature?: string }>();

  return (
    <Screen title="Go Premium" subtitle="Unlock the full Learnixo experience.">
      <Card elevated style={styles.card}>
        <Badge label="Premium" variant="secondary" />
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {feature ? `Unlock ${feature}` : 'Upgrade your study plan'}
        </Text>
        <Text style={{ color: theme.colors.textSecondary, lineHeight: 22 }}>
          Modal shell for paywall — connect subscription purchase flow later.
        </Text>
        <View style={styles.actions}>
          <Button
            title="View plans"
            fullWidth
            onPress={() => {
              goBack();
              navigate(ROUTES.app.subscription);
            }}
          />
          <Button title="Not now" variant="ghost" fullWidth onPress={goBack} />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  title: { fontSize: 22, fontWeight: '700' },
  actions: { gap: spacing.sm, marginTop: spacing.sm },
});
