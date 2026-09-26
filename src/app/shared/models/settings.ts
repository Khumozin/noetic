import {
  FieldGroupSettingsDefinition,
  FieldSettingsDefinition,
} from '../models/field';

export const FORM_CONTROL_NAME_SETTINGS: FieldSettingsDefinition = {
  type: 'text',
  key: 'fieldName',
  label: 'Field Name',
};

export const DATA_OPTIONS_SETTINGS: FieldGroupSettingsDefinition[] = [
  {
    label: 'Data Options',
    key: 'data-options',
    settings: [
      { type: 'dynamic-options', key: 'options', label: 'Select Options' },
    ],
  },
];

export const INPUT_SETTINGS: FieldGroupSettingsDefinition[] = [
  {
    label: 'Input',
    key: 'input',
    settings: [
      {
        type: 'text',
        key: 'placeholder',
        label: 'Placeholder',
      },
      FORM_CONTROL_NAME_SETTINGS,
      {
        type: 'text',
        key: 'hint',
        label: 'Hint',
      },
      {
        type: 'select',
        key: 'inputType',
        label: 'Input Type',
        options: [
          {
            value: 'text',
            label: 'Text',
          },
          {
            value: 'number',
            label: 'Number',
          },
          {
            value: 'email',
            label: 'Email',
          },
          {
            value: 'tel',
            label: 'Phone',
          },
          {
            value: 'file',
            label: 'File',
          },
          {
            value: 'password',
            label: 'Password',
          },
          {
            value: 'url',
            label: 'URL',
          },
        ],
      },
    ],
  },
];

export const TEXTAREA_SETTINGS: FieldGroupSettingsDefinition[] = [
  {
    label: 'Input',
    key: 'input',
    settings: [
      {
        type: 'text',
        key: 'placeholder',
        label: 'Placeholder',
      },
      FORM_CONTROL_NAME_SETTINGS,
      {
        type: 'text',
        key: 'hint',
        label: 'Hint',
      },
    ],
  },
];

export const LABEL_SETTINGS: FieldGroupSettingsDefinition[] = [
  {
    label: 'Label & Description',
    key: 'label',
    settings: [
      {
        type: 'toggle',
        key: 'showLabel',
        label: 'Show Label',
        responsive: true,
        options: [
          {
            label: 'yes',
            value: true,
          },
          {
            label: 'no',
            value: false,
          },
        ],
      },
      {
        type: 'text',
        key: 'label',
        label: 'Label',
      },
      {
        type: 'select',
        key: 'labelPosition',
        label: 'Position',
        responsive: true,
        options: [
          {
            label: 'Top',
            value: 'top',
          },
          {
            label: 'Left',
            value: 'left',
          },
          {
            label: 'Right',
            value: 'right',
          },
        ],
      },
      {
        type: 'toggle',
        key: 'labelAlignment',
        label: 'Alignment',
        responsive: true,
        options: [
          {
            icon: 'lucideAlignLeft',
            value: 'alignLeft',
          },
          {
            icon: 'lucideAlignCenter',
            value: 'alignCenter',
          },
          {
            icon: 'lucideAlignRight',
            value: 'alignRight',
          },
        ],
      },
    ],
  },
];

export const APPEARANCE_SETTINGS: FieldGroupSettingsDefinition[] = [
  {
    label: 'Appearance',
    key: 'appearance',
    settings: [
      {
        type: 'toggle',
        key: 'visible',
        label: 'Visible',
        responsive: true,
        options: [
          {
            label: 'yes',
            value: true,
          },
          {
            label: 'no',
            value: false,
          },
        ],
      },
      {
        type: 'select',
        key: 'columnSpan',
        label: 'Column Span',
        responsive: true,
        options: [
          {
            label: '1',
            value: 'col-span-1',
          },
          {
            label: '2',
            value: 'col-span-2',
          },
          {
            label: '3',
            value: 'col-span-3',
          },
          {
            label: '4',
            value: 'col-span-4',
          },
          {
            label: '5',
            value: 'col-span-5',
          },
          {
            label: '6',
            value: 'col-span-6',
          },
          {
            label: '7',
            value: 'col-span-7',
          },
          {
            label: '8',
            value: 'col-span-8',
          },
          {
            label: '9',
            value: 'col-span-9',
          },
          {
            label: '10',
            value: 'col-span-10',
          },
          {
            label: '11',
            value: 'col-span-11',
          },
          {
            label: '12',
            value: 'col-span-12',
          },
        ],
      },
      {
        type: 'select',
        key: 'columnStart',
        label: 'Column Start',
        responsive: true,
        options: [
          { label: 'Auto', value: 'col-start-auto' },
          {
            label: '1',
            value: 'col-start-1',
          },
          {
            label: '2',
            value: 'col-start-2',
          },
          {
            label: '3',
            value: 'col-start-3',
          },
          {
            label: '4',
            value: 'col-start-4',
          },
          {
            label: '5',
            value: 'col-start-5',
          },
          {
            label: '6',
            value: 'col-start-6',
          },
          {
            label: '7',
            value: 'col-start-7',
          },
          {
            label: '8',
            value: 'col-start-8',
          },
          {
            label: '9',
            value: 'col-start-9',
          },
          {
            label: '10',
            value: 'col-start-10',
          },
          {
            label: '11',
            value: 'col-start-11',
          },
          {
            label: '12',
            value: 'col-start-12',
          },
        ],
      },
    ],
  },
];

export const VALIDATION_SETTINGS: FieldGroupSettingsDefinition[] = [
  {
    label: 'Validation',
    key: 'validation',
    settings: [
      {
        type: 'toggle',
        key: 'required',
        label: 'Required',
        options: [
          {
            label: 'yes',
            value: true,
          },
          {
            label: 'no',
            value: false,
          },
        ],
      },
      {
        type: 'text',
        key: 'requiredMessage',
        label: 'Required Message',
      },
      {
        type: 'dynamic-validations',
        key: 'validations',
        label: 'Validation Rules',
      },
    ],
  },
];

export const TEXT_VALIDATION_SETTINGS: FieldGroupSettingsDefinition[] = [
  {
    label: 'Validation',
    key: 'validation',
    settings: [
      {
        type: 'toggle',
        key: 'required',
        label: 'Required',
        options: [
          {
            label: 'yes',
            value: true,
          },
          {
            label: 'no',
            value: false,
          },
        ],
      },
      {
        type: 'text',
        key: 'requiredMessage',
        label: 'Required Message',
      },
      {
        type: 'number',
        key: 'minLength',
        label: 'Min Length',
      },
      {
        type: 'text',
        key: 'minLengthMessage',
        label: 'Min Length Message',
      },
      {
        type: 'number',
        key: 'maxLength',
        label: 'Max Length',
      },
      {
        type: 'text',
        key: 'maxLengthMessage',
        label: 'Max Length Message',
      },
      {
        type: 'dynamic-validations',
        key: 'validations',
        label: 'Validation Rules',
      },
    ],
  },
];

export const BUTTON_SETTINGS: FieldGroupSettingsDefinition[] = [
  {
    label: 'Buttons',
    key: 'button',
    settings: [
      {
        type: 'text',
        key: 'content',
        label: 'Content',
      },
      {
        type: 'select',
        key: 'type',
        label: 'Type',
        options: [
          {
            label: 'Button',
            value: 'button',
          },
          {
            label: 'Submit',
            value: 'submit',
          },
          {
            label: 'Reset',
            value: 'reset',
          },
        ],
      },
      {
        type: 'select',
        key: 'variant',
        label: 'Variant',
        options: [
          {
            label: 'Default',
            value: 'default',
          },
          {
            label: 'Outline',
            value: 'outline',
          },
          {
            label: 'Ghost',
            value: 'ghost',
          },
          {
            label: 'Link',
            value: 'link',
          },
        ],
      },
    ],
  },
];

export const OTP_SETTINGS: FieldGroupSettingsDefinition[] = [
  {
    label: 'OTP Configuration',
    key: 'input',
    settings: [
      {
        type: 'select',
        key: 'otpLength',
        label: 'Number of Digits',
        options: [
          { value: 4, label: '4' },
          { value: 6, label: '6' },
          { value: 8, label: '8' },
        ],
      },
      {
        type: 'select',
        key: 'otpInputMode',
        label: 'Input Mode',
        options: [
          { value: 'numeric', label: 'Numeric' },
          { value: 'text', label: 'Text' },
          { value: 'tel', label: 'Telephone' },
        ],
      },
      {
        type: 'select',
        key: 'otpSeparator',
        label: 'Separator Style',
        options: [
          { value: 'none', label: 'None' },
          { value: 'middle', label: 'Middle' },
          { value: 'every-3', label: 'Every 3 Digits' },
        ],
      },
    ],
  },
];

export const HTML_ATTRIBUTES_SETTINGS: FieldGroupSettingsDefinition[] = [
  {
    label: 'HTML Attributes',
    key: 'html-attributes',
    settings: [
      {
        type: 'text',
        key: 'id',
        label: 'ID',
      },
      {
        type: 'text',
        key: 'name',
        label: 'Name',
      },
    ],
  },
];
