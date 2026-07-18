import { DEEP_LINK_MAP, APP_SCHEME, APP_SCHEME_LEGACY } from '@/constants/routes';
import type { DeepLinkAlias } from '@/types/navigation';

/**
 * Resolve deep-link aliases like `studyai://chat` → internal route.
 */
export function resolveDeepLinkPath(path: string): string | null {
  const cleaned = path
    .replace(new RegExp(`^${APP_SCHEME}://`, 'i'), '')
    .replace(new RegExp(`^${APP_SCHEME_LEGACY}://`, 'i'), '')
    .replace(/^\//, '')
    .split('?')[0]
    .split('#')[0]
    .toLowerCase();

  if (!cleaned) return DEEP_LINK_MAP.home;

  const alias = cleaned.split('/')[0] as DeepLinkAlias;
  if (alias in DEEP_LINK_MAP) {
    return DEEP_LINK_MAP[alias];
  }

  return null;
}

export const linkingPrefixes = [`${APP_SCHEME}://`, `${APP_SCHEME_LEGACY}://`] as const;
