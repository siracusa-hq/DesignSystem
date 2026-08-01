import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';
import { MarketingButton } from '@/components/primitives/marketing-button';

export const ctaSectionVariants = cva('', {
  variants: {
    layout: {
      centered: 'text-center',
      split: '',
    },
  },
  defaultVariants: {
    layout: 'centered',
  },
});

export interface CTAAction {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'gradient';
}

export interface CTASectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title'>,
    VariantProps<typeof ctaSectionVariants> {
  title: React.ReactNode;
  subtitle?: string;
  actions: CTAAction[];
  note?: string;
  background?: 'default' | 'muted' | 'dark' | 'brand';
  spacing?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  backgroundMesh?: boolean;
  socialProof?: string;
  logoStrip?: React.ReactNode;
}

export const CTASection = React.forwardRef<HTMLElement, CTASectionProps>(
  (
    {
      className,
      layout = 'centered',
      title,
      subtitle,
      actions,
      note,
      background = 'dark',
      spacing,
      backgroundMesh = false,
      socialProof,
      logoStrip,
      ...props
    },
    ref,
  ) => {

    const meshElement = backgroundMesh && (
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 [background-image:radial-gradient(ellipse_at_30%_50%,rgba(19,195,160,0.2),transparent_60%),radial-gradient(ellipse_at_70%_30%,rgba(59,130,246,0.1),transparent_60%)]"
        />
      </div>
    );

    if (layout === 'split') {
      return (
        <Section ref={ref} background={background} spacing={spacing ?? 'lg'} className={cn('relative overflow-hidden', className)} {...props}>
          {meshElement}
          <Container>
            <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
              <div className="max-w-xl">
                <Heading as="h2" size="display-sm">
                  {title}
                </Heading>
                {subtitle && (
                  <Text
                    size="body-lg"
                    tone="secondary"
                    className={cn('mt-4', 'dark:text-neutral-300')}
                  >
                    {subtitle}
                  </Text>
                )}
              </div>
              <div className="flex flex-wrap gap-4">
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
            </div>
          </Container>
        </Section>
      );
    }

    return (
      <Section
        ref={ref}
        background={background}
        spacing={spacing ?? 'lg'}
        className={cn('relative overflow-hidden', ctaSectionVariants({ layout }), className)}
        {...props}
      >
        {meshElement}
        <Container size="md">
          <Heading as="h2" size="display-md">
            {title}
          </Heading>
          {subtitle && (
            <Text
              size="body-lg"
              tone="secondary"
              className={cn('mx-auto mt-4 max-w-xl', 'dark:text-neutral-300')}
            >
              {subtitle}
            </Text>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
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
          {note && (
            <Text size="caption" tone="muted" className={cn('mt-4', 'dark:text-neutral-500')}>
              {note}
            </Text>
          )}
          {socialProof && (
            <Text size="body-sm" tone="muted" className={cn('mt-6 font-medium', 'dark:text-neutral-400')}>
              {socialProof}
            </Text>
          )}
          {logoStrip && (
            <div className="mt-8">{logoStrip}</div>
          )}
        </Container>
      </Section>
    );
  },
);
CTASection.displayName = 'CTASection';
