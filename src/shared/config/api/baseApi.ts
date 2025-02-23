import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getFromLS } from '@/shared/lib/manageLocalStorage';
import { LS_ACCESS_TOKEN } from '../constants/authConstants';
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

export const baseApi = createApi({
	tagTypes: Object.values(ApiTags),
	reducerPath: 'api',
	baseQuery,
	endpoints: () => ({}),
});
