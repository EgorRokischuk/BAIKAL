import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { globalActions } from '@/app/providers/store';
import { AuthForm, AuthTextField } from '@/widgets/auth-form';
import { useLoginMutation, useResendVerificationCodeMutation, type ILogin } from '@/entities/User';
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
        const [forgotStep, setForgotStep] = useState<'code' | 'password' | 'success' | null>(null);

        const [loginMutation] = useLoginMutation();
        const [sendResetCode, { isLoading: isSendingCode }] = useResendVerificationCodeMutation();

        const onLogin = async (data: ILogin) => {
                await loginMutation(data);
        };

        const loginValue = watch('login');
        const loginHint = (loginValue || '').trim();
        const handleForgotClose = () => setForgotStep(null);
        const handleForgotClick = async () => {
                const trimmedLogin = loginHint;

                if (!trimmedLogin) {
                        dispatch(globalActions.setErrorMessage('Укажите логин, чтобы отправить код на почту'));
                        return;
                }

                try {
                        await sendResetCode(trimmedLogin).unwrap();
                        setForgotStep('code');
                } catch (e) {
                        if (__IS_DEV__) console.error(e);
                }
        };

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
                                                        type="password"
                                                        placeholder="Пароль"
                                                        autoComplete="off"
                                                        error={Boolean(errors.password)}
                                                        helperText={errors.password?.message}
                                                        inputRef={ref}
                                                        {...field}
                                                />
                                        )}
                                />

                                <button
                                        className={styles.forgotPassword}
                                        type="button"
                                        onClick={handleForgotClick}
                                        disabled={isSendingCode}
                                >
                                        {isSendingCode ? 'Отправляем код...' : 'Забыли пароль?'}
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

                        <ForgotPasswordModal
                                emailHint={loginHint}
                                open={Boolean(forgotStep)}
                                step={forgotStep}
                                onClose={handleForgotClose}
                                onCodeConfirmed={() => setForgotStep('password')}
                                onPasswordSaved={() => setForgotStep('success')}
                                onBackToCode={() => setForgotStep('code')}
                        />
                </div>
        );
};

export { Login };
