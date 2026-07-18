import React, { memo } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '@/providers';
import { spacing } from '@/theme';

export interface DividerProps {
  label?: string;
  vertical?: boolean;
  spacing?: number;
  style?: ViewStyle;
}

export const Divider = memo(function Divider({
  label,
  vertical = false,
  spacing: gap = spacing.md,
  style,
}: DividerProps) {
  const { theme } = useTheme();

  if (vertical) {
    return (
      <View
        style={[
          styles.vertical,
          { backgroundColor: theme.colors.divider, marginHorizontal: gap },
          style,
        ]}
      />
    );
  }

  if (label) {
    return (
      <View style={[styles.labeled, { marginVertical: gap }, style]}>
        <View style={[styles.line, { backgroundColor: theme.colors.divider }]} />
        <Text style={[styles.label, { color: theme.colors.textMuted }]}>{label}</Text>
        <View style={[styles.line, { backgroundColor: theme.colors.divider }]} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.line,
        { backgroundColor: theme.colors.divider, marginVertical: gap },
        style,
      ]}
    />
  );
});

const styles = StyleSheet.create({
  line: { height: StyleSheet.hairlineWidth, flex: 1 },
  vertical: { width: StyleSheet.hairlineWidth, alignSelf: 'stretch' },
  labeled: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label: { fontSize: 12, fontWeight: '500' },
});
