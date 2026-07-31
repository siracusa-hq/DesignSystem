import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Grid } from '@/components/primitives/grid';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';

const featureCardVariants = cva(
  'rounded-2xl border border-neutral-200 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary-500/30 hover:shadow-xl dark:border-neutral-800',
  {
    variants: {
      cardStyle: {
        default: 'bg-white dark:bg-neutral-900',
        muted: 'bg-neutral-50 dark:bg-neutral-900/50',
      },
    },
    defaultVariants: {
      cardStyle: 'default',
    },
  },
);

export interface FeatureItem {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export interface FeatureGridProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: string;
  eyebrowStyle?: 'pill' | 'border' | 'text' | 'dot' | 'gradient' | 'icon-pill';
  title?: React.ReactNode;
  subtitle?: string;
  features: FeatureItem[];
  columns?: 2 | 3 | 4;
  cardStyle?: 'default' | 'muted';
  background?: 'default' | 'muted' | 'dark' | 'brand';
  spacing?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
}

export const FeatureGrid = React.forwardRef<HTMLElement, FeatureGridProps>(
  (
    {
      className,
      cardStyle,
      eyebrow, eyebrowStyle,
      title,
      subtitle,
      features,
      columns = 3,
      background = 'default', spacing,
      ...props
    },
    ref,
  ) => {

    return (
      <Section
        ref={ref}
        background={background}
        spacing={spacing ?? 'lg'}
        className={className}
        {...props}
      >
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

          <Grid columns={columns} gap="lg">
            {features.map((feature, i) => (
              <div key={i} className={featureCardVariants({ cardStyle })}>
                {feature.icon && (
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-500 dark:bg-primary-950">
                    {feature.icon}
                  </div>
                )}
                <Heading as="h3" size="heading-md" className="mb-2">
                  {feature.title}
                </Heading>
                <Text size="body-sm" tone="secondary">
                  {feature.description}
                </Text>
              </div>
            ))}
          </Grid>
        </Container>
      </Section>
    );
  },
);
FeatureGrid.displayName = 'FeatureGrid';
