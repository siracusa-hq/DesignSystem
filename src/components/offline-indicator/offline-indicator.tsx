import * as React from 'react';
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 shrink-0"
          aria-hidden="true"
        >
          <line x1="2" x2="22" y1="2" y2="22" />
          <path d="M8.5 16.5a5 5 0 0 1 7 0" />
          <path d="M2 8.82a15 15 0 0 1 4.17-2.65" />
          <path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76" />
          <path d="M16.85 11.25a10 10 0 0 1 2.22 1.68" />
          <path d="M5 12.859a10 10 0 0 1 5.17-2.69" />
          <line x1="12" x2="12.01" y1="20" y2="20" />
        </svg>
        {message}
      </div>
    );
  },
);
OfflineIndicator.displayName = 'OfflineIndicator';
