import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/providers';
import { createShadow, radius, spacing, springs } from '@/theme';

type TabIcon = keyof typeof Ionicons.glyphMap;

const TAB_ICONS: Record<string, { active: TabIcon; inactive: TabIcon }> = {
  index: { active: 'home', inactive: 'home-outline' },
  chat: { active: 'chatbubbles', inactive: 'chatbubbles-outline' },
  documents: { active: 'folder', inactive: 'folder-outline' },
  planner: { active: 'calendar', inactive: 'calendar-outline' },
  profile: { active: 'person', inactive: 'person-outline' },
};

export interface TabBadgeMap {
  [routeName: string]: number | string | undefined;
}

interface AnimatedTabBarProps extends BottomTabBarProps {
  badges?: TabBadgeMap;
}

/**
 * Custom animated bottom tab bar with active indicator + badge support.
 */
export const AnimatedTabBar = memo(function AnimatedTabBar({
  state,
  descriptors,
  navigation,
  badges = {},
}: AnimatedTabBarProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.tabBar,
          borderTopColor: theme.colors.tabBarBorder,
          paddingBottom: Math.max(insets.bottom, spacing.sm),
        },
        createShadow('sm', theme.colors.shadow),
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : (options.title ?? route.name);
        const focused = state.index === index;
        const icons = TAB_ICONS[route.name] ?? {
          active: 'ellipse' as TabIcon,
          inactive: 'ellipse-outline' as TabIcon,
        };
        const badge = badges[route.name];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <TabItem
            key={route.key}
            label={label}
            focused={focused}
            icon={focused ? icons.active : icons.inactive}
            badge={badge}
            onPress={onPress}
            color={focused ? theme.colors.primary : theme.colors.textMuted}
            indicatorColor={theme.colors.primary}
          />
        );
      })}
    </View>
  );
});

const TabItem = memo(function TabItem({
  label,
  focused,
  icon,
  badge,
  onPress,
  color,
  indicatorColor,
}: {
  label: string;
  focused: boolean;
  icon: TabIcon;
  badge?: number | string;
  onPress: () => void;
  color: string;
  indicatorColor: string;
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(focused ? 1 : 0.92, springs.snappy),
      },
    ],
  }));

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: withSpring(focused ? 1 : 0, springs.snappy),
    transform: [{ scaleX: withSpring(focused ? 1 : 0.4, springs.snappy) }],
  }));

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}
      onPress={onPress}
      style={styles.item}
    >
      <Animated.View style={[styles.iconWrap, animatedStyle]}>
        <Ionicons name={icon} size={24} color={color} />
        {badge != null && badge !== 0 && badge !== '' ? (
          <View style={[styles.badge, { backgroundColor: indicatorColor }]}>
            <Text style={styles.badgeText}>
              {typeof badge === 'number' && badge > 99 ? '99+' : badge}
            </Text>
          </View>
        ) : null}
      </Animated.View>
      <Text style={[styles.label, { color }]} numberOfLines={1}>
        {label}
      </Text>
      <Animated.View
        style={[styles.indicator, { backgroundColor: indicatorColor }, indicatorStyle]}
      />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.sm,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    minHeight: 52,
  },
  iconWrap: {
    width: 32,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
  indicator: {
    marginTop: 4,
    width: 16,
    height: 3,
    borderRadius: radius.full,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
});
