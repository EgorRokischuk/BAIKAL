import { zodResolver } from '@hookform/resolvers/zod';
import { CircularProgress, Tab, Tabs, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useMemo, useState, useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { ISupportTicketRequest, SupportTicketFields, useSendSupportTicketMutation } from '@/entities/SupportTicket';
import {
        IUserHistoryRecord,
        IUserProfileUpdate,
        useProfileHistoryQuery,
        useProfileQuery,
        useUpdateProfileMutation,
} from '@/entities/User';
import { defaultValues as supportDefaultValues, supportTicketSchema } from '@/pages/support/model';
import { Avatar } from '@/shared/ui/Avatar';
import { Button } from '@/shared/ui/Button';
import { InputField } from '@/shared/ui/InputField';
import { ModalCarcass } from '@/shared/ui/ModalCarcass';
import * as s from './PersonalArea.module.scss';
import { profileSchema } from './schema';

const PersonalArea: React.FC = () => {
        const [activeTab, setActiveTab] = useState(0);

        const { data: profile, isLoading: isProfileLoading } = useProfileQuery();
        const [updateProfile, { isLoading: isSavingProfile }] = useUpdateProfileMutation();
        const [sendSupportTicket, { isSuccess: isFeedbackSuccess, isLoading: isFeedbackSending }] =
                useSendSupportTicketMutation();

        const profileForm = useForm<IUserProfileUpdate>({
                resolver: zodResolver(profileSchema),
                mode: 'onSubmit',
                defaultValues: {
                        fullname: profile?.fullname ?? '',
                        phoneNumber: profile?.phoneNumber ?? '',
                        username: profile?.username ?? '',
                        email: profile?.email ?? '',
                },
        });

        useEffect(() => {
                if (!profile) return;

                profileForm.reset({
                        fullname: profile.fullname,
                        phoneNumber: profile.phoneNumber,
                        username: profile.username,
                        email: profile.email,
                });
        }, [profile, profileForm]);

        const historyEnabled = activeTab === 1;
        const { data: history = [], isFetching: isHistoryLoading } = useProfileHistoryQuery(undefined, {
                skip: !historyEnabled,
        });

        const feedbackForm = useForm<ISupportTicketRequest>({
                mode: 'onSubmit',
                resolver: zodResolver(supportTicketSchema),
                defaultValues: {
                        ...supportDefaultValues,
                        email: profile?.email ?? '',
                },
        });

        useEffect(() => {
                feedbackForm.reset({
                        ...supportDefaultValues,
                        email: profile?.email ?? '',
                });
        }, [profile, feedbackForm]);

        const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

        useEffect(() => {
                if (isFeedbackSuccess) {
                        setIsSuccessModalOpen(true);
                        feedbackForm.reset({
                                ...supportDefaultValues,
                                email: profile?.email ?? '',
                        });
                }
        }, [feedbackForm, isFeedbackSuccess, profile?.email]);

        const onSaveProfile = async (values: IUserProfileUpdate) => {
                await updateProfile(values);
        };

        const onSendFeedback = async (values: ISupportTicketRequest) => {
                await sendSupportTicket(values);
        };

        const registeredDate = useMemo(
                () => (profile?.registeredAt ? dayjs(profile.registeredAt).format('DD.MM.YYYY') : '—'),
                [profile?.registeredAt],
        );

        return (
                <div className={s.personalArea}>
                        <div className={s.card}>
                                <div className={s.header}>
                                        <div className={s.header__info}>
                                                <div className={s.header__avatar}>
                                                        <Avatar alt={profile?.email} sizes="72px" />
                                                </div>

                                                <div className={s.header__text}>
                                                        <Typography variant="h5" fontWeight={600}>
                                                                {profile?.fullname || '—'}
                                                        </Typography>
                                                        <Typography color="text.secondary">{profile?.email || '—'}</Typography>
                                                </div>
                                        </div>

                                        <div className={s.header__date}>
                                                <Typography color="text.secondary" fontWeight={600}>
                                                        {'зарегистрирован(а)'}
                                                </Typography>
                                                <Typography variant="body1" fontWeight={700}>
                                                        {registeredDate}
                                                </Typography>
                                        </div>
                                </div>
                        </div>

                        <div className={`${s.card} ${s.contentCard}`}>
                                <Tabs
                                        className={s.tabs}
                                        value={activeTab}
                                        onChange={(_, value) => setActiveTab(value)}
                                        textColor="primary"
                                        indicatorColor="primary"
                                        variant="scrollable"
                                        TabIndicatorProps={{ className: s.tabIndicator }}
                                >
                                        <Tab className={s.tab} classes={{ selected: s.tabSelected }} disableRipple label="Личные данные" />
                                        <Tab
                                                className={s.tab}
                                                classes={{ selected: s.tabSelected }}
                                                disableRipple
                                                label="История скачиваний"
                                        />
                                        <Tab className={s.tab} classes={{ selected: s.tabSelected }} disableRipple label="Обратная связь" />
                                </Tabs>
                        </div>

                        <div className={s.card}>
                                {isProfileLoading ? (
                                        <div className={s.centered}>
                                                <CircularProgress />
                                        </div>
                                ) : (
                                        <>
                                                {activeTab === 0 && (
                                                        <FormProvider {...profileForm}>
                                                                <form
                                                                        className={s.form}
                                                                        onSubmit={profileForm.handleSubmit(onSaveProfile)}
                                                                >
                                                                        <div className={s.form__grid}>
                                                                                <Controller
                                                                                        name="fullname"
                                                                                        control={profileForm.control}
                                                                                        render={({ field, fieldState }) => (
                                                                                                <InputField
                                                                                                        className={s.textField}
                                                                                                        label="ФИО"
                                                                                                        error={fieldState.invalid}
                                                                                                        helperText={fieldState.error?.message}
                                                                                                        {...field}
                                                                                                />
                                                                                        )}
                                                                                />
                                                                                <Controller
                                                                                        name="phoneNumber"
                                                                                        control={profileForm.control}
                                                                                        render={({ field, fieldState }) => (
                                                                                                <InputField
                                                                                                        className={s.textField}
                                                                                                        label="Номер телефона"
                                                                                                        error={fieldState.invalid}
                                                                                                        helperText={fieldState.error?.message}
                                                                                                        {...field}
                                                                                                />
                                                                                        )}
                                                                                />
                                                                                <Controller
                                                                                        name="username"
                                                                                        control={profileForm.control}
                                                                                        render={({ field, fieldState }) => (
                                                                                                <InputField
                                                                                                        className={s.textField}
                                                                                                        label="Логин"
                                                                                                        error={fieldState.invalid}
                                                                                                        helperText={fieldState.error?.message}
                                                                                                        {...field}
                                                                                                />
                                                                                        )}
                                                                                />
                                                                                <Controller
                                                                                        name="email"
                                                                                        control={profileForm.control}
                                                                                        render={({ field, fieldState }) => (
                                                                                                <InputField
                                                                                                        className={s.textField}
                                                                                                        label="Email"
                                                                                                        error={fieldState.invalid}
                                                                                                        helperText={fieldState.error?.message}
                                                                                                        {...field}
                                                                                                />
                                                                                        )}
                                                                                />
                                                                        </div>
                                                                        <div className={s.form__actions}>
                                                                                <Button
                                                                                        className={`${s.button} ${s.buttonOutlined}`}
                                                                                        variant="outlined"
                                                                                        color="primary"
                                                                                        onClick={() => profileForm.reset()}
                                                                                >
                                                                                        {'Отмена'}
                                                                                </Button>
                                                                                <Button
                                                                                        className={`${s.button} ${s.buttonContained}`}
                                                                                        type="submit"
                                                                                        variant="contained"
                                                                                        color="primary"
                                                                                        disabled={isSavingProfile}
                                                                                >
                                                                                        {'Сохранить'}
                                                                                </Button>
                                                                        </div>
                                                                </form>
                                                        </FormProvider>
                                                )}

                                                {activeTab === 1 && (
                                                        <div className={s.history}>
                                                                {isHistoryLoading ? (
                                                                        <div className={s.centered}>
                                                                                <CircularProgress />
                                                                        </div>
                                                                ) : history.length ? (
                                                                        <div className={s.tableWrapper}>
                                                                                <table className={s.table}>
                                                                                        <thead>
                                                                                                <tr>
                                                                                                        <th>{'Дата'}</th>
                                                                                                        <th>{'Электронная почта'}</th>
                                                                                                        <th>{'Продукт'}</th>
                                                                                                        <th>{'Примечание'}</th>
                                                                                                </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                                {history.map((row: IUserHistoryRecord, index: number) => (
                                                                                                        <tr key={`${row.date}-${index}`}>
                                                                                                                <td>{dayjs(row.date).format('DD.MM.YYYY')}</td>
                                                                                                                <td>{row.email}</td>
                                                                                                                <td>{row.product}</td>
                                                                                                                <td>{row.comment || '—'}</td>
                                                                                                        </tr>
                                                                                                ))}
                                                                                        </tbody>
                                                                                </table>
                                                                        </div>
                                                                ) : (
                                                                        <Typography color="text.secondary">
                                                                                {'История скачиваний отсутствует'}
                                                                        </Typography>
                                                                )}
                                                        </div>
                                                )}

                                                {activeTab === 2 && (
                                                        <FormProvider {...feedbackForm}>
                                                                <form
                                                                        className={s.feedback}
                                                                        onSubmit={feedbackForm.handleSubmit(onSendFeedback)}
                                                                >
                                                                        <Typography variant="body1" className={s.feedback__hint}>
                                                                                {
                                                                                        'Если у Вас возникла проблема или ошибка, пожалуйста, подробно опишите ее, и мы обязательно Вам поможем!'
                                                                                }
                                                                        </Typography>
                                                                        <SupportTicketFields
                                                                                fieldClassName={s.textField}
                                                                                fileInputClassName={s.feedback__file}
                                                                        />
                                                                        <div className={s.form__actions}>
                                                                                <Button
                                                                                        className={`${s.button} ${s.buttonOutlined}`}
                                                                                        variant="outlined"
                                                                                        color="primary"
                                                                                        onClick={() =>
                                                                                                feedbackForm.reset({
                                                                                                        ...supportDefaultValues,
                                                                                                        email: profile?.email ?? '',
                                                                                                })
                                                                                        }
                                                                                >
                                                                                        {'Отмена'}
                                                                                </Button>
                                                                                <Button
                                                                                        className={`${s.button} ${s.buttonContained}`}
                                                                                        type="submit"
                                                                                        variant="contained"
                                                                                        color="primary"
                                                                                        disabled={isFeedbackSending}
                                                                                >
                                                                                        {'Отправить'}
                                                                                </Button>
                                                                        </div>
                                                                </form>
                                                        </FormProvider>
                                                )}
                                        </>
                                )}
                        </div>

                        <ModalCarcass
                                open={isSuccessModalOpen}
                                onClose={() => setIsSuccessModalOpen(false)}
                                title=""
                                width={520}
                        >
                                <Typography variant="body1" align="center">
                                        {
                                                'Обратная связь отправлена. На Вашу почту будет отправлено письмо с результатами рассмотрения обращения в течение 10 рабочих дней.'
                                        }
                                </Typography>
                        </ModalCarcass>
                </div>
        );
};

export { PersonalArea };