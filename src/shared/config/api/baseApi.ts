import { BaseQueryFn, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getFromLS } from '@/shared/lib/manageLocalStorage';
import { LS_ACCESS_TOKEN } from '../constants/authConstants';
import { apiAccessTokenExpired } from './apiAccessTokenExpired';
import { ApiTags } from './apiTags';

const baseQuery = fetchBaseQuery({
	baseUrl: process.env.__API_URL__,
	credentials: 'include',
	prepareHeaders: (headers) => {
		const accessToken = getFromLS(LS_ACCESS_TOKEN);

		if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

		return headers;
	},
});

const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
	const result = await baseQuery(args, api, extraOptions);

	if (result.error?.status === 401 && args.url !== '/auth/refresh')
		api.dispatch(apiAccessTokenExpired());

	return result;
};

export const baseApi = createApi({
	tagTypes: Object.values(ApiTags),
	reducerPath: 'api',
	baseQuery: baseQueryWithReauth,
	endpoints: () => ({}),
});
