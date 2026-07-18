import React from 'react';
import { Redirect, useSegments, type Href } from 'expo-router';
import type { ReactNode } from 'react';
import { Loading } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/store';

interface AuthGuardProps {
  children: ReactNode;
  /** When true, signed-in verified users are sent to main tabs */
  guestOnly?: boolean;
}

/**
 * Protects authenticated areas. Unauthenticated users → Login.
 * Unverified users are forced to email verification.
 * Use `guestOnly` on auth screens to bounce verified signed-in users to tabs.
 */
export function AuthGuard({ children, guestOnly = false }: AuthGuardProps) {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const segments = useSegments() as string[];

  if (!isHydrated) {
    return <Loading fullScreen message="Loading…" />;
  }

  const onVerifyEmail = segments.includes('verify-email');
  const needsVerification =
    isAuthenticated && user != null && !user.isVerified && user.provider === 'email';

  if (guestOnly && isAuthenticated) {
    // Unverified email users may stay on the verification screen
    if (needsVerification && onVerifyEmail) {
      return <>{children}</>;
    }
    if (needsVerification) {
      return (
        <Redirect
          href={
            {
              pathname: ROUTES.auth.verifyEmail,
              params: { email: user.email ?? '' },
            } as Href
          }
        />
      );
    }
    return <Redirect href={ROUTES.tabs.home as Href} />;
  }

  if (!guestOnly && !isAuthenticated) {
    return <Redirect href={ROUTES.auth.login as Href} />;
  }

  if (!guestOnly && needsVerification) {
    return (
      <Redirect
        href={
          {
            pathname: ROUTES.auth.verifyEmail,
            params: { email: user.email ?? '' },
          } as Href
        }
      />
    );
  }

  return <>{children}</>;
}
