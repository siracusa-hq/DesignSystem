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
      className={cn('relative flex max-w-md flex-col gap-3', className)}
      {...props}
    />
  ),
);
AuthVisualContent.displayName = 'AuthVisualContent';

/* ----- AuthVisualBackdrop ----- */

export interface AuthVisualBackdropProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 角の brand グロー。既定 true */
  glow?: boolean;
  /** 1px 罫グリッド（中央フェード付き）。既定 true */
  grid?: boolean;
}

/**
 * AuthLayoutVisual の装飾背景。AuthLayoutVisual の直下（コンテンツより前）に置く。
 * グローは画面外にはみ出す角配置、グリッドはヴィネットマスクで端をフェードさせ、
 * 中央のコンテンツ可読域にはどちらも掛からないようにしてある。
 */
export const AuthVisualBackdrop = React.forwardRef<HTMLDivElement, AuthVisualBackdropProps>(
  ({ className, glow = true, grid = true, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0', className)}
      {...props}
    >
      {grid && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '72px 72px',
            maskImage: 'radial-gradient(ellipse 90% 90% at 50% 40%, black 30%, transparent 80%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 90% 90% at 50% 40%, black 30%, transparent 80%)',
          }}
        />
      )}
      {glow && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(48rem 48rem at 88% -12%, ${brand[500]}40, transparent 68%), radial-gradient(52rem 52rem at -18% 112%, ${brand[700]}59, transparent 70%)`,
          }}
        />
      )}
    </div>
  ),
);
AuthVisualBackdrop.displayName = 'AuthVisualBackdrop';

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

/* ----- AuthVisualQuote ----- */

export interface AuthVisualQuoteProps extends React.HTMLAttributes<HTMLElement> {
  /** 発言者の氏名。匿名の引用は信頼演出として逆効果のため必須 */
  author: string;
  /** 役職・所属（例: `情報システム部長 / 株式会社〇〇`） */
  role?: string;
  /** 発言者の所属企業ロゴなど、氏名の横に添える要素 */
  logo?: React.ReactNode;
}

/**
 * 顧客の推薦文。「引用文 + 氏名 + 役職 + 企業ロゴ」の4点セットで使う
 * （Drata / Knock / Supabase 等の trust wall パターン）。
 * 既存ユーザーが毎日通るログイン画面では訴求過多になり得るため、
 * サインアップ寄りの画面での利用を推奨。
 */
export const AuthVisualQuote = React.forwardRef<HTMLElement, AuthVisualQuoteProps>(
  ({ className, author, role, logo, children, ...props }, ref) => (
    <figure ref={ref} className={cn('flex flex-col gap-5', className)} {...props}>
      <span
        aria-hidden="true"
        className="-mb-8 select-none text-7xl font-serif leading-none text-white/10"
      >
        “
      </span>
      <blockquote className="text-xl font-medium leading-relaxed text-white/90">
        {children}
      </blockquote>
      <figcaption className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-white/90">{author}</span>
          {role && <span className="text-xs text-white/60">{role}</span>}
        </div>
        {logo && <div className="opacity-70">{logo}</div>}
      </figcaption>
    </figure>
  ),
);
AuthVisualQuote.displayName = 'AuthVisualQuote';

/* ----- AuthVisualLogos ----- */

export interface AuthVisualLogosProps extends React.HTMLAttributes<HTMLDivElement> {
  /** ロゴ列の上に置くラベル（例: `導入企業`） */
  label?: string;
}

/**
 * 顧客ロゴ列。6点前後・単色（白/グレー化）が定石。
 * 原色ロゴをそのまま並べると広告に見えるため、子要素側で単色化して渡すこと。
 */
export const AuthVisualLogos = React.forwardRef<HTMLDivElement, AuthVisualLogosProps>(
  ({ className, label, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-4', className)} {...props}>
      {label && (
        <span className="text-xs uppercase tracking-widest text-white/50">{label}</span>
      )}
      <ul className="grid grid-cols-3 items-center gap-x-6 gap-y-4">
        {React.Children.map(children, (child) =>
          child == null ? null : (
            <li className="flex h-8 items-center text-white/70">{child}</li>
          ),
        )}
      </ul>
    </div>
  ),
);
AuthVisualLogos.displayName = 'AuthVisualLogos';

/* ----- AuthVisualStat ----- */

export interface AuthVisualStatProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 強調する数値・成果（例: `導入 8,000社+`） */
  value: string;
  /** 数値の補足説明 */
  label?: string;
}

/** 数値ピル。段落に埋めず独立させ、1画面 1〜2 個まで */
export const AuthVisualStat = React.forwardRef<HTMLDivElement, AuthVisualStatProps>(
  ({ className, value, label, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm',
        className,
      )}
      {...props}
    >
      <span className="font-semibold" style={{ color: brand[300] }}>
        {value}
      </span>
      {label && <span className="text-white/70">{label}</span>}
    </div>
  ),
);
AuthVisualStat.displayName = 'AuthVisualStat';
