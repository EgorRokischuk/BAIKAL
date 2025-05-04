import { z } from 'zod';

export const aboutRecordEditSchema = z
	.object({
		id: z.string(),
		title: z.string().min(1, { message: 'Обязательное поле' }),
		description: z.string().min(1, { message: 'Обязательное поле' }),
	})
	.required();
