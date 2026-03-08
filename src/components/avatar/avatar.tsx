import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';
import { createContext } from '@/lib/create-context';

const [AvatarContextProvider, useAvatarContext] = createContext<{
  imageLoaded: boolean;
  setImageLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}>('Avatar');

export const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full',
  {
    variants: {
      size: {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof avatarVariants> {}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, size, ...props }, ref) => {
    const [imageLoaded, setImageLoaded] = React.useState(false);

    return (
      <AvatarContextProvider value={{ imageLoaded, setImageLoaded }}>
        <span
          ref={ref}
          className={cn(avatarVariants({ size }), className)}
          {...props}
        />
      </AvatarContextProvider>
    );
  },
);
Avatar.displayName = 'Avatar';

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

export interface AvatarFallbackProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

export const AvatarFallback = React.forwardRef<
  HTMLSpanElement,
  AvatarFallbackProps
>(({ className, ...props }, ref) => {
  const { imageLoaded } = useAvatarContext();

  if (imageLoaded) return null;

  return (
    <span
      ref={ref}
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-neutral-200 font-medium text-neutral-600',
        className,
      )}
      {...props}
    />
  );
});
AvatarFallback.displayName = 'AvatarFallback';
