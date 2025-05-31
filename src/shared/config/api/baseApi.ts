import { BaseQueryFn, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { globalActions } from '@/app/providers/store';
import { getFromLS } from '@/shared/lib/manageLocalStorage';
import { LS_ACCESS_TOKEN } from '../constants/authConstants';
import { apiAccessTokenExpired } from './apiAccessTokenExpired';
import { ApiTags } from './apiTags';

const baseQuery = fetchBaseQuery({
	baseUrl: process.env.API_URL,
	credentials: 'same-origin',
	prepareHeaders: (headers) => {
		const accessToken = getFromLS(LS_ACCESS_TOKEN);
		if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

		return headers;
	},
});

const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
	api.dispatch(globalActions.setLoading(true));
	const result = await baseQuery(args, api, extraOptions);
	api.dispatch(globalActions.setLoading(false));

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
