import { z } from 'zod';

export const publicationSchema = z.object({
  title: z.string().min(1, 'Required field'),
  description: z.string().min(1, 'Required field'),
  authors: z.string().min(1, 'Required field'),
  url: z.string().min(1, 'Required field').url('Invalid URL'),
});

export const publicationUpdateSchema = publicationSchema.extend({
  id: z.number().int().nonnegative(),
});
