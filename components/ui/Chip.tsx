import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { useTheme } from '@/providers';
import { radius, spacing } from '@/theme';
import { usePressAnimation } from './hooks/usePressAnimation';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface ChipProps {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export const Chip = memo(function Chip({
  label,
  selected = false,
  disabled = false,
  onPress,
  style,
}: ChipProps) {
  const { theme } = useTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation(0.96);

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled || !onPress}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      style={[
        styles.chip,
        {
          backgroundColor: selected
            ? theme.colors.primary
            : theme.colors.backgroundSecondary,
          borderColor: selected ? theme.colors.primary : theme.colors.border,
          opacity: disabled ? theme.opacity.disabled : 1,
        },
        animatedStyle,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: selected ? theme.colors.white : theme.colors.textSecondary },
        ]}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
});

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  label: { fontSize: 14, fontWeight: '600' },
});
