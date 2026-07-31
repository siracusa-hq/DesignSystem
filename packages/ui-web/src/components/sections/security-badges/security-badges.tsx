import * as React from 'react';
import { cn } from '@/lib/cn';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';
import { ShieldCheck } from 'lucide-react';

export interface SecurityBadge {
  name: string;
  icon?: React.ReactNode;
  description?: string;
}

export interface SecurityBadgesProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: string;
  eyebrowStyle?: 'pill' | 'border' | 'text' | 'dot' | 'gradient' | 'icon-pill';
  title?: React.ReactNode;
  subtitle?: string;
  badges: SecurityBadge[];
  background?: 'default' | 'muted' | 'dark' | 'brand';
  spacing?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
}

export const SecurityBadges = React.forwardRef<HTMLElement, SecurityBadgesProps>(
  ({ className, eyebrow, eyebrowStyle, title, subtitle, badges, background = 'muted', spacing, ...props }, ref) => {

    return (
      <Section ref={ref} background={background} spacing={spacing ?? 'md'} className={className} {...props}>
        <Container>
          {(eyebrow || title || subtitle) && (
            <div className="mb-10 text-center">
              {eyebrow && (
                <Text size={eyebrowStyle === 'border' ? 'overline-border' : eyebrowStyle === 'text' ? 'overline-text' : eyebrowStyle === 'dot' ? 'overline-dot' : eyebrowStyle === 'gradient' ? 'overline-gradient' : eyebrowStyle === 'icon-pill' ? 'overline-icon-pill' : 'overline-pill'} className="mb-4">
                  {eyebrow}
                </Text>
              )}
              {title && (
                <Heading as="h2" size="heading-lg">
                  {title}
                </Heading>
              )}
              {subtitle && (
                <Text
                  size="body-md"
                  tone="secondary"
                  className={cn('mx-auto mt-2 max-w-2xl', 'dark:text-neutral-300')}
                >
                  {subtitle}
                </Text>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-8">
            {badges.map((badge, i) => (
              <div
                key={i}
                className={cn(
                  'flex flex-col items-center gap-2 text-center',
                )}
              >
                <div className={cn(
                  'flex h-14 w-14 items-center justify-center rounded-xl',
                  'bg-white shadow-sm dark:bg-neutral-800 dark:shadow-none',
                )}>
                  {badge.icon ?? <ShieldCheck className="h-7 w-7 text-primary-500" />}
                </div>
                <Text as="div" size="body-sm" tone="default" className={cn('font-semibold', 'dark:text-white')}>
                  {badge.name}
                </Text>
                {badge.description && (
                  <Text as="div" size="caption" tone="muted" className="max-w-32">
                    {badge.description}
                  </Text>
                )}
              </div>
            ))}
          </div>
        </Container>
      </Section>
    );
  },
);
SecurityBadges.displayName = 'SecurityBadges';
