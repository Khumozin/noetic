import { effect, signal, WritableSignal } from '@angular/core';

export interface PersistedSignalOptions<T> {
  /** Value used when storage is empty, unreadable or fails validation. */
  fallback: () => T;
  /** Rejects stored values with the wrong shape. Defaults to accepting anything. */
  isValid?: (value: unknown) => value is T;
  /** Defaults to `JSON.stringify`. */
  serialize?: (value: T) => string;
  /** Defaults to `JSON.parse`. */
  deserialize?: (raw: string) => unknown;
}

/**
 * Creates a writable signal backed by `localStorage`.
 * Must be called in an injection context (it registers an effect).
 */
export function persistedSignal<T>(
  key: string,
  options: PersistedSignalOptions<T>,
): WritableSignal<T> {
  const { serialize = JSON.stringify, deserialize = JSON.parse } = options;
  const state = signal<T>(
    read(key, options.fallback, options.isValid, deserialize),
  );

  effect(() => {
    const value = state();
    try {
      localStorage.setItem(key, serialize(value));
    } catch {
      // storage unavailable or full; keep in-memory state
    }
  });

  return state;
}

function read<T>(
  key: string,
  fallback: () => T,
  isValid: PersistedSignalOptions<T>['isValid'],
  deserialize: (raw: string) => unknown,
): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      const parsed = deserialize(raw);
      if (!isValid || isValid(parsed)) return parsed as T;
    }
  } catch {
    // fall through to fallback
  }
  return fallback();
}
