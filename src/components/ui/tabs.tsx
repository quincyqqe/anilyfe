'use client';

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import { cn } from '@/lib/utils/cn';

type TabsVariant = 'line' | 'default';

interface TabsVariantProps {
  variant?: TabsVariant;
}

function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root data-slot="tabs" className={cn('flex flex-col', className)} {...props} />
  );
}

function TabsList({
  className,
  variant = 'default',
  ...props
}: TabsPrimitive.List.Props & TabsVariantProps) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(
        variant === 'line'
          ? 'scrollbar-none relative flex w-max items-center gap-6 overflow-x-auto'
          : 'flex w-max items-center gap-1 rounded-2xl border border-white/[0.04] bg-zinc-950/35 p-1',
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  variant = 'default',
  ...props
}: TabsPrimitive.Tab.Props & TabsVariantProps) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      data-variant={variant}
      className={cn(
        variant === 'line'
          ? 'flex items-center gap-2 pb-3 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors outline-none hover:text-foreground data-active:text-foreground'
          : 'flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold text-muted-foreground transition-colors outline-none hover:text-foreground data-active:bg-white/10 data-active:text-white',
        className,
      )}
      {...props}
    />
  );
}

function TabsIndicator({ className, ...props }: TabsPrimitive.Indicator.Props) {
  return (
    <TabsPrimitive.Indicator
      data-slot="tabs-indicator"
      className={cn(
        'absolute bottom-0 h-0.5 rounded-full bg-primary transition-[left,width] duration-300 ease-[cubic-bezier(0.34,1.3,0.64,1)]',
        className,
      )}
      style={{ left: 'var(--active-tab-left)', width: 'var(--active-tab-width)' }}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn('outline-none', className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsIndicator, TabsContent };
