import * as React from 'react';
import { createContext } from '@/lib/create-context';
import { cn } from '@/lib/cn';
import { Label, type LabelProps } from '@/components/label/label';

interface FormFieldContextValue {
  id: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  descriptionId: string;
  messageId: string;
}

const [FormFieldProvider, useFormField] = createContext<FormFieldContextValue>('FormField');

export { useFormField };

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, error, required, disabled, children, ...props }, ref) => {
    const id = React.useId();
    const descriptionId = `${id}-description`;
    const messageId = `${id}-message`;

    return (
      <FormFieldProvider
        value={{ id, error, required, disabled, descriptionId, messageId }}
      >
        <div ref={ref} className={cn('space-y-1.5', className)} {...props}>
          {children}
        </div>
      </FormFieldProvider>
    );
  },
);
FormField.displayName = 'FormField';

export interface FormLabelProps extends LabelProps {}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, children, ...props }, ref) => {
    const { id, error, required } = useFormField();

    return (
      <Label
        ref={ref}
        htmlFor={id}
        required={required}
        className={cn(error && 'text-error-600', className)}
        {...props}
      >
        {children}
      </Label>
    );
  },
);
FormLabel.displayName = 'FormLabel';

export interface FormControlProps {
  children: React.ReactElement;
}

export function FormControl({ children }: FormControlProps) {
  const { id, error, disabled, descriptionId, messageId } = useFormField();

  const describedBy = [
    !error ? descriptionId : undefined,
    error ? messageId : undefined,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  return React.cloneElement(children, {
    id,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    disabled: children.props.disabled ?? disabled,
    required: children.props.required,
  });
}
FormControl.displayName = 'FormControl';

export interface FormDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  FormDescriptionProps
>(({ className, ...props }, ref) => {
  const { descriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={descriptionId}
      className={cn('text-xs text-[--color-on-surface-muted]', className)}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';

export interface FormMessageProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  FormMessageProps
>(({ className, children, ...props }, ref) => {
  const { error, messageId } = useFormField();
  const message = error || children;

  if (!message) return null;

  return (
    <p
      ref={ref}
      id={messageId}
      role="alert"
      className={cn('text-xs text-error-600', className)}
      {...props}
    >
      {message}
    </p>
  );
});
FormMessage.displayName = 'FormMessage';
