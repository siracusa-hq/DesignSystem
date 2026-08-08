import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Page } from '../../components/layout/page';
import { Container } from '../../components/primitives/container';
import { Section } from '../../components/primitives/section';
import { Text } from '../../components/primitives/text';
import { Heading } from '../../components/primitives/heading';
import { HeroSection } from '../../components/sections/hero-section';
import { StatsSection } from '../../components/sections/stats-section';
import { LogoCloud } from '../../components/sections/logo-cloud';
import { CTABand } from '../../components/sections/cta-band';
import { CTASection } from '../../components/sections/cta-section';
import { ContactForm } from '../../components/sections/form';
import { defineLandingPage, LandingPage, type OfferPair } from '../../patterns';

/**
 * 規範ガード — dev ビルドでコンソールに出る警告のカタログ（Stage 5 Slice 1）。
 *
 * **ブラウザのコンソール（F12 / ⌥⌘I）を開いてから各ストーリーを選ぶこと。**
 * 見た目には何も起きない。警告は `console.warn` にだけ出る。
 *
 * このデザインシステムの規範は、守れているかどうかを**機械が判定できる形**で
 * 持っている。文章のガイドラインは読まれないし守られないため、
 * 「型で落とす → dev で警告する → VRT で固定する」の3段で担保する。
 * ここに並ぶのは真ん中の段（dev 警告）で、**すべて `process.env.NODE_ENV`
 * による分岐なので production ビルドではコードごと消える**。
 *
 * 各警告の根拠は日本語 LP 19社の実測（`[LP]` 調査）と景品表示法。
 * 「一般にこう言われている」ではなく、数えた結果だけを規則にしている。
 */
const meta = {
  title: 'Patterns/規範ガード',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/* ============================================================
   共通: 何が起きるかを画面にも書いておく説明ブロック
   ============================================================ */

function Guide({
  rule,
  evidence,
  expected,
}: {
  /** 何が規範か */
  rule: string;
  /** その規範の実測根拠 */
  evidence: string;
  /** コンソールに出る警告の先頭（探す手がかり） */
  expected: string;
}) {
  return (
    <Section background="muted" spacing="md">
      <Container size="md">
        <Heading as="h2" size="heading-lg">
          コンソール（F12）を開いて確認してください
        </Heading>
        <div style={{ marginTop: '1rem', display: 'grid', gap: '0.5rem' }}>
          <Text size="body-md">
            <strong>規範</strong>: {rule}
          </Text>
          <Text size="body-sm" tone="secondary">
            <strong>実測根拠</strong>: {evidence}
          </Text>
          <Text size="body-sm" tone="muted">
            <strong>出る警告</strong>: {expected}
          </Text>
        </div>
      </Container>
    </Section>
  );
}

const offers: OfferPair = [
  { label: '資料をダウンロード', href: '#dl' },
  { label: '料金を見る', href: '#pricing' },
];

/* ============================================================
   1. 暗い面の3連続
   ============================================================ */

/**
 * **コンソール（F12）を開いてから見ること。**
 *
 * 自分で暗面を塗るセクション（CTASection / ModuleOverview / 暗い backdrop の
 * HeroSection）が3つ続くと警告する。暗面の連続はページ全体の可読性を落とすため、
 * 実測の有無に関係なく確定規則にしている。
 */
export const 暗面3連続: Story = {
  render: () => (
    <>
      <Guide
        rule="自分で暗面を塗るセクションを3つ以上連続させない。間に明るい面を挟む"
        evidence="可読性の問題。他社実測ではなく確定規則（composition-redesign.md §3-3）"
        expected="[Page] 暗い面のセクションが3つ連続しています。…"
      />
      <Page brand="polastack">
        <CTASection title="1つ目の暗面" actions={[offers[0]]} />
        <CTASection title="2つ目の暗面" actions={[offers[0]]} />
        <CTASection title="3つ目の暗面（ここで警告）" actions={[offers[0]]} />
      </Page>
    </>
  ),
};

/* ============================================================
   2. 強調面（CTABand）の反復しすぎ
   ============================================================ */

/**
 * **コンソール（F12）を開いてから見ること。**
 *
 * 面を持つ CTA 帯（CTABand）を Page 配下に3つ以上置くと警告する。
 * 高頻度で CTA を反復したい場合は、面を持たない裸の CTA を使う。
 */
export const CTABand3つ: Story = {
  render: () => (
    <>
      <Guide
        rule="面を持つ CTA 帯の反復は中間1〜2回 + 末尾まで。それ以上は面なしの CTA で行う"
        evidence="CTA 帯の実測（research-cta-band.md §3-1）。4〜6回の高頻度反復は裸の CTA が担っていた"
        expected="[Page] 強調面（CTABand 等）が3つ以上あります。…"
      />
      <Page brand="peerdesk">
        <CTABand title="1本目の帯" actions={[offers[0]]} />
        <CTABand title="2本目の帯" actions={[offers[0]]} />
        <CTABand title="3本目の帯（ここで警告）" actions={[offers[0]]} />
      </Page>
    </>
  ),
};

/* ============================================================
   3. プライマリ CTA のラベルが3種類
   ============================================================ */

/**
 * **コンソール（F12）を開いてから見ること。**
 *
 * プライマリ CTA（`variant="cta"`）のラベルが3種類目に到達すると警告する。
 * **回数は数えない。** 同じラベルの反復は実測の標準形なので自由。
 */
export const プライマリCTAラベル3種: Story = {
  render: () => (
    <>
      <Guide
        rule="プライマリ CTA のラベルは2種類まで。同じラベルを何度反復してもよい"
        evidence="[LP] 実測の標準形は「同じ2種をセクション区切りごとに反復」（反復回数の中央値 15〜16本）"
        expected="[Page] プライマリCTA（variant=&quot;cta&quot;）のラベルが3種類以上あります: …"
      />
      {/* CTABand は2本まで（3本目は別の警告が鳴る）。3種類目は締めの CTASection で出す */}
      <Page brand="peerdesk-taxpeer">
        <CTABand title="1種類目" actions={[{ label: '資料をダウンロード', href: '#dl' }]} />
        <CTABand title="2種類目" actions={[{ label: '料金を見る', href: '#pricing' }]} />
        <CTASection
          title="3種類目（ここで警告）"
          actions={[{ label: 'デモを予約する', href: '#demo' }]}
        />
      </Page>
    </>
  ),
};

/* ============================================================
   4. ファーストビューの CTA が3本
   ============================================================ */

/**
 * **コンソール（F12）を開いてから見ること。**
 *
 * ヒーローの `actions` が3本以上で警告する。
 * `defineLandingPage` 経由なら `OfferPair` の型で3本目が落ちるが、
 * `HeroSection` を直接使う経路のために実行時の検査も持っている。
 */
export const FVのCTA3本: Story = {
  render: () => (
    <>
      <Guide
        rule="ファーストビューの CTA は2本まで（軽いオファー + 重いオファー）"
        evidence="[LP] 実測 13/17 が2本。3本以上は判断が割れる"
        expected="[HeroSection] ファーストビューの CTA が 3 本あります。…"
      />
      <Page brand="corporate">
        <HeroSection
          title="オファーを3つ並べたヒーロー"
          subtitle="選択肢が増えるほど、どれも選ばれなくなります。"
          actions={[
            { label: '資料をダウンロード', href: '#dl' },
            { label: '料金を見る', href: '#pricing' },
            { label: 'デモを予約する', href: '#demo' },
          ]}
        />
      </Page>
    </>
  ),
};

/* ============================================================
   5. 送信ボタンのラベルが汎用語
   ============================================================ */

/**
 * **コンソール（F12）を開いてから見ること。**
 *
 * フォームの送信ラベルが「送信」「submit」等の汎用語だと警告する。
 * ラベルはオファー名と一致させる（「資料をダウンロード」「デモを予約する」）。
 */
export const 汎用の送信ラベル: Story = {
  render: () => (
    <>
      <Guide
        rule="送信ボタンのラベルはオファー名と一致させる。「送信」のような汎用語を使わない"
        evidence="ラベル = オファー名が実測の規範（composition-redesign.md §4-4）"
        expected="[FormSection] 送信ボタンのラベル「送信」は汎用語です。…"
      />
      <Page brand="corporate">
        <ContactForm
          title="お問い合わせ"
          submitLabel="送信"
          ichisanEnabled={false}
        />
      </Page>
    </>
  ),
};

/* ============================================================
   6. h1 の重複
   ============================================================ */

/**
 * **コンソール（F12）を開いてから見ること。**
 *
 * Page はマウント後に自ルート配下の `h1` を数え、2つ以上で警告する。
 * h1 を出すのはページタイトルを担うセクションだけ
 * （HeroSection、またはヒーローを持たない事例一覧の `SectionHeader as="h1"`）。
 */
export const h1の重複: Story = {
  render: () => (
    <>
      <Guide
        rule="ページ内の h1 は1つ。他のセクション見出しは h2 のまま"
        evidence="構造の問題（見出しレベルの飛びは支援技術のページ把握を壊す）"
        expected="[Page] ページ内に h1 が 2 個あります。…"
      />
      <Page brand="corporate">
        <HeroSection title="ヒーローの h1（正しい1つ目）" />
        <Section background="default" spacing="md">
          <Container>
            {/* セクション見出しに h1 を使ってしまった例 */}
            <h1>セクション見出しに h1 を使った（ここで警告）</h1>
          </Container>
        </Section>
      </Page>
    </>
  ),
};

/* ============================================================
   7. 社会的証明スロットが空
   ============================================================ */

/**
 * **コンソール（F12）を開いてから見ること。**
 *
 * `product` / `product-portfolio-top` のページで `proof` を渡さないと警告する。
 * ロゴ帯と数値訴求は代替関係なので「どちらか」でよいが、どちらも無いページは
 * 実測に1件も存在しなかった。
 */
export const 社会的証明なし: Story = {
  render: () => (
    <>
      <Guide
        rule="ヒーロー直下の社会的証明スロットに、ロゴ帯か数値訴求のどちらかを必ず置く"
        evidence="[LP] 19/19 が数値訴求を保有。ロゴ帯を置かず数値に振り切るページも 6/19 と一般的"
        expected="[LandingPage] 社会的証明スロット（proof）が空です（pattern=&quot;product&quot;）。…"
      />
      <LandingPage
        {...defineLandingPage({
          pattern: 'product',
          brand: 'peerdesk',
          hero: {
            title: '証明のないランディングページ',
            subtitle: 'ロゴ帯も数値訴求も置いていない状態です。',
            offers,
          },
          features: {
            title: '機能',
            features: [{ title: '機能A', description: '説明。' }],
          },
          closing: { title: 'まずは資料からご覧ください' },
        })}
      />
    </>
  ),
};

/* ============================================================
   8. ロゴが1〜5社
   ============================================================ */

/**
 * **コンソール（F12）を開いてから見ること。**
 *
 * ロゴが1〜5社のロゴ帯で警告する。6社以上、あるいは0社（数値訴求に振り切る）
 * なら警告しない。「6社未満は逆効果」という因果は CVR データが非公開で検証不能なので、
 * 禁止ではなく**切替ガイド**として出している。
 */
export const ロゴ3社: Story = {
  render: () => (
    <>
      <Guide
        rule="ロゴ帯を組むなら6社以上（中央値は約20社・14社以上でカルーセル）。少数しか出せないならロゴ帯にせず事例カードに紐付ける"
        evidence="[LP] 1〜5社のロゴ帯は日本語ページに実例0件。0社（数値に振り切り）は 6/19"
        expected="[LogoCloud] ロゴが 3 社です。1〜5社の中途半端なロゴ帯は…"
      />
      <Page brand="corporate">
        <LogoCloud
          eyebrow="導入企業"
          title="3社しか出せないロゴ帯（ここで警告）"
          logos={[
            { name: 'Company A', node: <span>Company A</span> },
            { name: 'Company B', node: <span>Company B</span> },
            { name: 'Company C', node: <span>Company C</span> },
          ]}
        />
      </Page>
    </>
  ),
};

/* ============================================================
   9. 実績数値に時点表記が無い
   ============================================================ */

/**
 * **コンソール（F12）を開いてから見ること。**
 *
 * `StatsSection` に `asOf`（例: 「2026年7月時点」）も `note` も無いと警告する。
 * 景品表示法上、いつの数字か分からない実績表示は不当表示になりえる。
 * 文言はパッケージが持たず、利用側が文字列で渡す。
 */
export const 時点表記なし: Story = {
  render: () => (
    <>
      <Guide
        rule="実績数値には基準時点を付ける（asOf）。出典・調査方法まで書くなら note"
        evidence="景品表示法。No.1・シェア系を出す場合はほぼ必須"
        expected="[StatsSection] 実績数値に時点表記がありません。…"
      />
      <Page brand="corporate">
        <StatsSection
          eyebrow="実績"
          title="時点の無い実績数値（ここで警告）"
          stats={[
            { value: '1,200', numericValue: 1200, suffix: '社', label: '導入企業' },
            { value: '98', numericValue: 98, suffix: '%', label: '継続率' },
            { value: '3', numericValue: 3, suffix: '日', label: '平均導入期間' },
          ]}
        />
      </Page>
    </>
  ),
};

/**
 * **コンソール（F12）を開いてから見ること。警告が出ない例。**
 *
 * `asOf` を渡した状態。数値グリッドの下に caption で控えめに出る。
 * 上の 時点表記なし と見比べて、警告が消えることを確認すること。
 */
export const 時点表記あり_警告なし: Story = {
  render: () => (
    <>
      <Guide
        rule="asOf を渡せば警告は出ない。表示は caption トークンで控えめに"
        evidence="景品表示法。時点を自由文の note に書いている既存ページでも誤発火しない"
        expected="（警告は出ません）"
      />
      <Page brand="corporate">
        <StatsSection
          eyebrow="実績"
          title="時点表記のある実績数値"
          stats={[
            { value: '1,200', numericValue: 1200, suffix: '社', label: '導入企業' },
            { value: '98', numericValue: 98, suffix: '%', label: '継続率' },
            { value: '3', numericValue: 3, suffix: '日', label: '平均導入期間' },
          ]}
          asOf="※2026年7月末時点"
          note="当社調べ（導入企業アンケート 412 件の集計による）"
        />
      </Page>
    </>
  ),
};
