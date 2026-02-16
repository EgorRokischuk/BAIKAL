import { Visibility, VisibilityOff } from '@mui/icons-material';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  IconButton,
  Stack,
  TextField,
  Typography,
  Link as MuiLink,
  Button,
} from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '@/modules/auth/authApi';
import type { LoginPayload } from '@/modules/auth/model/types';
import { loginSchema } from '@/modules/auth/model/validators';
import { ROUTES } from '@/shared/constants/routes';
import { ForgotPasswordDialog } from './ForgotPasswordDialog';

const defaultValues: LoginPayload = {
  login: '',
  password: '',
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const [login] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotInitialEmail, setForgotInitialEmail] = useState('');

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginPayload>({
    mode: 'onSubmit',
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  const onSubmit = async (payload: LoginPayload) => {
    const result = await login(payload);

    if (!('error' in result)) {
      navigate(ROUTES.home);
    }
  };

  return (
    <Box>
      <Stack spacing={2.2} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h2">Вход</Typography>
        <Typography variant="body2" color="text.secondary">
          Авторизуйтесь для доступа к личному кабинету и дополнительным возможностям системы.
        </Typography>

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

        <MuiLink
          component="button"
          type="button"
          onClick={() => {
            setForgotInitialEmail((getValues('login') || '').trim());
            setForgotOpen(true);
          }}
          underline="hover"
        >
          Забыли пароль?
        </MuiLink>

        <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
          Войти
        </Button>

        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
          <Button variant="outlined" color="inherit" onClick={() => navigate(ROUTES.home)}>
            На карту
          </Button>
          <Button variant="outlined" component={Link} to={ROUTES.auth.register}>
            Регистрация
          </Button>
        </Stack>
      </Stack>

      {forgotOpen && (
        <ForgotPasswordDialog
          open={forgotOpen}
          onClose={() => setForgotOpen(false)}
          initialEmail={forgotInitialEmail}
        />
      )}
    </Box>
  );
};
