import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Chip, Paper, Stack, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useProfileQuery, useUpdateProfileMutation } from '@/modules/auth/authApi';
import { profileUpdateSchema } from '@/modules/auth/model/validators';
import { ROUTES } from '@/shared/constants/routes';
import { formatRuPhoneInput } from '@/shared/lib/phone';
import { useAppSelector } from '@/store/hooks';
import { selectProfile } from '@/store/slices/authSelectors';
import styles from './ProfilePage.module.scss';

interface ProfileFormValues {
  fullname: string;
  username: string;
  email: string;
  phoneNumber: string;
  password?: string;
  passwordAgain?: string;
}

const getDefaultFormValues = (): ProfileFormValues => ({
  fullname: '',
  username: '',
  email: '',
  phoneNumber: '',
  password: '',
  passwordAgain: '',
});

export const ProfilePage = () => {
  const navigate = useNavigate();
  const profile = useAppSelector(selectProfile);
  const [updateProfile] = useUpdateProfileMutation();
  const { isLoading, isFetching, isError } = useProfileQuery();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    mode: 'onTouched',
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: getDefaultFormValues(),
  });

  useEffect(() => {
    if (!profile) return;

    reset({
      fullname: profile.fullname,
      username: profile.username,
      email: profile.email,
      phoneNumber: formatRuPhoneInput(profile.phoneNumber),
      password: '',
      passwordAgain: '',
    });
  }, [profile, reset]);

  const onSubmit = handleSubmit(async (values) => {
    await updateProfile({
      fullname: values.fullname,
      username: values.username,
      email: values.email,
      phoneNumber: values.phoneNumber,
      password: (values.password ?? '').trim() ? (values.password ?? '').trim() : undefined,
    });

    reset({
      ...values,
      password: '',
      passwordAgain: '',
    });
  });

  if ((isLoading || isFetching) && !profile) {
    return (
      <Box className={styles.page}>
        <Paper className={styles.heroCard}>
          <Typography variant="h2">Личный кабинет</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Загрузка профиля...
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box className={styles.page}>
        <Paper className={styles.heroCard}>
          <Typography variant="h2">Личный кабинет</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {isError
              ? 'Не удалось загрузить данные профиля. Попробуйте войти снова.'
              : 'Профиль недоступен.'}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button variant="contained" onClick={() => navigate(ROUTES.home)}>
              На главную
            </Button>
          </Stack>
        </Paper>
      </Box>
    );
  }

  const roleLabel = profile.userRights.length ? profile.userRights.join(', ') : 'Не назначена';
  const phoneLabel = profile.phoneNumber ? formatRuPhoneInput(profile.phoneNumber) : 'Не указан';
  const initials = profile.fullname
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <Box className={styles.page}>
      <Paper className={styles.heroCard}>
        <div className={styles.heroHeader}>
          <div className={styles.avatar}>{initials || 'П'}</div>

          <div className={styles.heroText}>
            <Typography variant="h2">Личный кабинет</Typography>
            <Typography className={styles.heroSubtitle}>
              Управление персональными данными учетной записи.
            </Typography>
          </div>
        </div>

        <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.8} className={styles.heroBadges}>
          <Chip size="small" label={`Роль: ${roleLabel}`} />
          <Chip size="small" label={`E-mail: ${profile.email}`} />
          <Chip size="small" label={`Телефон: ${phoneLabel}`} />
        </Stack>
      </Paper>

      <Paper className={styles.formCard}>
        <Typography className={styles.sectionTitle}>Редактирование профиля</Typography>
        <Typography variant="body2" color="text.secondary">
          Изменения сохраняются в учетной записи. Роль доступна только для просмотра.
        </Typography>

        <Stack component="form" spacing={1.2} sx={{ mt: 1.8 }} onSubmit={onSubmit}>
          <Controller
            name="fullname"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="ФИО"
                size="small"
                error={Boolean(errors.fullname)}
                helperText={errors.fullname?.message}
              />
            )}
          />

          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Логин"
                size="small"
                error={Boolean(errors.username)}
                helperText={errors.username?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="E-mail"
                size="small"
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />
            )}
          />

          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <TextField
                name={field.name}
                value={field.value ?? ''}
                onBlur={field.onBlur}
                onChange={(event) => field.onChange(formatRuPhoneInput(event.target.value))}
                label="Телефон"
                size="small"
                error={Boolean(errors.phoneNumber)}
                helperText={errors.phoneNumber?.message}
                inputProps={{
                  inputMode: 'tel',
                  autoComplete: 'tel',
                }}
              />
            )}
          />

          <TextField label="Роль" size="small" value={roleLabel} InputProps={{ readOnly: true }} />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Новый пароль (необязательно)"
                size="small"
                type="password"
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
              />
            )}
          />

          <Controller
            name="passwordAgain"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Повторите новый пароль"
                size="small"
                type="password"
                error={Boolean(errors.passwordAgain)}
                helperText={errors.passwordAgain?.message}
              />
            )}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} className={styles.actions}>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              Сохранить изменения
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};
