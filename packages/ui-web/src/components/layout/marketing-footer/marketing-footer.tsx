import * as React from 'react';
import { cn } from '@/lib/cn';
import styles from './marketing-footer.module.css';
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
    { className, logo, description, linkGroups, socialLinks, legalLinks, copyright, ...props },
    ref,
  ) => (
    <footer ref={ref} className={cn(styles.footer, className)} {...props}>
      <Container>
        <div className={styles.main}>
          <div className={styles.grid}>
            {/* ロゴ + 説明 */}
            <div className={styles.brandCol}>
              <div className={styles.logoBox}>
                {logo ?? <Logo variant="full" colorScheme="primary" height={32} />}
              </div>
              {description && (
                <Text size="body-sm" tone="secondary" className={styles.description}>
                  {description}
                </Text>
              )}
              {socialLinks && socialLinks.length > 0 && (
                <div className={styles.social}>
                  {socialLinks.map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      aria-label={social.label}
                      className={styles.socialLink}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* リンクカラム */}
            {linkGroups && linkGroups.length > 0 && (
              <div className={styles.linkCols}>
                {linkGroups.map((group, i) => (
                  <div key={i}>
                    <Text as="div" size="body-sm" tone="default" className={styles.groupTitle}>
                      {group.title}
                    </Text>
                    <ul className={styles.linkList}>
                      {group.links.map((link, j) => (
                        <li key={j}>
                          <a href={link.href} className={styles.footerLink}>
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
        <div className={styles.bottomBar}>
          {copyright && (
            <Text size="caption" tone="muted">
              {copyright}
            </Text>
          )}
          {legalLinks && legalLinks.length > 0 && (
            <div className={styles.legalLinks}>
              {legalLinks.map((link, i) => (
                <a key={i} href={link.href} className={styles.legalLink}>
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
