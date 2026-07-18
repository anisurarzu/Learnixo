import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Screen, Input, Button, Card } from '@/components/ui';
import { useTheme } from '@/providers';
import { useAuthStore } from '@/store';
import { spacing } from '@/theme';
import type { AuthTokens, AuthUser } from '@/types';

const schema = z
  .object({
    displayName: z.string().min(2, 'Name is required'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterScreen() {
  const { theme } = useTheme();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const user: AuthUser = {
      id: 'local-user',
      email: values.email,
      displayName: values.displayName,
      avatarUrl: null,
      provider: 'email',
      isGuest: false,
      createdAt: new Date().toISOString(),
    };
    const tokens: AuthTokens = {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    };
    await setAuth(user, tokens);
    router.replace('/(tabs)');
  });

  return (
    <Screen title="Create account" subtitle="Start learning smarter in under a minute.">
      <Card elevated style={styles.formCard}>
        <Controller
          control={control}
          name="displayName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Full name"
              leftIcon="person-outline"
              placeholder="Alex Student"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.displayName?.message}
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
        <Button
          title="Create account"
          onPress={onSubmit}
          loading={isSubmitting}
          fullWidth
          size="lg"
        />
      </Card>

      <View style={styles.footer}>
        <Text style={{ color: theme.colors.textSecondary }}>
          Already have an account?{' '}
        </Text>
        <Link href="/(auth)/login" asChild>
          <Pressable>
            <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>
              Sign in
            </Text>
          </Pressable>
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  formCard: { gap: spacing.md },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
});
