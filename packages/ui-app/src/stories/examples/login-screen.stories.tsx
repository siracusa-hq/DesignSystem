import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { brand } from '@siracusahq/tokens';
import {
  AuthLayout,
  AuthLayoutForm,
  AuthLayoutVisual,
} from '../../components/auth-layout';
import {
  FormField,
  FormLabel,
  FormControl,
} from '../../components/form-field';
import { Input } from '../../components/input';
import { Checkbox } from '../../components/checkbox';
import { Button } from '../../components/button';
import { Label } from '../../components/label';
import { Alert, AlertTitle, AlertDescription } from '../../components/alert';
import { Separator } from '../../components/separator';

const meta: Meta = {
  title: 'Examples/Login Screen',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

function LoginForm({ error, sso }: { error?: boolean; sso?: boolean }) {
  return (
    <div className="flex flex-col gap-6">
      {/* 見出しは「製品名にログイン」一文のみ。説明サブコピーは置かない
          （Linear/GitHub/freee 等の定石。ロゴはモバイルで Visual が消えるためフォーム側に置く） */}
      <div className="flex flex-col gap-4">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold text-white"
          style={{ backgroundColor: brand[500] }}
          aria-hidden="true"
        >
          P
        </div>
        <h1 className="text-2xl font-semibold text-[var(--color-on-surface)]">
          Polastack にログイン
        </h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>ログインできませんでした</AlertTitle>
          <AlertDescription>
            メールアドレスまたはパスワードが正しくありません。
          </AlertDescription>
        </Alert>
      )}

      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        <FormField>
          <FormLabel>メールアドレス</FormLabel>
          <FormControl>
            <Input type="email" placeholder="you@example.com" autoComplete="email" />
          </FormControl>
        </FormField>

        <FormField>
          <FormLabel>パスワード</FormLabel>
          <FormControl>
            <Input type="password" autoComplete="current-password" />
          </FormControl>
        </FormField>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember">ログイン状態を保持</Label>
          </div>
          <Button variant="link" className="h-auto p-0">
            パスワードをお忘れの方
          </Button>
        </div>

        <Button type="submit" className="w-full">
          ログイン
        </Button>
      </form>

      {sso && (
        <>
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-[var(--color-on-surface-muted)]">または</span>
            <Separator className="flex-1" />
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="w-full">
              Google でログイン
            </Button>
            <Button variant="outline" className="w-full">
              Microsoft でログイン
            </Button>
          </div>
        </>
      )}

      <p className="text-center text-sm text-[var(--color-on-surface-muted)]">
        アカウントをお持ちでない方は
        <a href="#signup" className="text-primary-500 hover:underline">
          こちら
        </a>
      </p>

      <p className="text-center text-xs text-[var(--color-on-surface-muted)]">
        続行すると
        <a href="#terms" className="text-primary-500 hover:underline">
          利用規約
        </a>
        に同意したものとみなされます。
      </p>
    </div>
  );
}

/**
 * 右パネルの製品訴求。暗色背景上の装飾なので brand スケールを直接使う
 * （ui-app のテーマには brand を公開しない方針のため、CSS変数化しないこと）。
 */
function ProductVisual() {
  const features = [
    '請求から入金消込までを1画面で',
    '監査ログと権限管理を標準装備',
    '既存の会計ソフトとAPI連携',
  ];
  return (
    <div className="flex max-w-md flex-col gap-8">
      <div>
        <h2 className="text-3xl font-semibold leading-snug">
          バックオフィスの定型業務を、
          <span style={{ color: brand[300] }}>自動で終わらせる。</span>
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          Polastack は経理・労務・法務の反復作業を自動化する業務プラットフォームです。
        </p>
      </div>
      <ul className="flex flex-col gap-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3 text-sm text-white/90">
            <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: brand[400] }} />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <AuthLayout>
      <AuthLayoutForm>
        <LoginForm />
      </AuthLayoutForm>
      <AuthLayoutVisual>
        <ProductVisual />
      </AuthLayoutVisual>
    </AuthLayout>
  ),
};

export const WithError: Story = {
  render: () => (
    <AuthLayout>
      <AuthLayoutForm>
        <LoginForm error />
      </AuthLayoutForm>
      <AuthLayoutVisual>
        <ProductVisual />
      </AuthLayoutVisual>
    </AuthLayout>
  ),
};

export const WithSSO: Story = {
  render: () => (
    <AuthLayout>
      <AuthLayoutForm>
        <LoginForm sso />
      </AuthLayoutForm>
      <AuthLayoutVisual>
        <ProductVisual />
      </AuthLayoutVisual>
    </AuthLayout>
  ),
};

/** ビジュアルを左に置く場合は子要素の順序を入れ替えるだけでよい */
export const VisualLeft: Story = {
  render: () => (
    <AuthLayout>
      <AuthLayoutVisual>
        <ProductVisual />
      </AuthLayoutVisual>
      <AuthLayoutForm>
        <LoginForm />
      </AuthLayoutForm>
    </AuthLayout>
  ),
};

/** ビジュアルなしの1カラム（シンプル運用） */
export const FormOnly: Story = {
  render: () => (
    <AuthLayout className="lg:grid-cols-1">
      <AuthLayoutForm>
        <LoginForm />
      </AuthLayoutForm>
    </AuthLayout>
  ),
};
