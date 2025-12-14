import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { globalActions } from '@/app/providers/store';
import { AuthForm, AuthTextField } from '@/widgets/auth-form';
import { useRegisterMutation, type IRegister } from '@/entities/User';
import { ROUTES } from '@/shared/config/router/routes';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { Button } from '@/shared/ui/Button';
import * as styles from './Register.module.scss';
import { registerSchema, defaultValues } from '../model';

const Register: React.FC = () => {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<IRegister>({
		mode: 'onSubmit',
		resolver: zodResolver(registerSchema),
		defaultValues,
	});
	const dispatch = useAppDispatch();

	const [registerMutation] = useRegisterMutation();

	const onRegister = async (data: IRegister) => {
		if (data.password !== data.passwordAgain) {
			dispatch(globalActions.setErrorMessage('Пароли не совпадают'));
			return;
		}

		await registerMutation(data);
        };

        return (
                <div>
                        <AuthForm title={'Регистрация'} onSubmit={handleSubmit(onRegister)} className={styles.formWrapper}>
                                <Controller
                                        name="fullname"
                                        control={control}
                                        render={({ field: { ref, ...field } }) => (
                                                <AuthTextField
                                                        requiredMark
                                                        placeholder="Фамилия Имя Отчество"
                                                        error={Boolean(errors.fullname)}
                                                        helperText={errors.fullname?.message}
                                                        inputRef={ref}
                                                        {...field}
                                                />
                                        )}
                                />
                                <Controller
                                        name="login"
                                        control={control}
                                        render={({ field: { ref, ...field } }) => (
                                                <AuthTextField
                                                        requiredMark
                                                        placeholder="Логин"
                                                        error={Boolean(errors.login)}
                                                        helperText={errors.login?.message}
                                                        inputRef={ref}
                                                        {...field}
                                                />
                                        )}
                                />
                                <Controller
                                        name="email"
                                        control={control}
                                        render={({ field: { ref, ...field } }) => (
                                                <AuthTextField
                                                        requiredMark
                                                        placeholder="example@gmail.com"
                                                        autoComplete="username"
                                                        error={Boolean(errors.email)}
                                                        helperText={errors.email?.message}
                                                        inputRef={ref}
                                                        {...field}
                                                />
                                        )}
                                />
                                <Controller
                                        name="phoneNumber"
                                        control={control}
                                        render={({ field: { ref, ...field } }) => (
                                                <AuthTextField
                                                        requiredMark
                                                        placeholder="8__________"
                                                        error={Boolean(errors.phoneNumber)}
                                                        helperText={errors.phoneNumber?.message}
                                                        inputRef={ref}
                                                        {...field}
                                                />
                                        )}
                                />
                                <Controller
                                        name="password"
                                        control={control}
                                        render={({ field: { ref, ...field } }) => (
                                                <AuthTextField
                                                        requiredMark
                                                        type="password"
                                                        placeholder="Пароль"
                                                        autoComplete="new-password"
                                                        error={Boolean(errors.password)}
                                                        helperText={errors.password?.message}
                                                        inputRef={ref}
                                                        {...field}
                                                />
                                        )}
                                />
                                <Controller
                                        name="passwordAgain"
                                        control={control}
                                        render={({ field: { ref, ...field } }) => (
                                                <AuthTextField
                                                        requiredMark
                                                        type="password"
                                                        placeholder="Повторите пароль"
                                                        autoComplete="new-password"
                                                        error={Boolean(errors.passwordAgain)}
                                                        helperText={errors.passwordAgain?.message}
                                                        inputRef={ref}
                                                        {...field}
                                                />
                                        )}
                                />
                                <Button
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        className={styles.primaryButton}
                                >
                                        {'Зарегистрироваться'}
                                </Button>
                                <div className={styles.secondaryRow}>
                                        <Button
                                                variant="outlined"
                                                color="error"
                                                className={styles.secondaryButton}
                                                onClick={() => dispatch(globalActions.setCurrentPage(ROUTES.appRoute))}
                                        >
                                                {'Вернуться на главную'}
                                        </Button>
                                        <Button
                                                variant="outlined"
                                                color="primary"
                                                className={styles.secondaryButton}
                                                onClick={() => dispatch(globalActions.setCurrentPage(ROUTES.auth.login.page))}
                                        >
                                                {'Авторизоваться'}
                                        </Button>
                                </div>
                        </AuthForm>
                </div>
        );
};

export { Register };
