import { globalActions } from '@/app/providers/store';
import { ApiTags } from '@/shared/config/api/apiTags';
import { baseApi } from '@/shared/config/api/baseApi';
import { LS_ACCESS_TOKEN, LS_REFRESH_TOKEN } from '@/shared/config/constants/authConstants';
import { removeFromLS, setToLS } from '@/shared/lib/manageLocalStorage';
import { userActions } from '../model/slices';
import { IExtraArgument, ILogin, ILoginResponse, IRegister, IUser } from '../types';
import { adaptLogin, adaptProfile, adaptRegister, IProfileDTO } from './dto';

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

                                        await dispatch(
                                                authApi.endpoints.profile.initiate(undefined, { forceRefetch: true }),
                                        ).unwrap();

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
                // updateProfile: build.mutation<IUser, IUserProfileUpdate>({
                //         query: (profile) => ({
                //                 url: 'users/me',
                //                 method: 'PUT',
                //                 body: adaptProfileUpdate(profile),
                //         }),
                //         async onQueryStarted(_, { queryFulfilled, dispatch }) {
                //                 try {
                //                         const response = await queryFulfilled;

                //                         dispatch(userActions.setProfile(response.data));
                //                         dispatch(globalActions.setSuccessMessage('Профиль обновлен'));
                //                 } catch (e) {
                //                         if (__IS_DEV__) console.error(e);
                //                         //dispatch(globalActions.setErrorMessage('Не удалось сохранить данные'));
                //                         dispatch(globalActions.setErrorMessage('Функция в разработке'));
                //                 }
                //         },
                //         transformResponse: (baseQueryReturnValue) => {
                //                 const data = baseQueryReturnValue as IProfileDTO;

                //                 return adaptProfile(data);
                //         },
                //         invalidatesTags: [ApiTags.PROFILE],
                // }),
                // profileHistory: build.query<Array<IUserHistoryRecord>, void>({
                //         query: () => ({
                //                 url: 'users/history',
                //                 method: 'GET',
                //         }),
                //         transformResponse: (baseQueryReturnValue) => {
                //                 const data = baseQueryReturnValue as Array<IUserHistoryRecordDTO>;

                //                 return data.map((record) => adaptHistoryRecord(record));
                //         },
                //         providesTags: [ApiTags.PROFILE],
                // }),
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
                passwordResetRequest: build.mutation<string, string>({
                        query: (email) => ({
                                url: 'users/password_reset/request',
                                method: 'POST',
                                params: { email },
                        }),
                        async onQueryStarted(_, { queryFulfilled, dispatch }) {
                                try {
                                        await queryFulfilled;

                                        dispatch(globalActions.setSuccessMessage('Ссылка для сброса пароля отправлена'));
                                } catch (e) {
                                        if (__IS_DEV__) console.error(e);

                                        //dispatch(globalActions.setErrorMessage('Не удалось отправить ссылку для сброса'));
                                        dispatch(globalActions.setErrorMessage('Функция в разработке'));
                                }
                        },
                }),
                passwordResetConfirm: build.mutation<string, { new_password?: string } | undefined>({
                        query: (body) => ({
                                url: 'users/password_reset/confirm',
                                method: 'POST',
                                body: body?.new_password ? { new_password: body.new_password } : undefined,
                        }),
                        async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                                try {
                                        await queryFulfilled;

                                        if (arg && 'new_password' in arg && arg.new_password)
                                                dispatch(globalActions.setSuccessMessage('Пароль успешно изменен'));
                                } catch (e) {
                                        if (__IS_DEV__) console.error(e);

                                        const message = arg && 'new_password' in arg && arg.new_password
                                                ? 'Не удалось изменить пароль'
                                                : 'Подтверждение сброса пароля не выполнено';
                                        dispatch(globalActions.setErrorMessage(message));
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
        usePasswordResetRequestMutation,
        usePasswordResetConfirmMutation,
} = authApi;

export {
        authApi,
        useLoginMutation,
        useRegisterMutation,
        useProfileQuery,
        useRefreshQuery,
        usePasswordResetRequestMutation,
        usePasswordResetConfirmMutation,
};
