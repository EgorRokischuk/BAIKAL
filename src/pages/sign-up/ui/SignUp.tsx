import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { globalActions } from '@/app/providers/store';
import { AuthForm } from '@/widgets/auth-form';
import { useRegisterMutation, type IRegister } from '@/entities/User';
import { ROUTES } from '@/shared/config/router/routes';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { InputField } from '@/shared/ui/InputField';
import { registerSchema, defaultValues } from '../model';

const SignUp: React.FC = () => {
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
			<AuthForm title={'Регистрация'} onSubmit={handleSubmit(onRegister)}>
				<Controller
					name="fullname"
					control={control}
					render={({ field: { ref, ...field } }) => (
						<InputField
							label="ФИО"
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
						<InputField
							label="Логин"
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
						<InputField
							label="E-mail"
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
						<InputField
							label="Номер телефона"
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
						<InputField
							type="password"
							label="Пароль"
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
						<InputField
							type="password"
							label="Повторите пароль"
							autoComplete="new-password"
							error={Boolean(errors.passwordAgain)}
							helperText={errors.passwordAgain?.message}
							inputRef={ref}
							{...field}
						/>
					)}
				/>
				<Button size="small" type="submit" variant="contained" color="primary">
					{'Подтвердить'}
				</Button>
				<Button
					size="small"
					variant="contained"
					color="secondary"
					onClick={() => dispatch(globalActions.setCurrentPage(ROUTES.appRoute))}
				>
					{'Вернуться на главную'}
				</Button>
				<Button
					size="small"
					variant="contained"
					color="secondary"
					onClick={() => dispatch(globalActions.setCurrentPage(ROUTES.auth.login.page))}
				>
					{'Авторизация'}
				</Button>
			</AuthForm>
		</div>
	);
};

export { SignUp };
