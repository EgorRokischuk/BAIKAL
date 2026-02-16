import { z } from 'zod';

export const externalResourceSchema = z.object({
  title: z.string().min(1, 'Required field'),
  link: z.string().min(1, 'Required field').url('Invalid URL'),
  image: z.instanceof(File).optional(),
});

export const externalResourceUpdateSchema = z.object({
  id: z.string().min(1, 'Required field'),
  title: z.string().min(1, 'Required field'),
  link: z.string().min(1, 'Required field').url('Invalid URL'),
  imageUrl: z.string().min(1, 'Required field'),
});
