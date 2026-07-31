import * as React from 'react';
import { cn } from '@/lib/cn';

interface KanbanScrollSnapProps extends React.HTMLAttributes<HTMLDivElement> {
  columnCount: number;
}

export const KanbanScrollSnap = React.forwardRef<
  HTMLDivElement,
  KanbanScrollSnapProps
>(({ columnCount, className, children, ...props }, ref) => {
  const outerRef = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useImperativeHandle(ref, () => scrollRef.current!);

  // Measure outer container and set CSS variable for column width
  React.useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    const updateWidth = () => {
      const w = outer.clientWidth;
      outer.style.setProperty('--kanban-snap-col-w', `${w}px`);
    };

    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(outer);
    return () => ro.disconnect();
  }, []);

  // Track scroll position for dot indicator
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const outer = outerRef.current;
      if (!outer) return;
      const colW = outer.clientWidth;
      if (colW === 0) return;
      const index = Math.round(el.scrollLeft / colW);
      setActiveIndex(Math.min(index, columnCount - 1));
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [columnCount]);

  return (
    <div ref={outerRef} className="flex w-full flex-col overflow-hidden">
      <div
        ref={scrollRef}
        className={cn(
          'flex snap-x snap-mandatory overflow-x-auto scroll-smooth',
          className,
        )}
        {...props}
      >
        {children}
      </div>

      {columnCount > 1 && (
        <div
          className="flex items-center justify-center gap-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
          aria-hidden="true"
        >
          {Array.from({ length: columnCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              tabIndex={-1}
              onClick={() => {
                const el = scrollRef.current;
                const outer = outerRef.current;
                if (!el || !outer) return;
                el.scrollTo({ left: outer.clientWidth * i, behavior: 'smooth' });
              }}
              className={cn(
                'h-2 w-2 rounded-full transition-colors',
                i === activeIndex
                  ? 'bg-primary-500'
                  : 'bg-neutral-300 dark:bg-neutral-600',
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
});
KanbanScrollSnap.displayName = 'KanbanScrollSnap';

export const KanbanScrollSnapColumn = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('shrink-0 snap-start px-4 box-border', className)}
    style={{ width: 'var(--kanban-snap-col-w, 100%)' }}
    {...props}
  />
));
KanbanScrollSnapColumn.displayName = 'KanbanScrollSnapColumn';
