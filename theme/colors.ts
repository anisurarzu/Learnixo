import { brand } from './tokens';

/**
 * Semantic color palettes for light and dark themes.
 * Shared shape so components accept either palette.
 */
export type ColorScheme = {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryMuted: string;
  secondary: string;
  secondaryLight: string;
  secondaryMuted: string;
  accent: string;
  accentLight: string;
  accentMuted: string;
  success: string;
  successMuted: string;
  warning: string;
  warningMuted: string;
  error: string;
  errorMuted: string;
  info: string;
  infoMuted: string;

  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  surface: string;
  surfaceElevated: string;
  surfaceGlass: string;
  card: string;
  cardHover: string;

  border: string;
  borderSubtle: string;
  borderStrong: string;

  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  textLink: string;

  overlay: string;
  overlayLight: string;

  skeleton: string;
  skeletonHighlight: string;

  tabBar: string;
  tabBarBorder: string;

  inputBackground: string;
  inputBorder: string;
  inputFocus: string;
  inputError: string;
  inputPlaceholder: string;

  shadow: string;
  divider: string;

  toastSuccess: string;
  toastError: string;
  toastWarning: string;
  toastInfo: string;

  white: string;
  black: string;
  transparent: string;
};

export const lightColors: ColorScheme = {
  ...brand,
  background: '#F8FAFC',
  backgroundSecondary: '#F1F5F9',
  backgroundTertiary: '#E2E8F0',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceGlass: 'rgba(255, 255, 255, 0.72)',
  card: '#FFFFFF',
  cardHover: '#F8FAFC',
  border: '#E2E8F0',
  borderSubtle: '#F1F5F9',
  borderStrong: '#CBD5E1',
  text: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',
  textLink: brand.primary,
  overlay: 'rgba(15, 23, 42, 0.5)',
  overlayLight: 'rgba(15, 23, 42, 0.3)',
  skeleton: '#E2E8F0',
  skeletonHighlight: '#F1F5F9',
  tabBar: '#FFFFFF',
  tabBarBorder: '#E2E8F0',
  inputBackground: '#F8FAFC',
  inputBorder: '#E2E8F0',
  inputFocus: brand.primary,
  inputError: brand.error,
  inputPlaceholder: '#94A3B8',
  shadow: 'rgba(15, 23, 42, 0.08)',
  divider: '#E2E8F0',
  toastSuccess: brand.success,
  toastError: brand.error,
  toastWarning: brand.warning,
  toastInfo: brand.info,
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const darkColors: ColorScheme = {
  ...brand,
  primaryMuted: 'rgba(129, 140, 248, 0.18)',
  secondaryMuted: 'rgba(167, 139, 250, 0.18)',
  accentMuted: 'rgba(34, 211, 238, 0.18)',
  successMuted: 'rgba(34, 197, 94, 0.18)',
  warningMuted: 'rgba(245, 158, 11, 0.18)',
  errorMuted: 'rgba(239, 68, 68, 0.18)',
  infoMuted: 'rgba(59, 130, 246, 0.18)',
  background: '#09090B',
  backgroundSecondary: '#18181B',
  backgroundTertiary: '#27272A',
  surface: '#18181B',
  surfaceElevated: '#27272A',
  surfaceGlass: 'rgba(24, 24, 27, 0.78)',
  card: '#18181B',
  cardHover: '#1F1F23',
  border: '#27272A',
  borderSubtle: '#1F1F23',
  borderStrong: '#3F3F46',
  text: '#FAFAFA',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
  textInverse: '#09090B',
  textLink: brand.primaryLight,
  overlay: 'rgba(0, 0, 0, 0.72)',
  overlayLight: 'rgba(0, 0, 0, 0.45)',
  skeleton: '#27272A',
  skeletonHighlight: '#3F3F46',
  tabBar: '#09090B',
  tabBarBorder: '#27272A',
  inputBackground: '#18181B',
  inputBorder: '#27272A',
  inputFocus: brand.primaryLight,
  inputError: brand.error,
  inputPlaceholder: '#71717A',
  shadow: 'rgba(0, 0, 0, 0.45)',
  divider: '#27272A',
  toastSuccess: brand.success,
  toastError: brand.error,
  toastWarning: brand.warning,
  toastInfo: brand.info,
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemeColorKey = keyof ColorScheme;

export function getSemanticTint(
  colors: ColorScheme,
  semantic:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'neutral',
) {
  switch (semantic) {
    case 'secondary':
      return { fg: colors.secondary, bg: colors.secondaryMuted };
    case 'accent':
      return { fg: colors.accent, bg: colors.accentMuted };
    case 'success':
      return { fg: colors.success, bg: colors.successMuted };
    case 'warning':
      return { fg: colors.warning, bg: colors.warningMuted };
    case 'error':
      return { fg: colors.error, bg: colors.errorMuted };
    case 'info':
      return { fg: colors.info, bg: colors.infoMuted };
    case 'neutral':
      return { fg: colors.textSecondary, bg: colors.backgroundSecondary };
    default:
      return { fg: colors.primary, bg: colors.primaryMuted };
  }
}
