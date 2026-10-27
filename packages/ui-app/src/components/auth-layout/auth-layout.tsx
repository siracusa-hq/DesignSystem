import * as React from 'react';
import { cn } from '@/lib/cn';

/* ----- AuthLayout ----- */

/**
 * 認証画面用の縦2分割レイアウト。
 * 左（AuthLayoutForm）にログインフォーム、右（AuthLayoutVisual）に
 * 製品ビジュアルや訴求を置く。lg 未満ではフォームのみの1カラムになる。
 *
 * Visual の背景はブランドの濃い地（--color-bg-brand-deep）。data-brand でブランドに合わせて切り替わる
 * （2026-10-27。既定はコーポレートの装飾用 brand スケールの 950）。
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

/* ----- AuthLayoutCentered ----- */

export interface AuthLayoutCenteredProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * `plain` は面の上にフォームを直接置く構成（Linear / Vercel / Figma 型）。
   * `card` は沈めた背景の上に中央カードを浮かせる構成（SmartHR / マネーフォワード型）。
   */
  variant?: 'plain' | 'card';
  /** フォーム幅の上限。既定は `max-w-sm`（384px） */
  contentClassName?: string;
}

/**
 * 認証画面用の中央1カラムレイアウト。ログイン（既存ユーザーの日常導線）では
 * 訴求パネルを持たないこの構成が定石。訴求が必要な獲得導線では AuthLayout を使う。
 */
export const AuthLayoutCentered = React.forwardRef<HTMLDivElement, AuthLayoutCenteredProps>(
  ({ className, variant = 'plain', contentClassName, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex min-h-dvh flex-col items-center justify-center px-6 py-12',
        variant === 'card'
          ? 'bg-[var(--color-surface-sunken)]'
          : 'bg-[var(--color-surface)]',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'w-full max-w-sm',
          variant === 'card' &&
            'rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-8 shadow-sm',
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  ),
);
AuthLayoutCentered.displayName = 'AuthLayoutCentered';

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
      style={{ backgroundColor: 'var(--color-bg-brand-deep)', ...style }}
      {...props}
    />
  ),
);
AuthLayoutVisual.displayName = 'AuthLayoutVisual';
