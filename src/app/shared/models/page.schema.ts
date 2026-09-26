import { z } from 'zod';

export const pageTypeSchema = z.enum(['form', 'table', 'custom']);

export type PageType = z.infer<typeof pageTypeSchema>;

export const appPageSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  type: pageTypeSchema,
  title: z.string().optional(),
});

export type AppPage = z.infer<typeof appPageSchema>;

/**
 * Shape check for pages loaded from storage. An unknown `type` falls back to
 * `custom` so the page is kept rather than the whole app being discarded.
 */
export const storedPageSchema = appPageSchema.extend({
  type: pageTypeSchema.catch('custom'),
});
