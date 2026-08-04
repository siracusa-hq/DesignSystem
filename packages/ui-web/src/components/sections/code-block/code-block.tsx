'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Eyebrow } from '@/components/primitives/eyebrow';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';
import { SectionHeader } from '@/components/sections/section-header';
import styles from './code-block.module.css';
// shiki はオプショナル peerDependency — 動的importでバンドルサイズ増加を防止

export interface CodeBlockProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  code: string;
  language?: string;
  filename?: string;
  /**
   * コードの脇に置く補足（表・リスト等）。
   * **これがレイアウトを決める**: あれば横並び（split）、無ければ中央寄せ。
   * 旧 layout / alignment prop は削除した（workorder §3）。
   */
  description?: React.ReactNode;
  showLineNumbers?: boolean;
}

export const CodeBlock = React.forwardRef<HTMLElement, CodeBlockProps>(
  (
    {
      eyebrow,
      title,
      subtitle,
      code,
      language = 'typescript',
      filename,
      description,
      showLineNumbers = false,
      ...props
    },
    ref,
  ) => {
    const [copied, setCopied] = React.useState(false);
    const [highlightedHtml, setHighlightedHtml] = React.useState<string | null>(null);

    React.useEffect(() => {
      import('shiki')
        .then(({ codeToHtml }) => codeToHtml(code, { lang: language, theme: 'github-dark' }))
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
      <div className={styles.frame}>
        {/* ターミナル風ウィンドウクロム */}
        <div className={styles.chrome}>
          <div className={styles.chromeLeft}>
            <div className={styles.dots} aria-hidden="true">
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
            {filename && <span className={styles.filename}>{filename}</span>}
          </div>
          <button type="button" onClick={handleCopy} className={styles.copyButton}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        {highlightedHtml ? (
          <div
            className={cn(styles.code, showLineNumbers && styles.lineNumbers)}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : (
          <pre className={styles.fallback}>
            <code className={`language-${language}`}>{code}</code>
          </pre>
        )}
      </div>
    );

    // description があるときだけ横並び。無ければ中央寄せ（layout prop は持たない）
    if (description) {
      return (
        <Section ref={ref} background="default" spacing="lg" {...props}>
          <Container>
            <div className={styles.split}>
              <div className={styles.splitCopy}>
                {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
                {title && (
                  <Heading as="h2" size="display-sm">
                    {title}
                  </Heading>
                )}
                {subtitle && (
                  <Text size="body-lg" tone="secondary" clauseWrap>
                    {subtitle}
                  </Text>
                )}
                <div className={styles.description}>{description}</div>
              </div>
              {codeElement}
            </div>
          </Container>
        </Section>
      );
    }

    return (
      <Section ref={ref} background="default" spacing="lg" {...props}>
        <Container size="md">
          <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
          {codeElement}
        </Container>
      </Section>
    );
  },
);
CodeBlock.displayName = 'CodeBlock';
