import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/providers';
import { spacing } from '@/theme';

export const AuthScreenHeader = memo(function AuthScreenHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const { theme } = useTheme();

  return (
    <Animated.View entering={FadeInDown.duration(350)} style={styles.wrap}>
      <Text style={[styles.brand, { color: theme.colors.primary }]}>Learnixo</Text>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        {subtitle}
      </Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs, marginBottom: spacing.lg, marginTop: spacing.sm },
  brand: { fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
  title: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 15, lineHeight: 22 },
});
