import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { persistedSignal } from './persisted-signal';

const KEY = 'test-key';

function createMemoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: key => data.get(key) ?? null,
    key: index => [...data.keys()][index] ?? null,
    removeItem: key => void data.delete(key),
    setItem: (key, value) => void data.set(key, String(value)),
  };
}

const isNumber = (v: unknown): v is number => typeof v === 'number';

describe('persistedSignal', () => {
  function create<T>(options: Parameters<typeof persistedSignal<T>>[1]) {
    return TestBed.runInInjectionContext(() =>
      persistedSignal<T>(KEY, options),
    );
  }

  beforeEach(() => {
    vi.stubGlobal('localStorage', createMemoryStorage());
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should use fallback when storage is empty', () => {
    const state = create<number>({ fallback: () => 5 });

    expect(state()).toBe(5);
  });

  it('should load stored value', () => {
    localStorage.setItem(KEY, '42');

    const state = create<number>({ fallback: () => 0, isValid: isNumber });

    expect(state()).toBe(42);
  });

  it('should use fallback when stored value is invalid JSON', () => {
    localStorage.setItem(KEY, '{nope');

    const state = create<number>({ fallback: () => 7 });

    expect(state()).toBe(7);
  });

  it('should use fallback when stored value fails validation', () => {
    localStorage.setItem(KEY, '"text"');

    const state = create<number>({ fallback: () => 7, isValid: isNumber });

    expect(state()).toBe(7);
  });

  it('should write changes to storage', () => {
    const state = create<number>({ fallback: () => 1 });
    TestBed.tick();
    expect(localStorage.getItem(KEY)).toBe('1');

    state.set(2);
    TestBed.tick();

    expect(localStorage.getItem(KEY)).toBe('2');
  });

  it('should honour custom serialize and deserialize', () => {
    localStorage.setItem(KEY, 'plain');

    const state = create<string>({
      fallback: () => '',
      serialize: v => v,
      deserialize: raw => raw,
    });
    expect(state()).toBe('plain');

    state.set('changed');
    TestBed.tick();

    expect(localStorage.getItem(KEY)).toBe('changed');
  });

  it('should keep in-memory state when storage throws', () => {
    vi.stubGlobal('localStorage', {
      ...createMemoryStorage(),
      setItem: () => {
        throw new Error('quota');
      },
    });
    const state = create<number>({ fallback: () => 1 });

    expect(() => {
      state.set(2);
      TestBed.tick();
    }).not.toThrow();
    expect(state()).toBe(2);
  });

  it('should fall back when storage is unavailable', () => {
    vi.stubGlobal('localStorage', undefined);

    const state = create<number>({ fallback: () => 3 });

    expect(state()).toBe(3);
  });
});
