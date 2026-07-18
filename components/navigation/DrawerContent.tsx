import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  DrawerContentScrollView,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar, Button, Divider } from '@/components/ui';
import { useTheme } from '@/providers';
import { ROUTES } from '@/constants/routes';
import { navigate, replace } from '@/navigation';
import { useAuthStore } from '@/store';
import { spacing, type IconName } from '@/theme';
import { getUserDisplayName } from '@/types';

const LINKS: { label: string; icon: IconName; route: Parameters<typeof navigate>[0] }[] =
  [
    { label: 'Profile', icon: 'person-outline', route: ROUTES.tabs.profile },
    { label: 'Subscription', icon: 'diamond-outline', route: ROUTES.app.subscription },
    { label: 'Settings', icon: 'settings-outline', route: ROUTES.app.settings },
    { label: 'Help', icon: 'help-circle-outline', route: ROUTES.app.help },
  ];

export const DrawerContent = memo(function DrawerContent(
  props: DrawerContentComponentProps,
) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const displayName = getUserDisplayName(user);

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          paddingTop: insets.top + spacing.md,
          paddingBottom: insets.bottom + spacing.lg,
        },
      ]}
    >
      <Pressable
        onPress={() => {
          props.navigation.closeDrawer();
          navigate(ROUTES.tabs.profile);
        }}
        style={styles.profile}
      >
        <Avatar name={displayName} size="lg" />
        <View style={styles.profileText}>
          <Text style={[styles.name, { color: theme.colors.text }]}>{displayName}</Text>
          <Text style={{ color: theme.colors.textSecondary }} numberOfLines={1}>
            {user?.email ?? 'Guest account'}
          </Text>
        </View>
      </Pressable>

      <Divider />

      <View style={styles.links}>
        {LINKS.map((item) => (
          <Pressable
            key={item.label}
            onPress={() => {
              props.navigation.closeDrawer();
              navigate(item.route);
            }}
            style={styles.linkRow}
            accessibilityRole="button"
            accessibilityLabel={item.label}
          >
            <Ionicons name={item.icon} size={22} color={theme.colors.primary} />
            <Text style={[styles.linkLabel, { color: theme.colors.text }]}>
              {item.label}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
          </Pressable>
        ))}
      </View>

      <View style={styles.footer}>
        <Button
          title="Log out"
          variant="outline"
          fullWidth
          onPress={async () => {
            props.navigation.closeDrawer();
            await logout();
            replace(ROUTES.auth.login);
          }}
        />
      </View>
    </DrawerContentScrollView>
  );
});

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: spacing.md },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  profileText: { flex: 1, gap: 2 },
  name: { fontSize: 18, fontWeight: '700' },
  links: { gap: spacing.xs, marginTop: spacing.sm },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  linkLabel: { flex: 1, fontSize: 16, fontWeight: '600' },
  footer: { marginTop: 'auto', paddingTop: spacing.xl },
});
