import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const formLayoutVariants = cva('', {
  variants: {
    layout: {
      vertical: 'flex flex-col',
      horizontal: 'grid grid-cols-[auto_1fr] items-start',
      grid: 'grid',
    },
    size: {
      sm: 'gap-3',
      md: 'gap-4',
      lg: 'gap-6',
    },
  },
  compoundVariants: [
    {
      layout: 'horizontal',
      size: 'sm',
      className: 'gap-x-4 gap-y-3',
    },
    {
      layout: 'horizontal',
      size: 'md',
      className: 'gap-x-6 gap-y-4',
    },
    {
      layout: 'horizontal',
      size: 'lg',
      className: 'gap-x-8 gap-y-6',
    },
  ],
  defaultVariants: {
    layout: 'vertical',
    size: 'md',
  },
});

export interface FormLayoutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formLayoutVariants> {
  columns?: number | 'responsive';
}

export const FormLayout = React.forwardRef<HTMLDivElement, FormLayoutProps>(
  ({ className, layout, size, columns = 2, style, ...props }, ref) => {
    const isResponsive = columns === 'responsive';
    return (
      <div
        ref={ref}
        className={cn(
          formLayoutVariants({ layout, size }),
          isResponsive && layout === 'grid' && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
          className,
        )}
        style={
          layout === 'grid' && !isResponsive
            ? { gridTemplateColumns: `repeat(${columns}, 1fr)`, ...style }
            : style
        }
        {...props}
      />
    );
  },
);
FormLayout.displayName = 'FormLayout';

export interface FormSectionProps
  extends React.HTMLAttributes<HTMLFieldSetElement> {
  title: string;
  description?: string;
}

export const FormSection = React.forwardRef<
  HTMLFieldSetElement,
  FormSectionProps
>(({ className, title, description, children, ...props }, ref) => (
  <fieldset
    ref={ref}
    className={cn('space-y-4 border-0 p-0', className)}
    {...props}
  >
    <legend className="text-sm font-semibold text-[var(--color-on-surface)]">{title}</legend>
    {description && (
      <p className="-mt-2 text-xs text-[var(--color-on-surface-muted)]">{description}</p>
    )}
    {children}
  </fieldset>
));
FormSection.displayName = 'FormSection';

export interface FormActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'right' | 'center' | 'between';
}

const alignClasses: Record<string, string> = {
  left: 'justify-start',
  right: 'justify-end',
  center: 'justify-center',
  between: 'justify-between',
};

export const FormActions = React.forwardRef<HTMLDivElement, FormActionsProps>(
  ({ className, align = 'right', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-3 pt-4 border-t border-[var(--color-border)]',
        alignClasses[align],
        className,
      )}
      {...props}
    />
  ),
);
FormActions.displayName = 'FormActions';
