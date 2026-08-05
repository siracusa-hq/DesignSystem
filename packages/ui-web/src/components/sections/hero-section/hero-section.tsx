import * as React from 'react';
import { sectionVariants } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';
import { MarketingButton } from '@/components/primitives/marketing-button';
import { Badge } from '@/components/primitives/badge';
import type { MediaFrameProps } from '@/components/primitives/media-frame';
import type { ProductShotProps } from '@/components/primitives/product-shot';
import styles from './hero-section.module.css';
import { cn } from '@/lib/cn';

export interface HeroAction {
  label: string;
  href: string;
}

export interface HeroSectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  badge?: string;
  title: React.ReactNode;
  subtitle?: string;
  /** variant は自動割当: 1つ目 = primary / 以降 = secondary */
  actions?: HeroAction[];
  /** MediaFrame / ProductShot の要素のみ受け付ける（素の ReactNode は不可） */
  image?: React.ReactElement<MediaFrameProps | ProductShotProps>;
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
          {/* 見出しサイズは構造から導出（propは持たない）:
              - 横並び: display-lg。6fr幅の16:9画像（高さ約330px）と塊の高さが揃う
              - 画像が下: display-xl。直下に大きな面が続くため一段抑える
              - コピーだけのセンター: display-2xl。文字が主役 */}
          <Heading
            as="h1"
            size={isSide ? 'display-lg' : image != null ? 'display-xl' : 'display-2xl'}
          >
            {title}
          </Heading>
          {subtitle && (
            <div className={styles.subtitle}>
              <Text size="body-lg" tone="secondary" clauseWrap>
                {subtitle}
              </Text>
            </div>
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
      <section
        ref={ref}
        className={cn(
          sectionVariants({
            background: backdropTone === 'dark' ? 'dark' : 'default',
            spacing: 'xl',
          }),
          styles.hero,
          backdrop != null && styles.withBackdrop,
        )}
        {...props}
      >
        {backdrop && (
          <div className={styles.backdrop} aria-hidden="true">
            {backdrop}
          </div>
        )}
        <Container>
          {/* backdrop（absolute）より前面に出すための positioned 層 */}
          <div className={styles.content}>
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
          </div>
        </Container>
      </section>
    );
  },
);
HeroSection.displayName = 'HeroSection';
