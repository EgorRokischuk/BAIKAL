import { z } from 'zod';

export const loginSchema = z
	.object({
		login: z.string().min(1, { message: 'Обязательное поле' }),
		password: z.string().min(1, { message: 'Обязательное поле' }),
	})
	.required();

export const defaultValues = { login: '', password: '' };
