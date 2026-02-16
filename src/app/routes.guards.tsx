import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useProfileQuery } from '@/modules/auth/authApi';
import { ROUTES } from '@/shared/constants/routes';
import { STORAGE_KEYS } from '@/shared/constants/storageKeys';
import { hasAdminRights } from '@/shared/lib/roles';
import { getFromStorage } from '@/shared/lib/storage';
import { RouteSkeleton } from '@/shared/ui/feedback/RouteSkeleton';
import { useAppSelector } from '@/store/hooks';
import { selectProfile } from '@/store/slices/authSelectors';

export const RequireGuest = ({ children }: PropsWithChildren) => {
  const token = getFromStorage(STORAGE_KEYS.accessToken);
  return token ? <Navigate to={ROUTES.home} replace /> : <>{children}</>;
};

export const RequireAuth = ({ children }: PropsWithChildren) => {
  const token = getFromStorage(STORAGE_KEYS.accessToken);
  return token ? <>{children}</> : <Navigate to={ROUTES.auth.login} replace />;
};

export const RequireAdmin = ({ children }: PropsWithChildren) => {
  const token = getFromStorage(STORAGE_KEYS.accessToken);
  const profile = useAppSelector(selectProfile);

  const { isLoading, isFetching } = useProfileQuery(undefined, {
    skip: !token || Boolean(profile),
  });

  if (!token) {
    return <Navigate to={ROUTES.auth.login} replace />;
  }

  if ((isLoading || isFetching) && !profile) {
    return <RouteSkeleton />;
  }

  if (!profile) {
    return <Navigate to={ROUTES.auth.login} replace />;
  }

  if (!hasAdminRights(profile.userRights)) {
    return <Navigate to={ROUTES.errors.accessDenied} replace />;
  }

  return <>{children}</>;
};
