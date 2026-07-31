import * as React from 'react';
import { cn } from '@/lib/cn';
import { Container } from '@/components/primitives/container';
import { Text } from '@/components/primitives/text';
import { Logo } from '@/components/primitives/logo';
import { Divider } from '@/components/primitives/divider';

export interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

export interface SocialLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export interface MarketingFooterProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  description?: string;
  linkGroups?: FooterLinkGroup[];
  socialLinks?: SocialLink[];
  legalLinks?: { label: string; href: string }[];
  copyright?: string;
}

export const MarketingFooter = React.forwardRef<HTMLElement, MarketingFooterProps>(
  (
    {
      className,
      logo,
      description,
      linkGroups,
      socialLinks,
      legalLinks,
      copyright,
      ...props
    },
    ref,
  ) => (
    <footer
      ref={ref}
      className={cn(
        'border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950',
        className,
      )}
      {...props}
    >
      <Container>
        <div className="py-12 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-12">
            {/* ロゴ + 説明 */}
            <div className="lg:col-span-4">
              <div className="mb-4">
                {logo ?? <Logo variant="full" colorScheme="primary" className="h-8" />}
              </div>
              {description && (
                <Text size="body-sm" tone="secondary" className="max-w-xs">
                  {description}
                </Text>
              )}
              {socialLinks && socialLinks.length > 0 && (
                <div className="mt-6 flex gap-4">
                  {socialLinks.map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      aria-label={social.label}
                      className="text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-white"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* リンクカラム */}
            {linkGroups && linkGroups.length > 0 && (
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
                {linkGroups.map((group, i) => (
                  <div key={i}>
                    <Text as="div" size="body-sm" tone="default" className="mb-3 font-semibold">
                      {group.title}
                    </Text>
                    <ul className="space-y-2">
                      {group.links.map((link, j) => (
                        <li key={j}>
                          <a
                            href={link.href}
                            className="text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-white"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Divider variant="solid" spacing="none" />

        {/* ボトムバー */}
        <div className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          {copyright && (
            <Text size="caption" tone="muted">
              {copyright}
            </Text>
          )}
          {legalLinks && legalLinks.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {legalLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className="text-xs text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </Container>
    </footer>
  ),
);
MarketingFooter.displayName = 'MarketingFooter';
