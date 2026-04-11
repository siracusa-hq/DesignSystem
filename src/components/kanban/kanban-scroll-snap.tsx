import * as React from 'react';
import { cn } from '@/lib/cn';

interface KanbanScrollSnapProps extends React.HTMLAttributes<HTMLDivElement> {
  columnCount: number;
}

export const KanbanScrollSnap = React.forwardRef<
  HTMLDivElement,
  KanbanScrollSnapProps
>(({ columnCount, className, children, ...props }, ref) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useImperativeHandle(ref, () => scrollRef.current!);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollLeft = el.scrollLeft;
      const columnWidth = el.scrollWidth / columnCount;
      const index = Math.round(scrollLeft / columnWidth);
      setActiveIndex(Math.min(index, columnCount - 1));
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [columnCount]);

  return (
    <div className="flex flex-col">
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
                if (!el) return;
                const columnWidth = el.scrollWidth / columnCount;
                el.scrollTo({ left: columnWidth * i, behavior: 'smooth' });
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
    className={cn('w-full shrink-0 snap-start px-2', className)}
    {...props}
  />
));
KanbanScrollSnapColumn.displayName = 'KanbanScrollSnapColumn';
