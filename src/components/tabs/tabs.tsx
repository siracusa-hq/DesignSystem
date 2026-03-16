import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';
import { createContext } from '@/lib/create-context';

/* ----- Context for variant propagation ----- */

type TabsVariant = 'default' | 'underline';

const [TabsVariantProvider, useTabsVariant] = createContext<{
  variant: TabsVariant;
}>('TabsVariant');

/* ----- Tabs Root ----- */

export const Tabs = TabsPrimitive.Root;

/* ----- TabsList ----- */

const tabsListVariants = cva(
  'inline-flex items-center justify-center',
  {
    variants: {
      variant: {
        default: 'rounded-lg bg-[--color-surface-muted] p-1',
        underline: 'border-b border-[--color-border] bg-transparent',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

export const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant = 'default', ...props }, ref) => (
  <TabsVariantProvider value={{ variant: variant! }}>
    <TabsPrimitive.List
      ref={ref}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  </TabsVariantProvider>
));
TabsList.displayName = 'TabsList';

/* ----- TabsTrigger ----- */

const tabsTriggerBase =
  'inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-all duration-fast ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ' +
  'disabled:pointer-events-none disabled:opacity-50 ' +
  'touch:min-h-[--touch-target-min]';

const tabsTriggerVariantStyles: Record<TabsVariant, string> = {
  default:
    'rounded-md data-[state=active]:bg-[--color-surface-raised] data-[state=active]:shadow-sm data-[state=active]:text-[--color-on-surface] text-[--color-on-surface-secondary]',
  underline:
    'border-b-2 border-transparent rounded-none data-[state=active]:border-primary-500 data-[state=active]:text-[--color-on-surface] text-[--color-on-surface-secondary]',
};

export const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const { variant } = useTabsVariant();

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        tabsTriggerBase,
        tabsTriggerVariantStyles[variant],
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
