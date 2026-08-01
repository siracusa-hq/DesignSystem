import * as React from 'react';
import { cn } from '@/lib/cn';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Grid } from '@/components/primitives/grid';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';

export interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: React.ReactNode;
  rating?: 1 | 2 | 3 | 4 | 5;
  companyLogo?: React.ReactNode;
}

export interface TestimonialSectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: string;
  eyebrowStyle?: 'pill' | 'border' | 'text' | 'dot' | 'gradient' | 'icon-pill';
  title?: React.ReactNode;
  subtitle?: string;
  testimonials: Testimonial[];
  columns?: 1 | 2 | 3;
  background?: 'default' | 'muted' | 'dark' | 'brand';
  spacing?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
}

export const TestimonialSection = React.forwardRef<HTMLElement, TestimonialSectionProps>(
  ({ className, eyebrow, eyebrowStyle, title, subtitle, testimonials, columns = 3, background = 'default', spacing, ...props }, ref) => {

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
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={cn(
                  'rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary-500/30 hover:shadow-xl',
                  'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900',
                )}
              >
                <div className="relative">
                  <span className="absolute -top-2 -left-1 text-5xl leading-none text-primary-200 dark:text-primary-800 select-none" aria-hidden="true">
                    &ldquo;
                  </span>
                  {t.rating && (
                    <div className="mb-2 flex gap-0.5 pl-6">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <svg key={s} className={cn('h-4 w-4', s < t.rating! ? 'text-yellow-400' : 'text-neutral-300 dark:text-neutral-600')} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  )}
                  <Text
                    size="body-md"
                    tone="default"
                    className="mb-6 pl-6 dark:text-neutral-200"
                  >
                    {t.quote}
                  </Text>
                </div>
                <div className="flex items-center gap-3">
                  {t.avatar && (
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
                      {t.avatar}
                    </div>
                  )}
                  <div>
                    <Text as="div" size="body-sm" tone="default" className={cn('font-semibold', 'dark:text-white')}>
                      {t.author}
                    </Text>
                    {(t.role || t.company) && (
                      <Text as="div" size="caption" tone="muted">
                        {[t.role, t.company].filter(Boolean).join(' / ')}
                      </Text>
                    )}
                  </div>
                  {t.companyLogo && (
                    <div className="ml-auto shrink-0 opacity-50 grayscale">
                      {t.companyLogo}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </Grid>
        </Container>
      </Section>
    );
  },
);
TestimonialSection.displayName = 'TestimonialSection';
