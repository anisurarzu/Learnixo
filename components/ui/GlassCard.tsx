import React, { memo } from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/providers';
import { radius, spacing } from '@/theme';

export interface GlassCardProps {
  children: React.ReactNode;
  intensity?: number;
  padded?: boolean;
  style?: ViewStyle;
}

/**
 * Frosted-glass surface — uses BlurView on native, translucent fallback on web.
 */
export const GlassCard = memo(function GlassCard({
  children,
  intensity = 40,
  padded = true,
  style,
}: GlassCardProps) {
  const { theme } = useTheme();

  const content = <View style={[padded && styles.padded, styles.inner]}>{children}</View>;

  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surfaceGlass,
            borderColor: theme.colors.border,
          },
          style,
        ]}
      >
        {content}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.card,
        {
          borderColor: theme.colors.border,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <BlurView
        intensity={intensity}
        tint={theme.isDark ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.surfaceGlass }]}
      />
      {content}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: radius['2xl'],
    borderWidth: StyleSheet.hairlineWidth,
  },
  padded: { padding: spacing.lg },
  inner: { position: 'relative', zIndex: 1 },
});
