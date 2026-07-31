import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';
import { createContext } from '@/lib/create-context';

/* ----- Types ----- */

type TabsVariant = 'default' | 'underline';
type TabsColorScheme = 'neutral' | 'colored';

/* ----- Contexts ----- */

/**
 * Active value context — provided by Tabs root so that TabsList
 * can position its indicator purely from React state.
 */
const [TabsActiveProvider, useTabsActive] = createContext<{
  activeValue: string;
}>('TabsActive');

/**
 * Variant / colorScheme context — provided by TabsList so that
 * TabsTrigger can pick the right styles without prop drilling.
 */
const [TabsVariantProvider, useTabsVariant] = createContext<{
  variant: TabsVariant;
  colorScheme: TabsColorScheme;
}>('TabsVariant');

/**
 * Trigger registration context — provided by TabsList so that
 * each TabsTrigger can register its DOM node keyed by value.
 */
const [TabsTriggerMapProvider, useTabsTriggerMap] = createContext<{
  register: (value: string, node: HTMLButtonElement | null) => void;
}>('TabsTriggerMap');

/* ----- Tabs Root ----- */

export interface TabsProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {}

export const Tabs = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Root>,
  TabsProps
>(({ defaultValue, value, onValueChange, ...props }, ref) => {
  const [internalValue, setInternalValue] = React.useState(
    defaultValue ?? '',
  );
  const activeValue = value ?? internalValue;

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [value, onValueChange],
  );

  return (
    <TabsActiveProvider value={{ activeValue }}>
      <TabsPrimitive.Root
        ref={ref}
        defaultValue={defaultValue}
        value={value}
        onValueChange={handleValueChange}
        {...props}
      />
    </TabsActiveProvider>
  );
});
Tabs.displayName = 'Tabs';

/* ----- TabsList ----- */

const tabsListVariants = cva(
  // `isolate` で stacking context を TabsList 内に閉じる。これにより
  // TabsTrigger の `z-content` (= 1) が ancestor の Dialog/Drawer 等の上に
  // 漏れ出さない。詳細: docs/z-index-system.md
  'inline-flex items-center justify-center overflow-x-auto max-w-full relative isolate',
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

interface IndicatorStyle {
  width: number;
  x: number;
}

export const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant = 'default', colorScheme = 'neutral', children, ...props }, ref) => {
  const { activeValue } = useTabsActive();
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const triggerMapRef = React.useRef<Map<string, HTMLButtonElement>>(new Map());
  const [hasInitialized, setHasInitialized] = React.useState(false);
  const [indicator, setIndicator] = React.useState<IndicatorStyle>({
    width: 0,
    x: 0,
  });

  const register = React.useCallback(
    (value: string, node: HTMLButtonElement | null) => {
      if (node) {
        triggerMapRef.current.set(value, node);
      } else {
        triggerMapRef.current.delete(value);
      }
    },
    [],
  );

  // Recalculate indicator position when activeValue changes
  React.useEffect(() => {
    const list = listRef.current;
    const trigger = triggerMapRef.current.get(activeValue);
    if (!list || !trigger) return;

    const listRect = list.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    const offsetLeft = variant === 'default' ? 4 : 0; // p-1 padding

    setIndicator({
      width: triggerRect.width,
      x: triggerRect.left - listRect.left - offsetLeft,
    });

    if (!hasInitialized) setHasInitialized(true);
  }, [activeValue, variant, hasInitialized]);

  // Recalculate on resize
  React.useEffect(() => {
    const recalc = () => {
      const list = listRef.current;
      const trigger = triggerMapRef.current.get(activeValue);
      if (!list || !trigger) return;

      const listRect = list.getBoundingClientRect();
      const triggerRect = trigger.getBoundingClientRect();
      const offsetLeft = variant === 'default' ? 4 : 0;

      setIndicator({
        width: triggerRect.width,
        x: triggerRect.left - listRect.left - offsetLeft,
      });
    };

    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [activeValue, variant]);

  const indicatorClass =
    variant === 'underline'
      ? 'absolute bottom-0 left-0 h-0.5 bg-primary-400 pointer-events-none'
      : colorScheme === 'colored'
        ? 'absolute top-1 left-1 h-[calc(100%-8px)] rounded-md bg-primary-500 shadow-sm pointer-events-none'
        : 'absolute top-1 left-1 h-[calc(100%-8px)] rounded-md bg-[var(--color-surface-raised)] shadow-sm pointer-events-none';

  return (
    <TabsVariantProvider value={{ variant: variant!, colorScheme }}>
      <TabsTriggerMapProvider value={{ register }}>
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
          <span
            aria-hidden
            className={cn(
              indicatorClass,
              hasInitialized
                ? 'transition-all duration-slow ease-out'
                : 'transition-none',
            )}
            style={{
              width: indicator.width,
              transform: `translateX(${indicator.x}px)`,
              opacity: hasInitialized ? 1 : 0,
            }}
          />
        </TabsPrimitive.List>
      </TabsTriggerMapProvider>
    </TabsVariantProvider>
  );
});
TabsList.displayName = 'TabsList';

/* ----- TabsTrigger ----- */

const tabsTriggerBase =
  'inline-flex items-center justify-center whitespace-nowrap shrink-0 px-3 py-1.5 text-sm font-medium transition-colors duration-fast ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ' +
  'disabled:pointer-events-none disabled:opacity-50 ' +
  'touch:min-h-[--touch-target-min] relative z-content';

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
>(({ className, value, ...props }, ref) => {
  const { variant, colorScheme } = useTabsVariant();
  const { register } = useTabsTriggerMap();

  return (
    <TabsPrimitive.Trigger
      ref={(node) => {
        register(value, node);
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      value={value}
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
