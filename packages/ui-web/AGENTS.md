# AGENTS.md — `@siracusahq/gtm-design-system`

BtoB マーケティング LP のためのデザインシステム。構成の規範は国内 BtoB SaaS 19 ページの実測に基づいてパッケージ側が持っており、**AI エージェントの仕事は「デザインする」ことではなく「用意されたスロットを埋める」こと**である。

判断に迷ったら [./GUIDELINES.md](./GUIDELINES.md) を読むこと。本ファイルは入口であり、規範の本文はそちらにある。

## 導入

```ts
import '@siracusahq/gtm-design-system/styles.css';
```

この1行だけ。**Tailwind の導入・設定は不要**で、`@source` の記述も要らない。コンパイル済み CSS にコンポーネントスタイル・トークン・4ブランドのテーマ・Web フォントが入っている。

## 語彙（この3軸だけで表現する）

| 軸                | 値                                                                                   | 意味                                       |
| ----------------- | ------------------------------------------------------------------------------------ | ------------------------------------------ |
| ブランド `brand`  | `corporate` / `polastack` / `peerdesk` / `peerdesk-taxpeer`                          | 誰の顔か。色相と視覚デバイスを決める       |
| トーン `tone`     | `trust` / `product` / `campaign`                                                     | 何を狙うページか。余白量・装飾量を決める   |
| ページ型 `pattern` | `product` / `product-portfolio-top` / `lead-gen` / `case-study-list` / `case-study-detail` / `corporate-top` | 構成。セクションの順序と面のリズムを決める |

ブランドとトーンは直交する。`brand="peerdesk" tone="campaign"` も `brand="corporate" tone="trust"` も成立し、組み合わせに禁止はない。

## 組み方は2つだけ

### (a) LP 量産 — `defineLandingPage()`

**構成を自作しないこと。** セクションの順序・面と余白のリズム・CTA の配置はパターンが決める。呼び出し側は内容だけを渡す。

```tsx
import { defineLandingPage, LandingPage } from '@siracusahq/gtm-design-system';

<LandingPage {...defineLandingPage({
  pattern: 'product',
  brand: 'peerdesk-taxpeer',
  hero: { title: '…', subtitle: '…', offers: [{ label: '資料をダウンロード', href: '/download' }] },
  proof: { stats: { stats: [/* … */], asOf: '2026年7月時点' } },
  features: { title: '…', features: [/* … */] },
  closing: { title: '…' },
})} />
```

必須スロットが欠けていれば型エラーで落ちる。各ページ型で用意すべき素材は [GUIDELINES.md §2](./GUIDELINES.md#2-ユースケース別ガイドページ型5つ) にチェックリストがある。

### (b) 一点物のページ — `<Page>`

コーポレートサイトなど1ページずつ違うものだけ。並べ方は自由で、面と余白のリズムは `<Page>` が自動で割り当てる。

```tsx
<Page brand="corporate" tone="trust">
  <HeroSection … />
  <ModuleOverview … />
  <CTASection … />
</Page>
```

## Astro で使うときの注意（3点）

1. **`.astro` にセクションを直接並べない。** Astro は子を「レンダリング済み HTML の塊」として React に渡すため、`<Page>` から子が見えず、面リズムも dev 警告も効かない（実測: `.astro` 直置きで muted 面の出現 0 件）。`defineLandingPage` + `<LandingPage>` を使うか、セクションの並びを `.tsx` にまとめて `.astro` からはそれを1つ置く
2. **対話部品には `client:visible` を付ける。** アコーディオン（FAQSection）・多軸フィルタ（CaseStudyListSection）・カウントアップは JS が要る。ヒーローや機能一覧などの静的セクションには付けない
3. **フォームは静的出力のまま置く。** Netlify Forms はビルド後の静的 HTML を解析して受け口を作る。`client:*` を付けると解析対象が消える。フォームの言語は既定 `ja`（英語にするときだけ `lang="en"`）

## 間違いは文章ではなく機械が止める

- 面・余白・列数・色を指定する props は**存在しない**（型エラー）
- `className` は**受け付けない**（型エラー）
- 構成の逸脱（h1 重複・暗面3連続・CTA ラベル3種目・FV の CTA 3本目 など9種）は**開発中にコンソール警告**が出る

止められるものの一覧は [GUIDELINES.md §6](./GUIDELINES.md#6-守られていることの一覧読むだけでよい)。読まなくても機械が止めるので、覚える必要はない。
