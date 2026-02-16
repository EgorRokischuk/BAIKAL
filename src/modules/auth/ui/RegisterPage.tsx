import { Visibility, VisibilityOff } from '@mui/icons-material';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, IconButton, Stack, TextField, Typography, Button } from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '@/modules/auth/authApi';
import type { RegisterPayload } from '@/modules/auth/model/types';
import { registerSchema } from '@/modules/auth/model/validators';
import { ROUTES } from '@/shared/constants/routes';
import { formatRuPhoneInput } from '@/shared/lib/phone';

const defaultValues: RegisterPayload = {
  fullname: '',
  email: '',
  login: '',
  phoneNumber: '',
  password: '',
  passwordAgain: '',
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [registerMutation] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordAgain, setShowPasswordAgain] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterPayload>({
    mode: 'onSubmit',
    resolver: zodResolver(registerSchema),
    defaultValues,
  });

  const onSubmit = async (payload: RegisterPayload) => {
    const result = await registerMutation(payload);
    if (!('error' in result)) {
      navigate(ROUTES.auth.login);
    }
  };

  return (
    <Box>
      <Stack spacing={2.2} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h2">Регистрация</Typography>
        <Typography variant="body2" color="text.secondary">
          Создайте учетную запись для доступа к личному кабинету и сервисам платформы.
        </Typography>

        <Controller
          name="fullname"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              size="small"
              label="ФИО"
              error={Boolean(errors.fullname)}
              helperText={errors.fullname?.message}
            />
          )}
        />

        <Controller
          name="login"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              size="small"
              label="Логин"
              error={Boolean(errors.login)}
              helperText={errors.login?.message}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              size="small"
              label="E-mail"
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
              size="small"
              label="Телефон"
              error={Boolean(errors.phoneNumber)}
              helperText={errors.phoneNumber?.message}
              inputProps={{
                inputMode: 'tel',
                autoComplete: 'tel',
              }}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type={showPassword ? 'text' : 'password'}
              size="small"
              label="Пароль"
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    onMouseDown={(event) => event.preventDefault()}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                ),
              }}
            />
          )}
        />

        <Controller
          name="passwordAgain"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type={showPasswordAgain ? 'text' : 'password'}
              size="small"
              label="Повторите пароль"
              error={Boolean(errors.passwordAgain)}
              helperText={errors.passwordAgain?.message}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPasswordAgain((prev) => !prev)}
                    onMouseDown={(event) => event.preventDefault()}
                    edge="end"
                    size="small"
                  >
                    {showPasswordAgain ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                ),
              }}
            />
          )}
        />

        <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
          Зарегистрироваться
        </Button>

        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
          <Button variant="outlined" color="inherit" onClick={() => navigate(ROUTES.home)}>
            На карту
          </Button>
          <Button variant="outlined" component={Link} to={ROUTES.auth.login}>
            Войти
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
