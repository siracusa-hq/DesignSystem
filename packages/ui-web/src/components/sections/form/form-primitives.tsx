'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';
import styles from './form-primitives.module.css';

export interface FormInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label?: string;
  error?: string;
  /**
   * 外部フォーム補完サービス（イチサンフォーム）が入力欄を特定するための識別子。
   * 仕様上 class 名でしか指定できないため、この1点だけ class を出力する。
   * 見た目の上書き口ではないので、値は列挙で閉じてある。
   */
  autofillKey?: 'company_name';
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, id, autofillKey, ...props }, ref) => {
    const inputId = id ?? `input-${label?.replace(/\s/g, '-').toLowerCase()}`;
    return (
      <div className={styles.field}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(styles.control, error && styles.hasError, autofillKey)}
          {...props}
        />
        {error && <p className={styles.errorText}>{error}</p>}
      </div>
    );
  },
);
FormInput.displayName = 'FormInput';

export interface FormTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  label?: string;
  error?: string;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, id, ...props }, ref) => {
    const textareaId = id ?? `textarea-${label?.replace(/\s/g, '-').toLowerCase()}`;
    return (
      <div className={styles.field}>
        {label && (
          <label htmlFor={textareaId} className={styles.label}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(styles.control, styles.textarea, error && styles.hasError)}
          {...props}
        />
        {error && <p className={styles.errorText}>{error}</p>}
      </div>
    );
  },
);
FormTextarea.displayName = 'FormTextarea';

export interface FormSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, id, options, placeholder, ...props }, ref) => {
    const selectId = id ?? `select-${label?.replace(/\s/g, '-').toLowerCase()}`;
    return (
      <div className={styles.field}>
        {label && (
          <label htmlFor={selectId} className={styles.label}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(styles.control, error && styles.hasError)}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className={styles.errorText}>{error}</p>}
      </div>
    );
  },
);
FormSelect.displayName = 'FormSelect';

export interface FormCheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className' | 'type'> {
  /**
   * ラベル。リンクを含められる（「個人情報の取り扱いに同意します」の
   * 「個人情報の取り扱い」だけをリンクにするため、文字列ではなくノードを取る）。
   */
  label: React.ReactNode;
  error?: string;
}

/**
 * FormCheckbox — 同意チェックなどの真偽値入力。
 *
 * OS 標準の見た目を使わない（白い面で灰色に沈み、ホバーも効かないため）。
 * FormInput と同じ線・角丸・フォーカスリングの語彙で描く。
 */
export const FormCheckbox = React.forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ label, error, id, name, ...props }, ref) => {
    const inputId = id ?? `check-${name ?? 'field'}`;
    return (
      <div className={styles.field}>
        <div className={styles.checkField}>
          <input
            ref={ref}
            id={inputId}
            name={name}
            type="checkbox"
            className={cn(styles.checkbox, error && styles.hasError)}
            {...props}
          />
          <label htmlFor={inputId} className={styles.checkLabel}>
            {label}
          </label>
        </div>
        {error && <p className={styles.errorText}>{error}</p>}
      </div>
    );
  },
);
FormCheckbox.displayName = 'FormCheckbox';

export interface FormButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  loading?: boolean;
  /**
   * 計測用の CTA 識別子。指定すると `data-cta` 属性を出力する。
   * 3フォーム（ContactForm / ResourceRequestForm / DemoRequestForm）の送信ボタンには
   * `form-submit` が自動で割り当たる（どのフォームかは form-name で区別できるため一律）。
   */
  ctaId?: string;
}

/** 送信ボタン。コンバージョン導線のため CTA 第3役割（--color-*-cta）を使う */
export const FormButton = React.forwardRef<HTMLButtonElement, FormButtonProps>(
  ({ children, loading, disabled, ctaId, ...props }, ref) => (
    <button
      ref={ref}
      type="submit"
      disabled={disabled || loading}
      data-cta={ctaId}
      className={styles.button}
      {...props}
    >
      {loading && (
        <svg className={styles.spinner} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle
            style={{ opacity: 0.25 }}
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            style={{ opacity: 0.75 }}
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  ),
);
FormButton.displayName = 'FormButton';
