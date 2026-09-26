import { InjectionToken } from '@angular/core';

import { FieldGroupType, FieldTypeDefinition } from '../models/field';

/**
 * Describes a single custom field type registration.
 * Provide via FIELD_PLUGIN_TOKEN or the provideFieldPlugin() helper.
 */
export interface FieldPlugin {
  /**
   * Unique type key for this field.
   * Recommended convention: 'namespace:field-name' (e.g. 'acme:star-rating')
   * to avoid collisions with built-in types.
   */
  type: string;

  /**
   * Which palette group to add this field to.
   * Use an existing BuiltInFieldGroupType ('input', 'selection', 'datetime', 'button', 'typography')
   * to merge into a core group, or provide a new string key to create a new palette section.
   */
  group: FieldGroupType;

  /**
   * Label shown as the palette section header when `group` is a new key.
   * Ignored when joining an existing built-in group.
   */
  groupLabel?: string;

  /** Full field type definition including component, defaultConfig, and settingsConfig. */
  definition: FieldTypeDefinition;
}

/**
 * Multi-provider token for registering custom field plugins.
 *
 * @example
 * // in app.config.ts
 * providers: [
 *   { provide: FIELD_PLUGIN_TOKEN, useValue: myPlugin, multi: true }
 * ]
 */
export const FIELD_PLUGIN_TOKEN = new InjectionToken<FieldPlugin[]>(
  'FIELD_PLUGIN_TOKEN',
);

/**
 * Convenience factory that returns an Angular provider for a field plugin.
 *
 * @example
 * providers: [provideFieldPlugin(MY_PLUGIN)]
 */
export function provideFieldPlugin(plugin: FieldPlugin) {
  return { provide: FIELD_PLUGIN_TOKEN, useValue: plugin, multi: true };
}
