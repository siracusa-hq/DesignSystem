import * as React from 'react';
import { cn } from '@/lib/cn';

export interface LogoProps extends React.SVGAttributes<SVGSVGElement> {
  /** ロゴバリエーション */
  variant?: 'full' | 'mark' | 'type';
  /** カラーバリエーション */
  colorScheme?: 'primary' | 'reverse' | 'mono';
  /** 高さ（px） */
  height?: number;
}

/**
 * Polastackロゴ（プレースホルダー）
 * Branding.md 8.1 のバリエーション定義に準拠。
 * 実際のロゴアセットが確定次第、SVGパスを差し替える。
 */
export const Logo = React.forwardRef<SVGSVGElement, LogoProps>(
  ({ className, variant = 'full', colorScheme = 'primary', height = 32, ...props }, ref) => {
    const brandColor = '#13c3a0';

    const textColor =
      colorScheme === 'reverse'
        ? '#ffffff'
        : 'currentColor';

    const markColor = colorScheme === 'mono' ? 'currentColor' : brandColor;

    if (variant === 'mark') {
      return (
        <svg
          ref={ref}
          viewBox="0 0 32 32"
          fill="none"
          height={height}
          width={height}
          className={cn('shrink-0', className)}
          aria-label="Polastack"
          role="img"
          {...props}
        >
          <rect width="32" height="32" rx="8" fill={markColor} />
          <text
            x="16"
            y="22"
            textAnchor="middle"
            fill="white"
            fontSize="18"
            fontWeight="700"
            fontFamily="Inter, sans-serif"
          >
            P
          </text>
        </svg>
      );
    }

    if (variant === 'type') {
      return (
        <svg
          ref={ref}
          viewBox="0 0 140 32"
          fill="none"
          height={height}
          width={(140 / 32) * height}
          className={cn('shrink-0', className)}
          aria-label="Polastack"
          role="img"
          {...props}
        >
          <text
            x="0"
            y="24"
            fill={textColor}
            fontSize="22"
            fontWeight="700"
            fontFamily="Inter, sans-serif"
          >
            Polastack
          </text>
        </svg>
      );
    }

    // variant === 'full'
    return (
      <svg
        ref={ref}
        viewBox="0 0 180 32"
        fill="none"
        height={height}
        width={(180 / 32) * height}
        className={cn('shrink-0', className)}
        aria-label="Polastack"
        role="img"
        {...props}
      >
        <rect width="32" height="32" rx="8" fill={markColor} />
        <text
          x="16"
          y="22"
          textAnchor="middle"
          fill="white"
          fontSize="18"
          fontWeight="700"
          fontFamily="Inter, sans-serif"
        >
          P
        </text>
        <text
          x="42"
          y="24"
          fill={textColor}
          fontSize="22"
          fontWeight="700"
          fontFamily="Inter, sans-serif"
        >
          Polastack
        </text>
      </svg>
    );
  },
);
Logo.displayName = 'Logo';
