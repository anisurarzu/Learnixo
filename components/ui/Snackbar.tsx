import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/providers';
import { createShadow, radius, spacing } from '@/theme';

export interface SnackbarProps {
  visible: boolean;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  durationHint?: string;
  style?: ViewStyle;
}

export const Snackbar = memo(function Snackbar({
  visible,
  message,
  actionLabel,
  onAction,
  onDismiss,
  style,
}: SnackbarProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(16)}
      exiting={FadeOutDown.duration(160)}
      style={[
        styles.bar,
        {
          backgroundColor: theme.isDark ? theme.colors.surfaceElevated : '#1E293B',
          bottom: insets.bottom + spacing.lg,
        },
        createShadow('lg', theme.colors.shadow),
        style,
      ]}
    >
      <Text style={styles.message} numberOfLines={2}>
        {message}
      </Text>
      <View style={styles.actions}>
        {actionLabel && onAction ? (
          <Pressable onPress={onAction} accessibilityRole="button">
            <Text style={[styles.action, { color: theme.colors.accentLight }]}>
              {actionLabel}
            </Text>
          </Pressable>
        ) : null}
        {onDismiss ? (
          <Pressable
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel="Dismiss"
          >
            <Text style={styles.dismiss}>Dismiss</Text>
          </Pressable>
        ) : null}
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    zIndex: 55,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
  },
  message: { flex: 1, color: '#F8FAFC', fontSize: 14, lineHeight: 20 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  action: { fontSize: 14, fontWeight: '700' },
  dismiss: { fontSize: 13, color: '#94A3B8', fontWeight: '600' },
});
