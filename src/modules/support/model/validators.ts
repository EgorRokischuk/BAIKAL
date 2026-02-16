import { z } from 'zod';

export const supportSchema = z.object({
  subject: z.string().min(1, 'Required field'),
  description: z.string().min(1, 'Required field'),
  email: z.union([z.literal(''), z.string().email('Invalid email')]),
  file: z.instanceof(File).optional(),
});
