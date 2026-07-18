import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/providers';
import { radius, spacing, type IconName, type SemanticColor } from '@/theme';
import { semanticColors } from './utils';

export interface TagProps {
  label: string;
  variant?: SemanticColor;
  icon?: IconName;
  onRemove?: () => void;
  style?: ViewStyle;
}

export const Tag = memo(function Tag({
  label,
  variant = 'neutral',
  icon,
  onRemove,
  style,
}: TagProps) {
  const { theme } = useTheme();
  const tint = semanticColors(theme.colors, variant);

  return (
    <Pressable
      onPress={onRemove}
      disabled={!onRemove}
      accessibilityRole={onRemove ? 'button' : 'text'}
      accessibilityLabel={onRemove ? `Remove ${label}` : label}
      style={[styles.tag, { backgroundColor: tint.bg }, style]}
    >
      {icon ? <Ionicons name={icon} size={14} color={tint.fg} /> : null}
      <Text style={[styles.label, { color: tint.fg }]}>{label}</Text>
      {onRemove ? <Ionicons name="close" size={14} color={tint.fg} /> : null}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 1,
    borderRadius: radius.md,
  },
  label: { fontSize: 12, fontWeight: '600' },
});
