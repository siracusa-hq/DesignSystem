import * as React from 'react';
import { cn } from '@/lib/cn';

export interface PrintDividerProps extends React.HTMLAttributes<HTMLHRElement> {}

const PrintDivider = React.forwardRef<HTMLHRElement, PrintDividerProps>(
  ({ className, ...props }, ref) => (
    <hr
      ref={ref}
      className={cn('border-neutral-200 my-4', className)}
      {...props}
    />
  ),
);
PrintDivider.displayName = 'PrintDivider';

export { PrintDivider };
