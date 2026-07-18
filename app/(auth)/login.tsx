import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Input, Button, Card } from '@/components/ui';
import { useTheme } from '@/providers';
import { useAuthStore } from '@/store';
import { spacing } from '@/theme';
import type { AuthTokens, AuthUser } from '@/types';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof schema>;

export default function LoginScreen() {
  const { theme } = useTheme();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const mockAuth = async (provider: AuthUser['provider']) => {
    const user: AuthUser = {
      id: 'local-user',
      email: provider === 'guest' ? null : 'student@studyai.app',
      displayName: provider === 'guest' ? 'Guest Learner' : 'Alex Student',
      avatarUrl: null,
      provider,
      isGuest: provider === 'guest',
      createdAt: new Date().toISOString(),
    };
    const tokens: AuthTokens = {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    };
    await setAuth(user, tokens);
    router.replace('/(tabs)');
  };

  const onSubmit = handleSubmit(async () => {
    await mockAuth('email');
  });

  return (
    <Screen title="Welcome back" subtitle="Sign in to continue your study streak." scroll>
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
        <Link href="/(auth)/forgot-password" asChild>
          <Pressable style={styles.forgot}>
            <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>
              Forgot password?
            </Text>
          </Pressable>
        </Link>
        <Button
          title="Sign in"
          onPress={onSubmit}
          loading={isSubmitting}
          fullWidth
          size="lg"
        />
      </Card>

      <View style={styles.dividerRow}>
        <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
        <Text style={{ color: theme.colors.textMuted }}>or continue with</Text>
        <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
      </View>

      <View style={styles.socialRow}>
        <SocialButton
          icon="logo-google"
          label="Google"
          loading={socialLoading === 'google'}
          onPress={async () => {
            setSocialLoading('google');
            await mockAuth('google');
            setSocialLoading(null);
          }}
        />
        <SocialButton
          icon="logo-apple"
          label="Apple"
          loading={socialLoading === 'apple'}
          onPress={async () => {
            setSocialLoading('apple');
            await mockAuth('apple');
            setSocialLoading(null);
          }}
        />
      </View>

      <Button
        title="Continue as guest"
        variant="outline"
        fullWidth
        onPress={() => mockAuth('guest')}
        style={styles.guest}
      />

      <View style={styles.footer}>
        <Text style={{ color: theme.colors.textSecondary }}>New here? </Text>
        <Link href="/(auth)/register" asChild>
          <Pressable>
            <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>
              Create account
            </Text>
          </Pressable>
        </Link>
      </View>
    </Screen>
  );
}

function SocialButton({
  icon,
  label,
  onPress,
  loading,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  loading?: boolean;
}) {
  const { theme } = useTheme();
  return (
    <Button
      title={label}
      variant="outline"
      loading={loading}
      onPress={onPress}
      style={styles.socialBtn}
      leftIcon={<Ionicons name={icon} size={18} color={theme.colors.text} />}
    />
  );
}

const styles = StyleSheet.create({
  formCard: { gap: spacing.md },
  forgot: { alignSelf: 'flex-end' },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: spacing.lg,
  },
  line: { flex: 1, height: StyleSheet.hairlineWidth },
  socialRow: { flexDirection: 'row', gap: spacing.sm },
  socialBtn: { flex: 1 },
  guest: { marginTop: spacing.md },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
});
