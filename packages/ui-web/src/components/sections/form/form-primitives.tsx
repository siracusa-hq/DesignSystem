'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';
import styles from './form-primitives.module.css';

export interface FormInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label?: string;
  error?: string;
  /**
   * 外部フォーム補完サービス（一酸フォーム）が入力欄を特定するための識別子。
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

export interface FormButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  loading?: boolean;
}

/** 送信ボタン。コンバージョン導線のため CTA 第3役割（--color-*-cta）を使う */
export const FormButton = React.forwardRef<HTMLButtonElement, FormButtonProps>(
  ({ children, loading, disabled, ...props }, ref) => (
    <button
      ref={ref}
      type="submit"
      disabled={disabled || loading}
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
