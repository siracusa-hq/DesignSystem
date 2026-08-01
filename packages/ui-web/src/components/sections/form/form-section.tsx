'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';
import { FormInput, FormTextarea, FormSelect, FormButton } from './form-primitives';

/* ============================================================
   一酸フォーム スクリプト読み込みフック
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
   共通フォームセクションラッパー
   ============================================================ */

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface BaseFormSectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: string;
  eyebrowStyle?: 'pill' | 'border' | 'text' | 'dot' | 'gradient' | 'icon-pill';
  title?: React.ReactNode;
  subtitle?: string;
  background?: 'default' | 'muted' | 'dark' | 'brand';
  spacing?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  /** Formspree のフォームID（例: "xpznqkdl"） */
  formspreeId?: string;
  /** 送信成功時メッセージ */
  successMessage?: string;
  /** 送信失敗時メッセージ */
  errorMessage?: string;
}

function useFormspree(formspreeId?: string) {
  const [status, setStatus] = React.useState<FormStatus>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formspreeId) return;

    setStatus('submitting');
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return { status, handleSubmit };
}

/* ============================================================
   ContactForm — お問い合わせフォーム
   ============================================================ */

export interface ContactFormProps extends BaseFormSectionProps {
  /** 一酸フォームによる会社名自動補完を有効化 */
  ichisanEnabled?: boolean;
}

export const ContactForm = React.forwardRef<HTMLElement, ContactFormProps>(
  ({
    className, eyebrow, eyebrowStyle, title, subtitle, background = 'default',
    formspreeId, successMessage, errorMessage, spacing,
    ichisanEnabled = true,
    ...props
  }, ref) => {
    const { status, handleSubmit } = useFormspree(formspreeId);
    useIchisanForm(ichisanEnabled);

    const isJa = typeof document !== 'undefined' && document.documentElement.lang === 'ja';

    return (
      <Section ref={ref} background={background} spacing={spacing ?? 'lg'} className={className} {...props}>
        <Container size="sm">
          {(eyebrow || title || subtitle) && (
            <div className="mb-10 text-center">
              {eyebrow && <Text size={eyebrowStyle === 'border' ? 'overline-border' : eyebrowStyle === 'text' ? 'overline-text' : eyebrowStyle === 'dot' ? 'overline-dot' : eyebrowStyle === 'gradient' ? 'overline-gradient' : eyebrowStyle === 'icon-pill' ? 'overline-icon-pill' : 'overline-pill'} className="mb-4">{eyebrow}</Text>}
              {title && <Heading as="h2" size="display-sm">{title}</Heading>}
              {subtitle && <Text size="body-lg" tone="secondary" className="mx-auto mt-4 max-w-xl dark:text-neutral-300">{subtitle}</Text>}
            </div>
          )}

          {status === 'success' ? (
            <div className="rounded-2xl border border-success-500/30 bg-success-50 p-8 text-center dark:bg-success-500/10">
              <Text size="body-lg" className="font-semibold text-success-600">
                {successMessage ?? (isJa ? 'お問い合わせありがとうございます。担当者より折り返しご連絡いたします。' : 'Thank you for your inquiry. We will get back to you shortly.')}
              </Text>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormInput
                  name="name"
                  label={isJa ? 'お名前' : 'Name'}
                  placeholder={isJa ? '田中 太郎' : 'Taro Tanaka'}
                  required
                />
                <FormInput
                  name="email"
                  type="email"
                  label={isJa ? 'メールアドレス' : 'Email'}
                  placeholder="you@company.com"
                  required
                />
              </div>
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

              <FormTextarea
                name="message"
                label={isJa ? 'お問い合わせ内容' : 'Message'}
                placeholder={isJa ? 'ご質問やご要望をお聞かせください' : 'Tell us about your needs'}
                rows={5}
                required
              />
              <FormButton loading={status === 'submitting'}>
                {isJa ? '送信する' : 'Send Message'}
              </FormButton>
              {status === 'error' && (
                <Text size="body-sm" className="text-center text-error-500">
                  {errorMessage ?? (isJa ? '送信に失敗しました。時間をおいて再度お試しください。' : 'Failed to send. Please try again later.')}
                </Text>
              )}
            </form>
          )}
        </Container>
      </Section>
    );
  },
);
ContactForm.displayName = 'ContactForm';

/* ============================================================
   ResourceRequestForm — 資料請求フォーム
   ============================================================ */

export interface ResourceRequestFormProps extends BaseFormSectionProps {
  ichisanEnabled?: boolean;
  /** 資料名（フォーム内に表示） */
  resourceName?: string;
}

export const ResourceRequestForm = React.forwardRef<HTMLElement, ResourceRequestFormProps>(
  ({
    className, eyebrow, eyebrowStyle, title, subtitle, background = 'muted',
    formspreeId, successMessage, errorMessage, spacing,
    ichisanEnabled = true, resourceName,
    ...props
  }, ref) => {
    const { status, handleSubmit } = useFormspree(formspreeId);
    useIchisanForm(ichisanEnabled);

    const isJa = typeof document !== 'undefined' && document.documentElement.lang === 'ja';

    return (
      <Section ref={ref} background={background} spacing={spacing ?? 'lg'} className={className} {...props}>
        <Container size="sm">
          {(eyebrow || title || subtitle) && (
            <div className="mb-10 text-center">
              {eyebrow && <Text size={eyebrowStyle === 'border' ? 'overline-border' : eyebrowStyle === 'text' ? 'overline-text' : eyebrowStyle === 'dot' ? 'overline-dot' : eyebrowStyle === 'gradient' ? 'overline-gradient' : eyebrowStyle === 'icon-pill' ? 'overline-icon-pill' : 'overline-pill'} className="mb-4">{eyebrow}</Text>}
              {title && <Heading as="h2" size="display-sm">{title}</Heading>}
              {subtitle && <Text size="body-lg" tone="secondary" className="mx-auto mt-4 max-w-xl dark:text-neutral-300">{subtitle}</Text>}
            </div>
          )}

          {status === 'success' ? (
            <div className="rounded-2xl border border-success-500/30 bg-success-50 p-8 text-center dark:bg-success-500/10">
              <Text size="body-lg" className="font-semibold text-success-600">
                {successMessage ?? (isJa ? '資料をメールでお送りしました。ご確認ください。' : 'The document has been sent to your email.')}
              </Text>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {resourceName && <input type="hidden" name="resource" value={resourceName} />}
              <div className="grid gap-5 sm:grid-cols-2">
                <FormInput
                  name="name"
                  label={isJa ? 'お名前' : 'Name'}
                  placeholder={isJa ? '田中 太郎' : 'Taro Tanaka'}
                  required
                />
                <FormInput
                  name="email"
                  type="email"
                  label={isJa ? 'メールアドレス' : 'Email'}
                  placeholder="you@company.com"
                  required
                />
              </div>
              <FormInput
                name="company"
                label={isJa ? '会社名' : 'Company'}
                placeholder={isJa ? '株式会社...' : 'Company name'}
                className="company_name"
                autoComplete="off"
                required
              />
              <input type="hidden" name="zipcode" className="location_zipcode" />
              <input type="hidden" name="address" className="location_full" />
              <input type="hidden" name="corporate_number" className="corporate_number" />
              <input type="hidden" name="employee_count" className="employee_count" />

              <FormInput
                name="role"
                label={isJa ? '役職' : 'Job Title'}
                placeholder={isJa ? 'CTO / エンジニアリングマネージャー 等' : 'CTO / Engineering Manager etc.'}
              />
              <FormButton loading={status === 'submitting'}>
                {isJa ? '資料をダウンロード' : 'Download Resource'}
              </FormButton>
              {status === 'error' && (
                <Text size="body-sm" className="text-center text-error-500">
                  {errorMessage ?? (isJa ? '送信に失敗しました。' : 'Failed to send.')}
                </Text>
              )}
            </form>
          )}
        </Container>
      </Section>
    );
  },
);
ResourceRequestForm.displayName = 'ResourceRequestForm';

/* ============================================================
   DemoRequestForm — デモ予約フォーム
   ============================================================ */

export interface DemoRequestFormProps extends BaseFormSectionProps {
  ichisanEnabled?: boolean;
  /** 希望日時の選択肢 */
  timeSlots?: { value: string; label: string }[];
}

export const DemoRequestForm = React.forwardRef<HTMLElement, DemoRequestFormProps>(
  ({
    className, eyebrow, eyebrowStyle, title, subtitle, background = 'default',
    formspreeId, successMessage, errorMessage, spacing,
    ichisanEnabled = true, timeSlots,
    ...props
  }, ref) => {
    const { status, handleSubmit } = useFormspree(formspreeId);
    useIchisanForm(ichisanEnabled);

    const isJa = typeof document !== 'undefined' && document.documentElement.lang === 'ja';

    const defaultTimeSlots = timeSlots ?? (isJa
      ? [
          { value: 'weekday-am', label: '平日 午前（10:00-12:00）' },
          { value: 'weekday-pm', label: '平日 午後（13:00-17:00）' },
          { value: 'weekday-evening', label: '平日 夕方（17:00-19:00）' },
        ]
      : [
          { value: 'weekday-am', label: 'Weekday morning (10:00-12:00)' },
          { value: 'weekday-pm', label: 'Weekday afternoon (13:00-17:00)' },
          { value: 'weekday-evening', label: 'Weekday evening (17:00-19:00)' },
        ]);

    return (
      <Section ref={ref} background={background} spacing={spacing ?? 'lg'} className={className} {...props}>
        <Container size="sm">
          {(eyebrow || title || subtitle) && (
            <div className="mb-10 text-center">
              {eyebrow && <Text size={eyebrowStyle === 'border' ? 'overline-border' : eyebrowStyle === 'text' ? 'overline-text' : eyebrowStyle === 'dot' ? 'overline-dot' : eyebrowStyle === 'gradient' ? 'overline-gradient' : eyebrowStyle === 'icon-pill' ? 'overline-icon-pill' : 'overline-pill'} className="mb-4">{eyebrow}</Text>}
              {title && <Heading as="h2" size="display-sm">{title}</Heading>}
              {subtitle && <Text size="body-lg" tone="secondary" className="mx-auto mt-4 max-w-xl dark:text-neutral-300">{subtitle}</Text>}
            </div>
          )}

          {status === 'success' ? (
            <div className="rounded-2xl border border-success-500/30 bg-success-50 p-8 text-center dark:bg-success-500/10">
              <Text size="body-lg" className="font-semibold text-success-600">
                {successMessage ?? (isJa ? 'デモのご予約ありがとうございます。日程調整のご連絡をお送りします。' : 'Thank you for booking a demo. We will send you a scheduling confirmation.')}
              </Text>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormInput
                  name="name"
                  label={isJa ? 'お名前' : 'Name'}
                  placeholder={isJa ? '田中 太郎' : 'Taro Tanaka'}
                  required
                />
                <FormInput
                  name="email"
                  type="email"
                  label={isJa ? 'メールアドレス' : 'Email'}
                  placeholder="you@company.com"
                  required
                />
              </div>
              <FormInput
                name="company"
                label={isJa ? '会社名' : 'Company'}
                placeholder={isJa ? '株式会社...' : 'Company name'}
                className="company_name"
                autoComplete="off"
                required
              />
              <input type="hidden" name="zipcode" className="location_zipcode" />
              <input type="hidden" name="address" className="location_full" />
              <input type="hidden" name="corporate_number" className="corporate_number" />
              <input type="hidden" name="employee_count" className="employee_count" />

              <FormInput
                name="role"
                label={isJa ? '役職' : 'Job Title'}
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
                placeholder={isJa ? '事前にお伝えしたいことがあればご記入ください' : 'Anything you would like us to know beforehand'}
                rows={3}
              />
              <FormButton loading={status === 'submitting'}>
                {isJa ? 'デモを予約する' : 'Book a Demo'}
              </FormButton>
              {status === 'error' && (
                <Text size="body-sm" className="text-center text-error-500">
                  {errorMessage ?? (isJa ? '送信に失敗しました。' : 'Failed to send.')}
                </Text>
              )}
            </form>
          )}
        </Container>
      </Section>
    );
  },
);
DemoRequestForm.displayName = 'DemoRequestForm';
