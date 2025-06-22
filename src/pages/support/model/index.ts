import { z } from 'zod';
import { ISupportTicketRequest } from '@/entities/SupportTicket';

export const supportTicketSchema = z.object({
	subject: z.string().min(1, { message: 'Обязательное поле' }),
	description: z.string().min(1, { message: 'Обязательное поле' }),
	email: z.union([z.literal(''), z.string().email({ message: 'Некорректный email' })]),
});

export const defaultValues: ISupportTicketRequest = {
	subject: '',
	description: '',
	email: '',
	file: new File([], 'empty'),
};
