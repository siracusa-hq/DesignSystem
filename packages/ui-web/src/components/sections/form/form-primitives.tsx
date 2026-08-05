'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';
import styles from './form-primitives.module.css';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, label, error, id, ...props }, ref) => {
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
          className={cn(styles.control, error && styles.hasError, className)}
          {...props}
        />
        {error && <p className={styles.errorText}>{error}</p>}
      </div>
    );
  },
);
FormInput.displayName = 'FormInput';

export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
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
          className={cn(styles.control, styles.textarea, error && styles.hasError, className)}
          {...props}
        />
        {error && <p className={styles.errorText}>{error}</p>}
      </div>
    );
  },
);
FormTextarea.displayName = 'FormTextarea';

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ className, label, error, id, options, placeholder, ...props }, ref) => {
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
          className={cn(styles.control, error && styles.hasError, className)}
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

export interface FormButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

/** 送信ボタン。コンバージョン導線のため CTA 第3役割（--color-*-cta）を使う */
export const FormButton = React.forwardRef<HTMLButtonElement, FormButtonProps>(
  ({ className, children, loading, disabled, ...props }, ref) => (
    <button
      ref={ref}
      type="submit"
      disabled={disabled || loading}
      className={cn(styles.button, className)}
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
