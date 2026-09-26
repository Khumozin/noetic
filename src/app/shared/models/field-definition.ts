import { FieldTypeDefinition } from '../models/field';
import { ButtonField } from '../ui/button-field/button-field';
import { CheckboxField } from '../ui/checkbox-field/checkbox-field';
import { DatePickerField } from '../ui/date-picker-field/date-picker-field';
import { OtpField } from '../ui/otp-field/otp-field';
import { RadioGroupField } from '../ui/radio-group-field/radio-group-field';
import { SelectField } from '../ui/select-field/select-field';
import { SwitchField } from '../ui/switch-field/switch-field';
import { TextAreaField } from '../ui/text-area-field/text-area-field';
import { TextBlockField } from '../ui/text-block-field/text-block-field';
import { TextField } from '../ui/text-field/text-field';
import {
  APPEARANCE_SETTINGS,
  BUTTON_SETTINGS,
  DATA_OPTIONS_SETTINGS,
  FORM_CONTROL_NAME_SETTINGS,
  HTML_ATTRIBUTES_SETTINGS,
  INPUT_SETTINGS,
  LABEL_SETTINGS,
  OTP_SETTINGS,
  TEXTAREA_SETTINGS,
  VALIDATION_SETTINGS,
} from './settings';

export const TEXT_BLOCK_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'text-block',
  label: 'Text block',
  description: 'Text with typography styles',
  icon: 'lucideTextAlignJustify',
  defaultConfig: {
    label: 'Text Block',
    content: 'Your text here',
    typographyVariant: 'p',
    required: false,
    showLabel: true,
    labelPosition: 'top',
    labelAlignment: 'alignLeft',
    columnSpan: 'col-span-12',
    columnStart: 'col-start-auto',
    visible: true,
  },
  settingsConfig: [
    {
      label: 'Content',
      key: 'input',
      settings: [
        {
          type: 'select',
          key: 'typographyVariant',
          label: 'Variant',
          options: [
            { value: 'h1', label: 'h1' },
            { value: 'h2', label: 'h2' },
            { value: 'h3', label: 'h3' },
            { value: 'h4', label: 'h4' },
            { value: 'p', label: 'Paragraph' },
            { value: 'lead', label: 'Lead' },
            { value: 'large', label: 'Large' },
            { value: 'small', label: 'Small' },
            { value: 'muted', label: 'Muted' },
            { value: 'blockquote', label: 'Blockquote' },
            { value: 'code', label: 'Code' },
          ],
        },
        {
          type: 'textarea',
          key: 'content',
          label: 'Text Content',
        },
      ],
    },
    ...APPEARANCE_SETTINGS,
  ],
  component: TextBlockField,
};

export const TEXT_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'text',
  label: 'Text Field',
  description: 'Single line text input',
  icon: 'lucideTextCursorInput',
  defaultConfig: {
    label: 'Text Field',
    required: false,
    requiredMessage: '',
    validations: [],
    showLabel: true,
    labelPosition: 'top',
    labelAlignment: 'alignLeft',
    columnSpan: 'col-span-12',
    columnStart: 'col-start-auto',
    visible: true,
    inputType: 'text',
  },
  settingsConfig: [
    ...INPUT_SETTINGS,
    ...LABEL_SETTINGS,
    ...APPEARANCE_SETTINGS,
    ...VALIDATION_SETTINGS,
  ],
  component: TextField,
};

export const TEXTAREA_FIELD_DEFINITION = {
  type: 'textarea',
  label: 'Text Area Field',
  description: 'Multi-line text input',
  icon: 'lucideText',
  defaultConfig: {
    label: 'Text Area Field',
    required: false,
    requiredMessage: '',
    validations: [],
    showLabel: true,
    labelPosition: 'top',
    labelAlignment: 'alignLeft',
    columnSpan: 'col-span-12',
    columnStart: 'col-start-auto',
    visible: true,
  },
  settingsConfig: [
    ...TEXTAREA_SETTINGS,
    ...LABEL_SETTINGS,
    ...APPEARANCE_SETTINGS,
    ...VALIDATION_SETTINGS,
  ],
  component: TextAreaField,
};

export const NUMBER_FIELD_DEFINITION = {
  type: 'number',
  label: 'Number Field',
  description: 'Input field for numerics',
  icon: 'lucideHash',
  defaultConfig: {
    label: 'Number Field',
    required: false,
    showLabel: true,
    labelPosition: 'top',
    labelAlignment: 'alignLeft',
    columnSpan: 'col-span-12',
    columnStart: 'col-start-auto',
    visible: true,
    inputType: 'number',
  },
  settingsConfig: [
    ...INPUT_SETTINGS,
    ...LABEL_SETTINGS,
    ...APPEARANCE_SETTINGS,
    ...VALIDATION_SETTINGS,
  ],
  component: TextField,
};

export const EMAIL_FIELD_DEFINITION = {
  type: 'email',
  label: 'Email Field',
  description: 'Input field for email address',
  icon: 'lucideMail',
  defaultConfig: {
    label: 'Email Field',
    required: false,
    requiredMessage: '',
    validations: [],
    showLabel: true,
    labelPosition: 'top',
    labelAlignment: 'alignLeft',
    columnSpan: 'col-span-12',
    columnStart: 'col-start-auto',
    visible: true,
    inputType: 'email',
  },
  settingsConfig: [
    ...INPUT_SETTINGS,
    ...LABEL_SETTINGS,
    ...APPEARANCE_SETTINGS,
    ...VALIDATION_SETTINGS,
  ],
  component: TextField,
};

export const PASSWORD_FIELD_DEFINITION = {
  type: 'password',
  label: 'Password Field',
  description: 'Input field for passwords',
  icon: 'lucideLock',
  defaultConfig: {
    label: 'Password Field',
    required: false,
    showLabel: true,
    labelPosition: 'top',
    labelAlignment: 'alignLeft',
    columnSpan: 'col-span-12',
    columnStart: 'col-start-auto',
    visible: true,
    inputType: 'password',
  },
  settingsConfig: [
    ...INPUT_SETTINGS,
    ...LABEL_SETTINGS,
    ...APPEARANCE_SETTINGS,
    ...VALIDATION_SETTINGS,
  ],
  component: TextField,
};

export const FILEUPLOAD_FIELD_DEFINITION = {
  type: 'file',
  label: 'File Upload',
  description: 'Input field for file uploads',
  icon: 'lucideUpload',
  defaultConfig: {
    label: 'File Upload',
    required: false,
    showLabel: true,
    labelPosition: 'top',
    labelAlignment: 'alignLeft',
    columnSpan: 'col-span-12',
    columnStart: 'col-start-auto',
    visible: true,
    inputType: 'file',
  },
  settingsConfig: [
    ...INPUT_SETTINGS,
    ...LABEL_SETTINGS,
    ...APPEARANCE_SETTINGS,
    ...VALIDATION_SETTINGS,
  ],
  component: TextField,
};

export const TELEPHONE_FIELD_DEFINITION = {
  type: 'tel',
  label: 'Telephone',
  description: 'Input field for telephone numbers',
  icon: 'lucidePhone',
  defaultConfig: {
    label: 'Telephone',
    required: false,
    requiredMessage: '',
    validations: [],
    showLabel: true,
    labelPosition: 'top',
    labelAlignment: 'alignLeft',
    columnSpan: 'col-span-12',
    columnStart: 'col-start-auto',
    visible: true,
    inputType: 'tel',
  },
  settingsConfig: [
    ...INPUT_SETTINGS,
    ...LABEL_SETTINGS,
    ...APPEARANCE_SETTINGS,
    ...VALIDATION_SETTINGS,
  ],
  component: TextField,
};

export const URL_FIELD_DEFINITION = {
  type: 'url',
  label: 'URL',
  description: 'Input field for URLs',
  icon: 'lucideLink',
  defaultConfig: {
    label: 'URL',
    required: false,
    showLabel: true,
    labelPosition: 'top',
    labelAlignment: 'alignLeft',
    columnSpan: 'col-span-12',
    columnStart: 'col-start-auto',
    visible: true,
    inputType: 'url',
  },
  settingsConfig: [
    ...INPUT_SETTINGS,
    ...LABEL_SETTINGS,
    ...APPEARANCE_SETTINGS,
    ...VALIDATION_SETTINGS,
  ],
  component: TextField,
};

export const CHECKBOX_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'checkbox',
  label: 'Checkbox',
  description: 'Checkbox input',
  icon: 'lucideSquareCheck',
  defaultConfig: {
    label: 'Checkbox Field',
    required: false,
    showLabel: true,
    labelPosition: 'top',
    labelAlignment: 'alignLeft',
    columnSpan: 'col-span-12',
    columnStart: 'col-start-auto',
    visible: true,
  },
  settingsConfig: [
    {
      label: 'Input',
      key: 'input',
      settings: [
        { type: 'text', key: 'label', label: 'Label' },
        FORM_CONTROL_NAME_SETTINGS,
      ],
    },
    ...VALIDATION_SETTINGS,
  ],
  component: CheckboxField,
};

export const SELECT_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'select',
  label: 'Select',
  description: 'Dropdown select',
  icon: 'lucideList',
  defaultConfig: {
    label: 'Select Field',
    required: false,
    showLabel: true,
    labelPosition: 'top',
    labelAlignment: 'alignLeft',
    columnSpan: 'col-span-12',
    columnStart: 'col-start-auto',
    visible: true,
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
  },
  settingsConfig: [
    ...DATA_OPTIONS_SETTINGS,
    ...INPUT_SETTINGS,
    ...LABEL_SETTINGS,
    ...APPEARANCE_SETTINGS,
    ...VALIDATION_SETTINGS,
  ],
  component: SelectField,
};

export const RADIO_GROUP_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'radio',
  label: 'Radio Group',
  description: 'Radio Group',
  icon: 'lucideCircleDot',
  defaultConfig: {
    label: 'Group of radio buttons',
    required: false,
    showLabel: true,
    labelPosition: 'top',
    labelAlignment: 'alignLeft',
    columnSpan: 'col-span-12',
    columnStart: 'col-start-auto',
    visible: true,
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
  },
  settingsConfig: [
    ...DATA_OPTIONS_SETTINGS,
    ...INPUT_SETTINGS,
    ...LABEL_SETTINGS,
    ...APPEARANCE_SETTINGS,
    ...VALIDATION_SETTINGS,
  ],
  component: RadioGroupField,
};

export const SWITCH_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'switch',
  label: 'Switch',
  description: 'Toggle switch',
  icon: 'lucideToggleLeft',
  defaultConfig: {
    label: 'Switch',
    required: false,
    showLabel: true,
    labelPosition: 'top',
    labelAlignment: 'alignLeft',
    columnSpan: 'col-span-12',
    columnStart: 'col-start-auto',
    visible: true,
  },
  settingsConfig: [
    {
      label: 'Input',
      key: 'input',
      settings: [FORM_CONTROL_NAME_SETTINGS],
    },
    ...LABEL_SETTINGS,
    ...APPEARANCE_SETTINGS,
    ...VALIDATION_SETTINGS,
  ],
  component: SwitchField,
};

export const DATE_PICKER_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'date',
  label: 'Date Picker',
  description: 'Date picker input',
  icon: 'lucideCalendar',
  defaultConfig: {
    label: 'Date Picker',
    placeholder: 'Select date',
    required: false,
    showLabel: true,
    labelPosition: 'top',
    labelAlignment: 'alignLeft',
    columnSpan: 'col-span-12',
    columnStart: 'col-start-auto',
    visible: true,
  },
  settingsConfig: [
    ...INPUT_SETTINGS,
    ...LABEL_SETTINGS,
    ...APPEARANCE_SETTINGS,
    ...VALIDATION_SETTINGS,
  ],
  component: DatePickerField,
};

export const BUTTON_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'button',
  label: 'Button',
  description: 'Button',
  icon: 'lucideSquareMousePointer',
  defaultConfig: {
    label: 'Button',
    columnSpan: 'col-span-12',
    columnStart: 'col-start-auto',
    visible: true,
    content: 'Button',
    variant: 'outline',
    type: 'button',
  },
  settingsConfig: [
    ...BUTTON_SETTINGS,
    ...APPEARANCE_SETTINGS,
    ...HTML_ATTRIBUTES_SETTINGS,
  ],
  component: ButtonField,
};

export const SUBMIT_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'submit',
  label: 'Submit',
  description: 'Submit',
  icon: 'lucideSquareMousePointer',
  defaultConfig: {
    label: 'Submit',
    columnSpan: 'col-span-12',
    columnStart: 'col-start-auto',
    visible: true,
    content: 'Submit',
    variant: 'default',
    type: 'submit',
  },
  settingsConfig: [
    ...BUTTON_SETTINGS,
    ...APPEARANCE_SETTINGS,
    ...HTML_ATTRIBUTES_SETTINGS,
  ],
  component: ButtonField,
};

export const RESET_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'reset',
  label: 'Reset',
  description: 'Reset',
  icon: 'lucideSquareMousePointer',
  defaultConfig: {
    label: 'Reset',
    columnSpan: 'col-span-12',
    columnStart: 'col-start-auto',
    visible: true,
    content: 'Reset',
    variant: 'outline',
    type: 'reset',
  },
  settingsConfig: [
    ...BUTTON_SETTINGS,
    ...APPEARANCE_SETTINGS,
    ...HTML_ATTRIBUTES_SETTINGS,
  ],
  component: ButtonField,
};

export const OTP_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'otp',
  label: 'OTP Input',
  description: 'One-time password',
  icon: 'lucideKeySquare',
  defaultConfig: {
    required: false,
    showLabel: false,
    columnSpan: 'col-span-12',
    columnStart: 'col-start-auto',
    visible: true,
    otpLength: 6,
    otpInputMode: 'numeric',
    otpSeparator: 'middle',
    hint: '',
  },
  settingsConfig: [
    {
      label: 'Input',
      key: 'input',
      settings: [FORM_CONTROL_NAME_SETTINGS],
    },
    ...OTP_SETTINGS,
    ...APPEARANCE_SETTINGS,
    ...VALIDATION_SETTINGS,
  ],
  component: OtpField,
};
