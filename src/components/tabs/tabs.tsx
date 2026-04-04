import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';
import { createContext } from '@/lib/create-context';

/* ----- Context for variant propagation ----- */

type TabsVariant = 'default' | 'underline';
type TabsColorScheme = 'neutral' | 'colored';

const [TabsVariantProvider, useTabsVariant] = createContext<{
  variant: TabsVariant;
  colorScheme: TabsColorScheme;
  listRef: React.RefObject<HTMLDivElement | null>;
}>('TabsVariant');

/* ----- Tabs Root ----- */

export const Tabs = TabsPrimitive.Root;

/* ----- TabsList ----- */

const tabsListVariants = cva(
  'inline-flex items-center justify-center overflow-x-auto max-w-full relative',
  {
    variants: {
      variant: {
        default: 'rounded-lg bg-[var(--color-surface-muted)] p-1',
        underline: 'border-b border-[var(--color-border)] bg-transparent',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {
  /** Color scheme for the active tab indicator. @default 'neutral' */
  colorScheme?: TabsColorScheme;
}

export const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant = 'default', colorScheme = 'neutral', children, ...props }, ref) => {
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const activeRef = React.useRef<HTMLButtonElement | null>(null);
  const [, forceRender] = React.useState(0);

  React.useEffect(() => {
    const container = listRef.current;
    if (!container) return;

    const findActive = () => {
      const active = container.querySelector<HTMLButtonElement>(
        '[role="tab"][data-state="active"]',
      );
      if (active !== activeRef.current) {
        activeRef.current = active;
        forceRender((c) => c + 1);
      }
    };

    findActive();

    const observer = new MutationObserver(findActive);
    observer.observe(container, {
      attributes: true,
      subtree: true,
      attributeFilter: ['data-state'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <TabsVariantProvider value={{ variant: variant!, colorScheme, listRef }}>
      <TabsPrimitive.List
        ref={(node) => {
          listRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(tabsListVariants({ variant }), className)}
        {...props}
      >
        {children}
        {activeRef.current && (
          <TabsIndicator triggerRef={activeRef} />
        )}
      </TabsPrimitive.List>
    </TabsVariantProvider>
  );
});
TabsList.displayName = 'TabsList';

/* ----- Active indicator (sliding animation) ----- */

interface TabsIndicatorProps {
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

function TabsIndicator({ triggerRef }: TabsIndicatorProps) {
  const { variant, colorScheme, listRef } = useTabsVariant();
  const [style, setStyle] = React.useState<React.CSSProperties>({
    opacity: 0,
  });

  const update = React.useCallback(() => {
    const trigger = triggerRef.current;
    const list = listRef.current;
    if (!trigger || !list) return;

    const listRect = list.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();

    const offsetLeft = variant === 'default' ? 4 : 0; // account for p-1 padding

    setStyle({
      width: triggerRect.width,
      transform: `translateX(${triggerRect.left - listRect.left - offsetLeft}px)`,
      opacity: 1,
    });
  }, [triggerRef, listRef, variant]);

  React.useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update]);

  const indicatorClass =
    variant === 'underline'
      ? 'absolute bottom-0 left-0 h-0.5 bg-primary-400 transition-all duration-normal ease-out pointer-events-none'
      : colorScheme === 'colored'
        ? 'absolute top-1 left-1 h-[calc(100%-8px)] rounded-md bg-primary-500 shadow-sm transition-all duration-normal ease-out pointer-events-none'
        : 'absolute top-1 left-1 h-[calc(100%-8px)] rounded-md bg-[var(--color-surface-raised)] shadow-sm transition-all duration-normal ease-out pointer-events-none';

  return (
    <span
      aria-hidden
      className={indicatorClass}
      style={style}
    />
  );
}

/* ----- TabsTrigger ----- */

const tabsTriggerBase =
  'inline-flex items-center justify-center whitespace-nowrap shrink-0 px-3 py-1.5 text-sm font-medium transition-colors duration-fast ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ' +
  'disabled:pointer-events-none disabled:opacity-50 ' +
  'touch:min-h-[--touch-target-min] relative z-[1]';

const getTabsTriggerVariantStyles = (
  variant: TabsVariant,
  colorScheme: TabsColorScheme,
): string => {
  if (variant === 'underline') {
    return 'border-b-2 border-transparent rounded-none data-[state=active]:text-[var(--color-on-surface)] text-[var(--color-on-surface-secondary)]';
  }
  if (colorScheme === 'colored') {
    return 'rounded-md data-[state=active]:text-white text-[var(--color-on-surface-secondary)]';
  }
  return 'rounded-md data-[state=active]:text-[var(--color-on-surface)] text-[var(--color-on-surface-secondary)]';
};

export const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const { variant, colorScheme } = useTabsVariant();

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        tabsTriggerBase,
        getTabsTriggerVariantStyles(variant, colorScheme),
        className,
      )}
      {...props}
    />
  );
});
TabsTrigger.displayName = 'TabsTrigger';

/* ----- TabsContent ----- */

export const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = 'TabsContent';
