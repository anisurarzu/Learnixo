import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Screen, Input, Button, Card, EmptyState } from '@/components/ui';
import { AuthErrorBanner, AuthScreenHeader } from '@/components/features/auth';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/schemas/auth.schemas';
import { authService } from '@/services/auth';
import { toAuthError } from '@/services/auth/errors';
import { ROUTES } from '@/constants/routes';
import { replace, push, goBack } from '@/navigation';
import { useTheme } from '@/providers';
import { spacing } from '@/theme';

export default function ForgotPasswordScreen() {
  const { theme } = useTheme();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSentTo, setEmailSentTo] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      await authService.forgotPassword(values);
      setEmailSentTo(values.email);
      setSent(true);
    } catch (err) {
      setError(toAuthError(err).message);
    }
  });

  if (sent) {
    return (
      <Screen>
        <EmptyState
          icon="mail-open-outline"
          title="Check your inbox"
          description={`We sent a reset code to ${emailSentTo}. Use it on the next screen.`}
          actionLabel="Enter reset code"
          onAction={() => push(ROUTES.auth.resetPassword, { email: emailSentTo })}
        />
        <Button
          title="Back to sign in"
          variant="ghost"
          fullWidth
          onPress={() => replace(ROUTES.auth.login)}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <AuthScreenHeader
        title="Forgot password"
        subtitle="Enter your email and we’ll send a reset code."
      />
      <AuthErrorBanner message={error} />

      <Animated.View entering={FadeInUp.springify()}>
        <Card elevated style={styles.card}>
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
          <Text style={{ color: theme.colors.textMuted, fontSize: 13, lineHeight: 18 }}>
            For the mock backend, the OTP is logged in the Metro console.
          </Text>
          <Button
            title="Send reset code"
            onPress={onSubmit}
            loading={isSubmitting}
            fullWidth
            size="lg"
          />
          <Button title="Back" variant="ghost" fullWidth onPress={goBack} />
        </Card>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
});
