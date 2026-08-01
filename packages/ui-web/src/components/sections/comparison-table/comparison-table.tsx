import * as React from 'react';
import { cn } from '@/lib/cn';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Heading } from '@/components/primitives/heading';
import { Text } from '@/components/primitives/text';
import { Check, Minus } from 'lucide-react';

export interface ComparisonColumn {
  name: string;
  highlighted?: boolean;
}

export interface ComparisonRow {
  feature: string;
  values: (string | boolean | React.ReactNode)[];
}

export interface ComparisonTableProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: string;
  eyebrowStyle?: 'pill' | 'border' | 'text' | 'dot' | 'gradient' | 'icon-pill';
  title?: React.ReactNode;
  subtitle?: string;
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
  background?: 'default' | 'muted' | 'dark' | 'brand';
  spacing?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
}

const CellValue: React.FC<{ value: string | boolean | React.ReactNode }> = ({ value }) => {
  if (typeof value === 'boolean') {
    return value ? (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
        <Check className="h-3.5 w-3.5" />
      </span>
    ) : (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500">
        <Minus className="h-3.5 w-3.5" />
      </span>
    );
  }
  return <>{value}</>;
};

export const ComparisonTable = React.forwardRef<HTMLElement, ComparisonTableProps>(
  ({ className, eyebrow, eyebrowStyle, title, subtitle, columns, rows, background = 'default', spacing, ...props }, ref) => {

    return (
      <Section ref={ref} background={background} spacing={spacing ?? 'lg'} className={className} {...props}>
        <Container>
          {(eyebrow || title || subtitle) && (
            <div className="mb-12 text-center lg:mb-16">
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
                  className={cn('mx-auto mt-4 max-w-2xl', 'dark:text-neutral-300')}
                >
                  {subtitle}
                </Text>
              )}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse" role="table">
              <thead className="sticky top-0 z-10">
                <tr className="bg-white dark:bg-neutral-950">
                  <th className="p-4 text-left"><span className="sr-only">Feature</span></th>
                  {columns.map((col, i) => (
                    <th
                      key={i}
                      className={cn(
                        'p-4 text-center',
                        col.highlighted && 'bg-primary-50 dark:bg-primary-950/30',
                      )}
                    >
                      <Heading
                        as="h3"
                        size="heading-md"
                        className={cn(col.highlighted && 'text-primary-500')}
                      >
                        {col.name}
                      </Heading>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-t border-neutral-200 dark:border-neutral-800"
                  >
                    <td className="sticky left-0 z-5 p-4" style={{ backgroundColor: 'inherit' }}>
                      <Text as="span" size="body-sm" tone="default" className="dark:text-neutral-200">
                        {row.feature}
                      </Text>
                    </td>
                    {row.values.map((val, j) => (
                      <td
                        key={j}
                        className={cn(
                          'p-4 text-center text-sm',
                          columns[j]?.highlighted && 'bg-primary-50 dark:bg-primary-950/30',
                        )}
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
    );
  },
);
ComparisonTable.displayName = 'ComparisonTable';
