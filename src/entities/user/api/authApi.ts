import { globalActions } from '@/app/providers/store';
import { ApiTags } from '@/shared/config/api/apiTags';
import { baseApi } from '@/shared/config/api/baseApi';
import { LS_ACCESS_TOKEN, LS_REFRESH_TOKEN } from '@/shared/config/constants/authConstants';
import { removeFromLS, setToLS } from '@/shared/lib/manageLocalStorage';
import { userActions } from '../model/slices';
import { IExtraArgument, ILogin, ILoginResponse, IRegister, IUser, IUserByLogin } from '../types';
import { adaptLogin, adaptProfile, adaptRegister, adaptUserByLogin, IProfileDTO, IUserByLoginDTO } from './dto';

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
					setToLS(LS_ACCESS_TOKEN, response.data.access_token);
					setToLS(LS_REFRESH_TOKEN, response.data.refresh_token);

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
		profile: build.query<IUser, void>({
			query: () => ({
				url: 'users/me',
				method: 'GET',
			}),
			async onQueryStarted(_, { queryFulfilled, dispatch }) {
				try {
					const response = await queryFulfilled;

					dispatch(userActions.setProfile(response.data));
				} catch (e) {
					if (__IS_DEV__) console.error(e);
				}
			},
			transformResponse: (baseQueryReturnValue) => {
				const data = baseQueryReturnValue as IProfileDTO;

				return adaptProfile(data);
			},
			providesTags: [ApiTags.PROFILE],
		}),
		refresh: build.query<ILoginResponse, void>({
			query: () => ({
				url: 'users/refresh',
				method: 'GET',
			}),
			async onQueryStarted(_, { queryFulfilled, dispatch }) {
				try {
					const response = await queryFulfilled;

					setToLS(LS_ACCESS_TOKEN, response.data.access_token);
					setToLS(LS_REFRESH_TOKEN, response.data.refresh_token);

					dispatch(globalActions.setAccessToken(response.data.access_token));
				} catch (e) {
					if (__IS_DEV__) console.error(e);

					removeFromLS(LS_ACCESS_TOKEN);
					removeFromLS(LS_REFRESH_TOKEN);

									  }
                        },
                }),
                verifyEmail: build.mutation<string, string>({
                        query: (token) => ({
                                url: `users/verify_email/${token}`,
                                method: 'GET',
                        }),
                        async onQueryStarted(_, { queryFulfilled, dispatch }) {
                                try {
                                        await queryFulfilled;

                                        dispatch(globalActions.setSuccessMessage('Код подтвержден'));
                                } catch (e) {
                                        if (__IS_DEV__) console.error(e);

                                        dispatch(globalActions.setErrorMessage('Код не подтвержден'));
                                }
                        },
                }),
                getUserByLogin: build.query<IUserByLogin, string>({
                        query: (login) => ({
                                url: 'users/get_user_by_login',
                                method: 'GET',
                                params: { login },
                        }),
                        transformResponse: (response) => adaptUserByLogin(response as IUserByLoginDTO),
                }),
                resendVerificationCode: build.mutation<string, number>({
                        query: (userId) => ({
                                url: 'users/resend_verification_code',
                                method: 'POST',
                                params: { user_id: userId },
                        }),
                        async onQueryStarted(_, { queryFulfilled, dispatch }) {
                                try {
                                        await queryFulfilled;

                                        dispatch(globalActions.setSuccessMessage('Код отправлен на почту'));
                                } catch (e) {
                                        if (__IS_DEV__) console.error(e);

                                        dispatch(globalActions.setErrorMessage('Не удалось отправить код повторно'));
                                }
                        },
                }),
        }),
});

const {
        useLoginMutation,
        useRegisterMutation,
        useProfileQuery,
        useRefreshQuery,
        useVerifyEmailMutation,
        useLazyGetUserByLoginQuery,
        useResendVerificationCodeMutation,
} = authApi;

export {
        authApi,
        useLoginMutation,
        useRegisterMutation,
        useProfileQuery,
        useRefreshQuery,
        useVerifyEmailMutation,
        useLazyGetUserByLoginQuery,
        useResendVerificationCodeMutation,
};
