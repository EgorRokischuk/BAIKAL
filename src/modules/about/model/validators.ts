import { z } from 'zod';

export const aboutRecordSchema = z.object({
  title: z.string().min(1, 'Required field'),
  description: z.string().min(1, 'Required field'),
});

export const aboutRecordUpdateSchema = aboutRecordSchema.extend({
  id: z.string().min(1, 'Required field'),
});
