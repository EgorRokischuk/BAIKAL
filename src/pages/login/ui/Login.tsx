import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { AuthForm } from '@/widgets/auth-form';
import { useLoginMutation, type ILogin } from '@/entities/User';
import { Button } from '@/shared/ui/Button';
import { InputField } from '@/shared/ui/InputField';
import { loginSchema, defaultValues } from '../model';

const Login: React.FC = () => {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<ILogin>({
		mode: 'onSubmit',
		resolver: zodResolver(loginSchema),
		defaultValues,
	});

	const [loginMutation, { isLoading }] = useLoginMutation();

	const onLogin = async (data: ILogin) => {
		await loginMutation(data);
		console.log(isLoading);
	};

	return (
		<div>
			<AuthForm title={'Авторизация'} onSubmit={handleSubmit(onLogin)}>
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
					name="password"
					control={control}
					render={({ field: { ref, ...field } }) => (
						<InputField
							type="password"
							label="Пароль"
							error={Boolean(errors.password)}
							helperText={errors.password?.message}
							inputRef={ref}
							{...field}
						/>
					)}
				/>

				<Button size="small" type="submit" variant="contained" color="primary">
					{'Войти'}
				</Button>
				<Button href="/" size="small" variant="contained" color="secondary">
					{'Вернуться на главную'}
				</Button>
				<Button href="/auth/register" size="small" variant="contained" color="secondary">
					{'Регистрация'}
				</Button>
			</AuthForm>
		</div>
	);
};

export { Login };
