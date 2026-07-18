import { TextStyle } from 'react-native';
import type { ColorScheme, SemanticColor } from '@/theme';
import { getSemanticTint } from '@/theme';

export function semanticColors(colors: ColorScheme, tone: SemanticColor) {
  return getSemanticTint(colors, tone);
}

export function hitSlop(size = 8) {
  return { top: size, right: size, bottom: size, left: size };
}

export type TextAlign = NonNullable<TextStyle['textAlign']>;
