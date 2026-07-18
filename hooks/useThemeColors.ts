import { useTheme } from '@/providers';

/** Convenience hook for theme colors */
export function useColors() {
  const { theme } = useTheme();
  return theme.colors;
}

export function useIsDark() {
  const { isDark } = useTheme();
  return isDark;
}
