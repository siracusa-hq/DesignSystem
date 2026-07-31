'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: string;
  eyebrowStyle?: 'pill' | 'border' | 'text' | 'dot' | 'gradient' | 'icon-pill';
  title?: React.ReactNode;
  subtitle?: string;
  items: FAQItem[];
  background?: 'default' | 'muted' | 'dark' | 'brand';
  spacing?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
}

const AccordionItem: React.FC<{ item: FAQItem; index: number }> = ({ item, index }) => {
  const [open, setOpen] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const id = `faq-${index}`;

  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800">
      <button
        type="button"
        id={`${id}-trigger`}
        className={cn(
          'flex w-full items-center justify-between py-5 text-left transition-colors',
          'text-neutral-900 hover:text-primary-500 dark:text-white dark:hover:text-primary-400',
        )}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
      >
        <Heading as="h3" size="heading-sm" className="pr-8">
          {item.question}
        </Heading>
        <span
          className={cn(
            'shrink-0 transition-transform duration-200',
            open && 'rotate-45',
          )}
          aria-hidden="true"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="10" y1="4" x2="10" y2="16" />
            <line x1="4" y1="10" x2="16" y2="10" />
          </svg>
        </span>
      </button>
      <div
        ref={contentRef}
        id={`${id}-panel`}
        className="overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out"
        style={{
          maxHeight: open ? contentRef.current?.scrollHeight : 0,
          opacity: open ? 1 : 0,
        }}
        role="region"
        aria-labelledby={`${id}-trigger`}
      >
        <div className="pb-5">
          <Text size="body-md" tone="secondary" className={'dark:text-neutral-300'}>
            {item.answer}
          </Text>
        </div>
      </div>
    </div>
  );
};

export const FAQSection = React.forwardRef<HTMLElement, FAQSectionProps>(
  ({ className, eyebrow, eyebrowStyle, title, subtitle, items, background = 'default', spacing, ...props }, ref) => {

    return (
      <Section ref={ref} background={background} spacing={spacing ?? 'lg'} className={className} {...props}>
        <Container size="md">
          {(eyebrow || title || subtitle) && (
            <div className="mb-12 text-center">
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
                  className={cn('mx-auto mt-4 max-w-xl', 'dark:text-neutral-300')}
                >
                  {subtitle}
                </Text>
              )}
            </div>
          )}

          <div>
            {items.map((item, i) => (
              <AccordionItem key={i} item={item} index={i} />
            ))}
          </div>
        </Container>
      </Section>
    );
  },
);
FAQSection.displayName = 'FAQSection';
