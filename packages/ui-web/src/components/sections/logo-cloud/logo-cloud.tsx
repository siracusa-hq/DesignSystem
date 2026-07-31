import * as React from 'react';
import { cn } from '@/lib/cn';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';

export interface LogoItem {
  name: string;
  logo: React.ReactNode;
}

export interface LogoCloudProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: string;
  eyebrowStyle?: 'pill' | 'border' | 'text' | 'dot' | 'gradient' | 'icon-pill';
  title?: React.ReactNode;
  logos: LogoItem[];
  scrolling?: boolean;
  background?: 'default' | 'muted' | 'dark' | 'brand';
  spacing?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
}

export const LogoCloud = React.forwardRef<HTMLElement, LogoCloudProps>(
  ({ className, eyebrow, eyebrowStyle, title, logos, scrolling = false, background = 'default', spacing, ...props }, ref) => {

    return (
      <Section ref={ref} background={background} spacing={spacing ?? 'md'} className={className} {...props}>
        <Container>
          {(eyebrow || title) && (
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
            </div>
          )}

          {scrolling ? (
            <div className="group relative overflow-hidden">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[var(--color-surface)] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[var(--color-surface)] to-transparent" />
              <div className="flex gap-12 animate-[scroll_40s_linear_infinite] group-hover:[animation-play-state:paused]">
                {[...logos, ...logos, ...logos].map((item, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex shrink-0 items-center justify-center opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0',
                      'dark:invert',
                    )}
                    aria-label={item.name}
                  >
                    {item.logo}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
              {logos.map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex items-center justify-center opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0',
                    'dark:invert',
                  )}
                  aria-label={item.name}
                >
                  {item.logo}
                </div>
              ))}
            </div>
          )}
        </Container>
      </Section>
    );
  },
);
LogoCloud.displayName = 'LogoCloud';
