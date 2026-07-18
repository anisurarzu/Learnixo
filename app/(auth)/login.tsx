import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Screen, Input, Button, Card, SuccessState } from '@/components/ui';
import {
  AuthErrorBanner,
  AuthScreenHeader,
  RememberMeRow,
  SocialAuthButtons,
} from '@/components/features/auth';
import { loginSchema, type LoginFormValues } from '@/schemas/auth.schemas';
import { useAuthStore } from '@/store';
import { ROUTES } from '@/constants/routes';
import { replace, push } from '@/navigation';
import { spacing } from '@/theme';
import { useTheme } from '@/providers';

export default function LoginScreen() {
  const { theme } = useTheme();
  const login = useAuthStore((s) => s.login);
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
  const loginWithApple = useAuthStore((s) => s.loginWithApple);
  const loginAsGuest = useAuthStore((s) => s.loginAsGuest);
  const clearError = useAuthStore((s) => s.clearError);
  const error = useAuthStore((s) => s.error);

  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | 'guest' | null>(
    null,
  );
  const [success, setSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'demo@learnixo.app',
      password: 'Demo@1234',
      rememberMe: true,
    },
  });

  const finish = async (fn: () => Promise<unknown>) => {
    clearError();
    try {
      await fn();
      setSuccess(true);
      setTimeout(() => replace(ROUTES.tabs.home), 700);
    } catch {
      // error surfaced via store
    } finally {
      setSocialLoading(null);
    }
  };

  if (success) {
    return (
      <Screen>
        <SuccessState title="Welcome back!" description="Taking you to your study hub…" />
      </Screen>
    );
  }

  return (
    <Screen scroll padded>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <AuthScreenHeader
          title="Welcome back"
          subtitle="Sign in to continue your study streak."
        />

        <AuthErrorBanner message={error} />

        <Animated.View entering={FadeInUp.delay(80).springify()}>
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
                  autoComplete="email"
                  placeholder="you@school.edu"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  leftIcon="lock-closed-outline"
                  secureTextEntry
                  autoComplete="password"
                  placeholder="••••••••"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                />
              )}
            />

            <View style={styles.rowBetween}>
              <Controller
                control={control}
                name="rememberMe"
                render={({ field: { value, onChange } }) => (
                  <RememberMeRow value={value} onChange={onChange} />
                )}
              />
              <Pressable onPress={() => push(ROUTES.auth.forgotPassword)}>
                <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>
                  Forgot password?
                </Text>
              </Pressable>
            </View>

            <Button
              title="Sign in"
              fullWidth
              size="lg"
              loading={isSubmitting}
              disabled={socialLoading != null}
              onPress={handleSubmit((values) => finish(() => login(values)))}
            />

            <Text style={[styles.hint, { color: theme.colors.textMuted }]}>
              Demo: demo@learnixo.app / Demo@1234
            </Text>
          </Card>
        </Animated.View>

        <SocialAuthButtons
          loadingProvider={socialLoading}
          disabled={isSubmitting}
          onGoogle={() => {
            setSocialLoading('google');
            finish(loginWithGoogle);
          }}
          onApple={() => {
            setSocialLoading('apple');
            finish(loginWithApple);
          }}
          onGuest={() => {
            setSocialLoading('guest');
            finish(loginAsGuest);
          }}
        />

        <View style={styles.footer}>
          <Text style={{ color: theme.colors.textSecondary }}>New here? </Text>
          <Link href={ROUTES.auth.register} asChild>
            <Pressable>
              <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>
                Create account
              </Text>
            </Pressable>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  formCard: { gap: spacing.md, marginBottom: spacing.lg },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hint: { fontSize: 12, textAlign: 'center' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
});
