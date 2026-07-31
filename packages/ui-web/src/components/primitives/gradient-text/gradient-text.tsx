import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';
import { gradients } from '@/tokens/gradients';

export const gradientTextVariants = cva(
  'bg-clip-text text-transparent',
  {
    variants: {
      gradient: {
        brand: '',
        neutral: '',
        custom: '',
      },
    },
    defaultVariants: {
      gradient: 'brand',
    },
  },
);

export interface GradientTextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof gradientTextVariants> {
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  customGradient?: string;
}

const gradientMap = {
  brand: gradients.textBrand,
  neutral: gradients.textNeutral,
  custom: undefined,
} as const;

export const GradientText = React.forwardRef<HTMLElement, GradientTextProps>(
  ({ className, gradient = 'brand', as: Tag = 'span', customGradient, style, ...props }, ref) => {
    const backgroundImage = gradient === 'custom' ? customGradient : gradientMap[gradient!];

    return (
      <Tag
        ref={ref as React.Ref<never>}
        className={cn(gradientTextVariants({ gradient }), className)}
        style={{ backgroundImage, ...style }}
        {...props}
      />
    );
  },
);
GradientText.displayName = 'GradientText';
