import { z } from 'zod';
import { AppPage, storedPageSchema } from './page.schema';

const requiredText = (message: string) => z.string().trim().min(1, message);

/** Rules for editing app metadata (used by the settings form). */
export const appMetadataSchema = z.object({
  name: requiredText('Enter an app name.'),
  slug: requiredText('Enter a slug.').pipe(
    z
      .string()
      .regex(
        /^[a-z0-9]+(-[a-z0-9]+)*$/,
        'Use lowercase letters, numbers and hyphens only.',
      ),
  ),
  description: z.string(),
  version: requiredText('Enter a version.').pipe(
    z
      .string()
      .regex(
        /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/,
        'Use a semantic version, e.g. 1.0.0.',
      ),
  ),
  prefix: requiredText('Enter a prefix.').pipe(
    z
      .string()
      .regex(
        /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/,
        'Start with a letter; lowercase letters, numbers and hyphens only.',
      )
      // `ng` is reserved by Angular
      .refine(prefix => prefix !== 'ng', "'ng' is reserved."),
  ),
});

export type ApplicationMetadata = z.infer<typeof appMetadataSchema>;

export interface AngularApp {
  id: string;
  homePageId: string | null;
  metadata: ApplicationMetadata;
  pages: AppPage[];
}

/**
 * Shape check for apps loaded from storage. Deliberately lenient (plain
 * strings): a value that was once saved must never be discarded because the
 * editing rules got stricter. Fills in fields added since it was saved.
 */
export const storedAppsSchema = z
  .array(
    z.object({
      id: z.string(),
      homePageId: z.string().nullable(),
      metadata: z.object({
        name: z.string(),
        slug: z.string(),
        description: z.string().default(''),
        prefix: z.string(),
        version: z.string(),
      }),
      pages: z.array(storedPageSchema).default([]),
    }),
  )
  .min(1);
