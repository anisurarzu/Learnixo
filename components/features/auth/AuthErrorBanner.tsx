import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/providers';
import { radius, spacing } from '@/theme';

export const AuthErrorBanner = memo(function AuthErrorBanner({
  message,
}: {
  message: string | null | undefined;
}) {
  const { theme } = useTheme();
  if (!message) return null;

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(16)}
      exiting={FadeOutUp.duration(150)}
      accessibilityLiveRegion="polite"
      style={[
        styles.banner,
        {
          backgroundColor: theme.colors.errorMuted,
          borderColor: theme.colors.error,
        },
      ]}
    >
      <Ionicons name="alert-circle" size={20} color={theme.colors.error} />
      <Text style={[styles.text, { color: theme.colors.error }]}>{message}</Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1,
  },
  text: { flex: 1, fontSize: 14, fontWeight: '500', lineHeight: 20 },
});
