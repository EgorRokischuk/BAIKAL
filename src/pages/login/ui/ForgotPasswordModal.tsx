import { zodResolver } from '@hookform/resolvers/zod';
import { Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useResendVerificationCodeMutation, useVerifyEmailMutation } from '@/entities/User';
import { globalActions } from '@/app/providers/store';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { ModalCarcass } from '@/shared/ui/ModalCarcass';
import { Button } from '@/shared/ui/Button';
import { AuthTextField } from '@/widgets/auth-form';
import * as styles from './ForgotPasswordModal.module.scss';

type ForgotStep = 'code' | 'password' | 'success' | null;

interface ForgotPasswordModalProps {
        open: boolean;
        step: ForgotStep;
        emailHint: string;
        userId: number | null;
        onClose: () => void;
        onCodeConfirmed: () => void;
        onPasswordSaved: () => void;
        onBackToCode: () => void;
}

const codeSchema = z.object({
        code: z.string().min(1, 'Введите код'),
});

const passwordSchema = z
        .object({
                password: z.string().min(8, 'Длина пароля не должна быть меньше 8 символов'),
                passwordAgain: z.string().min(8, 'Повторите пароль'),
        })
        .refine((data) => data.password === data.passwordAgain, {
                message: 'Пароли не совпадают',
                path: ['passwordAgain'],
        });

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
        open,
        step,
        emailHint,
        userId,
        onClose,
        onCodeConfirmed,
        onPasswordSaved,
        onBackToCode,
}) => {
        const [verifyEmail, { isLoading: isVerifyLoading }] = useVerifyEmailMutation();
        const [resendVerificationCode, { isLoading: isResendLoading }] = useResendVerificationCodeMutation();
        const dispatch = useAppDispatch();

        const {
                control: codeControl,
                handleSubmit: handleCodeSubmit,
                formState: { errors: codeErrors },
                reset: resetCode,
        } = useForm<{ code: string }>({
                mode: 'onSubmit',
                resolver: zodResolver(codeSchema),
                defaultValues: { code: '' },
        });

        const {
                control: passwordControl,
                handleSubmit: handlePasswordSubmit,
                formState: { errors: passwordErrors },
                reset: resetPassword,
        } = useForm<{ password: string; passwordAgain: string }>({
                mode: 'onSubmit',
                resolver: zodResolver(passwordSchema),
                defaultValues: { password: '', passwordAgain: '' },
        });

        const handleClose = () => {
                resetCode();
                resetPassword();
                onClose();
        };

        const handleCodeFormSubmit = handleCodeSubmit(async (data) => {
                try {
                        await verifyEmail(data.code).unwrap();
                        onCodeConfirmed();
                } catch (e) {
                        if (__IS_DEV__) console.error(e);
                }
        });

        const handlePasswordFormSubmit = handlePasswordSubmit(() => {
                onPasswordSaved();
                resetPassword();
        });

        const handleResendCode = async () => {
                if (!userId) {
                        dispatch(globalActions.setErrorMessage('Сначала укажите логин на форме авторизации'));
                        return;
                }

                try {
                        await resendVerificationCode(userId).unwrap();
                } catch (e) {
                        if (__IS_DEV__) console.error(e);
                }
        };

        const renderContent = () => {
                if (step === 'password') {
                        return (
                                <form className={styles.modalForm} onSubmit={handlePasswordFormSubmit}>
                                        <Typography className={styles.modalText}>{'Придумайте новый пароль'}</Typography>

                                        <Controller
                                                name="password"
                                                control={passwordControl}
                                                render={({ field: { ref, ...field } }) => (
                                                        <AuthTextField
                                                                requiredMark
                                                                type="password"
                                                                placeholder="Пароль"
                                                                error={Boolean(passwordErrors.password)}
                                                                helperText={passwordErrors.password?.message}
                                                                inputRef={ref}
                                                                {...field}
                                                        />
                                                )}
                                        />
                                        <Controller
                                                name="passwordAgain"
                                                control={passwordControl}
                                                render={({ field: { ref, ...field } }) => (
                                                        <AuthTextField
                                                                requiredMark
                                                                type="password"
                                                                placeholder="Повторите пароль"
                                                                error={Boolean(passwordErrors.passwordAgain)}
                                                                helperText={passwordErrors.passwordAgain?.message}
                                                                inputRef={ref}
                                                                {...field}
                                                        />
                                                )}
                                        />

                                        <div className={styles.modalActions}>
                                                <Button
                                                        variant="outlined"
                                                        color="error"
                                                        className={styles.modalButton}
                                                        onClick={() => {
                                                                resetPassword();
                                                                onBackToCode();
                                                        }}
                                                >
                                                        {'Назад'}
                                                </Button>
                                                <Button type="submit" variant="contained" color="primary" className={styles.modalButton}>
                                                        {'Сохранить'}
                                                </Button>
                                        </div>
                                </form>
                        );
                }

                if (step === 'success') {
                        return (
                                <div className={styles.successWrapper}>
                                        <Typography className={styles.successText}>{'Пароль успешно изменен'}</Typography>
                                        <Button
                                                variant="contained"
                                                color="primary"
                                                className={styles.modalButton}
                                                onClick={handleClose}
                                        >
                                                {'ОК'}
                                        </Button>
                                </div>
                        );
                }

                        return (
                                <form className={styles.modalForm} onSubmit={handleCodeFormSubmit}>
                                        <Typography className={styles.modalText}>
                                                {`Введите код, отправленный на почту ${
                                                        emailHint ? `пользователя ${emailHint}` : 'пользователя'
                                                }`}
                                        </Typography>

                                <Controller
                                        name="code"
                                        control={codeControl}
                                        render={({ field: { ref, ...field } }) => (
                                                <AuthTextField
                                                        requiredMark
                                                        placeholder="Код"
                                                        error={Boolean(codeErrors.code)}
                                                        helperText={codeErrors.code?.message}
                                                        inputRef={ref}
                                                        {...field}
                                                />
                                        )}
                                />

                                <button
                                        type="button"
                                        className={styles.resendButton}
                                        onClick={handleResendCode}
                                        disabled={isResendLoading}
                                >
                                        {isResendLoading ? 'Отправляем...' : 'Отправить код повторно'}
                                </button>

                                <div className={styles.modalActions}>
                                        <Button
                                                variant="outlined"
                                                color="error"
                                                className={styles.modalButton}
                                                onClick={handleClose}
                                        >
                                                {'Назад'}
                                        </Button>
                                        <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                className={styles.modalButton}
                                                disabled={isVerifyLoading}
                                        >
                                                {isVerifyLoading ? 'Проверяем...' : 'Подтвердить'}
                                        </Button>
                                </div>
                        </form>
                );
        };

        const modalTitle = step === 'password' ? 'Придумайте новый пароль' : step === 'success' ? '' : '';

        return (
                <ModalCarcass open={open} onClose={handleClose} width={520} title={modalTitle || ''}>
                        {renderContent()}
                </ModalCarcass>
        );
};

export { ForgotPasswordModal };
