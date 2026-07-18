import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Screen, Input, Button, Card, SuccessState, OTPInput } from '@/components/ui';
import {
  AuthErrorBanner,
  AuthScreenHeader,
  PasswordStrengthMeter,
} from '@/components/features/auth';
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/schemas/auth.schemas';
import { authService } from '@/services/auth';
import { toAuthError } from '@/services/auth/errors';
import { ROUTES } from '@/constants/routes';
import { replace } from '@/navigation';
import { spacing } from '@/theme';

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{ email?: string }>();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: params.email ?? '',
      otp: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = useWatch({ control, name: 'password' });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      await authService.resetPassword(values);
      setDone(true);
    } catch (err) {
      setError(toAuthError(err).message);
    }
  });

  if (done) {
    return (
      <Screen>
        <SuccessState
          title="Password updated"
          description="You can now sign in with your new password."
          actionLabel="Back to sign in"
          onAction={() => replace(ROUTES.auth.login)}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <AuthScreenHeader
        title="Reset password"
        subtitle="Enter the code from your email and choose a new password."
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
            <Text style={styles.otpLabel}>Reset code</Text>
            <Controller
              control={control}
              name="otp"
              render={({ field: { value } }) => (
                <OTPInput
                  value={value}
                  onChange={(code) => setValue('otp', code, { shouldValidate: true })}
                  error={errors.otp?.message}
                />
              )}
            />
          </View>

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="New password"
                leftIcon="lock-closed-outline"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
              />
            )}
          />
          <PasswordStrengthMeter password={password} />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Confirm password"
                leftIcon="lock-closed-outline"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirmPassword?.message}
              />
            )}
          />

          <Button
            title="Update password"
            fullWidth
            size="lg"
            loading={isSubmitting}
            onPress={onSubmit}
          />
        </Card>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  otpLabel: { fontSize: 14, fontWeight: '500', marginBottom: spacing.xs, marginLeft: 4 },
});
