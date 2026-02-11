import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { globalActions } from '@/app/providers/store';
import { AuthForm, AuthTextField } from '@/widgets/auth-form';
import { useLoginMutation, type ILogin } from '@/entities/User';
import { ROUTES } from '@/shared/config/router/routes';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { Button } from '@/shared/ui/Button';
import * as styles from './Login.module.scss';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { loginSchema, defaultValues } from '../model';

const Login: React.FC = () => {
	const {
		control,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<ILogin>({
		mode: 'onSubmit',
		resolver: zodResolver(loginSchema),
		defaultValues,
	});
	const dispatch = useAppDispatch();
	const [isForgotOpen, setIsForgotOpen] = useState(false);
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const [loginMutation] = useLoginMutation();

	const onLogin = async (data: ILogin) => {
		await loginMutation(data);
	};

	const loginValue = watch('login');
	const loginHint = (loginValue || '').trim();
	const handleForgotClose = () => setIsForgotOpen(false);
	const handleForgotClick = () => setIsForgotOpen(true);
	const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);

	return (
		<div>
			<AuthForm title={'Авторизация'} onSubmit={handleSubmit(onLogin)} className={styles.formWrapper}>
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
					name="password"
					control={control}
					render={({ field: { ref, ...field } }) => (
						<AuthTextField
							requiredMark
							type={isPasswordVisible ? 'text' : 'password'}
							placeholder="Пароль"
							autoComplete="off"
							error={Boolean(errors.password)}
							helperText={errors.password?.message}
							inputRef={ref}
							InputProps={{
								endAdornment: (
									<IconButton
										onClick={togglePasswordVisibility}
										onMouseDown={(event) => event.preventDefault()}
										edge="end"
										size="small"
										aria-label={isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
										sx={{
											color: '#1E5DAC',
											'&:hover': {
												color: '#0C4493',
												backgroundColor: 'rgba(25, 105, 203, 0.12)',
											},
										}}
									>
										{isPasswordVisible ? (
											<VisibilityOff fontSize="small" />
										) : (
											<Visibility fontSize="small" />
										)}
									</IconButton>
								),
							}}
							{...field}
						/>
					)}
				/>

				<button className={styles.forgotPassword} type="button" onClick={handleForgotClick}>
					{'Забыли пароль?'}
				</button>

				<Button
					size="large"
					type="submit"
					variant="contained"
					color="primary"
					className={styles.primaryButton}
				>
					{'Войти'}
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
						onClick={() => dispatch(globalActions.setCurrentPage(ROUTES.auth.register.page))}
					>
						{'Зарегистрироваться'}
					</Button>
				</div>
			</AuthForm>

			<ForgotPasswordModal initialEmail={loginHint} open={isForgotOpen} onClose={handleForgotClose} />
		</div>
	);
};

export { Login };
