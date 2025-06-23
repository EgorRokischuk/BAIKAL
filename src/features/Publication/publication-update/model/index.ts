import { z } from 'zod';

export const publicationEditSchema = z
	.object({
		id: z.string(),
		title: z.string().min(1, { message: 'Обязательное поле' }),
		description: z.string().min(1, { message: 'Обязательное поле' }),
		authors: z
			.string()
			.min(1, { message: 'Обязательное поле' })
			.regex(/^((, )?([А-ЯA-Z]\. ){2}[А-яA-z]+){1,5}$/, { message: 'Неверный формат' }),
	})
	.required();
