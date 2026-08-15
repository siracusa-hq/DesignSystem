import type { Meta, StoryObj } from '@storybook/react';
import {
  ContactForm,
  ResourceRequestForm,
  DemoRequestForm,
} from '../../components/sections/form';

/**
 * フォーム3種 — Netlify Forms 標準（2026-08-04 決定・Formspree 廃止）。
 *
 * Netlify にデプロイするだけで送信が機能する（data-netlify / form-name /
 * honeypot を標準で描画。Astro のプリレンダでビルド時に検出される）。
 * 独自バックエンドに送る場合は `onSubmit` を渡す（preventDefault は呼び出し側）。
 */

const meta = {
  title: 'Sections/Forms',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const お問い合わせ: Story = {
  render: () => (
    <ContactForm
      title="まずはお気軽にご相談ください"
      subtitle="内容を確認のうえ、担当者より1営業日以内にご連絡いたします。"
    />
  ),
};

export const 資料請求: Story = {
  render: () => (
    <ResourceRequestForm
      title="製品資料をダウンロード"
      subtitle="機能の詳細、料金の考え方、導入の流れをまとめた資料をお送りします。"
      resourceName="polastack-overview"
    />
  ),
};

export const デモ予約: Story = {
  render: () => (
    <DemoRequestForm
      title="30分のオンラインデモ"
      subtitle="実際の画面を見ながら、貴社のユースケースに沿ってご説明します。"
    />
  ),
};

export const English: Story = {
  render: () => (
    <ContactForm
      title="Talk to our team"
      subtitle="We will get back to you within one business day."
      lang="en"
    />
  ),
};

/**
 * 名前付きの3項目（種別 / 電話 / 同意）を有効化した状態。
 * 国内 BtoB の問い合わせフォームの定型で、正本が必須とする構成。
 */
export const 日本向けフル構成: Story = {
  render: () => (
    <ContactForm
      title="お問い合わせ"
      subtitle="製品のご相談、お見積り、取材のご依頼はこちらから。2営業日以内にご返信します。"
      inquiryTypes={[
        '製品について相談したい',
        'お見積りがほしい',
        '導入支援について',
        '取材・登壇のご依頼',
        'その他',
      ]}
      phone="optional"
      consent={{ href: '/privacy' }}
    />
  ),
};

/**
 * `extraFields` で項目を足した状態。
 *
 * **開いているのは「項目」であって「見た目」ではない。** 受け取るのはデータだけで、
 * 描画は DS のフォーム部品に固定される（`className` も `children` も無い）。
 * 追加した項目も、組み込み項目とまったく同じ見た目になる。
 */
export const 項目を追加する: Story = {
  render: () => (
    <ContactForm
      title="お問い合わせ"
      inquiryTypes={['製品について相談したい', 'その他']}
      phone="required"
      consent={{ href: '/privacy' }}
      extraFields={[
        { kind: 'text', name: 'department', label: '部署名', placeholder: '情報システム部' },
        {
          kind: 'select',
          name: 'budget',
          label: 'ご予算感',
          placeholder: '選択してください',
          options: ['〜100万円', '100万〜500万円', '500万円〜', '未定'],
        },
        { kind: 'checkbox', name: 'newsletter', label: '製品アップデートのメール配信を希望する' },
      ]}
    />
  ),
};

/**
 * 外部の入力補完サービス（イチサンフォーム）を明示的に有効化した状態。
 *
 * **既定はオフ。** 外部スクリプトを読む＝送信先が1つ増える判断なので、
 * 利用側が明示的に有効化する（0.12.0 で既定を反転した）。
 */
export const 会社名の自動補完を有効化: Story = {
  render: () => (
    <ContactForm
      title="お問い合わせ"
      subtitle="会社名を入力すると、住所・法人番号が自動で補完されます。"
      ichisanEnabled
    />
  ),
};
