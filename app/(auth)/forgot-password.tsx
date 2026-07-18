import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Screen, Input, Button, Card, EmptyState } from '@/components/ui';
import { useTheme } from '@/providers';
import { spacing } from '@/theme';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordScreen() {
  const { theme } = useTheme();
  const [sent, setSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
  });

  if (sent) {
    return (
      <Screen>
        <EmptyState
          icon="mail-open-outline"
          title="Check your inbox"
          description="We sent password reset instructions to your email."
          actionLabel="Back to sign in"
          onAction={() => router.replace('/(auth)/login')}
        />
      </Screen>
    );
  }

  return (
    <Screen
      title="Reset password"
      subtitle="Enter your email and we’ll send you a reset link."
    >
      <Card elevated style={styles.formCard}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email"
              leftIcon="mail-outline"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@school.edu"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
            />
          )}
        />
        <Text style={[styles.hint, { color: theme.colors.textMuted }]}>
          Architecture ready — connect the auth API when the backend is available.
        </Text>
        <Button
          title="Send reset link"
          onPress={onSubmit}
          loading={isSubmitting}
          fullWidth
          size="lg"
        />
        <Button title="Back" variant="ghost" fullWidth onPress={() => router.back()} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  formCard: { gap: spacing.md },
  hint: { fontSize: 13, lineHeight: 18 },
});
