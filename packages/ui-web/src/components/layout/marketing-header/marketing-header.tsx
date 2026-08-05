'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';
import { Container } from '@/components/primitives/container';
import { MarketingButton } from '@/components/primitives/marketing-button';
import { Logo } from '@/components/primitives/logo';
import styles from './marketing-header.module.css';

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface HeaderAction {
  label: string;
  href: string;
}

export interface MarketingHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, 'className'> {
  logo?: React.ReactNode;
  navItems?: NavItem[];
  /** variant は自動割当: 末尾 = primary / それ以外 = ghost */
  actions?: HeaderAction[];
  sticky?: boolean;
}

export const MarketingHeader = React.forwardRef<HTMLElement, MarketingHeaderProps>(
  ({ logo, navItems, actions, sticky = true, ...props }, ref) => {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
      if (!sticky) return;
      const onScroll = () => setScrolled(window.scrollY > 10);
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }, [sticky]);

    const actionButtons = (fullWidth: boolean) =>
      actions?.map((action, i) => (
        <MarketingButton
          key={i}
          variant={i === actions.length - 1 ? 'primary' : 'ghost'}
          size="sm"
          href={action.href}
          fullWidth={fullWidth}
        >
          {action.label}
        </MarketingButton>
      ));

    return (
      <header
        ref={ref}
        className={cn(styles.header, sticky && styles.sticky, scrolled && styles.scrolled)}
        {...props}
      >
        <Container>
          <div className={styles.bar}>
            <div className={styles.logoBox}>{logo ?? <Logo variant="full" height={32} />}</div>

            {navItems && navItems.length > 0 && (
              <nav className={styles.nav} aria-label="Main navigation">
                {navItems.map((item, i) =>
                  item.children && item.children.length > 0 ? (
                    <div key={i} className={styles.dropdown}>
                      <button type="button" className={styles.dropdownButton}>
                        {item.label}
                        <svg
                          className={styles.chevron}
                          fill="none"
                          viewBox="0 0 12 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden="true"
                        >
                          <path d="M3 5l3 3 3-3" />
                        </svg>
                      </button>
                      <div className={styles.dropdownPanelWrap}>
                        <div className={styles.dropdownPanel}>
                          {item.children.map((child, j) => (
                            <a key={j} href={child.href} className={styles.dropdownItem}>
                              {child.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <a key={i} href={item.href} className={styles.navLink}>
                      {item.label}
                    </a>
                  ),
                )}
              </nav>
            )}

            <div className={styles.actions}>{actionButtons(false)}</div>

            <button
              type="button"
              className={styles.menuButton}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
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

        {mobileOpen && (
          <div className={styles.mobileMenu}>
            <Container>
              <div className={styles.mobileInner}>
                {navItems?.map((item, i) => (
                  <a key={i} href={item.href} className={styles.mobileLink}>
                    {item.label}
                  </a>
                ))}
                {actions && actions.length > 0 && (
                  <div className={styles.mobileActions}>{actionButtons(true)}</div>
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
