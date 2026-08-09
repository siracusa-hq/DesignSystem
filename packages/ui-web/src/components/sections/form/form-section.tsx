'use client';

import * as React from 'react';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { SectionHeader } from '@/components/sections/section-header';
import { isDev } from '@/lib/dev';
import { FormInput, FormTextarea, FormSelect, FormButton } from './form-primitives';
import styles from './form-section.module.css';

/* ============================================================
   イチサンフォーム スクリプト読み込みフック（会社名から住所等を自動補完）
   ============================================================ */

function useIchisanForm(enabled: boolean) {
  React.useEffect(() => {
    if (!enabled) return;
    if (document.querySelector('script[src*="ichisanForm"]')) return;

    const script = document.createElement('script');
    script.src = 'https://ichisan.jp/form/lib/ichisanForm.min.js';
    script.async = true;
    document.head.appendChild(script);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://ichisan.jp/form/lib/ichisanForm.min.css';
    document.head.appendChild(link);
  }, [enabled]);
}

/* ============================================================
   共通: Netlify Forms 対応フォーム
   （2026-08-04 決定: Formspree 廃止。ホスティングが Netlify に
     一本化されているため、Netlify Forms を標準とする）
   ============================================================ */

/** AJAX 送信（onResult 指定時）の結果 */
export interface FormSubmitResult {
  /** HTTP レスポンスが 2xx なら true。fetch 自体が失敗した場合も false */
  ok: boolean;
  /** レスポンスが返った場合のみ入る HTTP ステータス */
  status?: number;
  /** fetch が例外を投げた場合の原因（ネットワーク断など） */
  error?: unknown;
}

interface BaseFormSectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  /**
   * Netlify Forms のフォーム名（管理画面での識別子）。
   * 同一サイト内で用途ごとに一意にすること。
   */
  formName?: string;
  /** 送信後に遷移するサンクスページ（未指定なら Netlify の既定サクセス画面） */
  action?: string;
  /**
   * 独自バックエンドに送る場合のハンドラ（e.preventDefault() は呼び出し側で行う）。
   * 未指定なら素の POST として Netlify Forms が受ける。
   */
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  /**
   * 送信の成功/失敗を受け取る計測フック（stage4-workorder.md §3）。
   *
   * 指定すると送信経路が **fetch による AJAX** に切り替わる。フォームの内容を
   * URL エンコード（`form-name` を必ず同梱）して `action ?? location.pathname` へ
   * POST する ── Netlify Forms の AJAX 送信仕様に一致する。ページ遷移は起きないので、
   * サンクス表示やイベント送信は呼び出し側が担当する。
   *
   * **ネイティブ POST（onResult 未指定）ではこのイベントは原理的に出せない。**
   * ブラウザがページごと遷移してしまい、JS が結果を観測する機会がないため。
   * 送信を計測したいなら onResult を使うこと。
   *
   * 送信経路の優先順位: `onSubmit`（完全手動） > `onResult`（AJAX） > ネイティブ POST。
   * `onSubmit` を渡した場合 `onResult` は呼ばれない（送信は呼び出し側の責任になる）。
   */
  onResult?: (result: FormSubmitResult) => void;
  /**
   * 送信ボタンのラベル。**オファー名と一致させること**（stage4-workorder.md §4 Slice 2）。
   * 「送信」のような汎用語はコンバージョンを下げるため、dev では警告が出る。
   * 既定はフォームごとのオファー動詞（問い合わせる / 資料をダウンロード / デモを予約する）。
   */
  submitLabel?: string;
  /** フォーム内蔵文言の言語。既定 'ja'（SSG でも決定的） */
  lang?: FormLang;
}

/* 汎用の送信ラベル（dev 検査の対象）。実測の規範は「ラベル = オファー名」 */
const GENERIC_SUBMIT_LABELS = new Set(['送信', '送信する', 'submit', 'send', 'send message']);

function useSubmitLabelCheck(label: string) {
  React.useEffect(() => {
    if (!isDev) return;
    if (GENERIC_SUBMIT_LABELS.has(label.trim().toLowerCase()) || GENERIC_SUBMIT_LABELS.has(label.trim())) {
      console.warn(
        `[FormSection] 送信ボタンのラベル「${label}」は汎用語です。` +
          'オファー名と一致させてください（例: 「資料をダウンロード」「デモを予約する」。' +
          'composition-redesign.md §4-4）。',
      );
    }
  }, [label]);
}

function NetlifyForm({
  formName,
  action,
  onSubmit,
  onResult,
  children,
}: {
  formName: string;
  action?: string;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  onResult?: (result: FormSubmitResult) => void;
  children: React.ReactNode;
}) {
  /* 優先順位: onSubmit（完全手動） > onResult（AJAX） > ネイティブ POST。
     どれも未指定なら onSubmit を張らず、既存の素の POST 経路のままにする */
  const handleSubmit: React.FormEventHandler<HTMLFormElement> | undefined =
    onSubmit ??
    (onResult
      ? (event) => {
          event.preventDefault();
          const form = event.currentTarget;
          /* FormData → URL エンコード（Netlify Forms の AJAX 送信仕様）。
             ファイル入力は URL エンコードで送れないため文字列だけを積む */
          const body = new URLSearchParams();
          new FormData(form).forEach((value, key) => {
            if (typeof value === 'string') body.append(key, value);
          });
          // hidden 入力が外された場合の保険。Netlify は form-name が無いと受け取れない
          if (!body.has('form-name')) body.set('form-name', formName);

          void (async () => {
            try {
              const res = await fetch(action ?? window.location.pathname, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body.toString(),
              });
              onResult({ ok: res.ok, status: res.status });
            } catch (error) {
              onResult({ ok: false, error });
            }
          })();
        }
      : undefined);

  return (
    <form
      name={formName}
      method="POST"
      action={action}
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className={styles.form}
    >
      {/* Netlify がビルド時にフォームを識別するための必須フィールド */}
      <input type="hidden" name="form-name" value={formName} />
      <p className={styles.honeypot} aria-hidden="true">
        <label>
          記入しないでください: <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      {children}
    </form>
  );
}

/**
 * フォームの言語。**既定は日本語**で、実行環境に依存しない。
 *
 * 旧実装は document.documentElement.lang をブラウザで覗いていたが、
 * Astro の静的生成（Netlify Forms の標準経路）ではサーバーに document が無く、
 * **和文ページでもフォームだけ英語で公開される**事故が起きた（stage5-workorder §7-10）。
 * 「書いたとおりに出る」決定的な挙動に変更: 未指定 = ja / lang="en" で英語。
 */
export type FormLang = 'ja' | 'en';

/** 氏名+メールの定型行（autocomplete で入力摩擦を減らす） */
function NameEmailRow({ isJa }: { isJa: boolean }) {
  return (
    <div className={styles.row2}>
      <FormInput
        name="name"
        label={isJa ? 'お名前' : 'Name'}
        placeholder={isJa ? '田中 太郎' : 'Taro Tanaka'}
        autoComplete="name"
        required
      />
      <FormInput
        name="email"
        type="email"
        label={isJa ? 'メールアドレス' : 'Email'}
        placeholder="you@company.com"
        autoComplete="email"
        inputMode="email"
        required
      />
    </div>
  );
}

/** 会社名 + イチサンフォーム自動補完の隠しフィールド */
function CompanyField({ isJa }: { isJa: boolean }) {
  return (
    <>
      <FormInput
        name="company"
        label={isJa ? '会社名' : 'Company'}
        placeholder={isJa ? '株式会社...' : 'Company name'}
        autofillKey="company_name"
        autoComplete="off"
        required
      />
      {/* イチサンフォームで自動取得される隠しフィールド */}
      <input type="hidden" name="zipcode" className="location_zipcode" />
      <input type="hidden" name="address" className="location_full" />
      <input type="hidden" name="corporate_number" className="corporate_number" />
      <input type="hidden" name="employee_count" className="employee_count" />
    </>
  );
}

/* ============================================================
   ContactForm — お問い合わせ
   ============================================================ */

export interface ContactFormProps extends BaseFormSectionProps {
  /** イチサンフォームによる会社名自動補完を有効化 */
  ichisanEnabled?: boolean;
}

export const ContactForm = React.forwardRef<HTMLElement, ContactFormProps>(
  (
    {
      eyebrow,
      title,
      subtitle,
      formName = 'contact',
      action,
      onSubmit,
      onResult,
      submitLabel,
      lang = 'ja',
      ichisanEnabled = true,
      ...props
    },
    ref,
  ) => {
    useIchisanForm(ichisanEnabled);
    const isJa = lang !== 'en';
    useSubmitLabelCheck(submitLabel ?? (isJa ? '問い合わせる' : 'Contact Us'));

    return (
      <Section ref={ref} background="default" spacing="lg" {...props}>
        <Container size="sm">
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            subtitle={subtitle}
            headingSize="display-sm"
          />
          <NetlifyForm
            formName={formName}
            action={action}
            onSubmit={onSubmit}
            onResult={onResult}
          >
            <NameEmailRow isJa={isJa} />
            <CompanyField isJa={isJa} />
            <FormTextarea
              name="message"
              label={isJa ? 'お問い合わせ内容' : 'Message'}
              placeholder={isJa ? 'ご質問やご要望をお聞かせください' : 'Tell us about your needs'}
              rows={5}
              required
            />
            <FormButton ctaId="form-submit">{submitLabel ?? (isJa ? '問い合わせる' : 'Contact Us')}</FormButton>
          </NetlifyForm>
        </Container>
      </Section>
    );
  },
);
ContactForm.displayName = 'ContactForm';

/* ============================================================
   ResourceRequestForm — 資料請求
   ============================================================ */

export interface ResourceRequestFormProps extends BaseFormSectionProps {
  ichisanEnabled?: boolean;
  /** 請求対象の資料名（hidden フィールドとして送信される） */
  resourceName?: string;
}

export const ResourceRequestForm = React.forwardRef<HTMLElement, ResourceRequestFormProps>(
  (
    {
      eyebrow,
      title,
      subtitle,
      formName = 'resource-request',
      action,
      onSubmit,
      onResult,
      submitLabel,
      lang = 'ja',
      ichisanEnabled = true,
      resourceName,
      ...props
    },
    ref,
  ) => {
    useIchisanForm(ichisanEnabled);
    const isJa = lang !== 'en';
    useSubmitLabelCheck(submitLabel ?? (isJa ? '資料をダウンロード' : 'Download Resource'));

    return (
      <Section ref={ref} background="default" spacing="lg" {...props}>
        <Container size="sm">
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            subtitle={subtitle}
            headingSize="display-sm"
          />
          <NetlifyForm
            formName={formName}
            action={action}
            onSubmit={onSubmit}
            onResult={onResult}
          >
            {resourceName && <input type="hidden" name="resource" value={resourceName} />}
            <NameEmailRow isJa={isJa} />
            <CompanyField isJa={isJa} />
            <FormInput
              name="role"
              label={isJa ? '役職' : 'Job Title'}
              autoComplete="organization-title"
              placeholder={
                isJa ? 'CTO / エンジニアリングマネージャー 等' : 'CTO / Engineering Manager etc.'
              }
            />
            <FormButton ctaId="form-submit">
              {submitLabel ?? (isJa ? '資料をダウンロード' : 'Download Resource')}
            </FormButton>
          </NetlifyForm>
        </Container>
      </Section>
    );
  },
);
ResourceRequestForm.displayName = 'ResourceRequestForm';

/* ============================================================
   DemoRequestForm — デモ予約
   ============================================================ */

export interface DemoRequestFormProps extends BaseFormSectionProps {
  ichisanEnabled?: boolean;
  /** 希望時間帯の選択肢 */
  timeSlots?: { value: string; label: string }[];
}

export const DemoRequestForm = React.forwardRef<HTMLElement, DemoRequestFormProps>(
  (
    {
      eyebrow,
      title,
      subtitle,
      formName = 'demo-request',
      action,
      onSubmit,
      onResult,
      submitLabel,
      lang = 'ja',
      ichisanEnabled = true,
      timeSlots,
      ...props
    },
    ref,
  ) => {
    useIchisanForm(ichisanEnabled);
    const isJa = lang !== 'en';
    useSubmitLabelCheck(submitLabel ?? (isJa ? 'デモを予約する' : 'Book a Demo'));

    const defaultTimeSlots = timeSlots ?? [
      { value: 'morning', label: isJa ? '午前（10:00-12:00）' : 'Morning (10:00-12:00)' },
      { value: 'afternoon', label: isJa ? '午後（13:00-16:00）' : 'Afternoon (13:00-16:00)' },
      { value: 'evening', label: isJa ? '夕方（16:00-18:00）' : 'Evening (16:00-18:00)' },
    ];

    return (
      <Section ref={ref} background="default" spacing="lg" {...props}>
        <Container size="sm">
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            subtitle={subtitle}
            headingSize="display-sm"
          />
          <NetlifyForm
            formName={formName}
            action={action}
            onSubmit={onSubmit}
            onResult={onResult}
          >
            <NameEmailRow isJa={isJa} />
            <CompanyField isJa={isJa} />
            <FormInput
              name="role"
              label={isJa ? '役職' : 'Job Title'}
              autoComplete="organization-title"
              placeholder={isJa ? 'CTO / VPoE 等' : 'CTO / VPoE etc.'}
            />
            <FormSelect
              name="preferred_time"
              label={isJa ? 'ご希望の時間帯' : 'Preferred Time'}
              placeholder={isJa ? '選択してください' : 'Select a time slot'}
              options={defaultTimeSlots}
            />
            <FormTextarea
              name="notes"
              label={isJa ? 'ご質問・ご要望（任意）' : 'Questions or notes (optional)'}
              placeholder={
                isJa
                  ? '事前にお伝えしたいことがあればご記入ください'
                  : 'Anything you would like us to know beforehand'
              }
              rows={3}
            />
            <FormButton ctaId="form-submit">{submitLabel ?? (isJa ? 'デモを予約する' : 'Book a Demo')}</FormButton>
          </NetlifyForm>
        </Container>
      </Section>
    );
  },
);
DemoRequestForm.displayName = 'DemoRequestForm';
