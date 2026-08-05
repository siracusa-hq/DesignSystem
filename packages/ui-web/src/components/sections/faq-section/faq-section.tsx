'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';
import { SectionHeader } from '@/components/sections/section-header';
import styles from './faq-section.module.css';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  items: FAQItem[];
}

const AccordionItem: React.FC<{ item: FAQItem; index: number }> = ({ item, index }) => {
  const [open, setOpen] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const id = `faq-${index}`;

  return (
    <div className={styles.item}>
      <button
        type="button"
        id={`${id}-trigger`}
        className={styles.trigger}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
      >
        <span className={styles.question}>
          <Heading as="h3" size="heading-sm">
            {item.question}
          </Heading>
        </span>
        <span className={cn(styles.icon, open && styles.iconOpen)} aria-hidden="true">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="10" y1="4" x2="10" y2="16" />
            <line x1="4" y1="10" x2="16" y2="10" />
          </svg>
        </span>
      </button>
      <div
        ref={contentRef}
        id={`${id}-panel`}
        className={styles.panel}
        style={{
          // 高さは中身に依存する実測値のため inline でしか渡せない
          maxHeight: open ? contentRef.current?.scrollHeight : 0,
          opacity: open ? 1 : 0,
        }}
        role="region"
        aria-labelledby={`${id}-trigger`}
      >
        <div className={styles.panelInner}>
          <Text size="body-md" tone="secondary">
            {item.answer}
          </Text>
        </div>
      </div>
    </div>
  );
};

export const FAQSection = React.forwardRef<HTMLElement, FAQSectionProps>(
  ({ eyebrow, title, subtitle, items, ...props }, ref) => (
    <Section ref={ref} background="default" spacing="lg" {...props}>
      <Container size="md">
        <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <div>
          {items.map((item, i) => (
            <AccordionItem key={i} item={item} index={i} />
          ))}
        </div>
      </Container>
    </Section>
  ),
);
FAQSection.displayName = 'FAQSection';
