import * as React from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
}

export const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  (
    {
      language,
      title,
      showLineNumbers = false,
      highlightLines = [],
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [copied, setCopied] = React.useState(false);
    const code = typeof children === 'string' ? children : '';

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // silently fail
      }
    };

    const lines = code.split('\n');
    // Remove trailing empty line
    if (lines.length > 0 && lines[lines.length - 1] === '') {
      lines.pop();
    }

    const showHeader = language || title;

    return (
      <div
        ref={ref}
        className={cn(
          'overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-sunken)]',
          className,
        )}
        {...props}
      >
        {showHeader && (
          <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-2">
            <span className="text-xs text-[var(--color-on-surface-muted)]">
              {title ?? language}
            </span>
            <button
              type="button"
              aria-label={copied ? 'Copied' : 'Copy code'}
              onClick={handleCopy}
              className="rounded-sm p-1 text-[var(--color-on-surface-muted)] transition-colors hover:text-[var(--color-on-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              {copied ? (
                <Check className="size-3.5 text-success-600" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </button>
          </div>
        )}
        <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
          <code className="font-mono">
            {lines.map((line, i) => (
              <div
                key={i}
                className={cn(
                  'px-1',
                  highlightLines.includes(i + 1) && 'bg-primary-500/10 -mx-4 px-5',
                )}
              >
                {showLineNumbers && (
                  <span className="mr-4 inline-block w-8 select-none text-right text-[var(--color-on-surface-muted)]">
                    {i + 1}
                  </span>
                )}
                {line || '\n'}
              </div>
            ))}
          </code>
        </pre>
      </div>
    );
  },
);
CodeBlock.displayName = 'CodeBlock';
