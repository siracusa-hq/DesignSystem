'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';
import { Container } from '@/components/primitives/container';
import { MarketingButton } from '@/components/primitives/marketing-button';
import { Logo } from '@/components/primitives/logo';

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface HeaderAction {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'gradient';
}

export interface MarketingHeaderProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  navItems?: NavItem[];
  actions?: HeaderAction[];
  sticky?: boolean;
}

export const MarketingHeader = React.forwardRef<HTMLElement, MarketingHeaderProps>(
  ({ className, logo, navItems, actions, sticky = true, ...props }, ref) => {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
      if (!sticky) return;
      const onScroll = () => setScrolled(window.scrollY > 10);
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }, [sticky]);

    return (
      <header
        ref={ref}
        className={cn(
          'z-50 w-full transition-all duration-200',
          sticky && 'sticky top-0',
          scrolled
            ? 'border-b border-neutral-200 bg-white/80 backdrop-blur-lg dark:border-neutral-800 dark:bg-neutral-950/80'
            : 'bg-transparent',
          className,
        )}
        {...props}
      >
        <Container>
          <div className="flex h-16 items-center justify-between">
            {/* ロゴ */}
            <div className="shrink-0">
              {logo ?? <Logo variant="full" colorScheme="primary" className="h-8" />}
            </div>

            {/* デスクトップナビ */}
            {navItems && navItems.length > 0 && (
              <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
                {navItems.map((item, i) =>
                  item.children && item.children.length > 0 ? (
                    <div key={i} className="group relative">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                      >
                        {item.label}
                        <svg className="h-3 w-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2">
                          <path d="M3 5l3 3 3-3" />
                        </svg>
                      </button>
                      <div className="pointer-events-none absolute left-1/2 top-full z-50 min-w-48 -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                        <div className="rounded-xl border border-neutral-200 bg-white p-2 shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
                          {item.children.map((child, j) => (
                            <a
                              key={j}
                              href={child.href}
                              className="block rounded-lg px-3 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
                            >
                              {child.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <a
                      key={i}
                      href={item.href}
                      className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                    >
                      {item.label}
                    </a>
                  ),
                )}
              </nav>
            )}

            {/* デスクトップアクション */}
            <div className="hidden items-center gap-3 md:flex">
              {actions?.map((action, i) => (
                <MarketingButton
                  key={i}
                  variant={action.variant ?? (i === actions.length - 1 ? 'primary' : 'ghost')}
                  size="sm"
                  href={action.href}
                >
                  {action.label}
                </MarketingButton>
              ))}
            </div>

            {/* モバイルメニューボタン */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-neutral-600 hover:text-neutral-900 md:hidden dark:text-neutral-400 dark:hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="8" x2="20" y2="8" />
                    <line x1="4" y1="16" x2="20" y2="16" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </Container>

        {/* モバイルメニュー */}
        {mobileOpen && (
          <div className="border-t border-neutral-200 bg-white md:hidden dark:border-neutral-800 dark:bg-neutral-950">
            <Container>
              <div className="space-y-1 py-4">
                {navItems?.map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
                {actions && actions.length > 0 && (
                  <div className="flex flex-col gap-2 pt-4">
                    {actions.map((action, i) => (
                      <MarketingButton
                        key={i}
                        variant={action.variant ?? (i === actions.length - 1 ? 'primary' : 'ghost')}
                        size="sm"
                        href={action.href}
                        className="w-full"
                      >
                        {action.label}
                      </MarketingButton>
                    ))}
                  </div>
                )}
              </div>
            </Container>
          </div>
        )}
      </header>
    );
  },
);
MarketingHeader.displayName = 'MarketingHeader';
