import { globalActions } from '@/app/providers/store';
import { ApiTags } from '@/shared/config/api/apiTags';
import { baseApi } from '@/shared/config/api/baseApi';
import { LS_ACCESS_TOKEN, LS_REFRESH_TOKEN } from '@/shared/config/constants/authConstants';
import { removeFromLS, setToLS } from '@/shared/lib/manageLocalStorage';
import { userActions } from '../model/slices';
import { IExtraArgument, ILogin, ILoginResponse, IProfileResponse, IRegister } from '../types';
import { adaptLogin, adaptRegister } from './dto';

const authApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		login: build.mutation<ILoginResponse, ILogin>({
			query: (auth) => ({
				url: 'users/token',
				method: 'POST',
				body: adaptLogin(auth),
			}),
			async onQueryStarted(_, { queryFulfilled, dispatch, extra }) {
				try {
					const response = await queryFulfilled;

					dispatch(globalActions.setAccessToken(response.data.access_token));
					setToLS(LS_ACCESS_TOKEN, response.data.refresh_token);
					setToLS(LS_REFRESH_TOKEN, response.data);

					const typedExtra = extra as IExtraArgument;
					typedExtra.navigate('/');
				} catch (e) {
					if (__IS_DEV__) console.error(e);
					dispatch(globalActions.setErrorMessage('Неверный логин или пароль!'));
				}
			},
		}),
		register: build.mutation<ILoginResponse, IRegister>({
			query: (auth) => ({
				url: 'users/register',
				method: 'POST',
				body: adaptRegister(auth),
			}),
			async onQueryStarted(_, { queryFulfilled, dispatch, extra }) {
				try {
					await queryFulfilled;

					const typedExtra = extra as IExtraArgument;
					typedExtra.navigate('/');

					dispatch(globalActions.setSuccessMessage('Заявка на регистрацию отправлена'));
				} catch (e) {
					if (__IS_DEV__) console.error(e);
					dispatch(
						globalActions.setErrorMessage(
							'Не удалось создать новую учетную запись. Повторите попытку позже.',
						),
					);
				}
			},
		}),
		profile: build.query<IProfileResponse, void>({
			query: () => ({
				url: 'users/me',
				method: 'GET',
			}),
			async onQueryStarted(_, { queryFulfilled, dispatch }) {
				try {
					const response = await queryFulfilled;

					dispatch(userActions.setProfile(response.data.user));
				} catch (e) {
					if (__IS_DEV__) console.error(e);
				}
			},
			providesTags: [ApiTags.PROFILE],
		}),
		logout: build.query<void, void>({
			query: () => ({
				url: 'auth/logout',
				method: 'POST',
			}),
			async onQueryStarted(_, { queryFulfilled, extra, dispatch }) {
				try {
					await queryFulfilled;
					removeFromLS(LS_ACCESS_TOKEN);

					const typedExtra = extra as IExtraArgument;
					typedExtra.navigate('/');

					dispatch(globalActions.setAccessToken(''));
					dispatch(baseApi.util.resetApiState());
				} catch (e) {
					if (__IS_DEV__) console.error(e);
				}
			},
		}),
		refresh: build.query<ILoginResponse, void>({
			query: () => ({
				url: 'users/refresh',
				method: 'GET',
			}),
			async onQueryStarted(_, { queryFulfilled, extra }) {
				try {
					const response = await queryFulfilled;
					setToLS(LS_REFRESH_TOKEN, response.data.access_token);
					setToLS(LS_REFRESH_TOKEN, response.data.refresh_token);
				} catch (e) {
					if (__IS_DEV__) console.error(e);
					removeFromLS(LS_ACCESS_TOKEN);
					removeFromLS(LS_REFRESH_TOKEN);

					const typedExtra = extra as IExtraArgument;
					typedExtra.navigate('/');
				}
			},
		}),
	}),
});

const {
	useLoginMutation,
	useRegisterMutation,
	useProfileQuery,
	useLazyLogoutQuery,
	useRefreshQuery,
} = authApi;

export {
	authApi,
	useLoginMutation,
	useRegisterMutation,
	useProfileQuery,
	useLazyLogoutQuery,
	useRefreshQuery,
};
