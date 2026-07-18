import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ROUTES } from '@/constants/routes';
import { push, replace } from '@/navigation';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Avatar, Badge, Button } from '@/components/ui';
import { useTheme } from '@/providers';
import { useAuthStore, useSubscriptionStore } from '@/store';
import { spacing } from '@/theme';
import { getUserDisplayName } from '@/types';

const MENU = [
  {
    label: 'Edit profile',
    icon: 'create-outline' as const,
    href: ROUTES.app.editProfile,
  },
  {
    label: 'Account',
    icon: 'shield-checkmark-outline' as const,
    href: ROUTES.app.account,
  },
  { label: 'Settings', icon: 'settings-outline' as const, href: ROUTES.app.settings },
  {
    label: 'Subscription',
    icon: 'diamond-outline' as const,
    href: ROUTES.app.subscription,
  },
  {
    label: 'Notifications',
    icon: 'notifications-outline' as const,
    href: ROUTES.app.notifications,
  },
  { label: 'Help center', icon: 'help-buoy-outline' as const, href: ROUTES.app.help },
  { label: 'About', icon: 'information-circle-outline' as const, href: ROUTES.app.about },
];

export default function ProfileScreen() {
  const { theme } = useTheme();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const subscription = useSubscriptionStore((s) => s.subscription);
  const displayName = getUserDisplayName(user);

  return (
    <Screen title="Profile" subtitle="Manage your account and preferences.">
      <Card elevated style={styles.profileCard}>
        <Avatar name={displayName} size="xl" />
        <View style={styles.profileText}>
          <Text style={[styles.name, { color: theme.colors.text }]}>{displayName}</Text>
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
            onPress={() => push(item.href)}
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
          replace(ROUTES.auth.login);
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
