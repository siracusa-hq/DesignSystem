import * as React from 'react';
import { cn } from '@/lib/cn';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';
import { SectionHeader } from '@/components/sections/section-header';
import { Check, Minus } from 'lucide-react';
import styles from './comparison-table.module.css';

export interface ComparisonColumn {
  name: string;
  highlighted?: boolean;
}

export interface ComparisonRow {
  feature: string;
  values: (string | boolean | React.ReactNode)[];
}

export interface ComparisonTableProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'className'> {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  /** 比較対象そのもの（データ）。列数は表示の選択肢ではないので prop のまま */
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
}

const CellValue: React.FC<{ value: string | boolean | React.ReactNode }> = ({ value }) => {
  if (typeof value === 'boolean') {
    return value ? (
      <span className={styles.markYes}>
        <Check className={styles.markIcon} />
      </span>
    ) : (
      <span className={styles.markNo}>
        <Minus className={styles.markIcon} />
      </span>
    );
  }
  return <>{value}</>;
};

export const ComparisonTable = React.forwardRef<HTMLElement, ComparisonTableProps>(
  ({ eyebrow, title, subtitle, columns, rows, ...props }, ref) => (
    <Section ref={ref} background="default" spacing="lg" {...props}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <div className={styles.scroller}>
          <table className={styles.table}>
            <thead className={styles.head}>
              <tr className={styles.headRow}>
                <th className={styles.featureHeadCell}>
                  <span className={styles.srOnly}>Feature</span>
                </th>
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className={cn(styles.headCell, col.highlighted && styles.highlighted)}
                  >
                    <Heading as="h3" size="heading-md">
                      {col.name}
                    </Heading>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={styles.row}>
                  <td className={styles.featureCell}>
                    <Text as="span" size="body-sm">
                      {row.feature}
                    </Text>
                  </td>
                  {row.values.map((val, j) => (
                    <td
                      key={j}
                      className={cn(styles.cell, columns[j]?.highlighted && styles.highlighted)}
                    >
                      <CellValue value={val} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </Section>
  ),
);
ComparisonTable.displayName = 'ComparisonTable';
