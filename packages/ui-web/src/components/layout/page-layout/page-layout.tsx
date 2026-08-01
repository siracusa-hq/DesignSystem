import * as React from 'react';
import { cn } from '@/lib/cn';
import { MarketingHeader, type MarketingHeaderProps } from '../marketing-header';
import { MarketingFooter, type MarketingFooterProps } from '../marketing-footer';

export interface PageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  headerProps?: MarketingHeaderProps;
  footerProps?: MarketingFooterProps;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const PageLayout = React.forwardRef<HTMLDivElement, PageLayoutProps>(
  ({ className, headerProps, footerProps, header, footer, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex min-h-screen flex-col', className)} {...props}>
      {header ?? (headerProps ? <MarketingHeader {...headerProps} /> : null)}
      <main className="flex-1">{children}</main>
      {footer ?? (footerProps ? <MarketingFooter {...footerProps} /> : null)}
    </div>
  ),
);
PageLayout.displayName = 'PageLayout';
