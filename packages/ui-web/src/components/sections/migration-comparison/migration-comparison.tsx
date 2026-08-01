import * as React from 'react';
import { cn } from '@/lib/cn';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';
import { MarketingButton } from '@/components/primitives/marketing-button';

export interface MigrationTrigger {
  trigger: string;
  pain: string;
  solution: string;
}

export interface MigrationPath {
  from: string;
  tagline: string;
  description: string;
  triggers: MigrationTrigger[];
  action: { label: string; href: string };
}

export interface MigrationComparisonProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: string;
  eyebrowStyle?: 'pill' | 'border' | 'text' | 'dot' | 'gradient' | 'icon-pill';
  title?: React.ReactNode;
  subtitle?: string;
  paths: MigrationPath[];
  background?: 'default' | 'muted' | 'dark' | 'brand';
  spacing?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
}

export const MigrationComparison = React.forwardRef<HTMLElement, MigrationComparisonProps>(
  ({ className, eyebrow, eyebrowStyle, title, subtitle, paths, background = 'default', spacing, ...props }, ref) => {

    return (
      <Section ref={ref} background={background} spacing={spacing ?? 'lg'} className={className} {...props}>
        <Container>
          {(eyebrow || title || subtitle) && (
            <div className="mb-12 text-center lg:mb-16">
              {eyebrow && (
                <Text size={eyebrowStyle === 'border' ? 'overline-border' : eyebrowStyle === 'text' ? 'overline-text' : eyebrowStyle === 'dot' ? 'overline-dot' : eyebrowStyle === 'gradient' ? 'overline-gradient' : eyebrowStyle === 'icon-pill' ? 'overline-icon-pill' : 'overline-pill'} className="mb-4">
                  {eyebrow}
                </Text>
              )}
              {title && (
                <Heading as="h2" size="display-md">
                  {title}
                </Heading>
              )}
              {subtitle && (
                <Text
                  size="body-lg"
                  tone="secondary"
                  className={cn('mx-auto mt-4 max-w-2xl', 'dark:text-neutral-300')}
                >
                  {subtitle}
                </Text>
              )}
            </div>
          )}

          <div className={cn('grid gap-8', paths.length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-1')}>
            {paths.map((path, i) => (
              <div
                key={i}
                className={cn(
                  'rounded-2xl border p-6 lg:p-8',
                  'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900',
                )}
              >
                <Text size={eyebrowStyle === 'border' ? 'overline-border' : eyebrowStyle === 'text' ? 'overline-text' : eyebrowStyle === 'dot' ? 'overline-dot' : eyebrowStyle === 'gradient' ? 'overline-gradient' : eyebrowStyle === 'icon-pill' ? 'overline-icon-pill' : 'overline-pill'} className="mb-2">
                  {path.from}
                </Text>
                <Heading as="h3" size="heading-lg">
                  {path.tagline}
                </Heading>
                <Text
                  size="body-md"
                  tone="secondary"
                  className={cn('mt-2', 'dark:text-neutral-300')}
                >
                  {path.description}
                </Text>

                <div className="mt-6 space-y-4">
                  {path.triggers.map((trigger, j) => (
                    <div
                      key={j}
                      className={cn(
                        'rounded-lg border p-4',
                        'border-neutral-100 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950',
                      )}
                    >
                      <Text as="div" size="body-sm" tone="default" className={cn('font-semibold', 'dark:text-white')}>
                        {trigger.trigger}
                      </Text>
                      <Text size="caption" tone="muted" className="mt-1">
                        {trigger.pain}
                      </Text>
                      <Text size="caption" tone="brand" className="mt-1 font-medium">
                        → {trigger.solution}
                      </Text>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <MarketingButton variant="primary" href={path.action.href}>
                    {path.action.label}
                  </MarketingButton>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    );
  },
);
MigrationComparison.displayName = 'MigrationComparison';
