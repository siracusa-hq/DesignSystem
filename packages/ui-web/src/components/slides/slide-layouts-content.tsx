import * as React from 'react';
import { Slide, Heading as SpHeading, Text as SpText, FlexBox, Box } from 'spectacle';
import { colors } from '../../tokens/colors';

type SlideComponentProps = React.ComponentProps<typeof Slide>;

/* ============================================================
   BulletSlide — 箇条書きリスト
   ============================================================ */

export interface BulletItem {
  text: string;
  subText?: string;
  icon?: React.ReactNode;
}

export interface BulletSlideProps extends Partial<SlideComponentProps> {
  title: string;
  subtitle?: string;
  items: BulletItem[];
  columns?: 1 | 2;
}

export const BulletSlide: React.FC<BulletSlideProps> = ({
  title,
  subtitle,
  items,
  columns = 1,
  ...props
}) => (
  <Slide {...props}>
    <SpHeading fontSize="40px" fontWeight="700" margin="0 0 8px 0" style={{ letterSpacing: '-0.03em' }}>
      {title}
    </SpHeading>
    {subtitle && (
      <SpText fontSize="20px" color={colors.neutral[400]} margin="0 0 32px 0">{subtitle}</SpText>
    )}
    <FlexBox flexWrap="wrap" alignItems="flex-start">
      {items.map((item, i) => (
        <Box key={i} width={columns === 2 ? '48%' : '100%'} padding="8px 0">
          <FlexBox alignItems="flex-start">
            <Box style={{ marginRight: '12px', marginTop: '4px', flexShrink: 0 }}>
              {item.icon ?? (
                <Box
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: colors.primary[400],
                  }}
                />
              )}
            </Box>
            <Box>
              <SpText fontSize="20px" fontWeight="500" margin="0">{item.text}</SpText>
              {item.subText && (
                <SpText fontSize="16px" color={colors.neutral[400]} margin="4px 0 0 0">{item.subText}</SpText>
              )}
            </Box>
          </FlexBox>
        </Box>
      ))}
    </FlexBox>
  </Slide>
);

BulletSlide.displayName = 'BulletSlide';

/* ============================================================
   ComparisonSlide — Before/After 比較
   ============================================================ */

export interface ComparisonSlideProps extends Partial<SlideComponentProps> {
  title: string;
  leftHeader: string;
  rightHeader: string;
  leftItems: string[];
  rightItems: string[];
}

export const ComparisonSlide: React.FC<ComparisonSlideProps> = ({
  title,
  leftHeader,
  rightHeader,
  leftItems,
  rightItems,
  ...props
}) => (
  <Slide {...props}>
    <SpHeading fontSize="40px" fontWeight="700" margin="0 0 32px 0" style={{ letterSpacing: '-0.03em' }}>
      {title}
    </SpHeading>
    <FlexBox justifyContent="space-between">
      <Box width="46%">
        <SpText fontSize="20px" fontWeight="600" color={colors.neutral[500]} margin="0 0 20px 0">
          {leftHeader}
        </SpText>
        {leftItems.map((item, i) => (
          <FlexBox key={i} alignItems="center" style={{ padding: '8px 0' }}>
            <SpText fontSize="18px" color={colors.neutral[500]} margin="0 12px 0 0">✕</SpText>
            <SpText fontSize="18px" color={colors.neutral[400]} margin="0">{item}</SpText>
          </FlexBox>
        ))}
      </Box>
      <Box style={{ width: '1px', backgroundColor: colors.neutral[800], alignSelf: 'stretch' }} />
      <Box width="46%">
        <SpText fontSize="20px" fontWeight="600" color={colors.primary[400]} margin="0 0 20px 0">
          {rightHeader}
        </SpText>
        {rightItems.map((item, i) => (
          <FlexBox key={i} alignItems="center" style={{ padding: '8px 0' }}>
            <SpText fontSize="18px" color={colors.primary[400]} margin="0 12px 0 0">✓</SpText>
            <SpText fontSize="18px" margin="0">{item}</SpText>
          </FlexBox>
        ))}
      </Box>
    </FlexBox>
  </Slide>
);

ComparisonSlide.displayName = 'ComparisonSlide';

/* ============================================================
   ThreeColumnSlide — 3カラム均等配置
   ============================================================ */

export interface ColumnItem {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export interface ThreeColumnSlideProps extends Partial<SlideComponentProps> {
  title: string;
  subtitle?: string;
  columns: [ColumnItem, ColumnItem, ColumnItem];
}

export const ThreeColumnSlide: React.FC<ThreeColumnSlideProps> = ({
  title,
  subtitle,
  columns: cols,
  ...props
}) => (
  <Slide {...props}>
    <SpHeading fontSize="40px" fontWeight="700" margin="0 0 8px 0" style={{ letterSpacing: '-0.03em', textAlign: 'center' }}>
      {title}
    </SpHeading>
    {subtitle && (
      <SpText fontSize="20px" color={colors.neutral[400]} margin="0 0 40px 0" style={{ textAlign: 'center' }}>
        {subtitle}
      </SpText>
    )}
    <FlexBox justifyContent="space-between">
      {cols.map((col, i) => (
        <Box key={i} width="30%" style={{ textAlign: 'center' }}>
          {col.icon && <Box margin="0 0 16px 0">{col.icon}</Box>}
          <SpText fontSize="22px" fontWeight="600" margin="0 0 8px 0">{col.title}</SpText>
          <SpText fontSize="16px" color={colors.neutral[400]} margin="0">{col.description}</SpText>
        </Box>
      ))}
    </FlexBox>
  </Slide>
);

ThreeColumnSlide.displayName = 'ThreeColumnSlide';

/* ============================================================
   PricingSlide — 料金プラン
   ============================================================ */

export interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  features: string[];
  recommended?: boolean;
}

export interface PricingSlideProps extends Partial<SlideComponentProps> {
  title?: string;
  subtitle?: string;
  plans: PricingPlan[];
}

export const PricingSlide: React.FC<PricingSlideProps> = ({
  title,
  subtitle,
  plans,
  ...props
}) => (
  <Slide {...props}>
    {title && (
      <SpHeading fontSize="40px" fontWeight="700" margin="0 0 8px 0" style={{ letterSpacing: '-0.03em', textAlign: 'center' }}>
        {title}
      </SpHeading>
    )}
    {subtitle && (
      <SpText fontSize="20px" color={colors.neutral[400]} margin="0 0 32px 0" style={{ textAlign: 'center' }}>
        {subtitle}
      </SpText>
    )}
    <FlexBox justifyContent="center">
      {plans.map((plan, i) => (
        <Box
          key={i}
          width={`${Math.floor(80 / plans.length)}%`}
          margin="0 8px"
          padding="24px"
          style={{
            borderRadius: '16px',
            border: plan.recommended ? `2px solid ${colors.primary[500]}` : `1px solid ${colors.neutral[800]}`,
            backgroundColor: plan.recommended ? colors.primary[950] : 'transparent',
            position: 'relative',
          }}
        >
          {plan.recommended && (
            <Box
              style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: colors.primary[500],
                borderRadius: '9999px',
                padding: '2px 12px',
              }}
            >
              <SpText fontSize="12px" fontWeight="600" color={colors.neutral[50]} margin="0">Recommended</SpText>
            </Box>
          )}
          <SpText fontSize="18px" fontWeight="600" margin="0 0 8px 0">{plan.name}</SpText>
          <FlexBox alignItems="baseline">
            <SpText fontSize="36px" fontWeight="800" margin="0" style={{ letterSpacing: '-0.03em' }}>{plan.price}</SpText>
            {plan.period && <SpText fontSize="14px" color={colors.neutral[400]} margin="0 0 0 4px">{plan.period}</SpText>}
          </FlexBox>
          <Box style={{ marginTop: '16px', borderTop: `1px solid ${colors.neutral[800]}`, paddingTop: '16px' }}>
            {plan.features.map((f, j) => (
              <SpText key={j} fontSize="14px" color={colors.neutral[300]} margin="4px 0">
                ✓ {f}
              </SpText>
            ))}
          </Box>
        </Box>
      ))}
    </FlexBox>
  </Slide>
);

PricingSlide.displayName = 'PricingSlide';

/* ============================================================
   TableSlide — テーブル表示
   ============================================================ */

export interface TableSlideProps extends Partial<SlideComponentProps> {
  title: string;
  subtitle?: string;
  headers: string[];
  rows: (string | React.ReactNode)[][];
  highlightColumn?: number;
}

export const TableSlide: React.FC<TableSlideProps> = ({
  title,
  subtitle,
  headers,
  rows,
  highlightColumn,
  ...props
}) => (
  <Slide {...props}>
    <SpHeading fontSize="36px" fontWeight="700" margin="0 0 8px 0" style={{ letterSpacing: '-0.03em' }}>
      {title}
    </SpHeading>
    {subtitle && (
      <SpText fontSize="18px" color={colors.neutral[400]} margin="0 0 24px 0">{subtitle}</SpText>
    )}
    <Box style={{ width: '100%' }}>
      <FlexBox style={{ borderBottom: `2px solid ${colors.neutral[700]}`, padding: '12px 0' }}>
        {headers.map((h, i) => (
          <Box key={i} width={`${100 / headers.length}%`} style={{ textAlign: i === 0 ? 'left' : 'center' }}>
            <SpText
              fontSize="15px"
              fontWeight="600"
              color={highlightColumn === i ? colors.primary[400] : colors.neutral[300]}
              margin="0"
            >
              {h}
            </SpText>
          </Box>
        ))}
      </FlexBox>
      {rows.map((row, i) => (
        <FlexBox key={i} style={{ borderBottom: `1px solid ${colors.neutral[800]}`, padding: '10px 0' }}>
          {row.map((cell, j) => (
            <Box key={j} width={`${100 / headers.length}%`} style={{ textAlign: j === 0 ? 'left' : 'center' }}>
              <SpText
                fontSize="15px"
                color={highlightColumn === j ? colors.primary[400] : colors.neutral[300]}
                margin="0"
              >
                {cell}
              </SpText>
            </Box>
          ))}
        </FlexBox>
      ))}
    </Box>
  </Slide>
);

TableSlide.displayName = 'TableSlide';
