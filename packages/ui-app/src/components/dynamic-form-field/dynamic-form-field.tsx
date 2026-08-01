import * as React from 'react';
import { Input } from '@/components/input/input';
import { Textarea } from '@/components/textarea/textarea';
import { Checkbox } from '@/components/checkbox/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group/radio-group';
import { Switch } from '@/components/switch/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select/select';
import { NumberInput } from '@/components/number-input/number-input';
import { DatePicker } from '@/components/date-picker/date-picker';
import { Combobox } from '@/components/combobox/combobox';
import { Label } from '@/components/label/label';
import {
  FormField,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/form-field/form-field';

export type FieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'url'
  | 'tel'
  | 'password'
  | 'textarea'
  | 'select'
  | 'combobox'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'date'
  | 'datetime'
  | 'time'
  | 'file';

export interface FieldOption {
  value: string;
  label: string;
}

export interface DynamicFormFieldProps {
  type: FieldType;
  name: string;
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  value?: unknown;
  onChange?: (value: unknown) => void;
  options?: FieldOption[];
  min?: number | string;
  max?: number | string;
  step?: number;
  rows?: number;
  className?: string;
}

export function getFieldComponent(type: FieldType): string {
  const map: Record<FieldType, string> = {
    text: 'Input',
    email: 'Input',
    url: 'Input',
    tel: 'Input',
    password: 'Input',
    number: 'NumberInput',
    textarea: 'Textarea',
    select: 'Select',
    combobox: 'Combobox',
    checkbox: 'Checkbox',
    radio: 'RadioGroup',
    switch: 'Switch',
    date: 'DatePicker',
    datetime: 'Input',
    time: 'Input',
    file: 'Input',
  };
  return map[type];
}

function isInlineField(type: FieldType): boolean {
  return type === 'checkbox' || type === 'switch';
}

export const DynamicFormField = React.forwardRef<
  HTMLDivElement,
  DynamicFormFieldProps
>(
  (
    {
      type,
      name,
      label,
      description,
      error,
      required,
      disabled,
      placeholder,
      value,
      onChange,
      options = [],
      min,
      max,
      step,
      rows,
      className,
    },
    ref,
  ) => {
    if (isInlineField(type)) {
      return (
        <FormField ref={ref} error={error} disabled={disabled} className={className}>
          <div className="flex items-center gap-2">
            <FormControl>
              {type === 'checkbox' ? (
                <Checkbox
                  name={name}
                  checked={value as boolean | undefined}
                  onCheckedChange={(checked) => onChange?.(checked)}
                />
              ) : (
                <Switch
                  name={name}
                  checked={value as boolean | undefined}
                  onCheckedChange={(checked) => onChange?.(checked)}
                />
              )}
            </FormControl>
            <Label className="text-sm font-normal">
              {label}
              {required && (
                <span aria-hidden="true" className="ml-0.5 text-error-500">
                  *
                </span>
              )}
            </Label>
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormField>
      );
    }

    function renderControl() {
      switch (type) {
        case 'textarea':
          return (
            <Textarea
              name={name}
              placeholder={placeholder}
              value={value as string | undefined}
              onChange={(e) => onChange?.(e.target.value)}
              rows={rows}
            />
          );
        case 'number':
          return (
            <NumberInput
              name={name}
              placeholder={placeholder}
              value={value as number | undefined}
              onChange={(v) => onChange?.(v)}
              min={min as number | undefined}
              max={max as number | undefined}
              step={step}
            />
          );
        case 'date':
          return (
            <DatePicker
              name={name}
              value={value as string | undefined}
              onValueChange={(v) => onChange?.(v)}
              min={min as string | undefined}
              max={max as string | undefined}
            />
          );
        case 'select':
          return (
            <Select
              value={value as string | undefined}
              onValueChange={(v) => onChange?.(v)}
              disabled={disabled}
              name={name}
            >
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        case 'combobox':
          return (
            <Combobox
              name={name}
              options={options}
              value={value as string | undefined}
              onValueChange={(v) => onChange?.(v)}
              placeholder={placeholder}
            />
          );
        case 'radio':
          return (
            <RadioGroup
              value={value as string | undefined}
              onValueChange={(v) => onChange?.(v)}
            >
              {options.map((opt) => (
                <div key={opt.value} className="flex items-center gap-2">
                  <RadioGroupItem value={opt.value} id={`${name}-${opt.value}`} />
                  <Label htmlFor={`${name}-${opt.value}`} className="font-normal">
                    {opt.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          );
        default:
          return (
            <Input
              type={type === 'datetime' ? 'datetime-local' : type}
              name={name}
              placeholder={placeholder}
              value={value as string | undefined}
              onChange={(e) => onChange?.(e.target.value)}
            />
          );
      }
    }

    return (
      <FormField ref={ref} error={error} required={required} disabled={disabled} className={className}>
        <FormLabel>{label}</FormLabel>
        <FormControl>{renderControl()}</FormControl>
        {description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormField>
    );
  },
);
DynamicFormField.displayName = 'DynamicFormField';
