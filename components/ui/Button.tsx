import React, { memo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/providers';
import { radius, sizeTokens, spacing } from '@/theme';
import { usePressAnimation } from './hooks/usePressAnimation';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ButtonVariant =
  'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'soft';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  accessibilityLabel?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  haptic?: boolean;
}

export const Button = memo(function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  accessibilityLabel,
  style,
  textStyle,
  haptic = true,
}: ButtonProps) {
  const { theme } = useTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation();
  const isDisabled = disabled || loading;
  const colors = resolveVariant(variant, theme.colors);

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={() => {
        if (haptic) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
        }
        onPress?.();
      }}
      style={[
        styles.base,
        sizeStyles[size],
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          opacity: isDisabled ? theme.opacity.disabled : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        animatedStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <>
          {leftIcon}
          <Text style={[styles.label, sizeText[size], { color: colors.text }, textStyle]}>
            {title}
          </Text>
          {rightIcon}
        </>
      )}
    </AnimatedPressable>
  );
});

function resolveVariant(
  variant: ButtonVariant,
  colors: ReturnType<typeof useTheme>['theme']['colors'],
) {
  switch (variant) {
    case 'secondary':
      return { bg: colors.secondary, border: colors.secondary, text: colors.white };
    case 'outline':
      return { bg: colors.transparent, border: colors.border, text: colors.text };
    case 'ghost':
      return { bg: colors.transparent, border: colors.transparent, text: colors.primary };
    case 'danger':
      return { bg: colors.error, border: colors.error, text: colors.white };
    case 'soft':
      return {
        bg: colors.primaryMuted,
        border: colors.primaryMuted,
        text: colors.primary,
      };
    default:
      return { bg: colors.primary, border: colors.primary, text: colors.white };
  }
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1.5,
  },
  label: {
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

const sizeStyles = StyleSheet.create({
  sm: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: sizeTokens.button.sm,
  },
  md: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md - 2,
    minHeight: sizeTokens.button.md,
  },
  lg: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    minHeight: sizeTokens.button.lg,
  },
});

const sizeText = StyleSheet.create({
  sm: { fontSize: 14 },
  md: { fontSize: 16 },
  lg: { fontSize: 17 },
});
