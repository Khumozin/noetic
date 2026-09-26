import { Type } from '@angular/core';

export interface FieldGroupDefinition {
  label: string;
  type: FieldGroupType;
  fieldTypeDefinitions: Map<FieldType, FieldTypeDefinition>;
}

export interface FieldTypeDefinition {
  type: string;
  label: string;
  description: string;
  icon: string;
  defaultConfig: unknown;
  settingsConfig: FieldGroupSettingsDefinition[];
  component: Type<unknown>;
}

export type BuiltInFieldGroupType =
  'typography' | 'input' | 'selection' | 'datetime' | 'button';

export type FieldGroupType = BuiltInFieldGroupType | (string & {});

export type BuiltInFieldType =
  | 'text-block'
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'password'
  | 'file'
  | 'tel'
  | 'url'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'dynamic-options'
  | 'dynamic-validations'
  | 'toggle'
  | 'switch'
  | 'date'
  | 'button'
  | 'submit'
  | 'reset'
  | 'otp';

export type FieldType = BuiltInFieldType | (string & {});

export type LabelPosition = 'top' | 'left' | 'right';

export type LabelAlignment = 'alignLeft' | 'alignRight' | 'alignCenter';

export type FieldGroupSettingsType =
  | 'input'
  | 'label'
  | 'appearance'
  | 'html-attributes'
  | 'button'
  | 'validation'
  | 'data-options'
  | 'html-attributes';

export type Variant = 'default' | 'outline' | 'ghost' | 'link';

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'p'
  | 'lead'
  | 'large'
  | 'small'
  | 'muted'
  | 'blockquote'
  | 'code';

export type OtpSeparatorStyle = 'none' | 'middle' | 'every-3';
export type OtpInputMode = 'text' | 'numeric' | 'tel';

export interface ResponsiveBoolean {
  sm: boolean;
  md: boolean;
  lg: boolean;
}

export interface ResponsiveLabelPosition {
  sm: LabelPosition;
  md: LabelPosition;
  lg: LabelPosition;
}

export interface ResponsiveLabelAlignment {
  sm: LabelAlignment;
  md: LabelAlignment;
  lg: LabelAlignment;
}

export interface ResponsiveString {
  sm: string;
  md: string;
  lg: string;
}

export interface FieldGroupSettingsDefinition {
  key: FieldGroupSettingsType;
  label: string;
  settings: FieldSettingsDefinition[];
}

export interface FieldSettingsDefinition {
  type: BuiltInFieldType;
  key: string;
  label: string;
  options?: OptionItem[];
  responsive?: boolean;
}

export interface OptionItem<T = string | boolean | number> {
  label?: string;
  icon?: string;
  value: T;
}

export type ValidationPresetType =
  | 'saIdNumber'
  | 'saPhone'
  | 'saMobile'
  | 'saPostalCode'
  | 'saCompanyReg'
  | 'saVatNumber'
  | 'email'
  | 'phone'
  | 'url'
  | 'creditCard'
  | 'alphanumeric'
  | 'alphabetic'
  | 'numeric'
  | 'noWhitespace'
  | 'strongPassword'
  | 'hexColor'
  | 'slug';

export interface ValidationRule {
  id: string;
  type: ValidationPresetType | 'custom';
  pattern?: string;
  message: string;
  enabled: boolean;
}

export interface ValidationPreset {
  type: ValidationPresetType;
  label: string;
  description: string;
  pattern: string;
  defaultMessage: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  required: boolean;
  inputType?: string;
  placeholder?: string;
  hint?: string;
  fieldName?: string;
  options?: OptionItem[];

  /** Label & Description */
  label: string;
  labelPosition?: LabelPosition | ResponsiveLabelPosition;
  labelAlignment?: LabelAlignment | ResponsiveLabelAlignment;
  showLabel?: boolean | ResponsiveBoolean;

  /** Appearance */
  columnSpan?: string | ResponsiveString;
  columnStart?: string | ResponsiveString;
  visible?: boolean | ResponsiveBoolean;

  /** Button */
  content?: string;
  variant?: Variant;

  /** Typography */
  typographyVariant?: TypographyVariant;

  /** OTP Settings */
  otpLength?: number;
  otpInputMode?: OtpInputMode;
  otpSeparator?: OtpSeparatorStyle;

  /** Validation */
  requiredMessage?: string;
  validations?: ValidationRule[];
  minLength?: number;
  minLengthMessage?: string;
  maxLength?: number;
  maxLengthMessage?: string;
}
