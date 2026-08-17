import * as React from 'react';
import { brand } from '@siracusahq/tokens';
import { cn } from '@/lib/cn';

/* ----- AuthLayout ----- */

/**
 * 認証画面用の縦2分割レイアウト。
 * 左（AuthLayoutForm）にログインフォーム、右（AuthLayoutVisual）に
 * 製品ビジュアルや訴求を置く。lg 未満ではフォームのみの1カラムになる。
 *
 * Visual の背景には装飾用 `brand` スケール（@siracusahq/tokens）を直接使う。
 * 暗色背景上の装飾は brand の本来の用途であり WCAG 上の問題はないが、
 * ui-app のテーマ変数としては brand を公開しない方針のため、
 * この定数参照をテーマ変数（--color-brand-*）に置き換えないこと。
 */
export interface AuthLayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AuthLayout = React.forwardRef<HTMLDivElement, AuthLayoutProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('grid min-h-dvh lg:grid-cols-2', className)}
      {...props}
    />
  ),
);
AuthLayout.displayName = 'AuthLayout';

/* ----- AuthLayoutForm ----- */

export interface AuthLayoutFormProps extends React.HTMLAttributes<HTMLDivElement> {
  /** フォーム幅の上限。既定は `max-w-sm`（384px） */
  contentClassName?: string;
}

export const AuthLayoutForm = React.forwardRef<HTMLDivElement, AuthLayoutFormProps>(
  ({ className, contentClassName, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-center justify-center bg-[var(--color-surface)] px-6 py-12 lg:px-12',
        className,
      )}
      {...props}
    >
      <div className={cn('w-full max-w-sm', contentClassName)}>{children}</div>
    </div>
  ),
);
AuthLayoutForm.displayName = 'AuthLayoutForm';

/* ----- AuthLayoutVisual ----- */

export interface AuthLayoutVisualProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AuthLayoutVisual = React.forwardRef<HTMLDivElement, AuthLayoutVisualProps>(
  ({ className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative hidden flex-col items-center justify-center overflow-hidden p-12 text-white lg:flex',
        className,
      )}
      style={{ backgroundColor: brand[950], ...style }}
      {...props}
    />
  ),
);
AuthLayoutVisual.displayName = 'AuthLayoutVisual';
