import { Platform, ViewStyle } from 'react-native';

type Level = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const configs: Record<
  Exclude<Level, 'none'>,
  { offset: number; opacity: number; radius: number; elevation: number }
> = {
  xs: { offset: 1, opacity: 0.04, radius: 2, elevation: 1 },
  sm: { offset: 1, opacity: 0.06, radius: 4, elevation: 2 },
  md: { offset: 2, opacity: 0.08, radius: 8, elevation: 4 },
  lg: { offset: 4, opacity: 0.1, radius: 16, elevation: 8 },
  xl: { offset: 8, opacity: 0.14, radius: 24, elevation: 12 },
};

export function createShadow(level: Level = 'md', shadowColor = '#0F172A'): ViewStyle {
  if (level === 'none') return {};

  const config = configs[level];

  if (Platform.OS === 'android') {
    return { elevation: config.elevation, shadowColor };
  }

  return {
    shadowColor,
    shadowOffset: { width: 0, height: config.offset },
    shadowOpacity: config.opacity,
    shadowRadius: config.radius,
  };
}

export const shadows = {
  none: createShadow('none'),
  xs: createShadow('xs'),
  sm: createShadow('sm'),
  md: createShadow('md'),
  lg: createShadow('lg'),
  xl: createShadow('xl'),
};

export type ShadowLevel = keyof typeof shadows;
