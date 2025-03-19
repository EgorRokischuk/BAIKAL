import { globalActions } from '@/app/providers/store';
import { ApiTags } from '@/shared/config/api/apiTags';
import { baseApi } from '@/shared/config/api/baseApi';
import { LS_ACCESS_TOKEN } from '@/shared/config/constants/authConstants';
import { removeFromLS, setToLS } from '@/shared/lib/manageLocalStorage';
import { IExtraArgument, ILogin, ILoginResponse, IProfileResponse, IRegister } from '../types';

const authApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		login: build.mutation<ILoginResponse, ILogin>({
			query: (auth) => ({
				url: 'auth/login',
				method: 'POST',
				body: auth,
			}),
			async onQueryStarted(_, { queryFulfilled, dispatch, extra }) {
				try {
					const response = await queryFulfilled;

					dispatch(globalActions.setAccessToken(response.data.accessToken));
					setToLS(LS_ACCESS_TOKEN, response.data.accessToken);

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
				url: 'auth/register',
				method: 'POST',
				body: auth,
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
				url: 'auth/profile',
				method: 'GET',
			}),
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
				url: 'auth/refresh',
				method: 'GET',
			}),
			async onQueryStarted(_, { queryFulfilled, extra }) {
				try {
					const response = await queryFulfilled;
					setToLS(LS_ACCESS_TOKEN, response.data.accessToken);
				} catch (e) {
					if (__IS_DEV__) console.error(e);
					removeFromLS(LS_ACCESS_TOKEN);

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
