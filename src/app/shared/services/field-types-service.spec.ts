import { TestBed } from '@angular/core/testing';
import { FieldTypeDefinition } from '../models/field';
import { provideFieldPlugin } from '../models/field-plugin.token';
import { FieldTypesService } from './field-types-service';

class StubComponent {}

function makeDefinition(type: string, label = type): FieldTypeDefinition {
  return {
    type,
    label,
    description: `${label} description`,
    icon: 'lucideBox',
    defaultConfig: { label },
    settingsConfig: [],
    component: StubComponent,
  };
}

const BUILT_IN_TYPES = [
  'text-block',
  'text',
  'textarea',
  'number',
  'email',
  'password',
  'file',
  'tel',
  'url',
  'otp',
  'checkbox',
  'select',
  'radio',
  'switch',
  'date',
  'button',
  'submit',
  'reset',
];

const BUILT_IN_GROUPS = [
  'typography',
  'input',
  'selection',
  'datetime',
  'button',
];

function createService(...plugins: ReturnType<typeof provideFieldPlugin>[]) {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({ providers: plugins });
  return TestBed.inject(FieldTypesService);
}

describe('FieldTypesService', () => {
  let service: FieldTypesService;

  beforeEach(() => {
    service = createService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('built-in field types', () => {
    it('should register every built-in type', () => {
      expect([...service.fieldTypes.keys()].sort()).toEqual(
        [...BUILT_IN_TYPES].sort(),
      );
    });

    it.each(BUILT_IN_TYPES)('should describe %s completely', type => {
      const definition = service.getFieldType(type)!;

      expect(definition.label).toBeTruthy();
      expect(definition.description).toBeTruthy();
      expect(definition.icon).toBeTruthy();
      expect(definition.component).toBeTruthy();
      expect(definition.defaultConfig).toBeTruthy();
      expect(Array.isArray(definition.settingsConfig)).toBe(true);
    });

    it('should return undefined for an unknown type', () => {
      expect(service.getFieldType('nope')).toBeUndefined();
    });

    it('should list all types', () => {
      expect(service.getAllFieldTypes()).toHaveLength(BUILT_IN_TYPES.length);
    });
  });

  describe('built-in field groups', () => {
    it('should register the groups in palette order', () => {
      expect([...service.fieldGroups.keys()]).toEqual(BUILT_IN_GROUPS);
    });

    it.each(BUILT_IN_GROUPS)('should key group %s by its own type', key => {
      const group = service.getFieldGroupType(key)!;

      expect(group.type).toBe(key);
      expect(group.label).toBeTruthy();
      expect(group.fieldTypeDefinitions.size).toBeGreaterThan(0);
    });

    it('should return undefined for an unknown group', () => {
      expect(service.getFieldGroupType('nope')).toBeUndefined();
    });

    it('should list all groups', () => {
      expect(service.getAllFieldGroupTypes().map(g => g.type)).toEqual(
        BUILT_IN_GROUPS,
      );
    });

    it('should place every type in exactly one group', () => {
      const grouped = service
        .getAllFieldGroupTypes()
        .flatMap(g => [...g.fieldTypeDefinitions.keys()]);

      expect([...grouped].sort()).toEqual([...BUILT_IN_TYPES].sort());
      expect(new Set(grouped).size).toBe(grouped.length);
    });

    it('should share definitions between groups and types', () => {
      for (const group of service.getAllFieldGroupTypes()) {
        for (const [type, definition] of group.fieldTypeDefinitions) {
          expect(service.getFieldType(type)).toBe(definition);
        }
      }
    });

    it('should group types sensibly', () => {
      const keys = (group: string) => [
        ...service.getFieldGroupType(group)!.fieldTypeDefinitions.keys(),
      ];

      expect(keys('button')).toEqual(['button', 'submit', 'reset']);
      expect(keys('datetime')).toEqual(['date']);
      expect(keys('typography')).toEqual(['text-block']);
      expect(keys('selection')).toEqual(
        expect.arrayContaining(['checkbox', 'select', 'radio', 'switch']),
      );
    });
  });

  describe('plugins', () => {
    it('should register a plugin type', () => {
      const definition = makeDefinition('acme:rating', 'Rating');

      service = createService(
        provideFieldPlugin({
          type: 'acme:rating',
          group: 'input',
          definition,
        }),
      );

      expect(service.getFieldType('acme:rating')).toBe(definition);
      expect(service.getAllFieldTypes()).toHaveLength(
        BUILT_IN_TYPES.length + 1,
      );
    });

    it('should merge into an existing group', () => {
      const definition = makeDefinition('acme:rating');

      service = createService(
        provideFieldPlugin({
          type: 'acme:rating',
          group: 'input',
          definition,
        }),
      );

      const input = service.getFieldGroupType('input')!;
      expect(input.fieldTypeDefinitions.get('acme:rating')).toBe(definition);
      expect(input.label).toBe('Input Fields');
      expect(service.getAllFieldGroupTypes()).toHaveLength(
        BUILT_IN_GROUPS.length,
      );
    });

    it('should create a new group using groupLabel', () => {
      const definition = makeDefinition('acme:chart');

      service = createService(
        provideFieldPlugin({
          type: 'acme:chart',
          group: 'acme-charts',
          groupLabel: 'Charts',
          definition,
        }),
      );

      const group = service.getFieldGroupType('acme-charts')!;
      expect(group.type).toBe('acme-charts');
      expect(group.label).toBe('Charts');
      expect(group.fieldTypeDefinitions.get('acme:chart')).toBe(definition);
      expect(service.getAllFieldGroupTypes().at(-1)).toBe(group);
    });

    it('should fall back to the group key as label', () => {
      service = createService(
        provideFieldPlugin({
          type: 'acme:chart',
          group: 'acme-charts',
          definition: makeDefinition('acme:chart'),
        }),
      );

      expect(service.getFieldGroupType('acme-charts')!.label).toBe(
        'acme-charts',
      );
    });

    it('should put several plugins in the same new group', () => {
      service = createService(
        provideFieldPlugin({
          type: 'acme:a',
          group: 'acme',
          groupLabel: 'Acme',
          definition: makeDefinition('acme:a'),
        }),
        provideFieldPlugin({
          type: 'acme:b',
          group: 'acme',
          definition: makeDefinition('acme:b'),
        }),
      );

      const group = service.getFieldGroupType('acme')!;
      expect([...group.fieldTypeDefinitions.keys()]).toEqual([
        'acme:a',
        'acme:b',
      ]);
      expect(group.label).toBe('Acme');
    });

    it('should let a plugin replace a built-in type', () => {
      const definition = makeDefinition('text', 'Custom Text');

      service = createService(
        provideFieldPlugin({ type: 'text', group: 'input', definition }),
      );

      expect(service.getFieldType('text')).toBe(definition);
      expect(
        service.getFieldGroupType('input')!.fieldTypeDefinitions.get('text'),
      ).toBe(definition);
      expect(service.getAllFieldTypes()).toHaveLength(BUILT_IN_TYPES.length);
    });

    it('should not leak plugins into services created later', () => {
      createService(
        provideFieldPlugin({
          type: 'acme:leak',
          group: 'input',
          definition: makeDefinition('acme:leak'),
        }),
      );

      const fresh = createService();

      expect(fresh.getFieldType('acme:leak')).toBeUndefined();
      expect(
        fresh.getFieldGroupType('input')!.fieldTypeDefinitions.has('acme:leak'),
      ).toBe(false);
    });

    it('should not leak a replaced built-in type into later services', () => {
      createService(
        provideFieldPlugin({
          type: 'text',
          group: 'input',
          definition: makeDefinition('text', 'Custom Text'),
        }),
      );

      const fresh = createService();

      expect(fresh.getFieldType('text')!.label).not.toBe('Custom Text');
      expect(
        fresh.getFieldGroupType('input')!.fieldTypeDefinitions.get('text')!
          .label,
      ).not.toBe('Custom Text');
    });
  });
});
