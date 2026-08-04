import * as React from 'react';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';
import { MarketingButton } from '@/components/primitives/marketing-button';
import { Badge } from '@/components/primitives/badge';
import styles from './hero-section.module.css';
import { cn } from '@/lib/cn';

export interface HeroAction {
  label: string;
  href: string;
}

export interface HeroSectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  badge?: string;
  title: React.ReactNode;
  subtitle?: string;
  /** variant は自動割当: 1つ目 = primary / 以降 = secondary */
  actions?: HeroAction[];
  /** MediaFrame / ProductShot を渡すこと（Slice 4 で型を制約する） */
  image?: React.ReactNode;
  /** image がある場合の配置。side = 右横 / below = 下（既定） */
  imagePlacement?: 'side' | 'below';
  /**
   * 背景演出層（アニメーションSVG・動画・グラデーション等）。
   * 絶対配置・クリック不能・スクリーンリーダー不可視で全面に敷かれ、
   * コピーは自動的に左寄せになる。
   * アニメーションは --duration-ambient を使うこと（reduced-motion に自動追従）。
   */
  backdrop?: React.ReactNode;
  /**
   * backdrop の明暗（文字色の反転に必要な情報。装飾の好みの選択肢ではない）。
   * dark を指定すると暗面用のセマンティック反転が効く。
   */
  backdropTone?: 'light' | 'dark';
}

export const HeroSection = React.forwardRef<HTMLElement, HeroSectionProps>(
  (
    {
      badge,
      title,
      subtitle,
      actions,
      image,
      imagePlacement = 'below',
      backdrop,
      backdropTone = 'light',
      ...props
    },
    ref,
  ) => {
    const isSide = image != null && imagePlacement === 'side';
    const isStart = isSide || backdrop != null;
    const content = (
      <div className={cn(styles.inner, !isStart && styles.centered)}>
        {badge && (
          <div className={styles.badgeRow}>
            <Badge variant="default">{badge}</Badge>
          </div>
        )}
        <div className={styles.titleBlock}>
          {/* 横並び時はカラム幅が半分になるため一段小さく（propではなく構造から導出） */}
          <Heading as="h1" size={isSide ? 'display-xl' : 'display-2xl'}>
            {title}
          </Heading>
          {subtitle && (
            <Text size="body-lg" tone="secondary" clauseWrap className={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </div>
        {actions && actions.length > 0 && (
          <div className={styles.actions}>
            {actions.map((action, i) => (
              <MarketingButton
                key={i}
                variant={i === 0 ? 'primary' : 'secondary'}
                size="lg"
                href={action.href}
              >
                {action.label}
              </MarketingButton>
            ))}
          </div>
        )}
      </div>
    );

    return (
      <Section
        ref={ref}
        background={backdropTone === 'dark' ? 'dark' : 'default'}
        spacing="xl"
        className={cn(styles.hero, backdrop != null && styles.withBackdrop)}
        {...props}
      >
        {backdrop && (
          <div className={styles.backdrop} aria-hidden="true">
            {backdrop}
          </div>
        )}
        <Container className={styles.content}>
          {isSide ? (
            <div className={styles.split}>
              {content}
              <div className={styles.mediaSide}>{image}</div>
            </div>
          ) : (
            <>
              {content}
              {image && <div className={styles.mediaBelow}>{image}</div>}
            </>
          )}
        </Container>
      </Section>
    );
  },
);
HeroSection.displayName = 'HeroSection';
