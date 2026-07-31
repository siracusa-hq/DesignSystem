import * as React from 'react';
import { cn } from '@/lib/cn';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';

export interface AirPocket {
  module: string;
  headline: string;
  description: string;
  proof: string;
  competitors: { name: string; status: string }[];
  visual?: React.ReactNode;
}

export interface AirPocketFeatureProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: string;
  eyebrowStyle?: 'pill' | 'border' | 'text' | 'dot' | 'gradient' | 'icon-pill';
  title?: React.ReactNode;
  subtitle?: string;
  airPockets: AirPocket[];
  background?: 'default' | 'muted' | 'dark' | 'brand';
  spacing?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
}

export const AirPocketFeature = React.forwardRef<HTMLElement, AirPocketFeatureProps>(
  ({ className, eyebrow, eyebrowStyle, title, subtitle, airPockets, background = 'default', spacing, ...props }, ref) => {

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

          <div className="space-y-20">
            {airPockets.map((pocket, i) => (
              <div
                key={i}
                className={cn(
                  'grid items-center gap-12 lg:grid-cols-2',
                  i % 2 === 1 && 'lg:[&>:first-child]:order-2',
                )}
              >
                <div>
                  <Text size={eyebrowStyle === 'border' ? 'overline-border' : eyebrowStyle === 'text' ? 'overline-text' : eyebrowStyle === 'dot' ? 'overline-dot' : eyebrowStyle === 'gradient' ? 'overline-gradient' : eyebrowStyle === 'icon-pill' ? 'overline-icon-pill' : 'overline-pill'} className="mb-3">
                    {pocket.module}
                  </Text>
                  <Heading as="h3" size="display-sm">
                    {pocket.headline}
                  </Heading>
                  <Text
                    size="body-lg"
                    tone="secondary"
                    className={cn('mt-4', 'dark:text-neutral-300')}
                  >
                    {pocket.description}
                  </Text>
                  <Text
                    size="body-sm"
                    tone="brand"
                    className="mt-4 font-medium"
                  >
                    {pocket.proof}
                  </Text>

                  {/* 競合ステータス */}
                  <div className="mt-6 space-y-2">
                    {pocket.competitors.map((comp, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <Text as="span" size="caption" tone="muted" className="w-24 shrink-0">
                          {comp.name}
                        </Text>
                        <Text as="span" size="caption" tone="muted">
                          {comp.status}
                        </Text>
                      </div>
                    ))}
                    <div className="flex items-center gap-3">
                      <Text as="span" size="caption" tone="brand" className="w-24 shrink-0 font-semibold">
                        Polastack
                      </Text>
                      <Text as="span" size="caption" tone="brand" className="font-semibold">
                        ✓ 標準搭載
                      </Text>
                    </div>
                  </div>
                </div>

                {pocket.visual && (
                  <div className="relative">{pocket.visual}</div>
                )}
              </div>
            ))}
          </div>
        </Container>
      </Section>
    );
  },
);
AirPocketFeature.displayName = 'AirPocketFeature';
