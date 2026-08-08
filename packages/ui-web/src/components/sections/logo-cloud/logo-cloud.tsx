import * as React from 'react';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { LogoMark } from '@/components/primitives/logo-mark';
import { SectionHeader } from '@/components/sections/section-header';
import styles from './logo-cloud.module.css';
import { isDev } from '@/lib/dev';

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

/**
 * ロゴ帯として成立する下限。1〜5社は日本語 LP の実測（19社調査）で実例が0件。
 * 0社は「ロゴ帯を置かず数値訴求に振り切る」選択（実測 6/19）なので、
 * LogoCloud 自体を使わない判断になる。ここでは 1〜5 だけを警告する。
 */
const LOGO_BAND_MIN = 6;

export interface LogoCloudProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  eyebrow?: string;
  title?: React.ReactNode;
  /**
   * ロゴ帯を組むなら 6 社以上。**中央値は約20社**で、14社以上はカルーセルになる。
   *
   * ロゴ帯と数値訴求（StatsSection）は**代替関係**であって優劣ではない。
   * 実測（[LP] 19社）では「ロゴ帯を置かず数値に振り切る」ページが 6/19 あり、
   * **1〜5社の中途半端なロゴ帯は実例が0件**だった。少数しか出せない場合は
   * ロゴ帯にせず事例カードに紐付けること（SmartHR 6社 / Bill One 8社の方式）。
   * 1〜5社を渡すと dev 警告が出る。
   *
   * 8件以上で自動的にスクロール表示に切り替わる（旧 scrolling prop は削除）。
   */
  logos: LogoItem[];
}

export const LogoCloud = React.forwardRef<HTMLElement, LogoCloudProps>(
  ({ eyebrow, title, logos, ...props }, ref) => {
    if (isDev && logos.length > 0 && logos.length < LOGO_BAND_MIN) {
      console.warn(
        `[LogoCloud] ロゴが ${logos.length} 社です。1〜5社の中途半端なロゴ帯は日本語ページに実例が0件でした。` +
          '(1) 社会的証明はロゴ帯か数値訴求（StatsSection）のどちらかを必ず置く、' +
          '(2) ロゴを載せるなら中央値は約20社・14社以上はカルーセル、' +
          '(3) 少数しか出せない場合はロゴ帯にせず事例カードに紐付ける' +
          '（SmartHR 6社 / Bill One 8社の方式）。' +
          'ロゴ帯を置かず数値に振り切る選択も 6/19 と一般的です（composition-redesign.md §Stage 5）。',
      );
    }

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
