import React, { memo } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '@/providers';
import { radius, spacing, type SemanticColor } from '@/theme';
import { semanticColors } from './utils';

export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  label: string;
  variant?: SemanticColor;
  size?: BadgeSize;
  style?: ViewStyle;
}

export const Badge = memo(function Badge({
  label,
  variant = 'primary',
  size = 'sm',
  style,
}: BadgeProps) {
  const { theme } = useTheme();
  const tint = semanticColors(theme.colors, variant);

  return (
    <View
      accessibilityRole="text"
      style={[styles.badge, sizeStyles[size], { backgroundColor: tint.bg }, style]}
    >
      <Text style={[styles.label, sizeText[size], { color: tint.fg }]}>{label}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.full,
  },
  label: { fontWeight: '600' },
});

const sizeStyles = StyleSheet.create({
  sm: { paddingHorizontal: spacing.sm + 2, paddingVertical: spacing.xs },
  md: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 2 },
});

const sizeText = StyleSheet.create({
  sm: { fontSize: 12 },
  md: { fontSize: 13 },
});
