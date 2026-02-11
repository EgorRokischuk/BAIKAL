import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, type TextFieldProps } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import InputMask from 'react-input-mask';
import { useState } from 'react';
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
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [isPasswordAgainVisible, setIsPasswordAgainVisible] = useState(false);

	const [registerMutation] = useRegisterMutation();

	const onRegister = async (data: IRegister) => {
		if (data.password !== data.passwordAgain) {
			dispatch(globalActions.setErrorMessage('Пароли не совпадают'));
			return;
		}

		await registerMutation(data);
	};

	const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);
	const togglePasswordAgainVisibility = () => setIsPasswordAgainVisible((prev) => !prev);

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
						<InputMask
							mask="+7 (999) 999 - 99 - 99"
							maskChar="_"
							value={field.value ?? ''}
							onChange={field.onChange}
							onBlur={field.onBlur}
							name={field.name}
						>
							{(inputProps) => (
								<AuthTextField
									requiredMark
									type="tel"
									placeholder="+7 (___) ___ - __ - __"
									autoComplete="tel"
									error={Boolean(errors.phoneNumber)}
									helperText={errors.phoneNumber?.message}
									inputRef={ref}
									inputProps={{ inputMode: 'numeric' }}
									{...(inputProps as TextFieldProps)}
								/>
							)}
						</InputMask>
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
							autoComplete="new-password"
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
				<Controller
					name="passwordAgain"
					control={control}
					render={({ field: { ref, ...field } }) => (
						<AuthTextField
							requiredMark
							type={isPasswordAgainVisible ? 'text' : 'password'}
							placeholder="Повторите пароль"
							autoComplete="new-password"
							error={Boolean(errors.passwordAgain)}
							helperText={errors.passwordAgain?.message}
							inputRef={ref}
							InputProps={{
								endAdornment: (
									<IconButton
										onClick={togglePasswordAgainVisibility}
										onMouseDown={(event) => event.preventDefault()}
										edge="end"
										size="small"
										aria-label={isPasswordAgainVisible ? 'Скрыть пароль' : 'Показать пароль'}
										sx={{
											color: '#1E5DAC',
											'&:hover': {
												color: '#0C4493',
												backgroundColor: 'rgba(25, 105, 203, 0.12)',
											},
										}}
									>
										{isPasswordAgainVisible ? (
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
