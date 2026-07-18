import React, { memo, useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/providers';
import { radius } from '@/theme';

export interface ProgressBarProps {
  progress: number;
  height?: number;
  color?: string;
  trackColor?: string;
  animated?: boolean;
  style?: ViewStyle;
}

export const ProgressBar = memo(function ProgressBar({
  progress,
  height = 8,
  color,
  trackColor,
  animated = true,
  style,
}: ProgressBarProps) {
  const { theme } = useTheme();
  const width = useSharedValue(0);
  const clamped = Math.max(0, Math.min(1, progress));

  useEffect(() => {
    width.value = animated ? withTiming(clamped, { duration: 400 }) : clamped;
  }, [animated, clamped, width]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={[
        styles.track,
        {
          height,
          borderRadius: radius.full,
          backgroundColor: trackColor ?? theme.colors.backgroundSecondary,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            height,
            borderRadius: radius.full,
            backgroundColor: color ?? theme.colors.primary,
          },
          fillStyle,
        ]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  track: { width: '100%', overflow: 'hidden' },
  fill: {},
});
