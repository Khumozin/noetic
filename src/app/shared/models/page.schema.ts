import { z } from 'zod';

export const pageTypeSchema = z.enum(['form', 'table', 'custom']);

export type PageType = z.infer<typeof pageTypeSchema>;

export const appPageSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  type: pageTypeSchema,
  title: z.string(),
});

export type AppPage = z.infer<typeof appPageSchema>;

const requiredText = (message: string) => z.string().trim().min(1, message);

/** Rules for editing a page (used by the page detail form). Everything but `id`. */
export const pageMetadataSchema = appPageSchema.omit({ id: true }).extend({
  name: requiredText('Enter a page name.'),
  slug: requiredText('Enter a slug.').pipe(
    z
      .string()
      .regex(
        /^[a-z0-9]+(-[a-z0-9]+)*$/,
        'Use lowercase letters, numbers and hyphens only.',
      ),
  ),
});

export type PageMetadata = z.infer<typeof pageMetadataSchema>;

/**
 * Shape check for pages loaded from storage. An unknown `type` falls back to
 * `custom`, and a missing `title` (saved before it was required) defaults to
 * `''`, so the page is kept rather than the whole app being discarded.
 */
export const storedPageSchema = appPageSchema.extend({
  type: pageTypeSchema.catch('custom'),
  title: z.string().default(''),
});
