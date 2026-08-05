import * as React from 'react';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { LogoMark } from '@/components/primitives/logo-mark';
import { SectionHeader } from '@/components/sections/section-header';
import styles from './logo-cloud.module.css';

export interface LogoItem {
  /** 企業名。img の alt / スクロール時のラベルに使う */
  name: string;
  /** 画像ロゴの URL。node とどちらか一方 */
  src?: string;
  /** インライン SVG 等を渡す場合 */
  node?: React.ReactNode;
}

/** 8件を超えると1画面に収まらず、静的な帯は行が崩れる */
const SCROLL_THRESHOLD = 8;

export interface LogoCloudProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  eyebrow?: string;
  title?: React.ReactNode;
  /**
   * ロゴは 6 社以上そろってから出すこと。
   * 数が足りないうちは説得力が逆に落ちるため、ロゴ帯と数値バッジは**代替関係**に置く
   * （6社未満なら LogoCloud ではなく StatsSection で「導入◯社」を数字で見せる）。
   * 8件以上で自動的にスクロール表示に切り替わる（旧 scrolling prop は削除）。
   */
  logos: LogoItem[];
}

export const LogoCloud = React.forwardRef<HTMLElement, LogoCloudProps>(
  ({ eyebrow, title, logos, ...props }, ref) => {
    // ロゴ帯は既定でグレースケール（ロゴの原色が並ぶと自社の面が主張を失う）
    const renderMarks = (copy: number) =>
      logos.map((item, i) => (
        <div key={`${copy}-${i}`} className={styles.item}>
          <LogoMark src={item.src} alt={item.name} grayscale>
            {item.node}
          </LogoMark>
        </div>
      ));

    return (
      <Section ref={ref} background="default" spacing="md" {...props}>
        <Container>
          <SectionHeader eyebrow={eyebrow} title={title} headingSize="heading-lg" />
          {logos.length >= SCROLL_THRESHOLD ? (
            <div className={styles.marquee}>
              <div className={styles.fadeLeft} aria-hidden="true" />
              <div className={styles.fadeRight} aria-hidden="true" />
              {/* keyframes は -33.333% 送りなので、3周ぶん並べて途切れなく繋ぐ */}
              <div className={styles.track}>
                {renderMarks(0)}
                {renderMarks(1)}
                {renderMarks(2)}
              </div>
            </div>
          ) : (
            <div className={styles.row}>{renderMarks(0)}</div>
          )}
        </Container>
      </Section>
    );
  },
);
LogoCloud.displayName = 'LogoCloud';
