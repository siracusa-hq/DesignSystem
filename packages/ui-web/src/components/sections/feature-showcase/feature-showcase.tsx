import * as React from 'react';
import { cn } from '@/lib/cn';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';
import { Badge } from '@/components/primitives/badge';
import { Check } from 'lucide-react';

export interface ShowcaseItem {
  badge?: string;
  title: string;
  description: string;
  image?: React.ReactNode;
  features?: string[];
}

export interface FeatureShowcaseProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: string;
  eyebrowStyle?: 'pill' | 'border' | 'text' | 'dot' | 'gradient' | 'icon-pill';
  title?: React.ReactNode;
  subtitle?: string;
  items: ShowcaseItem[];
  background?: 'default' | 'muted' | 'dark' | 'brand';
  spacing?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
}

export const FeatureShowcase = React.forwardRef<HTMLElement, FeatureShowcaseProps>(
  ({ className, eyebrow, eyebrowStyle, title, subtitle, items, background = 'default', spacing, ...props }, ref) => {

    return (
      <Section ref={ref} background={background} spacing={spacing ?? 'lg'} className={className} {...props}>
        <Container>
          {(eyebrow || title || subtitle) && (
            <div className="mb-16 text-center">
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

          <div className="space-y-24">
            {items.map((item, i) => {
              const isReversed = i % 2 === 1;
              return (
                <div
                  key={i}
                  className={cn(
                    'grid items-center gap-12 lg:grid-cols-2',
                    isReversed && 'lg:[&>:first-child]:order-2',
                  )}
                >
                  <div>
                    {item.badge && (
                      <div className="mb-4">
                        <Badge variant="default">{item.badge}</Badge>
                      </div>
                    )}
                    <Heading as="h3" size="display-sm">
                      {item.title}
                    </Heading>
                    <Text
                      size="body-lg"
                      tone="secondary"
                      className={cn('mt-4', 'dark:text-neutral-300')}
                    >
                      {item.description}
                    </Text>
                    {item.features && item.features.length > 0 && (
                      <ul className="mt-6 space-y-2">
                        {item.features.map((feat, j) => (
                          <li key={j} className="flex items-center gap-3">
                            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
                              <Check className="h-3 w-3" />
                            </span>
                            <Text as="span" size="body-sm" tone="default" className={'dark:text-neutral-200'}>
                              {feat}
                            </Text>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {item.image && (
                    <div className="relative">{item.image}</div>
                  )}
                </div>
              );
            })}
          </div>
        </Container>
      </Section>
    );
  },
);
FeatureShowcase.displayName = 'FeatureShowcase';
