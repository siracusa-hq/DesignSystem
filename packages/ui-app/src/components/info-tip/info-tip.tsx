import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { Info } from 'lucide-react';
import { cn } from '@/lib/cn';
import { TooltipContent } from '@/components/tooltip';

export interface InfoTipProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'content'
> {
  /** ツールチップに表示する説明 */
  content: React.ReactNode;
  /** トリガーのアクセシブルネーム。何についての説明かが分かる文言にする */
  label?: string;
  side?: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>['side'];
  align?: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>['align'];
  size?: 'sm' | 'md';
  delayDuration?: number;
}

const iconSize = { sm: 'size-3.5', md: 'size-4' } as const;

/**
 * i アイコンにホバー / フォーカスすると説明を出す。タッチ端末ではタップで開閉する。
 *
 * Radix Tooltip はトリガーのクリック（pointerdown / click）で閉じる設計なので、
 * それらを preventDefault して既定の処理を止め、開閉をこちらで制御している
 * （Radix の composeEventHandlers は defaultPrevented なら既定処理を飛ばす）。
 */
export const InfoTip = React.forwardRef<HTMLButtonElement, InfoTipProps>(
  (
    {
      content,
      label = '詳細情報',
      side = 'top',
      align = 'center',
      size = 'md',
      delayDuration = 200,
      className,
      onPointerDown,
      onClick,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const pointerTypeRef = React.useRef<string | null>(null);
    const wasOpenRef = React.useRef(false);

    return (
      <TooltipPrimitive.Provider delayDuration={delayDuration}>
        <TooltipPrimitive.Root open={open} onOpenChange={setOpen}>
          <TooltipPrimitive.Trigger
            ref={ref}
            type="button"
            aria-label={label}
            className={cn(
              'relative inline-flex shrink-0 items-center justify-center rounded-full align-middle text-[var(--color-on-surface-muted)] transition-colors duration-fast',
              'hover:text-[var(--color-on-surface-secondary)] data-[state=delayed-open]:text-[var(--color-on-surface-secondary)] data-[state=instant-open]:text-[var(--color-on-surface-secondary)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 ring-offset-[var(--color-ring-offset)]',
              // アイコンは小さいまま、タップ領域だけ 44px 相当に広げる
              "touch:after:absolute touch:after:-inset-3.5 touch:after:content-['']",
              className,
            )}
            onPointerDown={(event) => {
              onPointerDown?.(event);
              pointerTypeRef.current = event.pointerType;
              wasOpenRef.current = open;
              event.preventDefault();
            }}
            onClick={(event) => {
              onClick?.(event);
              event.preventDefault();
              // タッチはタップごとに開閉、マウス・キーボードは開いたままにする
              setOpen(pointerTypeRef.current === 'touch' ? !wasOpenRef.current : true);
              pointerTypeRef.current = null;
            }}
            {...props}
          >
            <Info className={iconSize[size]} aria-hidden />
          </TooltipPrimitive.Trigger>
          <TooltipContent
            side={side}
            align={align}
            // 説明文は複数行になり得るので幅を抑える。
            // TooltipContent はタッチで非表示だが、InfoTip はタップで開くので表示する
            className="max-w-xs leading-relaxed touch:block"
          >
            {content}
          </TooltipContent>
        </TooltipPrimitive.Root>
      </TooltipPrimitive.Provider>
    );
  },
);
InfoTip.displayName = 'InfoTip';
