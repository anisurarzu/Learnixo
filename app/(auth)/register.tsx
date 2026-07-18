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
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Input, Button, Card } from '@/components/ui';
import {
  AuthErrorBanner,
  AuthScreenHeader,
  PasswordStrengthMeter,
  SocialAuthButtons,
} from '@/components/features/auth';
import { registerSchema, type RegisterFormValues } from '@/schemas/auth.schemas';
import { useAuthStore } from '@/store';
import { useTheme } from '@/providers';
import { ROUTES } from '@/constants/routes';
import { replace, push } from '@/navigation';
import { spacing } from '@/theme';
import type { User } from '@/types';

export default function RegisterScreen() {
  const { theme } = useTheme();
  const registerUser = useAuthStore((s) => s.register);
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
  const loginWithApple = useAuthStore((s) => s.loginWithApple);
  const clearError = useAuthStore((s) => s.clearError);
  const error = useAuthStore((s) => s.error);
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const password = useWatch({ control, name: 'password' });
  const acceptTerms = useWatch({ control, name: 'acceptTerms' });

  const afterAuth = async (fn: () => Promise<User>) => {
    clearError();
    try {
      const user = await fn();
      if (!user.isVerified && user.email) {
        replace(ROUTES.auth.verifyEmail, { email: user.email });
      } else {
        replace(ROUTES.tabs.home);
      }
    } catch {
      // surfaced via store
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <Screen scroll padded>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <AuthScreenHeader
          title="Create account"
          subtitle="Start learning smarter in under a minute."
        />
        <AuthErrorBanner message={error} />

        <Animated.View entering={FadeInUp.delay(60).springify()}>
          <Card elevated style={styles.formCard}>
            <View style={styles.row}>
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="First name"
                    placeholder="Alex"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.firstName?.message}
                    containerStyle={styles.half}
                  />
                )}
              />
              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Last name"
                    placeholder="Student"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.lastName?.message}
                    containerStyle={styles.half}
                  />
                )}
              />
            </View>

            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Username"
                  leftIcon="at-outline"
                  autoCapitalize="none"
                  placeholder="alex_student"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.username?.message}
                />
              )}
            />

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

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  leftIcon="lock-closed-outline"
                  secureTextEntry
                  placeholder="••••••••"
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
                  placeholder="••••••••"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="acceptTerms"
              render={({ field: { value, onChange } }) => (
                <Pressable
                  onPress={() => onChange(!value)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: value }}
                  style={styles.termsInner}
                >
                  <View
                    style={[
                      styles.check,
                      {
                        borderColor: value ? theme.colors.primary : theme.colors.border,
                        backgroundColor: value ? theme.colors.primary : 'transparent',
                      },
                    ]}
                  >
                    {value ? <Ionicons name="checkmark" size={14} color="#FFF" /> : null}
                  </View>
                  <Text
                    style={{ color: theme.colors.textSecondary, flex: 1, lineHeight: 20 }}
                  >
                    I agree to the{' '}
                    <Text
                      style={{ color: theme.colors.primary, fontWeight: '600' }}
                      onPress={() => push(ROUTES.app.terms)}
                    >
                      Terms
                    </Text>{' '}
                    and{' '}
                    <Text
                      style={{ color: theme.colors.primary, fontWeight: '600' }}
                      onPress={() => push(ROUTES.app.privacy)}
                    >
                      Privacy Policy
                    </Text>
                  </Text>
                </Pressable>
              )}
            />
            {errors.acceptTerms?.message ? (
              <Text style={{ color: theme.colors.error, fontSize: 12 }}>
                {errors.acceptTerms.message}
              </Text>
            ) : null}

            <Button
              title="Create account"
              fullWidth
              size="lg"
              loading={isSubmitting}
              disabled={!acceptTerms || socialLoading != null}
              onPress={handleSubmit((values) => afterAuth(() => registerUser(values)))}
            />
          </Card>
        </Animated.View>

        <SocialAuthButtons
          showGuest={false}
          loadingProvider={socialLoading}
          disabled={isSubmitting}
          onGoogle={() => {
            setSocialLoading('google');
            afterAuth(loginWithGoogle);
          }}
          onApple={() => {
            setSocialLoading('apple');
            afterAuth(loginWithApple);
          }}
        />

        <View style={styles.footer}>
          <Text style={{ color: theme.colors.textSecondary }}>
            Already have an account?{' '}
          </Text>
          <Link href={ROUTES.auth.login} asChild>
            <Pressable>
              <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>
                Sign in
              </Text>
            </Pressable>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  formCard: { gap: spacing.md, marginBottom: spacing.lg },
  row: { flexDirection: 'row', gap: spacing.sm },
  half: { flex: 1 },
  termsInner: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  check: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});
