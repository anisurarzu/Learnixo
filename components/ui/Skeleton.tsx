import React, { memo, useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/providers';
import { radius, spacing } from '@/theme';

export interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  circle?: boolean;
  style?: ViewStyle;
}

export const Skeleton = memo(function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = radius.md,
  circle = false,
  style,
}: SkeletonProps) {
  const { theme } = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(progress.value, [0, 1], [-80, 80]) }],
    opacity: interpolate(progress.value, [0, 0.5, 1], [0.35, 0.7, 0.35]),
  }));

  const resolvedRadius = circle
    ? typeof height === 'number'
      ? height / 2
      : radius.full
    : borderRadius;

  return (
    <View
      accessibilityLabel="Loading placeholder"
      style={[
        styles.base,
        {
          width: circle && typeof height === 'number' ? height : width,
          height,
          borderRadius: resolvedRadius,
          backgroundColor: theme.colors.skeleton,
        },
        style,
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          colors={['transparent', theme.colors.skeletonHighlight, 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
});

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <Skeleton height={18} width="55%" />
      <Skeleton height={14} width="90%" style={styles.gap} />
      <Skeleton height={14} width="75%" />
      <Skeleton height={100} style={styles.block} />
    </View>
  );
}

/** Alias */
export const SkeletonLoader = Skeleton;

const styles = StyleSheet.create({
  base: { overflow: 'hidden' },
  card: { gap: spacing.sm, padding: spacing.lg },
  gap: { marginTop: spacing.xs },
  block: { marginTop: spacing.md, borderRadius: radius.xl },
});
