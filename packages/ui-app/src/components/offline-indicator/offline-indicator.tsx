import * as React from 'react';
import { WifiOff } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface OfflineIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  isOffline: boolean;
  message?: string;
}

export const OfflineIndicator = React.forwardRef<
  HTMLDivElement,
  OfflineIndicatorProps
>(
  (
    {
      className,
      isOffline,
      message = 'オフラインです。一部の機能が制限されます。',
      ...props
    },
    ref,
  ) => {
    if (!isOffline) return null;

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'fixed top-0 left-0 right-0 z-toast flex items-center justify-center bg-warning-500 px-4 py-2 text-xs font-medium text-white pt-[calc(0.5rem+var(--safe-area-top))]',
          className,
        )}
        {...props}
      >
        <WifiOff className="mr-2 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {message}
      </div>
    );
  },
);
OfflineIndicator.displayName = 'OfflineIndicator';
