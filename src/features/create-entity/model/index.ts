import { z } from 'zod';
import type { IAboutRecordRequest } from '@/entities/AboutRecord';
import type { IExternalResourceRequest } from '@/entities/ExternalResource';

export const externalResourceSchema = z
	.object({
		title: z.string().min(1, { message: 'Обязательное поле' }),
		link: z
			.string()
			.min(1, { message: 'Обязательное поле' })
			.url({ message: 'Некорректная ссылка' }),
	})
	.required();

export const externalResourceDefaultValue: IExternalResourceRequest = {
	title: '',
	link: '',
	image: new File([], 'test'),
};

export const aboutRecordSchema = z
	.object({
		title: z.string().min(1, { message: 'Обязательное поле' }),
		description: z.string().min(1, { message: 'Обязательное поле' }),
	})
	.required();

export const aboutRecordDefaultValue: IAboutRecordRequest = {
	title: '',
	description: '',
};
