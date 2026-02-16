import { zodResolver } from '@hookform/resolvers/zod';
import SendIcon from '@mui/icons-material/Send';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { env } from '@/shared/config/env';
import { GUIDE_LLM_SYSTEM_PROMPT, GUIDE_LLM_WELCOME } from './guideKnowledge';
import styles from './GuideAssistantChat.module.scss';

const questionSchema = z.object({
  text: z.string().trim().min(1, 'Введите вопрос').max(2000, 'Слишком длинный запрос'),
});

type QuestionForm = z.infer<typeof questionSchema>;

type ChatRole = 'assistant' | 'user';

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface LlmResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

const toApiMessages = (messages: ChatMessage[]) =>
  messages.map((item) => ({
    role: item.role,
    content: item.content,
  }));

export const GuideAssistantChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: GUIDE_LLM_WELCOME },
  ]);
  const [requestError, setRequestError] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuestionForm>({
    mode: 'onSubmit',
    resolver: zodResolver(questionSchema),
    defaultValues: { text: '' },
  });

  const canSend = useMemo(() => !isSubmitting, [isSubmitting]);

  const onSubmit = handleSubmit(async ({ text }) => {
    const userMessage: ChatMessage = { role: 'user', content: text };
    const draftMessages = [...messages, userMessage];

    setRequestError('');
    setMessages(draftMessages);
    reset({ text: '' });

    try {
      const response = await fetch(env.llmApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: env.llmModelName,
          temperature: 0.2,
          max_tokens: 600,
          messages: [
            { role: 'system', content: GUIDE_LLM_SYSTEM_PROMPT },
            ...toApiMessages(draftMessages),
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`LLM request failed: ${response.status}`);
      }

      const payload = (await response.json()) as LlmResponse;
      const answer = payload.choices?.[0]?.message?.content?.trim();

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            answer ||
            'Не удалось извлечь ответ модели. Проверьте настройки локального LLM-сервера.',
        },
      ]);
    } catch {
      const message =
        'Не удалось обратиться к локальной LLM. Запустите llama-server и проверьте VITE_LLM_API_URL.';
      setRequestError(message);
      setMessages((prev) => [...prev, { role: 'assistant', content: message }]);
    }
  });

  return (
    <Box className={styles.chatCard}>
      <Typography variant="h3">AI-консультант по использованию сайта</Typography>
      <Typography variant="body2" color="text.secondary">
        Ассистент отвечает на вопросы по функциям платформы и сценариям работы в системе.
      </Typography>

      {requestError && <Alert severity="warning">{requestError}</Alert>}

      <Box className={styles.messages}>
        {messages.map((item, index) => (
          <Box
            key={`${item.role}-${index}`}
            className={`${styles.message} ${item.role === 'assistant' ? styles.assistant : styles.user}`}
          >
            <Typography variant="body2">{item.content}</Typography>
          </Box>
        ))}
      </Box>

      <Stack component="form" direction={{ xs: 'column', sm: 'row' }} spacing={1} onSubmit={onSubmit}>
        <Controller
          name="text"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              placeholder="Например: как сравнить две даты одного продукта?"
              fullWidth
              size="small"
              error={Boolean(errors.text)}
              helperText={errors.text?.message}
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          endIcon={isSubmitting ? <CircularProgress size={14} color="inherit" /> : <SendIcon />}
          disabled={!canSend}
        >
          Отправить
        </Button>
      </Stack>

      <Typography className={styles.footerNote}>
        Языковая модель дает рекомендации и может ошибаться. ФИЦ ИВТ не несет ответственности за ее ответы.
      </Typography>
    </Box>
  );
};
