import { appMetadataSchema, storedAppsSchema } from './app.schema';

const valid = {
  name: 'Shop',
  slug: 'shop',
  description: '',
  version: '1.0.0',
  prefix: 'app',
};

function messages(input: Partial<Record<keyof typeof valid, string>>) {
  const result = appMetadataSchema.safeParse({ ...valid, ...input });
  return result.success ? [] : result.error.issues.map(i => i.message);
}

describe('appMetadataSchema', () => {
  it('should accept valid metadata', () => {
    expect(appMetadataSchema.safeParse(valid).success).toBe(true);
  });

  it('should trim the name', () => {
    expect(appMetadataSchema.parse({ ...valid, name: '  Shop ' }).name).toBe(
      'Shop',
    );
  });

  it.each(['', '   '])('should reject blank name %j', name => {
    expect(messages({ name })).toEqual(['Enter an app name.']);
  });

  it('should report only the required message for an empty slug', () => {
    expect(messages({ slug: '' })).toEqual(['Enter a slug.']);
  });

  it.each(['Not Valid', 'UPPER', 'a--b', '-a', 'a-', 'a_b', 'shop!'])(
    'should reject slug %j',
    slug => {
      expect(messages({ slug })).toEqual([
        'Use lowercase letters, numbers and hyphens only.',
      ]);
    },
  );

  it.each(['shop', 'my-shop', 'shop2', '2fast'])(
    'should accept slug %j',
    slug => {
      expect(messages({ slug })).toEqual([]);
    },
  );

  it.each(['1.0', 'abc', 'v1.0.0', '1.0.0.0'])(
    'should reject version %j',
    version => {
      expect(messages({ version })).toEqual([
        'Use a semantic version, e.g. 1.0.0.',
      ]);
    },
  );

  it.each(['0.0.1', '1.2.3', '2.0.0-beta.1'])(
    'should accept version %j',
    version => {
      expect(messages({ version })).toEqual([]);
    },
  );

  it.each(['1app', 'App', 'a_b', '-a'])('should reject prefix %j', prefix => {
    expect(messages({ prefix })).toHaveLength(1);
  });

  it('should reject reserved prefix ng', () => {
    expect(messages({ prefix: 'ng' })).toEqual(["'ng' is reserved."]);
  });

  it.each(['app', 'shop', 'my-shop', 'ng2'])(
    'should accept prefix %j',
    prefix => {
      expect(messages({ prefix })).toEqual([]);
    },
  );
});

describe('storedAppsSchema', () => {
  const stored = (metadata: Record<string, unknown>) => [
    { id: 'a', homePageId: null, metadata },
  ];

  it('should default description for older saves', () => {
    const result = storedAppsSchema.parse(
      stored({ name: 'A', slug: 'a', prefix: 'app', version: '1.0.0' }),
    );

    expect(result[0].metadata.description).toBe('');
  });

  it('should not reject values the editing rules would refuse', () => {
    const result = storedAppsSchema.safeParse(
      stored({
        name: 'My App!',
        slug: 'my-app!',
        description: '',
        prefix: 'App',
        version: 'x',
      }),
    );

    expect(result.success).toBe(true);
  });

  it.each([[[]], [{}], [[{ foo: 1 }]], ['text']])(
    'should reject bad shape %j',
    value => {
      expect(storedAppsSchema.safeParse(value).success).toBe(false);
    },
  );
});
