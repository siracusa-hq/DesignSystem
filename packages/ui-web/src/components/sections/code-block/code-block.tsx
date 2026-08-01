'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';
// shiki はオプショナル peerDependency — 動的importでバンドルサイズ増加を防止

export interface CodeBlockProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: string;
  eyebrowStyle?: 'pill' | 'border' | 'text' | 'dot' | 'gradient' | 'icon-pill';
  title?: React.ReactNode;
  subtitle?: string;
  code: string;
  language?: string;
  filename?: string;
  description?: React.ReactNode;
  layout?: 'centered' | 'split';
  /** split layout 時の垂直方向の配置 */
  alignment?: 'center' | 'top';
  background?: 'default' | 'muted' | 'dark' | 'brand';
  spacing?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  showLineNumbers?: boolean;
  highlightLines?: number[];
}

export const CodeBlock = React.forwardRef<HTMLElement, CodeBlockProps>(
  (
    {
      className,
      eyebrow, eyebrowStyle,
      title,
      subtitle,
      code,
      language = 'typescript',
      filename,
      description,
      layout = 'centered',
      alignment = 'center',
      background = 'default',
      spacing,
      showLineNumbers = false,
      highlightLines = [],
      ...props
    },
    ref,
  ) => {
    const [copied, setCopied] = React.useState(false);
    const [highlightedHtml, setHighlightedHtml] = React.useState<string | null>(null);

    React.useEffect(() => {
      import('shiki')
        .then(({ codeToHtml }) =>
          codeToHtml(code, { lang: language, theme: 'github-dark' }),
        )
        .then(setHighlightedHtml)
        .catch(() => {
          // shiki未インストール or 言語未対応時はフォールバック
        });
    }, [code, language]);

    const handleCopy = () => {
      navigator.clipboard.writeText(code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    };

    const codeElement = (
      <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950">
        {/* ターミナル風ウィンドウクロム */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-2.5">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-neutral-700" />
              <span className="h-3 w-3 rounded-full bg-neutral-700" />
              <span className="h-3 w-3 rounded-full bg-neutral-700" />
            </div>
            {filename && (
              <span className="text-xs text-neutral-500">{filename}</span>
            )}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="text-xs text-neutral-500 transition-colors hover:text-neutral-300"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        {highlightedHtml ? (
          <div
            className={cn(
              'overflow-x-auto p-4 text-sm leading-relaxed [&_pre]:!m-0 [&_pre]:!bg-transparent [&_pre]:!p-0',
              showLineNumbers && '[&_.line]:before:mr-6 [&_.line]:before:inline-block [&_.line]:before:w-4 [&_.line]:before:text-right [&_.line]:before:text-neutral-600 [&_.line]:before:content-[counter(line)] [&_.line]:[counter-increment:line] [&_pre]:[counter-reset:line]',
            )}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : (
          <pre className="overflow-x-auto p-4">
            <code className={cn('text-sm leading-relaxed text-neutral-300', `language-${language}`)}>
              {code}
            </code>
          </pre>
        )}
      </div>
    );

    if (layout === 'split' && (title || description)) {
      return (
        <Section ref={ref} background={background} spacing={spacing ?? 'lg'} className={className} {...props}>
          <Container>
            <div className={cn('grid gap-12 lg:grid-cols-2', alignment === 'center' ? 'items-center' : 'items-start')}>
              <div>
                {eyebrow && (
                  <Text size={eyebrowStyle === 'border' ? 'overline-border' : eyebrowStyle === 'text' ? 'overline-text' : eyebrowStyle === 'dot' ? 'overline-dot' : eyebrowStyle === 'gradient' ? 'overline-gradient' : eyebrowStyle === 'icon-pill' ? 'overline-icon-pill' : 'overline-pill'} className="mb-4">
                    {eyebrow}
                  </Text>
                )}
                {title && (
                  <Heading as="h2" size="display-sm">
                    {title}
                  </Heading>
                )}
                {subtitle && (
                  <Text
                    size="body-lg"
                    tone="secondary"
                    className={cn('mt-4', 'dark:text-neutral-300')}
                  >
                    {subtitle}
                  </Text>
                )}
                {description && <div className="mt-6">{description}</div>}
              </div>
              {codeElement}
            </div>
          </Container>
        </Section>
      );
    }

    return (
      <Section ref={ref} background={background} spacing={spacing ?? 'lg'} className={className} {...props}>
        <Container size="md">
          {(eyebrow || title || subtitle) && (
            <div className="mb-8 text-center">
              {eyebrow && (
                <Text size={eyebrowStyle === 'border' ? 'overline-border' : eyebrowStyle === 'text' ? 'overline-text' : eyebrowStyle === 'dot' ? 'overline-dot' : eyebrowStyle === 'gradient' ? 'overline-gradient' : eyebrowStyle === 'icon-pill' ? 'overline-icon-pill' : 'overline-pill'} className="mb-4">
                  {eyebrow}
                </Text>
              )}
              {title && (
                <Heading as="h2" size="display-md">
                  {title}
                </Heading>
              )}
              {subtitle && (
                <Text
                  size="body-lg"
                  tone="secondary"
                  className={cn('mx-auto mt-4 max-w-xl', 'dark:text-neutral-300')}
                >
                  {subtitle}
                </Text>
              )}
            </div>
          )}
          {codeElement}
        </Container>
      </Section>
    );
  },
);
CodeBlock.displayName = 'CodeBlock';
