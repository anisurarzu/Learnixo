import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ProgressBar } from '@/components/ui';
import { useTheme } from '@/providers';
import { getPasswordStrength, type PasswordStrength } from '@/schemas/auth.schemas';
import { spacing } from '@/theme';

const COLORS: Record<PasswordStrength, string> = {
  weak: '#EF4444',
  fair: '#F59E0B',
  good: '#06B6D4',
  strong: '#22C55E',
};

export const PasswordStrengthMeter = memo(function PasswordStrengthMeter({
  password,
}: {
  password: string;
}) {
  const { theme } = useTheme();
  if (!password) return null;

  const { score, label, checks } = getPasswordStrength(password);
  const color = COLORS[label];

  return (
    <Animated.View entering={FadeInDown.duration(200)} style={styles.wrap}>
      <ProgressBar progress={score / 5} color={color} height={6} />
      <Text style={[styles.label, { color }]}>
        Password strength: {label.charAt(0).toUpperCase() + label.slice(1)}
      </Text>
      <View style={styles.checks}>
        {(
          [
            ['length', '8+ characters'],
            ['upper', 'Uppercase'],
            ['lower', 'Lowercase'],
            ['number', 'Number'],
            ['special', 'Special character'],
          ] as const
        ).map(([key, text]) => (
          <Text
            key={key}
            style={{
              color: checks[key] ? theme.colors.success : theme.colors.textMuted,
              fontSize: 12,
            }}
          >
            {checks[key] ? '✓' : '○'} {text}
          </Text>
        ))}
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  label: { fontSize: 12, fontWeight: '600' },
  checks: { gap: 2, marginTop: 2 },
});
