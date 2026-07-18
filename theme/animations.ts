import {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  LinearTransition,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import { durationTokens, springTokens } from './tokens';

export const animationDurations = durationTokens;
export const springs = springTokens;

export const pressScale = {
  pressed: 0.96,
  subtle: 0.98,
  default: 1,
} as const;

/** Shared Reanimated entering/exiting presets */
export const animations = {
  fadeIn: FadeIn.duration(durationTokens.normal),
  fadeOut: FadeOut.duration(durationTokens.fast),
  fadeInUp: FadeInUp.duration(durationTokens.normal).springify().damping(18),
  fadeInDown: FadeInDown.duration(durationTokens.normal).springify().damping(18),
  zoomIn: ZoomIn.duration(durationTokens.normal).springify().damping(16),
  zoomOut: ZoomOut.duration(durationTokens.fast),
  layout: LinearTransition.springify().damping(18).stiffness(180),
};

export type AnimationPreset = keyof typeof animations;
