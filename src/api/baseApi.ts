import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { env } from '@/shared/config/env';
import { STORAGE_KEYS } from '@/shared/constants/storageKeys';
import { getFromStorage } from '@/shared/lib/storage';
import { appActions } from '@/store/slices/appSlice';
import { apiTokenExpired } from './tokenExpired';
import { ApiTag } from './tags';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: env.apiUrl,
  credentials: 'same-origin',
  prepareHeaders: (headers) => {
    const accessToken = getFromStorage(STORAGE_KEYS.accessToken);

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return headers;
  },
});

const baseQueryWithLoader: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  api.dispatch(appActions.setLoading(true));

  const result = await rawBaseQuery(args, api, extraOptions);

  api.dispatch(appActions.setLoading(false));

  const url = typeof args === 'string' ? args : args.url;
  if (result.error?.status === 401 && !String(url).includes('users/refresh')) {
    api.dispatch(apiTokenExpired());
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithLoader,
  tagTypes: Object.values(ApiTag),
  keepUnusedDataFor: 300,
  refetchOnFocus: false,
  refetchOnReconnect: false,
  endpoints: () => ({}),
});
