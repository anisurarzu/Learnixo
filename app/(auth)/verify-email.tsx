import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import { Screen, Button, Card, SuccessState, OTPInput, Input } from '@/components/ui';
import { AuthErrorBanner, AuthScreenHeader } from '@/components/features/auth';
import { verifyEmailSchema, type VerifyEmailFormValues } from '@/schemas/auth.schemas';
import { authService } from '@/services/auth';
import { toAuthError } from '@/services/auth/errors';
import { useAuthStore } from '@/store';
import { ROUTES } from '@/constants/routes';
import { replace } from '@/navigation';
import { useTheme } from '@/providers';
import { spacing } from '@/theme';

export default function VerifyEmailScreen() {
  const { theme } = useTheme();
  const params = useLocalSearchParams<{ email?: string }>();
  const setUser = useAuthStore((s) => s.setUser);
  const establishSession = useAuthStore((s) => s.establishSession);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: params.email ?? '',
      code: '',
    },
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      const { user, tokens } = await authService.verifyEmail(values);
      await establishSession(user, tokens, true);
      await setUser(user);
      setDone(true);
      setTimeout(() => replace(ROUTES.tabs.home), 900);
    } catch (err) {
      setError(toAuthError(err).message);
    }
  });

  const resend = useCallback(async () => {
    const email = params.email;
    if (!email || cooldown > 0) return;
    setError(null);
    try {
      const res = await authService.resendVerification(email);
      setCooldown(res.cooldownSeconds);
    } catch (err) {
      setError(toAuthError(err).message);
    }
  }, [cooldown, params.email]);

  if (done) {
    return (
      <Screen>
        <Animated.View entering={ZoomIn.springify()}>
          <SuccessState
            title="Email verified!"
            description="Your account is ready. Redirecting…"
          />
        </Animated.View>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <AuthScreenHeader
        title="Verify email"
        subtitle="Enter the 6-digit code we sent to your inbox."
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
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
              />
            )}
          />

          <View>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Verification code
            </Text>
            <Controller
              control={control}
              name="code"
              render={({ field: { value } }) => (
                <OTPInput
                  value={value}
                  onChange={(code) => setValue('code', code, { shouldValidate: true })}
                  onComplete={() => onSubmit()}
                  error={errors.code?.message}
                />
              )}
            />
          </View>

          <Button
            title="Verify email"
            fullWidth
            size="lg"
            loading={isSubmitting}
            onPress={onSubmit}
          />

          <Button
            title={cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
            variant="ghost"
            fullWidth
            disabled={cooldown > 0}
            onPress={resend}
          />
        </Card>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  label: { fontSize: 14, fontWeight: '500', marginBottom: spacing.xs, marginLeft: 4 },
});
