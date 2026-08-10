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
