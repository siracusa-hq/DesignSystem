import * as React from 'react';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Text } from '@/components/primitives/text';
import { SectionHeader } from '@/components/sections/section-header';
import styles from './leadership.module.css';
import { cn } from '@/lib/cn';

export interface LeadershipMember {
  /** 例: 「代表取締役 CEO」 */
  role: string;
  name: string;
  /** ラテン文字表記など。任意 */
  nameEn?: string;
  /** alt には人物と文脈を書く（GUIDELINES §3） */
  photo?: { src: string; alt: string };
  bio?: string;
}

export interface LeadershipSectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  members: LeadershipMember[];
}

/**
 * LeadershipSection — 経営陣。
 *
 * TestimonialSection は顧客の声のための語彙なので流用できない（役員紹介に使うと
 * 「お客様の声」の見た目になる）。カードの意匠は CaseCard と揃えてある。
 *
 * 列数は件数から導出する（2名なら2列、3名以上なら3列）。DS の既定どおり、
 * 列数を指定する props は持たない。
 */
export const LeadershipSection = React.forwardRef<HTMLElement, LeadershipSectionProps>(
  ({ eyebrow, title, subtitle, members, ...props }, ref) => (
    <Section ref={ref} background="default" spacing="md" {...props}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <div className={cn(styles.grid, members.length <= 2 ? styles.cols2 : styles.cols3)}>
          {members.map((m, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.head}>
                {m.photo ? (
                  <img className={styles.photo} src={m.photo.src} alt={m.photo.alt} loading="lazy" />
                ) : (
                  <div className={styles.initial} aria-hidden="true">
                    {[...m.name][0]}
                  </div>
                )}
                <div>
                  <div className={styles.role}>{m.role}</div>
                  <div className={styles.name}>{m.name}</div>
                  {m.nameEn && (
                    <Text as="div" size="caption" tone="muted">
                      {m.nameEn}
                    </Text>
                  )}
                </div>
              </div>
              {m.bio && (
                <Text as="p" size="body-sm" tone="secondary">
                  {m.bio}
                </Text>
              )}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  ),
);
LeadershipSection.displayName = 'LeadershipSection';
