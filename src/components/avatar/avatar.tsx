import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';
import { createContext } from '@/lib/create-context';
import { stringToIndex } from '@/lib/string-hash';

/* ----- Context ----- */

const [AvatarContextProvider, useAvatarContext] = createContext<{
  imageLoaded: boolean;
  setImageLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  shape: 'circle' | 'square';
  size: 'sm' | 'md' | 'lg';
}>('Avatar');

/* ----- Color Palette ----- */

const FALLBACK_COLORS = [
  'bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-300',
  'bg-success-100 text-success-700 dark:bg-success-950 dark:text-success-300',
  'bg-warning-100 text-warning-700 dark:bg-warning-950 dark:text-warning-300',
  'bg-error-100 text-error-700 dark:bg-error-950 dark:text-error-300',
  'bg-info-100 text-info-700 dark:bg-info-950 dark:text-info-300',
  'bg-primary-200 text-primary-800 dark:bg-primary-900 dark:text-primary-200',
  'bg-info-200 text-info-800 dark:bg-info-900 dark:text-info-200',
  'bg-success-200 text-success-800 dark:bg-success-900 dark:text-success-200',
] as const;

/* ----- Avatar ----- */

export const avatarVariants = cva('relative flex shrink-0 overflow-hidden', {
  variants: {
    size: {
      sm: 'h-8 w-8 text-xs',
      md: 'h-10 w-10 text-sm',
      lg: 'h-12 w-12 text-base',
    },
    shape: {
      circle: 'rounded-full',
      square: 'rounded-lg',
    },
  },
  defaultVariants: {
    size: 'md',
    shape: 'circle',
  },
});

export interface AvatarProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof avatarVariants> {}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, size = 'md', shape = 'circle', ...props }, ref) => {
    const [imageLoaded, setImageLoaded] = React.useState(false);

    return (
      <AvatarContextProvider
        value={{ imageLoaded, setImageLoaded, shape: shape!, size: size! }}
      >
        <span
          ref={ref}
          className={cn(avatarVariants({ size, shape }), className)}
          {...props}
        />
      </AvatarContextProvider>
    );
  },
);
Avatar.displayName = 'Avatar';

/* ----- AvatarImage ----- */

export interface AvatarImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {}

export const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, onLoad, onError, ...props }, ref) => {
    const { imageLoaded, setImageLoaded } = useAvatarContext();

    return (
      <img
        ref={ref}
        className={cn(
          'aspect-square h-full w-full object-cover',
          !imageLoaded && 'hidden',
          className,
        )}
        onLoad={(e) => {
          setImageLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          setImageLoaded(false);
          onError?.(e);
        }}
        {...props}
      />
    );
  },
);
AvatarImage.displayName = 'AvatarImage';

/* ----- AvatarFallback ----- */

export interface AvatarFallbackProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** String used to deterministically pick a fallback color. If omitted, uses neutral gray. */
  colorSeed?: string;
}

export const AvatarFallback = React.forwardRef<
  HTMLSpanElement,
  AvatarFallbackProps
>(({ className, colorSeed, ...props }, ref) => {
  const { imageLoaded, shape } = useAvatarContext();

  if (imageLoaded) return null;

  const colorClasses = colorSeed
    ? FALLBACK_COLORS[stringToIndex(colorSeed, FALLBACK_COLORS.length)]
    : 'bg-[var(--color-surface-muted)] text-[var(--color-on-surface-secondary)]';

  return (
    <span
      ref={ref}
      className={cn(
        'flex h-full w-full items-center justify-center font-medium',
        shape === 'circle' ? 'rounded-full' : 'rounded-lg',
        colorClasses,
        className,
      )}
      {...props}
    />
  );
});
AvatarFallback.displayName = 'AvatarFallback';

/* ----- AvatarStatus ----- */

export type AvatarStatusType = 'online' | 'offline' | 'busy' | 'away';

export interface AvatarStatusProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  status: AvatarStatusType;
}

const STATUS_COLORS: Record<AvatarStatusType, string> = {
  online: 'bg-success-500',
  offline: 'bg-neutral-400',
  busy: 'bg-error-500',
  away: 'bg-warning-500',
};

const STATUS_LABELS: Record<AvatarStatusType, string> = {
  online: 'Online',
  offline: 'Offline',
  busy: 'Busy',
  away: 'Away',
};

const STATUS_SIZES: Record<string, string> = {
  sm: 'h-2.5 w-2.5',
  md: 'h-3 w-3',
  lg: 'h-3.5 w-3.5',
};

export const AvatarStatus = React.forwardRef<
  HTMLSpanElement,
  AvatarStatusProps
>(({ status, className, ...props }, ref) => {
  const { size, shape } = useAvatarContext();

  return (
    <span
      ref={ref}
      role="status"
      aria-label={props['aria-label'] ?? STATUS_LABELS[status]}
      className={cn(
        'absolute bottom-0 right-0 rounded-full ring-2 ring-[var(--color-surface)]',
        STATUS_COLORS[status],
        STATUS_SIZES[size],
        shape === 'circle' && 'translate-x-[10%] translate-y-[10%]',
        className,
      )}
      {...props}
    />
  );
});
AvatarStatus.displayName = 'AvatarStatus';
