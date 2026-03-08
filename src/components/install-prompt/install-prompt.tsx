import * as React from 'react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/button';

export interface InstallPromptProps
  extends React.HTMLAttributes<HTMLDivElement> {
  canInstall: boolean;
  onInstall: () => void;
  onDismiss: () => void;
  title?: string;
  description?: string;
  installLabel?: string;
  dismissLabel?: string;
}

export const InstallPrompt = React.forwardRef<HTMLDivElement, InstallPromptProps>(
  (
    {
      className,
      canInstall,
      onInstall,
      onDismiss,
      title = 'アプリをインストール',
      description = 'ホーム画面に追加すると、すぐにアクセスできます。',
      installLabel = 'インストール',
      dismissLabel = '後で',
      ...props
    },
    ref,
  ) => {
    if (!canInstall) return null;

    return (
      <div
        ref={ref}
        role="dialog"
        aria-label={title}
        className={cn(
          'fixed bottom-0 left-0 right-0 z-modal border-t border-neutral-200 bg-white p-4 shadow-lg pb-[calc(1rem+var(--safe-area-bottom))]',
          className,
        )}
        {...props}
      >
        <div className="mx-auto max-w-md">
          <p className="text-sm font-semibold text-neutral-900">{title}</p>
          <p className="mt-1 text-xs text-neutral-500">{description}</p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={onInstall} className="flex-1">
              {installLabel}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onDismiss}
              className="flex-1"
            >
              {dismissLabel}
            </Button>
          </div>
        </div>
      </div>
    );
  },
);
InstallPrompt.displayName = 'InstallPrompt';
