import * as React from 'react';
import { cn } from '@/lib/cn';
import { createCTAClickCapture, type PageCTAClickHandler } from '@/lib/cta-click';
import { CTARegistryContext, createCTALabelRegistry } from '@/lib/cta-registry';
import { isDev } from '@/lib/dev';
import { resolvePageSurface } from '@/lib/page-surface';
import styles from './page.module.css';

/** brand-registry のキーと一致すること（page.test.tsx が突き合わせる） */
export const PAGE_BRANDS = ['corporate', 'polastack', 'peerdesk', 'peerdesk-taxpeer'] as const;
export type PageBrand = (typeof PAGE_BRANDS)[number];

/**
 * トーン = 何を狙うページか。装飾量・コントラスト・余白量を決める。
 * ブランド軸（誰の顔か）と直交し、組み合わせを禁止しない。
 */
export const PAGE_TONES = ['trust', 'product', 'campaign'] as const;
export type PageTone = (typeof PAGE_TONES)[number];

export interface PageProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  /** 誰の顔か。色相・視覚デバイスを決める（既定: corporate） */
  brand?: PageBrand;
  /** 何を狙うページか。余白・装飾量を決める（既定: product = 基準） */
  tone?: PageTone;
  /**
   * ページ内の CTA クリックを一括で受け取る計測フック（stage4-workorder.md §3）。
   *
   * `data-cta` を持つ要素（＝ MarketingButton / FormButton に `ctaId` が付いたもの）の
   * クリックだけが届く。実装はルート要素の capture フェーズでのクリック委譲なので、
   * context もマウント時コストも要らず SSR でも安全。
   *
   * **計測タグ（GA4 / GTM 等）はこのパッケージには同梱しない。**
   * ベンダーの選択は利用側の決定であり、デザインシステムが決めてはならない。
   * ここで受けたイベントを利用側が自分の計測基盤へ送る。
   */
  onCTAClick?: PageCTAClickHandler;
  children?: React.ReactNode;
}

/**
 * h1 重複の dev 検査（Stage 5 Slice 1）。
 *
 * 「ページの見出しは1つ」は構造の問題なので、DOM ができてから数えるしかない
 * （children を静的に走査しても、セクションが内部で h1 を出すかは分からない）。
 * SSR では effect が走らないため何もしない。1マウントにつき1回だけ数える。
 */
function useDuplicateH1Check(rootRef: React.RefObject<HTMLElement | null>) {
  React.useEffect(() => {
    if (!isDev) return;
    const root = rootRef.current;
    if (!root) return;
    const count = root.querySelectorAll('h1').length;
    if (count < 2) return;
    console.warn(
      `[Page] ページ内に h1 が ${count} 個あります。h1 はページタイトルを担うセクションだけが出します` +
        '（HeroSection、またはヒーローを持たない事例一覧の SectionHeader as="h1"）。' +
        '他のセクション見出しは h2 のままにしてください（composition-redesign.md §Stage 5）。',
    );
    // ページ（=このコンポーネントのライフサイクル）につき1回
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Page — ページのリズムを割り当てるコンテナ（composition-redesign.md §3-3）。
 *
 * - 面: 自分で暗面を塗るセクション（pageSurface 申告）を除き、
 *   default ↔ muted を交互に割り当てる。暗面で交互カウンタをリセットする
 *   （暗面直後は必ず default から再開）
 * - 暗面の3連続は禁止（dev 警告）。可読性の問題であり、確定規則
 * - h1 の重複を dev 警告（マウント後に自ルート配下を数える）
 * - トーン/ブランドは data 属性で配下に伝播する
 * - 計測: `onCTAClick` で配下の `data-cta` 付き CTA のクリックを一括で受け取れる
 */
export const Page = React.forwardRef<HTMLDivElement, PageProps>(
  (
    { brand = 'corporate', tone = 'product', children, onCTAClick, onClickCapture, ...props },
    ref,
  ) => {
    const items = React.Children.toArray(children);

    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const setRootRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref],
    );
    useDuplicateH1Check(rootRef);

    const handleClickCapture = createCTAClickCapture<HTMLDivElement>(onCTAClick, onClickCapture);

    /* CTA ラベル2種ルールの dev レジストリ。MarketingButton（variant="cta"）が
       context 経由で登録する。prod では張らない（DCE でコードごと落ちる） */
    const ctaRegistry = React.useMemo(
      () => (isDev ? createCTALabelRegistry() : null),
      // ページ（=このコンポーネントのライフサイクル）につき1つ
      [],
    );

    /* 1パス目: 全子要素の面を解決する（隣接判定に先読みが要るため2パス構成） */
    const surfaces = items.map((child) =>
      React.isValidElement(child) ? resolvePageSurface(child.type, child.props) : null,
    );

    let alternation = 0;
    let darkRun = 0;
    let darkRunWarned = false;
    let accentCount = 0;
    let accentWarned = false;

    /* 2パス目: リズム割当 */
    const assigned = items.map((child, i) => {
      if (!React.isValidElement(child)) return child;

      const surface = surfaces[i];
      if (surface === 'dark') {
        darkRun += 1;
        alternation = 0;
        if (isDev && darkRun >= 3 && !darkRunWarned) {
          darkRunWarned = true;
          console.warn(
            '[Page] 暗い面のセクションが3つ連続しています。暗面の連続は可読性を損なうため禁止です。' +
              '間に明るい面のセクションを挟んでください（composition-redesign.md §3-3）。',
          );
        }
        return child;
      }

      if (surface === 'accent') {
        // 自前の強調面（CTABand 等）。リズムから除外し、直後は default から再開
        alternation = 0;
        darkRun = 0;
        accentCount += 1;
        if (isDev && accentCount >= 3 && !accentWarned) {
          accentWarned = true;
          console.warn(
            '[Page] 強調面（CTABand 等）が3つ以上あります。実測では面を持つ CTA 帯の反復は' +
              '中間1〜2回 + 末尾が上限です。それ以上の反復は面を持たない CTA で行ってください' +
              '（docs/research/research-cta-band.md §3-1）。',
          );
        }
        return child;
      }

      darkRun = 0;
      /* 強調面（淡いブランド面）は muted との対比が 1.11:1 しかなく、隣接すると
         面差が消える（research-cta-band.md §0）。直後が accent なら muted にしない */
      const nextIsAccent = surfaces[i + 1] === 'accent';
      const muted = alternation % 2 === 1 && !nextIsAccent;
      alternation = nextIsAccent ? 0 : alternation + 1;
      if (!muted) return child;
      return (
        <div key={`page-slot-${i}`} className={styles.slotMuted}>
          {child}
        </div>
      );
    });

    return (
      <CTARegistryContext.Provider value={ctaRegistry}>
        <div
          ref={setRootRef}
          data-brand={brand}
          data-tone={tone}
          className={cn(styles.page)}
          onClickCapture={handleClickCapture}
          {...props}
        >
          {assigned}
        </div>
      </CTARegistryContext.Provider>
    );
  },
);
Page.displayName = 'Page';
