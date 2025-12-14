import { zodResolver } from '@hookform/resolvers/zod';
import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { usePasswordResetConfirmMutation, usePasswordResetRequestMutation } from '@/entities/User';
import { globalActions } from '@/app/providers/store';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { ModalCarcass } from '@/shared/ui/ModalCarcass';
import { Button } from '@/shared/ui/Button';
import { AuthTextField } from '@/widgets/auth-form';
import * as styles from './ForgotPasswordModal.module.scss';

type ForgotStep = 'email' | 'waiting' | 'password' | 'success';

interface ForgotPasswordModalProps {
        open: boolean;
        onClose: () => void;
        initialEmail?: string;
}

const emailSchema = z.object({
        email: z.string().email('Введите корректный email'),
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

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ open, onClose, initialEmail = '' }) => {
        const [step, setStep] = useState<ForgotStep>('email');
        const [requestReset, { isLoading: isRequesting }] = usePasswordResetRequestMutation();
        const [confirmReset, { isLoading: isConfirming }] = usePasswordResetConfirmMutation();
        const dispatch = useAppDispatch();

        const {
                control: emailControl,
                handleSubmit: handleEmailSubmit,
                formState: { errors: emailErrors },
                reset: resetEmail,
        } = useForm<{ email: string }>({
                mode: 'onSubmit',
                resolver: zodResolver(emailSchema),
                defaultValues: { email: initialEmail },
        });

        const currentEmail = useWatch({ control: emailControl, name: 'email' });

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

        useEffect(() => {
                if (open) {
                        setStep('email');
                        resetEmail({ email: initialEmail });
                        resetPassword();
                }
        }, [open, initialEmail, resetEmail, resetPassword]);

        useEffect(() => {
                if (step !== 'waiting') return undefined;

                const intervalId = setInterval(async () => {
                        try {
                                await confirmReset().unwrap();
                                setStep('password');
                                clearInterval(intervalId);
                        } catch (e) {
                                if (__IS_DEV__) console.error(e);
                        }
                }, 5000);

                return () => clearInterval(intervalId);
        }, [step, confirmReset]);

        const handleClose = () => {
                resetEmail({ email: initialEmail });
                resetPassword();
                setStep('email');
                onClose();
        };

        const handleEmailFormSubmit = handleEmailSubmit(async (data) => {
                try {
                        await requestReset(data.email).unwrap();
                        setStep('waiting');
                } catch (e) {
                        if (__IS_DEV__) console.error(e);
                }
        });

        const handlePasswordFormSubmit = handlePasswordSubmit(async (data) => {
                try {
                        await confirmReset({ new_password: data.password }).unwrap();
                        setStep('success');
                        resetPassword();
                } catch (e) {
                        if (__IS_DEV__) console.error(e);
                }
        });

        const handleCheckConfirmation = async () => {
                try {
                        await confirmReset().unwrap();
                        setStep('password');
                } catch (e) {
                        if (__IS_DEV__) console.error(e);
                        dispatch(globalActions.setErrorMessage('Подтверждение сброса еще не выполнено'));
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
                                                        onClick={() => setStep('waiting')}
                                                >
                                                        {'Назад'}
                                                </Button>
                                                <Button
                                                        type="submit"
                                                        variant="contained"
                                                        color="primary"
                                                        className={styles.modalButton}
                                                >
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

                if (step === 'waiting') {
                        return (
                                <div className={styles.modalForm}>
                                        <Typography className={styles.modalText}>
                                                {`Мы отправили ссылку для сброса пароля на ${currentEmail || 'указанный email'}. После подтверждения по ссылке вы сможете задать новый пароль.`}
                                        </Typography>

                                        <div className={styles.modalActions}>
                                                <Button
                                                        variant="outlined"
                                                        color="error"
                                                        className={styles.modalButton}
                                                        onClick={() => setStep('email')}
                                                >
                                                        {'Изменить email'}
                                                </Button>
                                                <Button
                                                        variant="contained"
                                                        color="primary"
                                                        className={styles.modalButton}
                                                        onClick={handleCheckConfirmation}
                                                        disabled={isConfirming}
                                                >
                                                        {isConfirming ? 'Проверяем...' : 'Проверить подтверждение'}
                                                </Button>
                                        </div>
                                </div>
                        );
                }

                return (
                        <form className={styles.modalForm} onSubmit={handleEmailFormSubmit}>
                                <Typography className={styles.modalText}>{'Укажите email для отправки ссылки на смену пароля'}</Typography>

                                <Controller
                                        name="email"
                                        control={emailControl}
                                        render={({ field: { ref, ...field } }) => (
                                                <AuthTextField
                                                        requiredMark
                                                        placeholder="Email"
                                                        error={Boolean(emailErrors.email)}
                                                        helperText={emailErrors.email?.message}
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
                                                onClick={handleClose}
                                        >
                                                {'Назад'}
                                        </Button>
                                        <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                className={styles.modalButton}
                                                disabled={isRequesting}
                                        >
                                                {isRequesting ? 'Отправляем...' : 'Отправить ссылку'}
                                        </Button>
                                </div>
                        </form>
                );
        };

        const modalTitle = step === 'password' ? 'Придумайте новый пароль' : '';

        return (
                <ModalCarcass open={open} onClose={handleClose} width={520} title={modalTitle}>
                        {renderContent()}
                </ModalCarcass>
        );
};

export { ForgotPasswordModal };
