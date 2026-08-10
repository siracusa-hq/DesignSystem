import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import {
  ContactForm,
  ResourceRequestForm,
  DemoRequestForm,
  type FormSubmitResult,
} from '../../components/sections/form';
import { Text } from '../../components/primitives/text';

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

export const 資料請求_サンクスページ指定: Story = {
  render: () => (
    <ResourceRequestForm
      title="製品資料をダウンロード"
      subtitle="機能の詳細、料金の考え方、導入の流れをまとめた資料をお送りします。"
      resourceName="polastack-overview"
      action="/thanks"
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

export const 独自バックエンド_onSubmit: Story = {
  render: () => (
    <ContactForm
      title="独自バックエンドに送る例"
      subtitle="onSubmit で preventDefault し、自前の API へ送信する。"
      onSubmit={(e) => {
        e.preventDefault();
        // eslint-disable-next-line no-alert
        alert('カスタム送信ハンドラが呼ばれました（Netlify へは送信されません）');
      }}
    />
  ),
};

/**
 * AJAX 送信（Stage 4 Slice 0）。`onResult` を渡すと送信経路が fetch に切り替わり、
 * ページ遷移せずに成功/失敗を受け取れる（URL エンコード・`form-name` 同梱・
 * POST 先は `action ?? location.pathname`。Netlify Forms の AJAX 仕様どおり）。
 *
 * **ネイティブ POST（onResult 未指定）ではこのイベントは原理的に出せない。**
 * ブラウザがページごと遷移するため、JS が結果を観測する機会がない。
 * 送信を計測したい／その場でサンクスを出したいなら onResult を使う。
 *
 * 送信ボタンには `data-cta="form-submit"` が自動で付くので、
 * クリック自体は `Page.onCTAClick` でも拾える（どのフォームかは form-name で判別する）。
 */
const AjaxResultExample = () => {
  /* 実運用の型: 結果を state に受けて、その場に表示する（ページ遷移なし）。
     Storybook には受け口（Netlify Forms）が無いため、送信すると失敗側の表示になる —
     それ自体が「結果がプログラムに届く」ことの実演になっている */
  const [result, setResult] = React.useState<FormSubmitResult | null>(null);
  return (
    <div>
      <ResourceRequestForm
        title="AJAX 送信の例"
        subtitle="送信してもページは遷移しない。結果は onResult で受け取り、その場に表示する。"
        resourceName="polastack-overview"
        onResult={setResult}
      />
      {result && (
        <div
          role="status"
          style={{ maxWidth: '36rem', margin: '0 auto', padding: '0 1.5rem 4rem' }}
        >
          <Text as="p" size="body-md" tone={result.ok ? 'brand' : 'muted'}>
            {result.ok
              ? '送信ありがとうございました。資料のダウンロードリンクをお送りしました。'
              : `送信できませんでした（status=${result.status ?? '-'}）。時間をおいてもう一度お試しください。`}
          </Text>
        </div>
      )}
    </div>
  );
};

export const AJAX送信_onResult: Story = {
  render: () => <AjaxResultExample />,
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
