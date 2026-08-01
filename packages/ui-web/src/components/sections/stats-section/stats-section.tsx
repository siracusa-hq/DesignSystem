import * as React from 'react';
import { cn } from '@/lib/cn';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';
import { AnimatedCounter } from '@/components/primitives/animated-counter';

export interface StatItem {
  value: string;
  /** AnimatedCounter 用の数値（animated=true 時に使用） */
  numericValue?: number;
  label: string;
  description?: string;
  /** 数値の接頭辞（例: "¥"） */
  prefix?: string;
  /** 数値の接尾辞（例: "%", "+"） */
  suffix?: string;
}

export interface StatsSectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: string;
  eyebrowStyle?: 'pill' | 'border' | 'text' | 'dot' | 'gradient' | 'icon-pill';
  title?: React.ReactNode;
  subtitle?: string;
  stats: StatItem[];
  background?: 'default' | 'muted' | 'dark' | 'brand';
  spacing?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  /** カウントアップアニメーションを有効にする */
  animated?: boolean;
}

export const StatsSection = React.forwardRef<HTMLElement, StatsSectionProps>(
  ({ className, eyebrow, eyebrowStyle, title, subtitle, stats, background = 'default', spacing, animated = false, ...props }, ref) => {

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

          <div
            className={cn(
              'grid gap-8 text-center',
              stats.length <= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4',
            )}
          >
            {stats.map((stat, i) => (
              <div key={i}>
                <div
                  className={cn(
                    'text-display-sm font-extrabold tracking-tight md:text-display-md',
                    'text-primary-500 dark:text-white',
                  )}
                >
                  {animated && stat.numericValue != null ? (
                    <AnimatedCounter
                      value={stat.numericValue}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  ) : (
                    stat.value
                  )}
                </div>
                <Text
                  as="div"
                  size="body-md"
                  tone="default"
                  className={cn('mt-2 font-semibold', 'dark:text-white')}
                >
                  {stat.label}
                </Text>
                {stat.description && (
                  <Text size="body-sm" tone="muted" className={cn('mt-1', 'dark:text-neutral-400')}>
                    {stat.description}
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
StatsSection.displayName = 'StatsSection';
