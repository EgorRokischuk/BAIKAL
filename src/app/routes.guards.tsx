import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useEffect, type PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useProfileQuery } from '@/modules/auth/authApi';
import { ROUTES } from '@/shared/constants/routes';
import { STORAGE_KEYS } from '@/shared/constants/storageKeys';
import { hasAdminRights } from '@/shared/lib/roles';
import { getFromStorage, removeFromStorage } from '@/shared/lib/storage';
import { RouteSkeleton } from '@/shared/ui/feedback/RouteSkeleton';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { authActions } from '@/store/slices/authSlice';
import { selectProfile, selectAccessToken } from '@/store/slices/authSelectors';

const isUnauthorizedStatus = (error: unknown) => {
  const status = (error as FetchBaseQueryError | undefined)?.status;
  return status === 401 || status === 403;
};

export const RequireGuest = ({ children }: PropsWithChildren) => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(selectAccessToken);
  const profile = useAppSelector(selectProfile);
  const token = accessToken || getFromStorage(STORAGE_KEYS.accessToken);

  const { isLoading, isFetching, isError, error } = useProfileQuery(undefined, {
    skip: !token || Boolean(profile),
  });

  useEffect(() => {
    if (!token || !isError || !isUnauthorizedStatus(error)) {
      return;
    }

    removeFromStorage(STORAGE_KEYS.accessToken);
    removeFromStorage(STORAGE_KEYS.refreshToken);
    dispatch(authActions.logout());
  }, [dispatch, error, isError, token]);

  if (!token) {
    return <>{children}</>;
  }

  if (profile) {
    return <Navigate to={ROUTES.home} replace />;
  }

  if (isLoading || isFetching) {
    return <RouteSkeleton />;
  }

  if (isError && isUnauthorizedStatus(error)) {
    return <>{children}</>;
  }

  return <Navigate to={ROUTES.home} replace />;
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
