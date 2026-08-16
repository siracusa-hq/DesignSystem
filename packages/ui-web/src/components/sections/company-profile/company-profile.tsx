import * as React from 'react';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Link } from '@/components/primitives/link';
import { SectionHeader } from '@/components/sections/section-header';
import styles from './company-profile.module.css';

/**
 * 値1件。href を持つオブジェクトを渡すとリンクとして組む
 * （窓口一覧の mailto、会社概要の公式サイト行など。コーポレートサイト申し送り
 * 2026-08-16 P3）。メールアドレスは `href: 'mailto:...'` を明示すること —
 * 文字列からの自動 mailto 化はしない（書いたとおりに出る原則）。
 */
export type CompanyProfileValue = string | { text: string; href: string };

export interface CompanyProfileItem {
  label: string;
  /**
   * 値。配列を渡すと箇条書きで組む（事業内容など複数行の項目用）。
   * 文字列とリンクは配列の中で混在できる。
   *
   * 「従業員数 12名（2026年7月末時点）」のように**時点を伴う数値は、時点を
   * この値の中に含めて書く**（GUIDELINES §3「数値には基準時点を必ず添える」）。
   */
  value: CompanyProfileValue | CompanyProfileValue[];
}

function ProfileValue({ value }: { value: CompanyProfileValue }) {
  if (typeof value === 'string') return <>{value}</>;
  /* 表の中で「押せる」と分かる必要があるため、下線つきの既定バリアントで出す */
  return <Link href={value.href}>{value.text}</Link>;
}

export interface CompanyProfileSectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  items: CompanyProfileItem[];
}

/**
 * CompanyProfileSection — 会社概要表。
 *
 * 国内 BtoB のコーポレートサイトの標準語彙（商号・設立・代表者・所在地・資本金・
 * 事業内容…）。運営会社情報として各プロダクトサイトからも使うため、
 * プリミティブ組みではなくセクション部品として持つ。
 */
export const CompanyProfileSection = React.forwardRef<HTMLElement, CompanyProfileSectionProps>(
  ({ eyebrow, title, subtitle, items, ...props }, ref) => (
    <Section ref={ref} background="default" spacing="md" {...props}>
      <Container size="md">
        <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <dl className={styles.list}>
          {items.map((item, i) => (
            <div key={i} className={styles.row}>
              <dt className={styles.label}>{item.label}</dt>
              <dd className={styles.value}>
                {Array.isArray(item.value) ? (
                  <ul className={styles.valueList}>
                    {item.value.map((v, j) => (
                      <li key={j}>
                        <ProfileValue value={v} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ProfileValue value={item.value} />
                )}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  ),
);
CompanyProfileSection.displayName = 'CompanyProfileSection';
