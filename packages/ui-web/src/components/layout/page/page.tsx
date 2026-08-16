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

/**
 * スロットの面。パターン／ページ側が「どのセクションをどの面に置くか」を
 * 明示的に割り当てるための語彙（2026-08）。
 *
 * - `auto`:    Page の自動ゼブラに任せる（既定。配列を渡さないときと同じ）
 * - `default`: 白（面を塗らない）
 * - `muted`:   ニュートラルの沈んだ面（#f4f4f5）
 * - `tinted`:  ブランドのティント淡色面（白 50% + ramp-50。LP 用）
 *
 * `dark` / `accent` はここに無い。**面を自分で塗るかどうかはセクションの内部事情**
 * であり、外から指定させると Stage 2 で消した background props に戻る。
 * 自分で塗るセクションは今までどおり pageSurface で自己申告する。
 */
export const PAGE_SLOT_SURFACES = ['auto', 'default', 'muted', 'tinted'] as const;
export type PageSlotSurface = (typeof PAGE_SLOT_SURFACES)[number];

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
  /**
   * スロットごとの面の明示割当（2026-08）。子の添字と 1:1 で対応する。
   *
   * 渡さない・`'auto'`・配列が子より短いときの余りは、**従来どおり自動ゼブラ**
   * （default ↔ muted の交互割当）で処理される。既定の見た目は変わらない。
   *
   * 明示値を置いたスロットは交互カウンタをリセットするため、その直後の `'auto'` は
   * 必ず白から再開する（暗面・強調面のリセットと同じ考え方）。
   * セクションが `pageSurface` で `dark` / `accent` を自己申告している場合は
   * そちらが優先され、配列の値は無視される（dev 警告）。
   *
   * 機械的な ABAB ゼブラは実サイトでは確認できておらず（交替回数は 1〜3 回が主流。
   * docs/research/research-eyebrow.md §4-3）、LP では「白の連続の中に社会的証明だけが
   * ティントの塊で浮かぶ」といった配置のほうが実測に近い。その割当はページの意味を
   * 知っているパターン側にしか決められないため、この口を開けている。
   */
  surfaces?: PageSlotSurface[];
  /**
   * 自動割当が沈んだ面に使う色（2026-08、既定: `muted`）。
   *
   * 交互リズムそのものは変えず、**色だけ**を差し替える。`tinted` にすると
   * ニュートラルグレー（#f4f4f5）の代わりにブランドのティント淡色を使う。
   *
   * `surfaces` の明示割当と違い、どのスロットが沈むかは自動のままなので、
   * **任意スロット（`about` / `stats` 等）が省かれても隣接や連続が壊れない。**
   * リズムは既存のままでよく色だけブランド寄りにしたいページ型はこちらを使う。
   */
  autoSurface?: Extract<PageSlotSurface, 'muted' | 'tinted'>;
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
 * - 面の明示割当: `surfaces` を渡すと、そのスロットだけ自動ゼブラの代わりに
 *   指定の面（default / muted / tinted）を使う。未指定は従来どおり自動
 * - 暗面の3連続は禁止（dev 警告）。可読性の問題であり、確定規則
 * - h1 の重複を dev 警告（マウント後に自ルート配下を数える）
 * - トーン/ブランドは data 属性で配下に伝播する
 * - 計測: `onCTAClick` で配下の `data-cta` 付き CTA のクリックを一括で受け取れる
 */
export const Page = React.forwardRef<HTMLDivElement, PageProps>(
  (
    {
      brand = 'corporate',
      tone = 'product',
      children,
      surfaces: requested,
      autoSurface = 'muted',
      onCTAClick,
      onClickCapture,
      ...props
    },
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

    /* 1パス目: 全子要素の自己申告面を解決する（隣接判定に先読みが要るため2パス構成） */
    const declared = items.map((child) =>
      React.isValidElement(child) ? resolvePageSurface(child.type, child.props) : null,
    );

    let alternation = 0;
    let darkRun = 0;
    let darkRunWarned = false;
    let accentCount = 0;
    let accentWarned = false;
    let overriddenWarned = false;
    let mutedBeforeAccentWarned = false;

    /* 2パス目: リズム割当 */
    const assigned = items.map((child, i) => {
      if (!React.isValidElement(child)) return child;

      const surface = declared[i];
      /* 配列が短い・未指定なら auto（＝従来の自動ゼブラ） */
      const explicit = requested?.[i] ?? 'auto';

      if (surface === 'dark' || surface === 'accent') {
        /* 自己申告が最優先。塗る/塗らないの判断はセクションの内部に閉じており、
           外からの指定で上書きしてよいものではない（page-surface.ts の契約） */
        if (isDev && explicit !== 'auto' && !overriddenWarned) {
          overriddenWarned = true;
          console.warn(
            `[Page] surfaces[${i}] の指定（"${explicit}"）を無視しました。` +
              `このセクションは pageSurface で "${surface}" を自己申告しています。` +
              '自分で面を塗るセクションの面は外から変えられません（lib/page-surface.ts）。',
          );
        }
      }

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
      const nextIsAccent = declared[i + 1] === 'accent';

      /* 明示割当。自動エンジンの交互カウンタはリセットする（暗面・強調面と同じ扱い。
         明示面の直後の auto は必ず白から再開する） */
      if (explicit !== 'auto') {
        alternation = 0;
        if (isDev && explicit === 'muted' && nextIsAccent && !mutedBeforeAccentWarned) {
          mutedBeforeAccentWarned = true;
          console.warn(
            `[Page] surfaces[${i}] の "muted" の直後が強調面（CTABand 等）です。` +
              'ニュートラルの沈んだ面（#f4f4f5）と淡いブランド面の対比は 1.053:1 しかなく、' +
              '面差が知覚できません。"tinted"（白 / ティント / 強調面が 1.06:1 以上の等間隔）' +
              'か "default" にしてください（docs/research/research-eyebrow.md §4-3）。',
          );
        }
        if (explicit === 'default') return child;
        return (
          <div
            key={`page-slot-${i}`}
            className={explicit === 'tinted' ? styles.slotTinted : styles.slotMuted}
          >
            {child}
          </div>
        );
      }

      /* 強調面（淡いブランド面）は muted との対比が 1.053:1 しかなく、隣接すると
         面差が消える（research-cta-band.md §0）。直後が accent なら muted にしない。
         ティントは強調面と 1.06:1 以上を確保できるため、この回避は要らない */
      const avoidBeforeAccent = nextIsAccent && autoSurface === 'muted';
      const sunken = alternation % 2 === 1 && !avoidBeforeAccent;
      alternation = avoidBeforeAccent ? 0 : alternation + 1;
      if (!sunken) return child;
      return (
        <div
          key={`page-slot-${i}`}
          className={autoSurface === 'tinted' ? styles.slotTinted : styles.slotMuted}
        >
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
