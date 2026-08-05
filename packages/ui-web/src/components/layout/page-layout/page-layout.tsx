import * as React from 'react';
import styles from './page-layout.module.css';
import { MarketingHeader, type MarketingHeaderProps } from '../marketing-header';
import { MarketingFooter, type MarketingFooterProps } from '../marketing-footer';

export interface PageLayoutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  headerProps?: MarketingHeaderProps;
  footerProps?: MarketingFooterProps;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const PageLayout = React.forwardRef<HTMLDivElement, PageLayoutProps>(
  ({ headerProps, footerProps, header, footer, children, ...props }, ref) => (
    <div ref={ref} className={styles.layout} {...props}>
      {header ?? (headerProps ? <MarketingHeader {...headerProps} /> : null)}
      <main className={styles.main}>{children}</main>
      {footer ?? (footerProps ? <MarketingFooter {...footerProps} /> : null)}
    </div>
  ),
);
PageLayout.displayName = 'PageLayout';
