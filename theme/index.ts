import { darkColors, lightColors, ThemeMode } from './colors';
import { typography } from './typography';
import { radius, spacing } from './spacing';
import { shadows } from './shadows';
import { icons, iconSizes } from './icons';
import { animations, animationDurations, pressScale, springs } from './animations';
import { opacityTokens, sizeTokens, zIndexTokens } from './tokens';

export * from './tokens';
export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';
export * from './icons';
export * from './animations';

export const themes = {
  light: {
    colors: lightColors,
    typography,
    spacing,
    radius,
    shadows,
    icons,
    iconSizes,
    animations,
    animationDurations,
    springs,
    pressScale,
    opacity: opacityTokens,
    sizes: sizeTokens,
    zIndex: zIndexTokens,
    isDark: false as const,
  },
  dark: {
    colors: darkColors,
    typography,
    spacing,
    radius,
    shadows,
    icons,
    iconSizes,
    animations,
    animationDurations,
    springs,
    pressScale,
    opacity: opacityTokens,
    sizes: sizeTokens,
    zIndex: zIndexTokens,
    isDark: true as const,
  },
} as const;

export type AppTheme = (typeof themes)['light'] | (typeof themes)['dark'];

export function resolveTheme(mode: ThemeMode, systemIsDark: boolean): AppTheme {
  if (mode === 'system') {
    return systemIsDark ? themes.dark : themes.light;
  }
  return themes[mode];
}
