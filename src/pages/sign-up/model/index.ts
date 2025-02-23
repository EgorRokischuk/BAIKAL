import { z } from 'zod';
import { IRegister } from '@/entities/User';

export const registerSchema = z
	.object({
		fullname: z.string().min(1, { message: 'Обязательное поле' }),
		email: z
			.string()
			.min(1, { message: 'Обязательное поле' })
			.email({ message: 'Некорректный email' }),
		workplace: z.string().min(1, { message: 'Обязательное поле' }),
		login: z.string().min(1, { message: 'Обязательное поле' }),
		password: z
			.string()
			.min(8, { message: 'Длина пароля не должна составлять менее 8 символов' })
			.regex(/[0-9]/, { message: 'Пароль должен содержать хотя бы одну цифру' })
			.regex(/[A-Z]/, { message: 'Пароль должен содержать хотя бы одну заглавную букву' })
			.regex(/[a-z]/, { message: 'Пароль должен содержать хотя бы одну строчную букву' }),
		passwordAgain: z.string().min(1, { message: 'Обязательное поле' }),
	})
	.required();

export const defaultValues: IRegister = {
	fullname: '',
	email: '',
	workplace: '',
	login: '',
	password: '',
	passwordAgain: '',
};
