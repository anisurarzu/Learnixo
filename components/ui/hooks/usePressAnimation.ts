import { useCallback } from 'react';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { pressScale, springs } from '@/theme';

/** Shared press-scale animation for interactive components */
export function usePressAnimation(scaleTo: number = pressScale.pressed) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = useCallback(() => {
    scale.value = withSpring(scaleTo, springs.snappy);
  }, [scale, scaleTo]);

  const onPressOut = useCallback(() => {
    scale.value = withSpring(pressScale.default, springs.default);
  }, [scale]);

  return { scale, animatedStyle, onPressIn, onPressOut };
}
