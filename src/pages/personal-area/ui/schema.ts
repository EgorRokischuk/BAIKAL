
import { z } from 'zod';

export const profileSchema = z.object({
        fullname: z.string().min(1, 'Укажите ФИО'),
        phoneNumber: z.string().optional(),
        username: z.string().min(1, 'Укажите логин'),
        email: z.string().email('Укажите корректный email'),
});