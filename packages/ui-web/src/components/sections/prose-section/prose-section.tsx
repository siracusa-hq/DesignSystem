import * as React from 'react';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Link } from '@/components/primitives/link';
import { SectionHeader } from '@/components/sections/section-header';
import styles from './prose-section.module.css';
import { isDev } from '@/lib/dev';

/** 署名（役職 + 氏名 + 顔写真）。これがあると代表挨拶、無ければミッションになる */
export interface ProseSignature {
  /** 例: 「代表取締役 CEO」 */
  role?: string;
  name: string;
  /**
   * 円形で表示する顔写真。**任意**で、無ければ役職と氏名だけの署名になる。
   *
   * LeadershipSection のようなイニシャルの代替枠は置かない。あちらはカード列の
   * 高さを揃える必要があるが、署名は1行なので代替枠に意味がないため。
   *
   * alt には人物と文脈を書く（GUIDELINES §3）。
   */
  photo?: { src: string; alt: string };
}

export interface ProseMoreLink {
  label: string;
  href: string;
}

export interface ProseSectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  /**
   * 段落の配列。**Markdown は受け取らない**（本文が Markdown から生成される
   * 読み物ページの器は DocumentArticle の仕事）。
   */
  paragraphs: string[];
  /** 任意。渡すと署名が出る（代表挨拶） */
  signature?: ProseSignature;
  /** 任意。全文ページ等への導線 */
  moreLink?: ProseMoreLink;
}

/**
 * ProseSection — 箇条書きに割れない文章を置くための唯一のセクション。
 *
 * **GUIDELINES §3「セクション内の散文は見出し1文だけ」は説明セクションの規則で、
 * 読み物の面には適用しない。** 説明を書きたくなったときに要点3つへ割る規範は
 * そのまま生きており、この部品は「割れない文章」（ミッション・代表挨拶）専用。
 * 機能説明をここに流し込むと規範の迂回路になるため、dev 警告で牽制する。
 *
 * 段落の寸法は CaseStudyArticleSection と共有する（読み物の組版は1つだけ持つ）。
 */
export const ProseSection = React.forwardRef<HTMLElement, ProseSectionProps>(
  ({ eyebrow, title, subtitle, paragraphs, signature, moreLink, ...props }, ref) => {
    if (isDev && paragraphs.length > 4) {
      console.warn(
        `[ProseSection] 段落が ${paragraphs.length} 個あります。この部品は箇条書きに割れない文章` +
          '（ミッション・代表挨拶）のためのもので、機能や特長の説明には使いません' +
          '（GUIDELINES §3: 説明は箇条書き最大3点と数値に分解する）。' +
          '長い読み物は DocumentArticle を、機能説明は FeatureGrid / AirPocketFeature を検討してください。',
      );
    }

    return (
      <Section ref={ref} background="default" spacing="md" {...props}>
        <Container size="md">
          <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
          <div className={styles.body}>
            {paragraphs.map((p, i) => (
              <p key={i} className={styles.paragraph}>
                {p}
              </p>
            ))}

            {signature && (
              <div className={styles.signature}>
                {signature.photo && (
                  <img
                    className={styles.photo}
                    src={signature.photo.src}
                    alt={signature.photo.alt}
                    loading="lazy"
                  />
                )}
                <div>
                  {signature.role && <div className={styles.role}>{signature.role}</div>}
                  <div className={styles.name}>{signature.name}</div>
                </div>
              </div>
            )}

            {moreLink && (
              <div className={styles.more}>
                <Link href={moreLink.href} variant="arrow">
                  {moreLink.label}
                </Link>
              </div>
            )}
          </div>
        </Container>
      </Section>
    );
  },
);
ProseSection.displayName = 'ProseSection';
