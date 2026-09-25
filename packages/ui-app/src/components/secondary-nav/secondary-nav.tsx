import * as React from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cn } from '@/lib/cn';

/* --------------------------------------------------------
   SecondaryNav

   1階層目のサイドバー（AppShellSidebar + SidebarNav）で選んだ項目に紐づく
   2階層目のナビゲーション。設定画面の「ユーザー設定 / 通知設定 / チーム設定 …」
   のような縦並びタブとして使う。

   - md 以上: 固定幅の縦カラム（右ボーダー）
   - md 未満: 上部の横スクロールバー（下ボーダー）に自動で切り替わる。
     2階層目をモバイルで縦に積むと本文が画面外に押し出されるため、
     レイアウトは CSS のみで分岐し JS での出し分けは持たない
   -------------------------------------------------------- */

export interface SecondaryNavProps extends React.HTMLAttributes<HTMLElement> {
  /** md 以上での幅(px)。既定 224 */
  width?: number;
}

export const SecondaryNav = React.forwardRef<HTMLElement, SecondaryNavProps>(
  ({ className, width = 224, style, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn(
        // モバイル: 横スクロールの1行。md+: 固定幅の縦カラム
        // 背景を半段沈めて、1階層目(AppShellSidebar=raised)との階層差を
        // ボーダーだけでなく背景の段差でも読めるようにする。
        // sunken をそのまま使うとダークモードで段差が強すぎるため、
        // surface との中間色(50%)に留める
        'flex shrink-0 gap-1 overflow-x-auto border-b border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-surface-sunken)_50%,var(--color-surface))] px-3 py-2',
        'md:w-[var(--secondary-nav-width)] md:flex-col md:overflow-x-visible md:overflow-y-auto md:border-b-0 md:border-r md:py-4',
        className,
      )}
      style={
        {
          '--secondary-nav-width': `${width}px`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  ),
);
SecondaryNav.displayName = 'SecondaryNav';

/* --------------------------------------------------------
   SecondaryNavHeader
   -------------------------------------------------------- */

/**
 * ナビ先頭の見出し（例:「設定」）。モバイルの横並び時は場所を取るだけなので
 * 非表示にし、md 以上でのみ表示する。
 */
export const SecondaryNavHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'hidden md:block px-2.5 pb-2 text-sm font-semibold text-[var(--color-on-surface)]',
      className,
    )}
    {...props}
  />
));
SecondaryNavHeader.displayName = 'SecondaryNavHeader';

/* --------------------------------------------------------
   SecondaryNavSection
   -------------------------------------------------------- */

export interface SecondaryNavSectionProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** セクション見出し。モバイルの横並び時は非表示 */
  title?: string;
}

/**
 * 項目のグルーピング。SidebarNavGroup と異なり開閉はしない
 * （設定ナビは項目数が一覧できる規模であるべきで、折りたたみは現在地を隠す）。
 * モバイルでは見出しを隠し、項目だけが横一列に流れる。
 */
export const SecondaryNavSection = React.forwardRef<
  HTMLDivElement,
  SecondaryNavSectionProps
>(({ className, title, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex gap-1 md:mt-4 md:flex-col md:gap-0.5 md:first:mt-0', className)}
    {...props}
  >
    {title && (
      <div className="hidden md:block px-2.5 pb-1 pt-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-muted)]">
        {title}
      </div>
    )}
    {children}
  </div>
));
SecondaryNavSection.displayName = 'SecondaryNavSection';

/* --------------------------------------------------------
   SecondaryNavItem
   -------------------------------------------------------- */

export interface SecondaryNavItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  active?: boolean;
  badge?: React.ReactNode;
  /**
   * true のとき Slot として単一子（例: next/link の `Link`）へ props/className を
   * マージし、icon・label・badge をその子の内側に描画する。SidebarNavItem と同じ規約。
   */
  asChild?: boolean;
}

export const SecondaryNavItem = React.forwardRef<
  HTMLButtonElement,
  SecondaryNavItemProps
>(
  (
    { className, icon, active = false, badge, asChild = false, children, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        {...(asChild ? {} : { type: 'button' as const })}
        className={cn(
          // モバイル: 幅なりのピル。md+: 全幅の行
          'flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-sm transition-colors touch:min-h-[--touch-target-min]',
          'md:w-full md:whitespace-normal',
          active
            ? 'bg-[var(--color-surface-accent)] text-[var(--color-on-surface-accent)] font-medium'
            : 'text-[var(--color-on-surface-secondary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-on-surface)]',
          className,
        )}
        aria-current={active ? 'page' : undefined}
        {...props}
      >
        {icon && (
          <span className={cn('shrink-0', active ? 'opacity-100' : 'opacity-70')}>
            {icon}
          </span>
        )}
        {asChild ? (
          <Slottable>{children}</Slottable>
        ) : (
          <span className="text-left md:flex-1 md:truncate">{children}</span>
        )}
        {badge && (
          <span
            className={cn(
              'min-w-[20px] rounded-full px-1.5 py-0.5 text-center text-xs font-medium',
              // asChild では label が flex-1 span に包まれないため右端へ寄せる
              asChild && 'md:ml-auto',
              active
                ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)] dark:bg-[var(--color-primary-950)] dark:text-[var(--color-primary-300)]'
                : // ナビ背景が surface-sunken なので、バッジは1段上の muted で埋没を防ぐ
                  'bg-[var(--color-surface-muted)] text-[var(--color-on-surface-muted)]',
            )}
          >
            {badge}
          </span>
        )}
      </Comp>
    );
  },
);
SecondaryNavItem.displayName = 'SecondaryNavItem';
