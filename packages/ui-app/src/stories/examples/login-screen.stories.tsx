import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AlertCircle } from 'lucide-react';
import { brand } from '@siracusahq/tokens';
import {
  AuthLayout,
  AuthLayoutForm,
  AuthLayoutVisual,
  AuthVisualContent,
  AuthVisualBackdrop,
  AuthVisualTitle,
  AuthVisualAccent,
  AuthVisualDescription,
  AuthVisualFeatures,
  AuthVisualFeature,
  AuthVisualQuote,
  AuthVisualLogos,
  AuthVisualStat,
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

function SSODivider() {
  return (
    <div className="flex items-center gap-3">
      <Separator className="flex-1" />
      <span className="text-xs text-[var(--color-on-surface-muted)]">または</span>
      <Separator className="flex-1" />
    </div>
  );
}

/**
 * sso='top' は SSO 主体の構成（Netlify/Supabase/Figma/Clerk/Resend 型）。
 * ログインと登録を兼ねる導線のため、ボタン文言は「ログイン」ではなく
 * 中立な「続行」を使う（Notion / Slack 日本語版の実文言に準拠）。
 * sso='bottom' はメール+パスワード主体で、SSO は補助導線。
 */
function LoginForm({ error, sso }: { error?: boolean; sso?: 'top' | 'bottom' }) {
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

      {sso === 'top' && (
        <>
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="w-full">
              Google で続行
            </Button>
            <Button variant="outline" className="w-full">
              Microsoft で続行
            </Button>
            <Button variant="outline" className="w-full">
              SSO（SAML）で続行
            </Button>
          </div>
          <SSODivider />
        </>
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

      {sso === 'bottom' && (
        <>
          <SSODivider />
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

/** 右パネルの製品訴求。AuthVisual* コンポーネント群で組み立てる */
function ProductVisual() {
  const features = [
    '請求から入金消込までを1画面で',
    '監査ログと権限管理を標準装備',
    '既存の会計ソフトとAPI連携',
  ];
  return (
    <>
      <AuthVisualBackdrop />
      <AuthVisualContent>
        <AuthVisualTitle>
          バックオフィスの定型業務を、
          <AuthVisualAccent>自動で終わらせる。</AuthVisualAccent>
        </AuthVisualTitle>
        <AuthVisualDescription>
          Polastack は経理・労務・法務の反復作業を自動化する業務プラットフォームです。
        </AuthVisualDescription>
        <AuthVisualFeatures>
          {features.map((feature) => (
            <AuthVisualFeature key={feature}>{feature}</AuthVisualFeature>
          ))}
        </AuthVisualFeatures>
      </AuthVisualContent>
    </>
  );
}

/** 単色化した架空の顧客ロゴ（実運用では monochrome の SVG ロゴを渡す） */
function DemoLogo({ children }: { children: string }) {
  return <span className="text-sm font-semibold tracking-tight">{children}</span>;
}

/**
 * trust wall 構成（Drata / Supabase / Knock 型）。
 * 「引用 + 氏名・役職 + 顧客ロゴ列 + 数値ピル」の4点セット。
 * 既存ユーザーの日常導線であるログインでは Default の製品訴求に留め、
 * サインアップ等の獲得導線でこちらを使う想定。
 */
function TrustVisual() {
  return (
    <>
      <AuthVisualBackdrop />
      <AuthVisualContent className="gap-10">
        <AuthVisualStat value="月間 12万時間" label="の定型業務を自動化" />
        <AuthVisualQuote
          author="佐藤 誠"
          role="経営管理部長 / ノヴァワークス株式会社"
          logo={<DemoLogo>NOVAWORKS</DemoLogo>}
        >
          月次決算が5営業日から2営業日になりました。監査対応の資料づくりが実質ゼロになったのが一番大きい。
        </AuthVisualQuote>
        <AuthVisualLogos label="導入企業">
          <DemoLogo>NOVAWORKS</DemoLogo>
          <DemoLogo>関東製作所</DemoLogo>
          <DemoLogo>AOBA Foods</DemoLogo>
          <DemoLogo>みなと運輸</DemoLogo>
          <DemoLogo>Hoshino Lab</DemoLogo>
          <DemoLogo>クレド商事</DemoLogo>
        </AuthVisualLogos>
      </AuthVisualContent>
    </>
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

/** trust wall 構成（引用 + ロゴ列 + 数値ピル）。サインアップ等の獲得導線向け */
export const SocialProof: Story = {
  render: () => (
    <AuthLayout>
      <AuthLayoutForm>
        <LoginForm sso="top" />
      </AuthLayoutForm>
      <AuthLayoutVisual>
        <TrustVisual />
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

/** SSO 主体の構成。SSO ボタン群を最上部に置き、メール+パスワードを補助扱いにする */
export const SSOFirst: Story = {
  render: () => (
    <AuthLayout>
      <AuthLayoutForm>
        <LoginForm sso="top" />
      </AuthLayoutForm>
      <AuthLayoutVisual>
        <ProductVisual />
      </AuthLayoutVisual>
    </AuthLayout>
  ),
};

/** メール+パスワード主体で、SSO は補助導線としてフォームの下に置く構成 */
export const WithSSO: Story = {
  render: () => (
    <AuthLayout>
      <AuthLayoutForm>
        <LoginForm sso="bottom" />
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
