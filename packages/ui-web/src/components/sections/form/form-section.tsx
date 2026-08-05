'use client';

import * as React from 'react';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { SectionHeader } from '@/components/sections/section-header';
import { FormInput, FormTextarea, FormSelect, FormButton } from './form-primitives';
import styles from './form-section.module.css';

/* ============================================================
   一酸フォーム スクリプト読み込みフック（会社名から住所等を自動補完）
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

interface BaseFormSectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
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
}

function NetlifyForm({
  formName,
  action,
  onSubmit,
  children,
}: {
  formName: string;
  action?: string;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  children: React.ReactNode;
}) {
  return (
    <form
      name={formName}
      method="POST"
      action={action}
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={onSubmit}
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

const useIsJa = () => typeof document !== 'undefined' && document.documentElement.lang === 'ja';

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

/** 会社名 + 一酸フォーム自動補完の隠しフィールド */
function CompanyField({ isJa }: { isJa: boolean }) {
  return (
    <>
      <FormInput
        name="company"
        label={isJa ? '会社名' : 'Company'}
        placeholder={isJa ? '株式会社...' : 'Company name'}
        className="company_name"
        autoComplete="off"
        required
      />
      {/* 一酸フォームで自動取得される隠しフィールド */}
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
  /** 一酸フォームによる会社名自動補完を有効化 */
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
      ichisanEnabled = true,
      ...props
    },
    ref,
  ) => {
    useIchisanForm(ichisanEnabled);
    const isJa = useIsJa();

    return (
      <Section ref={ref} background="default" spacing="lg" {...props}>
        <Container size="sm">
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            subtitle={subtitle}
            headingSize="display-sm"
          />
          <NetlifyForm formName={formName} action={action} onSubmit={onSubmit}>
            <NameEmailRow isJa={isJa} />
            <CompanyField isJa={isJa} />
            <FormTextarea
              name="message"
              label={isJa ? 'お問い合わせ内容' : 'Message'}
              placeholder={isJa ? 'ご質問やご要望をお聞かせください' : 'Tell us about your needs'}
              rows={5}
              required
            />
            <FormButton>{isJa ? '送信する' : 'Send Message'}</FormButton>
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
      ichisanEnabled = true,
      resourceName,
      ...props
    },
    ref,
  ) => {
    useIchisanForm(ichisanEnabled);
    const isJa = useIsJa();

    return (
      <Section ref={ref} background="default" spacing="lg" {...props}>
        <Container size="sm">
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            subtitle={subtitle}
            headingSize="display-sm"
          />
          <NetlifyForm formName={formName} action={action} onSubmit={onSubmit}>
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
            <FormButton>{isJa ? '資料をダウンロード' : 'Download Resource'}</FormButton>
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
      ichisanEnabled = true,
      timeSlots,
      ...props
    },
    ref,
  ) => {
    useIchisanForm(ichisanEnabled);
    const isJa = useIsJa();

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
          <NetlifyForm formName={formName} action={action} onSubmit={onSubmit}>
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
            <FormButton>{isJa ? 'デモを予約する' : 'Book a Demo'}</FormButton>
          </NetlifyForm>
        </Container>
      </Section>
    );
  },
);
DemoRequestForm.displayName = 'DemoRequestForm';
