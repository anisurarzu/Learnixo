import { router, type Href } from 'expo-router';
import { ROUTES } from '@/constants/routes';
import type { AppRoute, RouteParamsMap } from '@/types/navigation';

type ParamsFor<R extends AppRoute> = R extends keyof RouteParamsMap
  ? RouteParamsMap[R]
  : Record<string, string | number | undefined> | undefined;

/**
 * Typed navigation helpers — prefer these over raw `router.*` calls.
 */
export function navigate<R extends AppRoute>(route: R, params?: ParamsFor<R>): void {
  if (params) {
    router.navigate({ pathname: route, params } as Href);
  } else {
    router.navigate(route as Href);
  }
}

export function push<R extends AppRoute>(route: R, params?: ParamsFor<R>): void {
  if (params) {
    router.push({ pathname: route, params } as Href);
  } else {
    router.push(route as Href);
  }
}

export function replace<R extends AppRoute>(route: R, params?: ParamsFor<R>): void {
  if (params) {
    router.replace({ pathname: route, params } as Href);
  } else {
    router.replace(route as Href);
  }
}

export function goBack(): void {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace(ROUTES.tabs.home as Href);
  }
}

export function reset(route: AppRoute = ROUTES.tabs.home): void {
  while (router.canGoBack()) {
    router.back();
  }
  router.replace(route as Href);
}

export function canGoBack(): boolean {
  return router.canGoBack();
}

/** Open a modal presentation route */
export function openModal<R extends AppRoute>(route: R, params?: ParamsFor<R>): void {
  push(route, params);
}

export const navigation = {
  navigate,
  push,
  replace,
  goBack,
  reset,
  canGoBack,
  openModal,
};
