import { inject, Service } from '@angular/core';
import {
  FieldGroupDefinition,
  FieldGroupType,
  FieldType,
  FieldTypeDefinition,
} from '../models/field';
import {
  BUTTON_FIELD_DEFINITION,
  CHECKBOX_FIELD_DEFINITION,
  DATE_PICKER_FIELD_DEFINITION,
  EMAIL_FIELD_DEFINITION,
  FILEUPLOAD_FIELD_DEFINITION,
  NUMBER_FIELD_DEFINITION,
  OTP_FIELD_DEFINITION,
  PASSWORD_FIELD_DEFINITION,
  RADIO_GROUP_FIELD_DEFINITION,
  RESET_FIELD_DEFINITION,
  SELECT_FIELD_DEFINITION,
  SUBMIT_FIELD_DEFINITION,
  SWITCH_FIELD_DEFINITION,
  TELEPHONE_FIELD_DEFINITION,
  TEXT_BLOCK_FIELD_DEFINITION,
  TEXT_FIELD_DEFINITION,
  TEXTAREA_FIELD_DEFINITION,
  URL_FIELD_DEFINITION,
} from '../models/field-definition';
import { FIELD_PLUGIN_TOKEN, FieldPlugin } from '../models/field-plugin.token';

const INPUT_FIELDS_GROUP: FieldGroupDefinition = {
  label: 'Input Fields',
  type: 'input',
  fieldTypeDefinitions: new Map([
    ['text', TEXT_FIELD_DEFINITION],
    ['textarea', TEXTAREA_FIELD_DEFINITION],
    ['number', NUMBER_FIELD_DEFINITION],
    ['email', EMAIL_FIELD_DEFINITION],
    ['password', PASSWORD_FIELD_DEFINITION],
    ['file', FILEUPLOAD_FIELD_DEFINITION],
    ['tel', TELEPHONE_FIELD_DEFINITION],
    ['url', URL_FIELD_DEFINITION],
    ['otp', OTP_FIELD_DEFINITION],
  ]),
};

const SELECTION_FIELDS_GROUP: FieldGroupDefinition = {
  label: 'Selection Fields',
  type: 'selection',
  fieldTypeDefinitions: new Map([
    ['checkbox', CHECKBOX_FIELD_DEFINITION],
    ['select', SELECT_FIELD_DEFINITION],
    ['radio', RADIO_GROUP_FIELD_DEFINITION],
    ['switch', SWITCH_FIELD_DEFINITION],
  ]),
};

const DATETIME_FIELDS_GROUP: FieldGroupDefinition = {
  label: 'Date & Time',
  type: 'datetime',
  fieldTypeDefinitions: new Map([['date', DATE_PICKER_FIELD_DEFINITION]]),
};

const BUTTON_FIELDS_GROUP: FieldGroupDefinition = {
  label: 'Buttons',
  type: 'button',
  fieldTypeDefinitions: new Map([
    ['button', BUTTON_FIELD_DEFINITION],
    ['submit', SUBMIT_FIELD_DEFINITION],
    ['reset', RESET_FIELD_DEFINITION],
  ]),
};

const TYPOGRAPHY_FIELDS_GROUP: FieldGroupDefinition = {
  label: 'Typography',
  type: 'typography',
  fieldTypeDefinitions: new Map([['text-block', TEXT_BLOCK_FIELD_DEFINITION]]),
};

// plugins add types to groups, so each service needs its own copy; sharing the
// module-level groups would leak plugins into every later instance
function cloneGroup(group: FieldGroupDefinition): FieldGroupDefinition {
  return {
    ...group,
    fieldTypeDefinitions: new Map(group.fieldTypeDefinitions),
  };
}

@Service()
export class FieldTypesService {
  fieldGroups = new Map<FieldGroupType, FieldGroupDefinition>([
    ['typography', cloneGroup(TYPOGRAPHY_FIELDS_GROUP)],
    ['input', cloneGroup(INPUT_FIELDS_GROUP)],
    ['selection', cloneGroup(SELECTION_FIELDS_GROUP)],
    ['datetime', cloneGroup(DATETIME_FIELDS_GROUP)],
    ['button', cloneGroup(BUTTON_FIELDS_GROUP)],
  ]);

  fieldTypes = new Map<FieldType, FieldTypeDefinition>([
    ['text-block', TEXT_BLOCK_FIELD_DEFINITION],
    ['text', TEXT_FIELD_DEFINITION],
    ['textarea', TEXTAREA_FIELD_DEFINITION],
    ['number', NUMBER_FIELD_DEFINITION],
    ['email', EMAIL_FIELD_DEFINITION],
    ['password', PASSWORD_FIELD_DEFINITION],
    ['file', FILEUPLOAD_FIELD_DEFINITION],
    ['tel', TELEPHONE_FIELD_DEFINITION],
    ['url', URL_FIELD_DEFINITION],
    ['otp', OTP_FIELD_DEFINITION],
    ['checkbox', CHECKBOX_FIELD_DEFINITION],
    ['select', SELECT_FIELD_DEFINITION],
    ['radio', RADIO_GROUP_FIELD_DEFINITION],
    ['switch', SWITCH_FIELD_DEFINITION],
    ['date', DATE_PICKER_FIELD_DEFINITION],
    ['button', BUTTON_FIELD_DEFINITION],
    ['submit', SUBMIT_FIELD_DEFINITION],
    ['reset', RESET_FIELD_DEFINITION],
  ]);

  constructor() {
    const plugins: FieldPlugin[] =
      inject(FIELD_PLUGIN_TOKEN, { optional: true }) ?? [];
    for (const plugin of plugins) {
      this.fieldTypes.set(plugin.type, plugin.definition);
      if (this.fieldGroups.has(plugin.group)) {
        this.fieldGroups
          .get(plugin.group)!
          .fieldTypeDefinitions.set(plugin.type, plugin.definition);
      } else {
        this.fieldGroups.set(plugin.group, {
          type: plugin.group,
          label: plugin.groupLabel ?? plugin.group,
          fieldTypeDefinitions: new Map([[plugin.type, plugin.definition]]),
        });
      }
    }
  }

  getFieldGroupType(type: FieldGroupType): FieldGroupDefinition | undefined {
    return this.fieldGroups.get(type);
  }

  getFieldType(type: FieldType): FieldTypeDefinition | undefined {
    return this.fieldTypes.get(type);
  }

  getAllFieldGroupTypes(): FieldGroupDefinition[] {
    return Array.from(this.fieldGroups.values());
  }

  getAllFieldTypes(): FieldTypeDefinition[] {
    return Array.from(this.fieldTypes.values());
  }
}
