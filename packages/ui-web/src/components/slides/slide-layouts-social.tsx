import * as React from 'react';
import { Slide, Heading as SpHeading, Text as SpText, FlexBox, Box } from 'spectacle';
import { colors } from '../../tokens/colors';

type SlideComponentProps = React.ComponentProps<typeof Slide>;

/* ============================================================
   LogoGridSlide — 導入企業ロゴ一覧
   ============================================================ */

export interface LogoGridItem {
  logo: React.ReactNode;
  alt: string;
}

export interface LogoGridSlideProps extends Partial<SlideComponentProps> {
  title?: string;
  logos: LogoGridItem[];
  columns?: 3 | 4 | 5;
}

export const LogoGridSlide: React.FC<LogoGridSlideProps> = ({
  title = 'Trusted by',
  logos,
  columns = 4,
  ...props
}) => (
  <Slide {...props}>
    <SpHeading fontSize="36px" fontWeight="700" margin="0 0 48px 0" style={{ letterSpacing: '-0.03em', textAlign: 'center' }}>
      {title}
    </SpHeading>
    <FlexBox justifyContent="center" flexWrap="wrap" alignItems="center">
      {logos.map((item, i) => (
        <Box
          key={i}
          width={`${Math.floor(80 / columns)}%`}
          padding="16px"
          style={{ textAlign: 'center', opacity: 0.6 }}
        >
          {item.logo}
        </Box>
      ))}
    </FlexBox>
  </Slide>
);

LogoGridSlide.displayName = 'LogoGridSlide';

/* ============================================================
   CaseStudySlide — 導入事例概要
   ============================================================ */

export interface CaseStudySlideProps extends Partial<SlideComponentProps> {
  companyName: string;
  companyLogo?: React.ReactNode;
  industry?: string;
  challenge: string;
  result: string;
  metrics?: { value: string; label: string }[];
  quote?: string;
  quoteName?: string;
  quoteRole?: string;
}

export const CaseStudySlide: React.FC<CaseStudySlideProps> = ({
  companyName,
  companyLogo,
  industry,
  challenge,
  result,
  metrics,
  quote,
  quoteName,
  quoteRole,
  ...props
}) => (
  <Slide {...props}>
    <FlexBox alignItems="flex-start" justifyContent="space-between">
      {/* 左: 企業情報 */}
      <Box width="35%">
        {companyLogo && <Box margin="0 0 16px 0">{companyLogo}</Box>}
        <SpText fontSize="24px" fontWeight="700" margin="0 0 4px 0">{companyName}</SpText>
        {industry && <SpText fontSize="14px" color={colors.neutral[400]} margin="0">{industry}</SpText>}
        {metrics && metrics.length > 0 && (
          <Box style={{ marginTop: '24px', borderTop: `1px solid ${colors.neutral[800]}`, paddingTop: '16px' }}>
            {metrics.map((m, i) => (
              <Box key={i} style={{ marginBottom: '12px' }}>
                <SpText fontSize="32px" fontWeight="800" color={colors.primary[400]} margin="0" style={{ letterSpacing: '-0.03em' }}>
                  {m.value}
                </SpText>
                <SpText fontSize="13px" color={colors.neutral[400]} margin="2px 0 0 0">{m.label}</SpText>
              </Box>
            ))}
          </Box>
        )}
      </Box>
      {/* 右: 課題・結果・引用 */}
      <Box width="58%">
        <SpText fontSize="14px" color={colors.neutral[500]} margin="0 0 4px 0" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Challenge
        </SpText>
        <SpText fontSize="18px" color={colors.neutral[300]} margin="0 0 24px 0">{challenge}</SpText>
        <SpText fontSize="14px" color={colors.neutral[500]} margin="0 0 4px 0" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Result
        </SpText>
        <SpText fontSize="18px" margin="0 0 24px 0">{result}</SpText>
        {quote && (
          <Box
            style={{
              borderLeft: `3px solid ${colors.primary[500]}`,
              paddingLeft: '16px',
              marginTop: '16px',
            }}
          >
            <SpText fontSize="16px" fontWeight="500" margin="0" style={{ fontStyle: 'italic' }}>
              &ldquo;{quote}&rdquo;
            </SpText>
            {quoteName && (
              <SpText fontSize="14px" color={colors.neutral[400]} margin="8px 0 0 0">
                — {quoteName}{quoteRole ? `, ${quoteRole}` : ''}
              </SpText>
            )}
          </Box>
        )}
      </Box>
    </FlexBox>
  </Slide>
);

CaseStudySlide.displayName = 'CaseStudySlide';

/* ============================================================
   AwardSlide — 受賞・認定
   ============================================================ */

export interface AwardItem {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  year?: string;
}

export interface AwardSlideProps extends Partial<SlideComponentProps> {
  title?: string;
  items: AwardItem[];
}

export const AwardSlide: React.FC<AwardSlideProps> = ({
  title = 'Awards & Recognition',
  items,
  ...props
}) => (
  <Slide {...props}>
    <SpHeading fontSize="40px" fontWeight="700" margin="0 0 48px 0" style={{ letterSpacing: '-0.03em', textAlign: 'center' }}>
      {title}
    </SpHeading>
    <FlexBox justifyContent="center" flexWrap="wrap">
      {items.map((item, i) => (
        <Box key={i} width={`${Math.floor(80 / Math.min(items.length, 4))}%`} padding="16px" style={{ textAlign: 'center' }}>
          {item.icon && <Box margin="0 0 12px 0">{item.icon}</Box>}
          <SpText fontSize="18px" fontWeight="600" margin="0">{item.title}</SpText>
          {item.year && <SpText fontSize="14px" color={colors.primary[400]} margin="4px 0 0 0">{item.year}</SpText>}
          {item.description && (
            <SpText fontSize="14px" color={colors.neutral[400]} margin="6px 0 0 0">{item.description}</SpText>
          )}
        </Box>
      ))}
    </FlexBox>
  </Slide>
);

AwardSlide.displayName = 'AwardSlide';
