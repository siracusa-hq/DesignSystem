import * as React from 'react';
import { cn } from '@/lib/cn';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';

export interface BentoItem {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  content?: React.ReactNode;
  span?: 1 | 2;
  rowSpan?: 1 | 2;
  variant?: 'default' | 'featured' | 'dark';
}

export interface BentoGridProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: string;
  eyebrowStyle?: 'pill' | 'border' | 'text' | 'dot' | 'gradient' | 'icon-pill';
  title?: React.ReactNode;
  subtitle?: string;
  items: BentoItem[];
  background?: 'default' | 'muted' | 'dark' | 'brand';
  spacing?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
}

const spanClasses = {
  1: '',
  2: 'md:col-span-2',
} as const;

const rowSpanClasses = {
  1: '',
  2: 'md:row-span-2',
} as const;

export const BentoGrid = React.forwardRef<HTMLElement, BentoGridProps>(
  ({ className, eyebrow, eyebrowStyle, title, subtitle, items, background = 'default', spacing, ...props }, ref) => {

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

          <div className="grid gap-4 md:grid-cols-3 md:gap-6">
            {items.map((item, i) => (
              <div
                key={i}
                className={cn(
                  'flex flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary-500/30 hover:shadow-xl',
                  item.variant === 'featured'
                    ? 'border-primary-500/20 bg-gradient-to-br from-primary-50 to-white shadow-glow-primary dark:from-primary-950/20 dark:to-neutral-900'
                    : item.variant === 'dark'
                      ? 'border-neutral-800 bg-neutral-950 text-white'
                      : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900',
                  spanClasses[item.span ?? 1],
                  rowSpanClasses[item.rowSpan ?? 1],
                )}
              >
                {item.icon && (
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-500 dark:bg-primary-950">
                    {item.icon}
                  </div>
                )}
                <Heading as="h3" size="heading-md" className={item.variant === 'dark' ? 'text-white!' : ''}>
                  {item.title}
                </Heading>
                {item.description && (
                  <Text
                    size="body-sm"
                    tone={item.variant === 'dark' ? 'inherit' : 'secondary'}
                    className={cn('mt-2', item.variant === 'dark' && 'text-neutral-400')}
                  >
                    {item.description}
                  </Text>
                )}
                {item.content && (
                  <div className="mt-4 flex-1">{item.content}</div>
                )}
              </div>
            ))}
          </div>
        </Container>
      </Section>
    );
  },
);
BentoGrid.displayName = 'BentoGrid';
