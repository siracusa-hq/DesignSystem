import * as React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { brand } from '@siracusahq/tokens';
import { cn } from '@/lib/cn';

/**
 * AuthLayoutVisual の中に置く製品訴求コンテンツ。
 * タイトル・アクセント・説明・特徴リストを compound で組み立てる。
 *
 * 文字色・アイコン色には装飾用 `brand` スケール（@siracusahq/tokens）を直接使う。
 * AuthLayoutVisual の暗色背景（brand[950]）上でのみ使う前提であり、
 * ui-app のテーマ変数としては brand を公開しない方針のため、
 * この定数参照をテーマ変数（--color-brand-*）に置き換えないこと。
 */

/* ----- AuthVisualContent ----- */

export interface AuthVisualContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AuthVisualContent = React.forwardRef<HTMLDivElement, AuthVisualContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex max-w-md flex-col gap-3', className)}
      {...props}
    />
  ),
);
AuthVisualContent.displayName = 'AuthVisualContent';

/* ----- AuthVisualTitle ----- */

export interface AuthVisualTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const AuthVisualTitle = React.forwardRef<HTMLHeadingElement, AuthVisualTitleProps>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('text-3xl font-semibold leading-snug', className)}
      {...props}
    />
  ),
);
AuthVisualTitle.displayName = 'AuthVisualTitle';

/* ----- AuthVisualAccent ----- */

export interface AuthVisualAccentProps extends React.HTMLAttributes<HTMLSpanElement> {}

/** タイトル内の強調語。暗色背景上でのみコントラストが成立する */
export const AuthVisualAccent = React.forwardRef<HTMLSpanElement, AuthVisualAccentProps>(
  ({ style, ...props }, ref) => (
    <span ref={ref} style={{ color: brand[300], ...style }} {...props} />
  ),
);
AuthVisualAccent.displayName = 'AuthVisualAccent';

/* ----- AuthVisualDescription ----- */

export interface AuthVisualDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const AuthVisualDescription = React.forwardRef<
  HTMLParagraphElement,
  AuthVisualDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm leading-relaxed text-white/70', className)}
    {...props}
  />
));
AuthVisualDescription.displayName = 'AuthVisualDescription';

/* ----- AuthVisualFeatures ----- */

export interface AuthVisualFeaturesProps extends React.HTMLAttributes<HTMLUListElement> {}

export const AuthVisualFeatures = React.forwardRef<HTMLUListElement, AuthVisualFeaturesProps>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn('mt-5 flex flex-col gap-3', className)}
      {...props}
    />
  ),
);
AuthVisualFeatures.displayName = 'AuthVisualFeatures';

/* ----- AuthVisualFeature ----- */

export interface AuthVisualFeatureProps extends React.HTMLAttributes<HTMLLIElement> {
  /** 行頭アイコン。既定は CheckCircle2（brand[400]） */
  icon?: React.ReactNode;
}

export const AuthVisualFeature = React.forwardRef<HTMLLIElement, AuthVisualFeatureProps>(
  ({ className, icon, children, ...props }, ref) => (
    <li
      ref={ref}
      className={cn('flex items-center gap-3 text-sm text-white/90', className)}
      {...props}
    >
      {icon ?? (
        <CheckCircle2
          className="h-4 w-4 shrink-0"
          style={{ color: brand[400] }}
          aria-hidden="true"
        />
      )}
      {children}
    </li>
  ),
);
AuthVisualFeature.displayName = 'AuthVisualFeature';
