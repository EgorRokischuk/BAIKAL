import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  Button,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useAppDispatch } from '@/store/hooks';
import { appActions } from '@/store/slices/appSlice';
import {
  usePasswordResetConfirmMutation,
  usePasswordResetRequestMutation,
} from '@/modules/auth/authApi';
import { forgotEmailSchema, forgotPasswordSchema } from '@/modules/auth/model/validators';

type Step = 'email' | 'waiting' | 'password' | 'success';

interface ForgotPasswordDialogProps {
  open: boolean;
  onClose: () => void;
  initialEmail?: string;
}

export const ForgotPasswordDialog = ({
  open,
  onClose,
  initialEmail = '',
}: ForgotPasswordDialogProps) => {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<Step>('email');

  const [requestReset, { isLoading: isRequesting }] = usePasswordResetRequestMutation();
  const [confirmReset, { isLoading: isConfirming }] = usePasswordResetConfirmMutation();

  const {
    control: emailControl,
    handleSubmit: submitEmail,
    reset: resetEmail,
    formState: { errors: emailErrors },
  } = useForm<{ email: string }>({
    mode: 'onSubmit',
    resolver: zodResolver(forgotEmailSchema),
    defaultValues: { email: initialEmail },
  });

  const currentEmail = useWatch({ control: emailControl, name: 'email' });

  const {
    control: passwordControl,
    handleSubmit: submitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<{ password: string; passwordAgain: string }>({
    mode: 'onSubmit',
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      password: '',
      passwordAgain: '',
    },
  });

  useEffect(() => {
    if (step !== 'waiting') return undefined;

    const timer = setInterval(async () => {
      try {
        await confirmReset(undefined).unwrap();
        setStep('password');
      } catch {
        // polling intentionally silent
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [confirmReset, step]);

  const close = () => {
    setStep('email');
    resetEmail({ email: initialEmail });
    resetPassword();
    onClose();
  };

  const onEmailSubmit = submitEmail(async (payload) => {
    try {
      await requestReset(payload.email).unwrap();
      setStep('waiting');
    } catch {
      // handled in endpoint
    }
  });

  const onPasswordSubmit = submitPassword(async (payload) => {
    try {
      await confirmReset({ new_password: payload.password }).unwrap();
      setStep('success');
    } catch {
      // handled in endpoint
    }
  });

  const handleManualCheck = async () => {
    try {
      await confirmReset(undefined).unwrap();
      setStep('password');
    } catch {
      dispatch(appActions.showError('Reset confirmation still pending.'));
    }
  };

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
      <DialogTitle>
        {step === 'password' ? 'Set new password' : 'Password reset'}
      </DialogTitle>

      <DialogContent>
        {step === 'email' && (
          <Stack spacing={2} component="form" sx={{ mt: 1 }} onSubmit={onEmailSubmit}>
            <Typography variant="body2" color="text.secondary">
              Enter your email to request password reset link.
            </Typography>
            <Controller
              name="email"
              control={emailControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  size="small"
                  error={Boolean(emailErrors.email)}
                  helperText={emailErrors.email?.message}
                />
              )}
            />
            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <Button variant="outlined" color="inherit" onClick={close}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isRequesting}>
                {isRequesting ? 'Sending...' : 'Send link'}
              </Button>
            </Stack>
          </Stack>
        )}

        {step === 'waiting' && (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              We sent confirmation instructions to {currentEmail || 'your email'}.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              After confirmation, you can set new password here.
            </Typography>
            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <Button variant="outlined" color="inherit" onClick={() => setStep('email')}>
                Change email
              </Button>
              <Button variant="contained" onClick={handleManualCheck} disabled={isConfirming}>
                {isConfirming ? 'Checking...' : 'Check confirmation'}
              </Button>
            </Stack>
          </Stack>
        )}

        {step === 'password' && (
          <Stack spacing={2} component="form" sx={{ mt: 1 }} onSubmit={onPasswordSubmit}>
            <Controller
              name="password"
              control={passwordControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="password"
                  label="New password"
                  size="small"
                  error={Boolean(passwordErrors.password)}
                  helperText={passwordErrors.password?.message}
                />
              )}
            />
            <Controller
              name="passwordAgain"
              control={passwordControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="password"
                  label="Repeat password"
                  size="small"
                  error={Boolean(passwordErrors.passwordAgain)}
                  helperText={passwordErrors.passwordAgain?.message}
                />
              )}
            />

            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <Button variant="outlined" color="inherit" onClick={() => setStep('waiting')}>
                Back
              </Button>
              <Button type="submit" variant="contained">
                Save
              </Button>
            </Stack>
          </Stack>
        )}

        {step === 'success' && (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography>Password has been changed successfully.</Typography>
            <Box display="flex" justifyContent="flex-end">
              <Button variant="contained" onClick={close}>
                OK
              </Button>
            </Box>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};
