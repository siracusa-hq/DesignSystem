import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

/* ----------------------------------------------------------------
   PrintField — Label + value pair for report data
   ---------------------------------------------------------------- */

export interface PrintFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Field label */
  label: string;
  /** Field value (string or ReactNode for rich content) */
  value?: React.ReactNode;
}

const PrintField = React.forwardRef<HTMLDivElement, PrintFieldProps>(
  ({ className, label, value, children, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props}>
      <dt className="text-[8pt] font-medium text-neutral-500 mb-0.5">{label}</dt>
      <dd className="text-[9pt] text-neutral-900">{value ?? children}</dd>
    </div>
  ),
);
PrintField.displayName = 'PrintField';

/* ----------------------------------------------------------------
   PrintFieldGroup — Grid layout for PrintField items
   ---------------------------------------------------------------- */

const printFieldGroupVariants = cva('grid gap-x-6 gap-y-2', {
  variants: {
    columns: {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
    },
  },
  defaultVariants: {
    columns: 2,
  },
});

export interface PrintFieldGroupProps
  extends React.HTMLAttributes<HTMLDListElement>,
    VariantProps<typeof printFieldGroupVariants> {}

const PrintFieldGroup = React.forwardRef<HTMLDListElement, PrintFieldGroupProps>(
  ({ className, columns, ...props }, ref) => (
    <dl
      ref={ref}
      className={cn(printFieldGroupVariants({ columns }), className)}
      {...props}
    />
  ),
);
PrintFieldGroup.displayName = 'PrintFieldGroup';

export { PrintField, PrintFieldGroup, printFieldGroupVariants };
