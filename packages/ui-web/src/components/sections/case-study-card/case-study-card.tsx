import * as React from 'react';
import { cn } from '@/lib/cn';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Grid } from '@/components/primitives/grid';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';
import { Link } from '@/components/primitives/link';
import { ArrowRight } from 'lucide-react';

export interface CaseStudy {
  companyName: string;
  companyLogo?: React.ReactNode;
  quote: string;
  metrics?: { label: string; value: string }[];
  href?: string;
  linkLabel?: string;
}

export interface CaseStudySectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: string;
  eyebrowStyle?: 'pill' | 'border' | 'text' | 'dot' | 'gradient' | 'icon-pill';
  title?: React.ReactNode;
  subtitle?: string;
  cases: CaseStudy[];
  columns?: 1 | 2 | 3;
  background?: 'default' | 'muted' | 'dark' | 'brand';
  spacing?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
}

export const CaseStudySection = React.forwardRef<HTMLElement, CaseStudySectionProps>(
  ({ className, eyebrow, eyebrowStyle, title, subtitle, cases, columns = 2, background = 'default', spacing, ...props }, ref) => {

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

          <Grid columns={columns} gap="lg">
            {cases.map((c, i) => (
              <div
                key={i}
                className={cn(
                  'flex flex-col rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary-500/30 hover:shadow-xl lg:p-8',
                  'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900',
                )}
              >
                {c.companyLogo && (
                  <div className="mb-4 h-8 opacity-70 grayscale">{c.companyLogo}</div>
                )}
                {!c.companyLogo && (
                  <Text as="div" size="body-sm" tone="brand" className="mb-4 font-semibold">
                    {c.companyName}
                  </Text>
                )}

                <Text
                  size="body-md"
                  tone="default"
                  className="flex-1 dark:text-neutral-200"
                >
                  &ldquo;{c.quote}&rdquo;
                </Text>

                {c.metrics && c.metrics.length > 0 && (
                  <div className="mt-6 flex gap-6 border-t border-neutral-200 pt-6 dark:border-neutral-800">
                    {c.metrics.map((m, j) => (
                      <div key={j}>
                        <div className="text-lg font-bold text-primary-500 dark:text-white">
                          {m.value}
                        </div>
                        <Text as="div" size="caption" tone="muted">{m.label}</Text>
                      </div>
                    ))}
                  </div>
                )}

                {c.href && (
                  <div className="mt-4">
                    <Link href={c.href} className="inline-flex items-center gap-1 text-sm">
                      {c.linkLabel ?? '詳しく見る'}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </Grid>
        </Container>
      </Section>
    );
  },
);
CaseStudySection.displayName = 'CaseStudySection';
