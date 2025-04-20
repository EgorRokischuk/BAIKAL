import { z } from 'zod';
import { IExternalResourceRequest } from '@/entities/ExternalResource';

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
