/**
 * Maps deep-link aliases (studyai://chat) to Expo Router paths.
 * @see https://docs.expo.dev/router/advanced/native-intent/
 */
import { resolveDeepLinkPath } from '@/navigation/linking';

export function redirectSystemPath({
  path,
  initial,
}: {
  path: string;
  initial: boolean;
}): string | null {
  const resolved = resolveDeepLinkPath(path);
  if (resolved) return resolved;

  // Unknown deep links fall through to +not-found via Expo Router
  if (initial && path && !path.startsWith('/')) {
    return path.startsWith('/') ? path : `/${path}`;
  }

  return path;
}
