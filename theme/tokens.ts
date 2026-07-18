/**
 * StudyAI Design Tokens
 * Central source of truth for the design system.
 * Inspired by Notion, Linear, Duolingo, and ChatGPT Mobile.
 */

export const brand = {
  primary: '#4F46E5',
  primaryLight: '#818CF8',
  primaryDark: '#3730A3',
  primaryMuted: 'rgba(79, 70, 229, 0.12)',
  secondary: '#7C3AED',
  secondaryLight: '#A78BFA',
  secondaryMuted: 'rgba(124, 58, 237, 0.12)',
  accent: '#06B6D4',
  accentLight: '#22D3EE',
  accentMuted: 'rgba(6, 182, 212, 0.12)',
  success: '#22C55E',
  successMuted: 'rgba(34, 197, 94, 0.12)',
  warning: '#F59E0B',
  warningMuted: 'rgba(245, 158, 11, 0.12)',
  error: '#EF4444',
  errorMuted: 'rgba(239, 68, 68, 0.12)',
  info: '#3B82F6',
  infoMuted: 'rgba(59, 130, 246, 0.12)',
} as const;

export const spacingTokens = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
} as const;

/** Semantic spacing aliases (8px system) */
export const space = {
  none: spacingTokens[0],
  xxs: spacingTokens[0.5],
  xs: spacingTokens[1],
  sm: spacingTokens[2],
  md: spacingTokens[4],
  lg: spacingTokens[6],
  xl: spacingTokens[8],
  '2xl': spacingTokens[10],
  '3xl': spacingTokens[12],
  '4xl': spacingTokens[16],
  '5xl': spacingTokens[20],
} as const;

export const radiusTokens = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
} as const;

export const fontSizeTokens = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
} as const;

export const fontWeightTokens = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const;

export const lineHeightTokens = {
  tight: 1.2,
  snug: 1.35,
  normal: 1.5,
  relaxed: 1.65,
} as const;

export const letterSpacingTokens = {
  tighter: -0.5,
  tight: -0.3,
  normal: 0,
  wide: 0.2,
  wider: 0.4,
} as const;

export const durationTokens = {
  instant: 100,
  fast: 150,
  normal: 250,
  slow: 400,
  slower: 600,
} as const;

export const springTokens = {
  snappy: { damping: 20, stiffness: 300, mass: 0.6 },
  default: { damping: 18, stiffness: 180, mass: 0.8 },
  gentle: { damping: 16, stiffness: 120, mass: 1 },
  bouncy: { damping: 12, stiffness: 160, mass: 0.7 },
} as const;

export const zIndexTokens = {
  base: 0,
  raised: 10,
  dropdown: 20,
  sticky: 30,
  overlay: 40,
  modal: 50,
  toast: 60,
  max: 999,
} as const;

export const opacityTokens = {
  disabled: 0.45,
  pressed: 0.85,
  hover: 0.92,
  muted: 0.6,
  glass: 0.72,
} as const;

export const sizeTokens = {
  iconButton: { sm: 32, md: 40, lg: 48 },
  avatar: { xs: 24, sm: 32, md: 44, lg: 64, xl: 88 },
  button: { sm: 36, md: 48, lg: 56 },
  input: { sm: 40, md: 52, lg: 56 },
  fab: { sm: 48, md: 60, lg: 72 },
  touchTarget: 44,
} as const;

export type SpacingToken = keyof typeof space;
export type RadiusToken = keyof typeof radiusTokens;
export type SizeToken = 'sm' | 'md' | 'lg';
export type SemanticColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral';
