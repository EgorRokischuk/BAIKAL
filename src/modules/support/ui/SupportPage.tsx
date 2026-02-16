import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { supportSchema } from '@/modules/support/model/validators';
import type { SupportTicketPayload } from '@/modules/support/model/types';
import { useSendSupportTicketMutation } from '@/modules/support/supportApi';
import styles from './SupportPage.module.scss';

const defaultValues: SupportTicketPayload = {
  subject: '',
  description: '',
  email: '',
  file: undefined,
};

export const SupportPage = () => {
  const [sendTicket] = useSendSupportTicketMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SupportTicketPayload>({
    mode: 'onTouched',
    resolver: zodResolver(supportSchema),
    defaultValues,
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await sendTicket(values);

    if (!('error' in result)) {
      reset(defaultValues);
    }
  });

  return (
    <Box className={styles.page}>
      <Paper className={styles.card}>
        <Typography variant="h2">Поддержка</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Опишите проблему. При необходимости приложите файл и оставьте контактный e-mail.
        </Typography>

        <Stack component="form" spacing={2} sx={{ mt: 2 }} onSubmit={onSubmit}>
          <Controller
            name="subject"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Тема"
                size="small"
                error={Boolean(errors.subject)}
                helperText={errors.subject?.message}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Описание"
                size="small"
                multiline
                minRows={5}
                error={Boolean(errors.description)}
                helperText={errors.description?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="E-mail (необязательно)"
                size="small"
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />
            )}
          />

          <Controller
            name="file"
            control={control}
            render={({ field }) => (
              <Box className={styles.fileField}>
                <input
                  id="support-file-input"
                  className={styles.hiddenInput}
                  type="file"
                  onChange={(event) => field.onChange(event.target.files?.[0] ?? undefined)}
                />
                <label htmlFor="support-file-input">
                  <Button component="span" variant="outlined" color="inherit" size="small">
                    Выбрать файл
                  </Button>
                </label>

                <Typography variant="body2" color="text.secondary" noWrap className={styles.fileName}>
                  {field.value instanceof File ? field.value.name : 'Файл не выбран'}
                </Typography>

                {field.value instanceof File && (
                  <Button size="small" onClick={() => field.onChange(undefined)}>
                    Очистить
                  </Button>
                )}
              </Box>
            )}
          />

          <Box display="flex" justifyContent="flex-end">
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              Отправить обращение
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};
