import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';
import { MarketingButton } from '@/components/primitives/marketing-button';
import { Badge } from '@/components/primitives/badge';
import { GradientText } from '@/components/primitives/gradient-text';

export const heroSectionVariants = cva('relative overflow-hidden', {
  variants: {
    layout: {
      centered: 'text-center',
      'split-image': '',
      'with-demo': 'text-center',
    },
  },
  defaultVariants: {
    layout: 'centered',
  },
});

export interface HeroAction {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'gradient';
}

export type HeroBackgroundPattern = 'grid' | 'dots' | 'mesh' | 'radial-glow' | 'none';

export interface HeroSectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title'>,
    VariantProps<typeof heroSectionVariants> {
  badge?: string;
  title: React.ReactNode;
  titleGradient?: string;
  subtitle?: string;
  actions?: HeroAction[];
  image?: React.ReactNode;
  background?: 'default' | 'muted' | 'dark' | 'brand';
  backgroundPattern?: HeroBackgroundPattern;
  spacing?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
}

export const HeroSection = React.forwardRef<HTMLElement, HeroSectionProps>(
  (
    {
      className,
      layout = 'centered',
      badge,
      title,
      titleGradient,
      subtitle,
      actions,
      image,
      background = 'default',
      backgroundPattern = 'none',
      spacing,
      ...props
    },
    ref,
  ) => {
    const patternElement = backgroundPattern !== 'none' && (
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className={cn(
            'absolute inset-0',
            backgroundPattern === 'grid' &&
              '[background-image:linear-gradient(rgba(19,195,160,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(19,195,160,0.08)_1px,transparent_1px)] [background-size:48px_48px]',
            backgroundPattern === 'dots' &&
              '[background-image:radial-gradient(circle,rgba(19,195,160,0.15)_1px,transparent_1px)] [background-size:24px_24px]',
            backgroundPattern === 'mesh' &&
              '[background-image:radial-gradient(ellipse_at_20%_50%,rgba(19,195,160,0.15),transparent_50%),radial-gradient(ellipse_at_80%_20%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(ellipse_at_50%_80%,rgba(19,195,160,0.1),transparent_50%)]',
            backgroundPattern === 'radial-glow' &&
              '[background-image:radial-gradient(ellipse_at_center,rgba(19,195,160,0.2),transparent_70%)]',
          )}
          style={{ maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)' }}
        />
      </div>
    );

    const titleElement =
      typeof title === 'string' && titleGradient ? (
        <Heading as="h1" size="display-2xl">
          {title}
          <br />
          <GradientText as="span" customGradient={titleGradient} gradient="custom">
            {titleGradient ? title : null}
          </GradientText>
        </Heading>
      ) : (
        <Heading as="h1" size="display-2xl">
          {title}
        </Heading>
      );


    const content = (
      <>
        {badge && (
          <div className={layout === 'centered' || layout === 'with-demo' ? 'flex justify-center' : ''}>
            <Badge variant="default">{badge}</Badge>
          </div>
        )}

        <div className="space-y-6">
          {titleElement}

          {subtitle && (
            <Text
              size="body-lg"
              tone="secondary"
              className={cn(
                'max-w-2xl',
                (layout === 'centered' || layout === 'with-demo') && 'mx-auto',
                'dark:text-neutral-300',
              )}
            >
              {subtitle}
            </Text>
          )}
        </div>

        {actions && actions.length > 0 && (
          <div
            className={cn(
              'flex flex-wrap gap-4',
              (layout === 'centered' || layout === 'with-demo') && 'justify-center',
            )}
          >
            {actions.map((action, i) => (
              <MarketingButton
                key={i}
                variant={action.variant ?? (i === 0 ? 'primary' : 'secondary')}
                size="lg"
                href={action.href}
              >
                {action.label}
              </MarketingButton>
            ))}
          </div>
        )}
      </>
    );

    if (layout === 'split-image') {
      return (
        <Section
          ref={ref}
          background={background}
          spacing={spacing ?? 'xl'}
          className={cn(heroSectionVariants({ layout }), className)}
          {...props}
        >
          {patternElement}
          <Container>
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="space-y-8">{content}</div>
              {image && <div className="relative">{image}</div>}
            </div>
          </Container>
        </Section>
      );
    }

    return (
      <Section
        ref={ref}
        background={background}
        spacing={spacing ?? 'xl'}
        className={cn(heroSectionVariants({ layout }), className)}
        {...props}
      >
        {patternElement}
        <Container>
          <div className="space-y-8">{content}</div>
        </Container>
        {image && layout === 'with-demo' && (
          <Container className="mt-12">
            <div className="relative">{image}</div>
          </Container>
        )}
      </Section>
    );
  },
);
HeroSection.displayName = 'HeroSection';
