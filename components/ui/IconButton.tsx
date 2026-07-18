import React, { memo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/providers';
import { iconSizes, radius, sizeTokens, type IconName } from '@/theme';
import { usePressAnimation } from './hooks/usePressAnimation';
import { hitSlop } from './utils';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type IconButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps {
  icon: IconName;
  onPress?: () => void;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  loading?: boolean;
  disabled?: boolean;
  accessibilityLabel: string;
  color?: string;
  style?: ViewStyle;
}

export const IconButton = memo(function IconButton({
  icon,
  onPress,
  variant = 'ghost',
  size = 'md',
  loading = false,
  disabled = false,
  accessibilityLabel,
  color,
  style,
}: IconButtonProps) {
  const { theme } = useTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation();
  const dimension = sizeTokens.iconButton[size];
  const iconSize = iconSizes[size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'];
  const isDisabled = disabled || loading;
  const palette = resolveVariant(variant, theme.colors);
  const iconColor = color ?? palette.fg;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      hitSlop={hitSlop(6)}
      disabled={isDisabled}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={() => {
        Haptics.selectionAsync().catch(() => undefined);
        onPress?.();
      }}
      style={[
        styles.base,
        {
          width: dimension,
          height: dimension,
          borderRadius: radius.full,
          backgroundColor: palette.bg,
          borderColor: palette.border,
          opacity: isDisabled ? theme.opacity.disabled : 1,
        },
        animatedStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={iconColor} />
      ) : (
        <Ionicons name={icon} size={iconSize} color={iconColor} />
      )}
    </AnimatedPressable>
  );
});

function resolveVariant(
  variant: IconButtonVariant,
  colors: ReturnType<typeof useTheme>['theme']['colors'],
) {
  switch (variant) {
    case 'solid':
      return { bg: colors.primary, border: colors.primary, fg: colors.white };
    case 'soft':
      return { bg: colors.primaryMuted, border: colors.primaryMuted, fg: colors.primary };
    case 'outline':
      return { bg: colors.transparent, border: colors.border, fg: colors.text };
    default:
      return { bg: colors.transparent, border: colors.transparent, fg: colors.text };
  }
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
});
