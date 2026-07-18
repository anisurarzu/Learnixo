import { radiusTokens, space, spacingTokens } from './tokens';

/**
 * 8px spacing system + radius scale.
 * `spacing` aliases kept for backward compatibility with existing screens.
 */
export const spacing = space;
export const spaceScale = spacingTokens;
export const radius = {
  none: radiusTokens.none,
  sm: radiusTokens.sm,
  md: radiusTokens.md,
  lg: radiusTokens.lg,
  xl: radiusTokens.xl,
  '2xl': radiusTokens['2xl'],
  '3xl': radiusTokens['3xl'],
  full: radiusTokens.full,
  xs: radiusTokens.xs,
} as const;

export type SpacingKey = keyof typeof spacing;
export type RadiusKey = keyof typeof radius;
