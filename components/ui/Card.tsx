import React, { memo } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '@/providers';
import { createShadow, radius, spacing } from '@/theme';
import { usePressAnimation } from './hooks/usePressAnimation';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  elevated?: boolean;
  padded?: boolean;
  animated?: boolean;
  delay?: number;
  bordered?: boolean;
}

export const Card = memo(function Card({
  children,
  onPress,
  style,
  elevated = true,
  padded = true,
  animated = true,
  delay = 0,
  bordered = true,
}: CardProps) {
  const { theme } = useTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation(0.98);

  const content = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: bordered ? theme.colors.border : theme.colors.transparent,
          padding: padded ? spacing.lg : 0,
        },
        elevated ? createShadow('md', theme.colors.shadow) : null,
        style,
      ]}
    >
      {children}
    </View>
  );

  const body = onPress ? (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      style={animatedStyle}
    >
      {content}
    </AnimatedPressable>
  ) : (
    content
  );

  if (!animated) return body;

  return (
    <Animated.View entering={FadeInUp.delay(delay).springify().damping(18)}>
      {body}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: radius['2xl'],
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
});
