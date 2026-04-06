import * as React from 'react';
import { PatternFormat, type PatternFormatProps } from 'react-number-format';
import { cn } from '@/lib/cn';
import { inputVariants } from '@/components/input';

export const MASK_PHONE_JP = '###-####-####';
export const MASK_POSTAL_JP = '###-####';
export const MASK_CREDIT_CARD = '#### #### #### ####';
export const MASK_DATE = '####/##/##';

export interface MaskedInputProps
  extends Omit<PatternFormatProps, 'customInput' | 'format'> {
  mask: string;
  maskChar?: string;
  className?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
}

export const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, maskChar = '_', className, ...props }, ref) => (
    <PatternFormat
      getInputRef={ref}
      format={mask}
      mask={maskChar}
      allowEmptyFormatting={false}
      className={cn(
        inputVariants(),
        className,
      )}
      {...props}
    />
  ),
);
MaskedInput.displayName = 'MaskedInput';
