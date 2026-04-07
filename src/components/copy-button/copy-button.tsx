import * as React from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/button';

export interface CopyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  timeout?: number;
  onCopy?: () => void;
}

export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  ({ value, timeout = 2000, onCopy, className, ...props }, ref) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = React.useCallback(async () => {
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        onCopy?.();
        setTimeout(() => setCopied(false), timeout);
      } catch {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        onCopy?.();
        setTimeout(() => setCopied(false), timeout);
      }
    }, [value, timeout, onCopy]);

    return (
      <button
        ref={ref}
        type="button"
        aria-label={copied ? 'Copied' : 'Copy to clipboard'}
        onClick={handleCopy}
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'size-8 p-0 touch:size-11',
          className,
        )}
        {...props}
      >
        {copied ? (
          <Check className="size-4 text-success-600" />
        ) : (
          <Copy className="size-4" />
        )}
      </button>
    );
  },
);
CopyButton.displayName = 'CopyButton';
