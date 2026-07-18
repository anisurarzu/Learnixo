import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Avatar, Badge, Button } from '@/components/ui';
import { useTheme } from '@/providers';
import { useAuthStore, useSubscriptionStore } from '@/store';
import { spacing } from '@/theme';

const MENU = [
  { label: 'Settings', icon: 'settings-outline' as const, href: '/settings' },
  { label: 'Subscription', icon: 'diamond-outline' as const, href: '/subscription' },
  {
    label: 'Notifications',
    icon: 'notifications-outline' as const,
    href: '/notifications',
  },
];

export default function ProfileScreen() {
  const { theme } = useTheme();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const subscription = useSubscriptionStore((s) => s.subscription);

  return (
    <Screen title="Profile" subtitle="Manage your account and preferences.">
      <Card elevated style={styles.profileCard}>
        <Avatar name={user?.displayName} size="xl" />
        <View style={styles.profileText}>
          <Text style={[styles.name, { color: theme.colors.text }]}>
            {user?.displayName ?? 'Learner'}
          </Text>
          <Text style={{ color: theme.colors.textSecondary }}>
            {user?.email ?? 'Guest account'}
          </Text>
          <Badge
            label={subscription.plan.toUpperCase()}
            variant={subscription.plan === 'free' ? 'neutral' : 'secondary'}
            style={styles.badge}
          />
        </View>
      </Card>

      <Card elevated padded={false} style={styles.menuCard}>
        {MENU.map((item, index) => (
          <Pressable
            key={item.label}
            onPress={() => router.push(item.href as never)}
            style={[
              styles.menuRow,
              index < MENU.length - 1 && {
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: theme.colors.border,
              },
            ]}
          >
            <View style={styles.menuLeft}>
              <Ionicons name={item.icon} size={20} color={theme.colors.primary} />
              <Text style={[styles.menuLabel, { color: theme.colors.text }]}>
                {item.label}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
          </Pressable>
        ))}
      </Card>

      <Button
        title="Sign out"
        variant="outline"
        fullWidth
        onPress={async () => {
          await logout();
          router.replace('/(auth)/login');
        }}
        style={styles.logout}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  profileText: { flex: 1, gap: 4 },
  name: { fontSize: 22, fontWeight: '700' },
  badge: { marginTop: spacing.xs },
  menuCard: { overflow: 'hidden' },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  menuLabel: { fontSize: 16, fontWeight: '600' },
  logout: { marginTop: spacing.xl },
});
