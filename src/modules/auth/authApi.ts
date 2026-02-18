import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { baseApi } from '@/api/baseApi';
import { ApiTag } from '@/api/tags';
import { env } from '@/shared/config/env';
import { AppRole } from '@/shared/constants/roles';
import { STORAGE_KEYS } from '@/shared/constants/storageKeys';
import {
  getFromStorage,
  getJsonFromStorage,
  removeFromStorage,
  setToStorage,
} from '@/shared/lib/storage';
import { appActions } from '@/store/slices/appSlice';
import { authActions } from '@/store/slices/authSlice';
import { mapLoginPayload, mapRegisterPayload, mapUserProfile } from './model/mappers';
import type {
  LoginPayload,
  LoginResponse,
  ProfileUpdatePayload,
  RegisterPayload,
  UserProfile,
  UserProfileDto,
} from './model/types';

interface PasswordResetConfirmBody {
  token?: string;
  new_password?: string;
}

interface MockAuthUser {
  login: string;
  password: string;
  profile: UserProfile;
}

interface RejectedQueryError {
  status?: number | string;
  error?: {
    status?: number | string;
  };
}

const MOCK_AUTH_USERS_DEFAULT: MockAuthUser[] = [
  {
    login: 'admin',
    password: 'admin',
    profile: {
      fullname: 'Администратор системы',
      username: 'admin',
      email: 'admin@baikal.local',
      phoneNumber: '+7 (000) 000-00-01',
      userRights: [AppRole.ADMIN],
    },
  },
  {
    login: 'user',
    password: 'user',
    profile: {
      fullname: 'Пользователь системы',
      username: 'user',
      email: 'user@baikal.local',
      phoneNumber: '+7 (000) 000-00-02',
      userRights: [AppRole.AUTHORIZED],
    },
  },
];

const cloneDefaultMockUsers = () =>
  MOCK_AUTH_USERS_DEFAULT.map((user) => ({
    ...user,
    profile: { ...user.profile, userRights: [...user.profile.userRights] },
  }));

const isValidMockAuthUser = (candidate: unknown): candidate is MockAuthUser => {
  if (!candidate || typeof candidate !== 'object') {
    return false;
  }

  const value = candidate as Partial<MockAuthUser>;
  const profile = value.profile as Partial<UserProfile> | undefined;

  return (
    typeof value.login === 'string' &&
    typeof value.password === 'string' &&
    !!profile &&
    typeof profile.fullname === 'string' &&
    typeof profile.username === 'string' &&
    typeof profile.email === 'string' &&
    typeof profile.phoneNumber === 'string' &&
    Array.isArray(profile.userRights)
  );
};

const readMockUsers = (): MockAuthUser[] => {
  const raw = getJsonFromStorage<unknown>(STORAGE_KEYS.mockAuthUsers);

  if (Array.isArray(raw)) {
    const normalized = raw.filter(isValidMockAuthUser).map((user) => ({
      ...user,
      profile: { ...user.profile, userRights: [...user.profile.userRights] },
    }));

    if (normalized.length) {
      return normalized;
    }
  }

  const defaults = cloneDefaultMockUsers();
  setToStorage(STORAGE_KEYS.mockAuthUsers, defaults);
  return defaults;
};

const writeMockUsers = (users: MockAuthUser[]) => {
  setToStorage(STORAGE_KEYS.mockAuthUsers, users);
};

const buildMockTokenPair = (username: string): LoginResponse => ({
  access_token: `mock.${username}.access.${Date.now()}`,
  refresh_token: `mock.${username}.refresh.${Date.now()}`,
  token_type: 'bearer',
});

const getMockUsernameFromToken = (token: string | null): string | null => {
  if (!token || !token.startsWith('mock.')) {
    return null;
  }

  const username = token.split('.')[1] || '';
  return username || null;
};

const getMockUserByUsername = (username: string | null, users: MockAuthUser[]): MockAuthUser | undefined => {
  if (!username) return undefined;
  return users.find((user) => user.login === username);
};

const getRejectedStatus = (error: unknown): number | string | undefined => {
  if (!error || typeof error !== 'object') {
    return undefined;
  }

  const candidate = error as RejectedQueryError;
  return candidate.error?.status ?? candidate.status;
};

const resetAuthSession = (dispatch: (action: unknown) => unknown) => {
  removeFromStorage(STORAGE_KEYS.accessToken);
  removeFromStorage(STORAGE_KEYS.refreshToken);
  dispatch(authActions.logout());
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginPayload>({
      async queryFn(payload, _api, _extraOptions, baseQuery) {
        if (env.useMocks) {
          const users = readMockUsers();
          const user = users.find(
            (item) => item.login === payload.login.trim() && item.password === payload.password,
          );

          if (!user) {
            return {
              error: {
                status: 401,
                data: 'Invalid login or password',
              } as FetchBaseQueryError,
            };
          }

          return { data: buildMockTokenPair(user.login) };
        }

        const result = await baseQuery({
          url: 'users/token',
          method: 'POST',
          body: mapLoginPayload(payload),
        });

        if (result.error) {
          return { error: result.error as FetchBaseQueryError };
        }

        return { data: result.data as LoginResponse };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          setToStorage(STORAGE_KEYS.accessToken, data.access_token);
          setToStorage(STORAGE_KEYS.refreshToken, data.refresh_token);
          dispatch(authActions.setAccessToken(data.access_token));

          await dispatch(authApi.endpoints.profile.initiate(undefined, { forceRefetch: true })).unwrap();
        } catch {
          resetAuthSession(dispatch);
          dispatch(appActions.showError('Неверный логин или пароль.'));
        }
      },
    }),
    register: build.mutation<unknown, RegisterPayload>({
      async queryFn(payload, _api, _extraOptions, baseQuery) {
        if (env.useMocks) {
          const users = readMockUsers();
          const login = payload.login.trim();
          const email = payload.email.trim().toLowerCase();

          const loginExists = users.some((user) => user.login.toLowerCase() === login.toLowerCase());
          if (loginExists) {
            return {
              error: {
                status: 409,
                data: 'Login already exists',
              } as FetchBaseQueryError,
            };
          }

          const emailExists = users.some((user) => user.profile.email.toLowerCase() === email);
          if (emailExists) {
            return {
              error: {
                status: 409,
                data: 'Email already exists',
              } as FetchBaseQueryError,
            };
          }

          users.push({
            login,
            password: payload.password,
            profile: {
              fullname: payload.fullname.trim(),
              username: login,
              email,
              phoneNumber: payload.phoneNumber.trim(),
              userRights: [AppRole.AUTHORIZED],
            },
          });

          writeMockUsers(users);

          return { data: { ok: true } };
        }

        const result = await baseQuery({
          url: 'users/register',
          method: 'POST',
          body: mapRegisterPayload(payload),
        });

        if (result.error) {
          return { error: result.error as FetchBaseQueryError };
        }

        return { data: result.data };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(appActions.showSuccess('Пользователь зарегистрирован.'));
        } catch (error) {
          const status = (error as { error?: FetchBaseQueryError })?.error?.status;
          if (status === 409) {
            dispatch(appActions.showError('Пользователь с таким логином или e-mail уже существует.'));
            return;
          }

          dispatch(appActions.showError('Не удалось зарегистрировать пользователя.'));
        }
      },
    }),
    profile: build.query<UserProfile, void>({
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        if (env.useMocks) {
          const users = readMockUsers();
          const accessToken = getFromStorage(STORAGE_KEYS.accessToken);
          const username = getMockUsernameFromToken(accessToken);
          const user = getMockUserByUsername(username, users);

          if (!user) {
            return {
              error: {
                status: 401,
                data: 'No mock profile found for access token',
              } as FetchBaseQueryError,
            };
          }

          return { data: user.profile };
        }

        const result = await baseQuery({
          url: 'users/me',
          method: 'GET',
        });

        if (result.error) {
          return { error: result.error as FetchBaseQueryError };
        }

        return { data: mapUserProfile(result.data as UserProfileDto) };
      },
      providesTags: [ApiTag.Profile],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(authActions.setProfile(data));
        } catch (error) {
          const status = getRejectedStatus(error);

          if (status === 401 || status === 403) {
            resetAuthSession(dispatch);
            return;
          }

          dispatch(authActions.setProfile(null));
        }
      },
    }),
    updateProfile: build.mutation<UserProfile, ProfileUpdatePayload>({
      async queryFn(payload) {
        if (!env.useMocks) {
          return {
            error: {
              status: 501,
              data: 'Profile update endpoint is not available yet',
            } as FetchBaseQueryError,
          };
        }

        const users = readMockUsers();
        const accessToken = getFromStorage(STORAGE_KEYS.accessToken);
        const username = getMockUsernameFromToken(accessToken);
        const currentUser = getMockUserByUsername(username, users);

        if (!currentUser) {
          return {
            error: {
              status: 401,
              data: 'No mock profile found for access token',
            } as FetchBaseQueryError,
          };
        }

        const currentIndex = users.findIndex((user) => user.login === currentUser.login);
        if (currentIndex < 0) {
          return {
            error: {
              status: 404,
              data: 'Mock user not found',
            } as FetchBaseQueryError,
          };
        }

        const nextLogin = payload.username.trim();
        const conflict = users.some(
          (user, index) => index !== currentIndex && user.login.toLowerCase() === nextLogin.toLowerCase(),
        );

        if (conflict) {
          return {
            error: {
              status: 409,
              data: 'Login already exists',
            } as FetchBaseQueryError,
          };
        }

        const nextPassword = payload.password?.trim() ? payload.password.trim() : users[currentIndex].password;

        const nextProfile: UserProfile = {
          ...users[currentIndex].profile,
          fullname: payload.fullname.trim(),
          username: nextLogin,
          email: payload.email.trim(),
          phoneNumber: payload.phoneNumber.trim(),
        };

        users[currentIndex] = {
          login: nextLogin,
          password: nextPassword,
          profile: nextProfile,
        };

        writeMockUsers(users);

        const tokens = buildMockTokenPair(nextLogin);
        setToStorage(STORAGE_KEYS.accessToken, tokens.access_token);
        setToStorage(STORAGE_KEYS.refreshToken, tokens.refresh_token);

        return { data: nextProfile };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(authActions.setProfile(data));
          dispatch(
            appActions.showWarning(
              'Сохранение профиля на сервере пока недоступно. Изменения применены локально.',
            ),
          );
        } catch (error) {
          const status = (error as { error?: FetchBaseQueryError })?.error?.status;

          if (status === 409) {
            dispatch(appActions.showError('Логин уже занят. Выберите другой.'));
            return;
          }

          dispatch(appActions.showWarning('Серверное обновление профиля пока не поддерживается.'));
        }
      },
    }),
    refresh: build.mutation<LoginResponse, void>({
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        const refreshToken = getFromStorage(STORAGE_KEYS.refreshToken);

        const noTokenError: FetchBaseQueryError = {
          status: 401,
          data: 'No refresh token',
        };

        if (!refreshToken) {
          return { error: noTokenError };
        }

        if (env.useMocks) {
          const users = readMockUsers();
          const username = getMockUsernameFromToken(refreshToken);
          const user = getMockUserByUsername(username, users);

          if (!user) {
            return {
              error: {
                status: 401,
                data: 'Invalid mock refresh token',
              } as FetchBaseQueryError,
            };
          }

          return { data: buildMockTokenPair(user.login) };
        }

        const postResult = await baseQuery({
          url: 'users/refresh',
          method: 'POST',
          body: { refresh_token: refreshToken },
        });

        if (postResult.data) {
          return { data: postResult.data as LoginResponse };
        }

        const getResult = await baseQuery({
          url: 'users/refresh',
          method: 'GET',
        });

        if (getResult.data) {
          return { data: getResult.data as LoginResponse };
        }

        return {
          error: (getResult.error ?? postResult.error ?? noTokenError) as FetchBaseQueryError,
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          setToStorage(STORAGE_KEYS.accessToken, data.access_token);
          setToStorage(STORAGE_KEYS.refreshToken, data.refresh_token);
          dispatch(authActions.setAccessToken(data.access_token));
        } catch {
          resetAuthSession(dispatch);
        }
      },
    }),
    passwordResetRequest: build.mutation<unknown, string>({
      query: (email) => ({
        url: 'users/password_reset/request',
        method: 'POST',
        params: { email },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(appActions.showSuccess('Ссылка для сброса пароля отправлена.'));
        } catch {
          dispatch(appActions.showError('Не удалось отправить ссылку для сброса пароля.'));
        }
      },
    }),
    passwordResetConfirm: build.mutation<unknown, PasswordResetConfirmBody | undefined>({
      query: (body) => ({
        url: 'users/password_reset/confirm',
        method: 'POST',
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          if (arg?.new_password) {
            dispatch(appActions.showSuccess('Пароль успешно обновлен.'));
          }
        } catch {
          dispatch(
            appActions.showError(
              arg?.new_password
                ? 'Не удалось изменить пароль.'
                : 'Подтверждение сброса пароля пока не завершено.',
            ),
          );
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useProfileQuery,
  useUpdateProfileMutation,
  useRefreshMutation,
  usePasswordResetRequestMutation,
  usePasswordResetConfirmMutation,
} = authApi;
