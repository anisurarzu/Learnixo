import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { goBack } from '@/navigation';
import { Screen, Card, Button, Badge } from '@/components/ui';
import { useTheme } from '@/providers';
import { useSubscriptionStore } from '@/store';
import { spacing } from '@/theme';

type Plan = {
  id: 'free' | 'pro' | 'premium';
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
};

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    features: ['Basic AI chat', '3 uploads / month', 'Limited quizzes'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$12',
    features: ['Unlimited chat', '50 uploads', 'Quizzes + flashcards'],
    highlighted: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$24',
    features: ['Everything in Pro', 'Priority AI', 'Study planner insights'],
  },
];

export default function SubscriptionScreen() {
  const { theme } = useTheme();
  const subscription = useSubscriptionStore((s) => s.subscription);

  return (
    <Screen
      title="Subscription"
      subtitle="Unlock the full StudyAI experience."
      headerRight={<Button title="Close" variant="ghost" size="sm" onPress={goBack} />}
    >
      <Card elevated style={styles.current}>
        <Text style={{ color: theme.colors.textSecondary }}>Current plan</Text>
        <Text style={[styles.planName, { color: theme.colors.text }]}>
          {subscription.plan.toUpperCase()}
        </Text>
        <Badge label={subscription.status} variant="success" />
      </Card>

      {PLANS.map((plan) => {
        const cardStyle: ViewStyle[] = [styles.planCard];
        if (plan.highlighted) {
          cardStyle.push({
            borderColor: theme.colors.primary,
            borderWidth: 1.5,
          });
        }

        return (
          <Card key={plan.id} elevated style={cardStyle}>
            <View style={styles.planHeader}>
              <Text style={[styles.planName, { color: theme.colors.text }]}>
                {plan.name}
              </Text>
              {plan.highlighted ? <Badge label="Popular" /> : null}
            </View>
            <Text style={[styles.price, { color: theme.colors.text }]}>
              {plan.price}
              <Text style={{ color: theme.colors.textMuted, fontSize: 14 }}>/mo</Text>
            </Text>
            {plan.features.map((feature) => (
              <Text
                key={feature}
                style={{ color: theme.colors.textSecondary, lineHeight: 22 }}
              >
                • {feature}
              </Text>
            ))}
            <Button
              title={subscription.plan === plan.id ? 'Current plan' : 'Choose plan'}
              variant={plan.highlighted ? 'primary' : 'outline'}
              disabled={subscription.plan === plan.id}
              fullWidth
              onPress={() => undefined}
              style={styles.cta}
            />
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  current: { gap: spacing.xs, marginBottom: spacing.lg },
  planCard: { gap: spacing.xs, marginBottom: spacing.md },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planName: { fontSize: 20, fontWeight: '700' },
  price: { fontSize: 32, fontWeight: '800', marginVertical: spacing.xs },
  cta: { marginTop: spacing.sm },
});
