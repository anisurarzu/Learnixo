import React, { memo } from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/providers';
import { createShadow, sizeTokens, type IconName } from '@/theme';
import { usePressAnimation } from './hooks/usePressAnimation';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type FloatingButtonSize = 'sm' | 'md' | 'lg';

export interface FloatingButtonProps {
  onPress: () => void;
  icon?: IconName;
  size?: FloatingButtonSize;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

export const FloatingButton = memo(function FloatingButton({
  onPress,
  icon = 'add',
  size = 'md',
  disabled = false,
  accessibilityLabel = 'Floating action',
  style,
}: FloatingButtonProps) {
  const { theme } = useTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation(0.92);
  const dimension = sizeTokens.fab[size];
  const iconSize = size === 'sm' ? 22 : size === 'lg' ? 32 : 28;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
        onPress();
      }}
      style={[
        styles.fab,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          backgroundColor: theme.colors.primary,
          opacity: disabled ? theme.opacity.disabled : 1,
          bottom: theme.spacing.lg,
          right: theme.spacing.lg,
        },
        createShadow('lg', theme.colors.shadow),
        animatedStyle,
        style,
      ]}
    >
      <Ionicons name={icon} size={iconSize} color={theme.colors.white} />
    </AnimatedPressable>
  );
});

/** @deprecated Prefer FloatingButton */
export const FloatingActionButton = FloatingButton;
export type FloatingActionButtonProps = FloatingButtonProps;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
  },
});
