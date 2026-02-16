import { z } from 'zod';

export const loginSchema = z.object({
  login: z.string().min(1, 'Введите логин'),
  password: z.string().min(1, 'Введите пароль'),
});

export const registerSchema = z
  .object({
    fullname: z
      .string()
      .min(3, 'Укажите ФИО')
      .max(120, 'Слишком длинное ФИО'),
    email: z.string().min(1, 'Введите e-mail').email('Некорректный e-mail'),
    login: z
      .string()
      .min(3, 'Логин должен быть не короче 3 символов')
      .max(32, 'Логин слишком длинный'),
    phoneNumber: z
      .string()
      .min(1, 'Введите телефон')
      .refine((value) => value.replace(/\D/g, '').length === 11, 'Телефон должен содержать 11 цифр'),
    password: z.string().min(4, 'Пароль должен быть не короче 4 символов'),
    passwordAgain: z.string().min(1, 'Повторите пароль'),
  })
  .refine((values) => values.password === values.passwordAgain, {
    path: ['passwordAgain'],
    message: 'Пароли не совпадают',
  });

export const profileUpdateSchema = z
  .object({
    fullname: z.string().min(3, 'Укажите ФИО').max(120, 'Слишком длинное ФИО'),
    username: z.string().min(3, 'Логин должен быть не короче 3 символов').max(32, 'Логин слишком длинный'),
    email: z.string().min(1, 'Введите e-mail').email('Некорректный e-mail'),
    phoneNumber: z
      .string()
      .min(1, 'Введите телефон')
      .refine((value) => value.replace(/\D/g, '').length === 11, 'Телефон должен содержать 11 цифр'),
    password: z.string().optional(),
    passwordAgain: z.string().optional(),
  })
  .refine(
    (values) => {
      const password = (values.password || '').trim();
      const passwordAgain = (values.passwordAgain || '').trim();

      if (!password && !passwordAgain) {
        return true;
      }

      return password.length >= 4 && password === passwordAgain;
    },
    {
      path: ['passwordAgain'],
      message: 'Пароль должен быть не короче 4 символов и совпадать в обоих полях',
    },
  );

export const forgotEmailSchema = z.object({
  email: z.string().email('Некорректный e-mail'),
});

export const forgotPasswordSchema = z
  .object({
    password: z.string().min(8, 'Минимальная длина пароля 8 символов'),
    passwordAgain: z.string().min(8, 'Повторите пароль'),
  })
  .refine((values) => values.password === values.passwordAgain, {
    path: ['passwordAgain'],
    message: 'Пароли не совпадают',
  });
