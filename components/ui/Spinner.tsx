import React, { memo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '@/providers';
import { spacing } from '@/theme';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps {
  message?: string;
  size?: SpinnerSize;
  fullScreen?: boolean;
  color?: string;
  style?: ViewStyle;
}

export const Spinner = memo(function Spinner({
  message,
  size = 'md',
  fullScreen = false,
  color,
  style,
}: SpinnerProps) {
  const { theme } = useTheme();
  const indicatorSize = size === 'sm' ? 'small' : 'large';

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={message ?? 'Loading'}
      style={[
        styles.container,
        fullScreen && styles.fullScreen,
        fullScreen && { backgroundColor: theme.colors.background },
        style,
      ]}
    >
      <ActivityIndicator size={indicatorSize} color={color ?? theme.colors.primary} />
      {message ? (
        <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
          {message}
        </Text>
      ) : null}
    </View>
  );
});

/** @deprecated Prefer Spinner */
export const Loading = Spinner;
export type LoadingProps = SpinnerProps;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  fullScreen: { flex: 1 },
  message: { fontSize: 15, fontWeight: '500' },
});
