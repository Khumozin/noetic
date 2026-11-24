/**
 * The breakpoints a responsive field setting can vary across.
 * There is no viewport switcher in the canvas yet, so callers default to 'lg'.
 */
export type ViewportSize = 'sm' | 'md' | 'lg';

/** Type guard for a responsive object with sm, md, lg keys. */
export function isResponsiveValue<T>(
  value: unknown,
): value is { sm: T; md: T; lg: T } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'sm' in value &&
    'md' in value &&
    'lg' in value
  );
}

/**
 * Resolves a potentially responsive value for one viewport.
 * A plain (non-responsive) value is returned as-is; `undefined` falls back
 * to `defaultValue`.
 */
export function getValueForViewport<T>(
  value: T | { sm: T; md: T; lg: T } | undefined,
  viewport: ViewportSize,
  defaultValue: T,
): T {
  if (value === undefined) return defaultValue;
  if (isResponsiveValue<T>(value)) return value[viewport];
  return value;
}
