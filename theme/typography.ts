import { TextStyle } from 'react-native';
import {
  fontSizeTokens,
  fontWeightTokens,
  letterSpacingTokens,
  lineHeightTokens,
} from './tokens';

type Weight = TextStyle['fontWeight'];

const weight = (value: string) => value as Weight;

/**
 * Typography scale — modern, readable hierarchy.
 */
export const fontSizes = fontSizeTokens;
export const fontWeights = {
  regular: weight(fontWeightTokens.regular),
  medium: weight(fontWeightTokens.medium),
  semibold: weight(fontWeightTokens.semibold),
  bold: weight(fontWeightTokens.bold),
  extrabold: weight(fontWeightTokens.extrabold),
};
export const lineHeights = lineHeightTokens;
export const letterSpacings = letterSpacingTokens;

export const typography = {
  display: {
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.bold,
    lineHeight: Math.round(fontSizes['4xl'] * lineHeights.tight),
    letterSpacing: letterSpacings.tighter,
  },
  h1: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    lineHeight: Math.round(fontSizes['3xl'] * lineHeights.tight),
    letterSpacing: letterSpacings.tight,
  },
  h2: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    lineHeight: Math.round(fontSizes['2xl'] * lineHeights.snug),
    letterSpacing: letterSpacings.tight,
  },
  h3: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    lineHeight: Math.round(fontSizes.xl * lineHeights.snug),
    letterSpacing: letterSpacings.normal,
  },
  h4: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    lineHeight: Math.round(fontSizes.lg * lineHeights.snug),
    letterSpacing: letterSpacings.normal,
  },
  body: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.regular,
    lineHeight: Math.round(fontSizes.base * lineHeights.normal),
    letterSpacing: letterSpacings.normal,
  },
  bodyMedium: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    lineHeight: Math.round(fontSizes.base * lineHeights.normal),
    letterSpacing: letterSpacings.normal,
  },
  bodySmall: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: Math.round(fontSizes.sm * lineHeights.normal),
    letterSpacing: letterSpacings.normal,
  },
  caption: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    lineHeight: Math.round(fontSizes.xs * lineHeights.normal),
    letterSpacing: letterSpacings.wide,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: Math.round(fontSizes.sm * lineHeights.snug),
    letterSpacing: letterSpacings.normal,
  },
  button: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    lineHeight: Math.round(fontSizes.base * lineHeights.tight),
    letterSpacing: letterSpacings.wide,
  },
  overline: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    lineHeight: Math.round(fontSizes.xs * lineHeights.tight),
    letterSpacing: letterSpacings.wider,
    textTransform: 'uppercase' as const,
  },
} as const;

export type TypographyVariant = keyof typeof typography;
