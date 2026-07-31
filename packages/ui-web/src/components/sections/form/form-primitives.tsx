'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';

/* ============================================================
   FormInput — テキスト入力
   ============================================================ */

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? `input-${label?.replace(/\s/g, '-').toLowerCase()}`;
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-[var(--color-on-surface)]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'block w-full rounded-lg border border-neutral-200 bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-on-surface)] placeholder:text-neutral-400 transition-colors',
            'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
            'dark:border-neutral-700 dark:placeholder:text-neutral-500',
            error && 'border-error-500 focus:border-error-500 focus:ring-error-500/20',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-error-500">{error}</p>}
      </div>
    );
  },
);
FormInput.displayName = 'FormInput';

/* ============================================================
   FormTextarea — テキストエリア
   ============================================================ */

export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id ?? `textarea-${label?.replace(/\s/g, '-').toLowerCase()}`;
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-[var(--color-on-surface)]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'block w-full rounded-lg border border-neutral-200 bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-on-surface)] placeholder:text-neutral-400 transition-colors resize-y min-h-24',
            'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
            'dark:border-neutral-700 dark:placeholder:text-neutral-500',
            error && 'border-error-500 focus:border-error-500 focus:ring-error-500/20',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-error-500">{error}</p>}
      </div>
    );
  },
);
FormTextarea.displayName = 'FormTextarea';

/* ============================================================
   FormSelect — セレクト
   ============================================================ */

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
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-[var(--color-on-surface)]">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'block w-full rounded-lg border border-neutral-200 bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-on-surface)] transition-colors',
            'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
            'dark:border-neutral-700',
            error && 'border-error-500 focus:border-error-500 focus:ring-error-500/20',
            className,
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && <p className="text-xs text-error-500">{error}</p>}
      </div>
    );
  },
);
FormSelect.displayName = 'FormSelect';

/* ============================================================
   FormButton — 送信ボタン
   ============================================================ */

export interface FormButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export const FormButton = React.forwardRef<HTMLButtonElement, FormButtonProps>(
  ({ className, children, loading, disabled, ...props }, ref) => (
    <button
      ref={ref}
      type="submit"
      disabled={disabled || loading}
      className={cn(
        'inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold !text-white transition-all',
        'hover:bg-primary-600 hover:-translate-y-0.5 active:translate-y-0',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50',
        'disabled:opacity-50 disabled:pointer-events-none',
        className,
      )}
      {...props}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  ),
);
FormButton.displayName = 'FormButton';
