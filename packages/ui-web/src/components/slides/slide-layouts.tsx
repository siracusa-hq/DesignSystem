import * as React from 'react';
import {
  Slide,
  Heading as SpHeading,
  Text as SpText,
  FlexBox,
  Box,
} from 'spectacle';
import { colors } from '../../tokens/colors';

/* ============================================================
   TitleSlide — タイトルスライド（表紙・区切り）
   ============================================================ */

type SlideComponentProps = React.ComponentProps<typeof Slide>;

export interface TitleSlideProps extends Partial<SlideComponentProps> {
  title: string;
  subtitle?: string;
  badge?: string;
}

export const TitleSlide: React.FC<TitleSlideProps> = ({
  title,
  subtitle,
  badge,
  ...props
}) => (
  <Slide {...props}>
    <FlexBox flexDirection="column" alignItems="center" justifyContent="center" height="100%">
      {badge && (
        <Box
          padding="4px 16px"
          backgroundColor={colors.primary[500]}
          style={{ borderRadius: '9999px', marginBottom: '24px' }}
        >
          <SpText fontSize="14px" color={colors.neutral[50]} fontWeight="600" margin="0">
            {badge}
          </SpText>
        </Box>
      )}
      <SpHeading
        fontSize="56px"
        fontWeight="800"
        margin="0 0 16px 0"
        style={{ letterSpacing: '-0.04em', textAlign: 'center' }}
      >
        {title}
      </SpHeading>
      {subtitle && (
        <SpText
          fontSize="24px"
          color={colors.neutral[400]}
          margin="0"
          style={{ textAlign: 'center', maxWidth: '700px' }}
        >
          {subtitle}
        </SpText>
      )}
    </FlexBox>
  </Slide>
);

TitleSlide.displayName = 'TitleSlide';

/* ============================================================
   ContentSlide — 見出し + コンテンツの汎用スライド
   ============================================================ */

export interface ContentSlideProps extends Partial<SlideComponentProps> {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const ContentSlide: React.FC<ContentSlideProps> = ({
  title,
  subtitle,
  children,
  ...props
}) => (
  <Slide {...props}>
    <SpHeading
      fontSize="40px"
      fontWeight="700"
      margin="0 0 8px 0"
      style={{ letterSpacing: '-0.03em' }}
    >
      {title}
    </SpHeading>
    {subtitle && (
      <SpText fontSize="20px" color={colors.neutral[400]} margin="0 0 32px 0">
        {subtitle}
      </SpText>
    )}
    <Box>{children}</Box>
  </Slide>
);

ContentSlide.displayName = 'ContentSlide';

/* ============================================================
   SplitSlide — 左右2カラムのスライド
   ============================================================ */

export interface SplitSlideProps extends Partial<SlideComponentProps> {
  title: string;
  left: React.ReactNode;
  right: React.ReactNode;
}

export const SplitSlide: React.FC<SplitSlideProps> = ({
  title,
  left,
  right,
  ...props
}) => (
  <Slide {...props}>
    <SpHeading
      fontSize="40px"
      fontWeight="700"
      margin="0 0 32px 0"
      style={{ letterSpacing: '-0.03em' }}
    >
      {title}
    </SpHeading>
    <FlexBox alignItems="flex-start" justifyContent="space-between">
      <Box width="48%">{left}</Box>
      <Box width="48%">{right}</Box>
    </FlexBox>
  </Slide>
);

SplitSlide.displayName = 'SplitSlide';

/* ============================================================
   StatSlide — 大きな数値 + ラベルのインパクトスライド
   ============================================================ */

export interface StatSlideItem {
  value: string;
  label: string;
}

export interface StatSlideProps extends Partial<SlideComponentProps> {
  title?: string;
  stats: StatSlideItem[];
}

export const StatSlide: React.FC<StatSlideProps> = ({
  title,
  stats,
  ...props
}) => (
  <Slide {...props}>
    {title && (
      <SpHeading
        fontSize="36px"
        fontWeight="700"
        margin="0 0 48px 0"
        style={{ letterSpacing: '-0.03em', textAlign: 'center' }}
      >
        {title}
      </SpHeading>
    )}
    <FlexBox justifyContent="center" alignItems="flex-start" flexWrap="wrap">
      {stats.map((stat, i) => (
        <Box key={i} padding="0 32px" style={{ textAlign: 'center' }}>
          <SpText
            fontSize="64px"
            fontWeight="800"
            color={colors.primary[400]}
            margin="0"
            style={{ letterSpacing: '-0.04em' }}
          >
            {stat.value}
          </SpText>
          <SpText fontSize="18px" color={colors.neutral[400]} margin="8px 0 0 0">
            {stat.label}
          </SpText>
        </Box>
      ))}
    </FlexBox>
  </Slide>
);

StatSlide.displayName = 'StatSlide';

/* ============================================================
   QuoteSlide — 引用スライド（テスティモニアル）
   ============================================================ */

export interface QuoteSlideProps extends Partial<SlideComponentProps> {
  quote: string;
  author: string;
  role?: string;
  company?: string;
}

export const QuoteSlide: React.FC<QuoteSlideProps> = ({
  quote,
  author,
  role,
  company,
  ...props
}) => (
  <Slide {...props}>
    <FlexBox flexDirection="column" alignItems="center" justifyContent="center" height="100%">
      <SpText
        fontSize="18px"
        color={colors.primary[400]}
        margin="0 0 24px 0"
        style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}
      >
        Testimonial
      </SpText>
      <SpText
        fontSize="32px"
        fontWeight="500"
        margin="0 0 32px 0"
        style={{ textAlign: 'center', maxWidth: '800px', lineHeight: 1.5 }}
      >
        &ldquo;{quote}&rdquo;
      </SpText>
      <SpText fontSize="18px" fontWeight="600" margin="0">
        {author}
      </SpText>
      {(role || company) && (
        <SpText fontSize="16px" color={colors.neutral[400]} margin="4px 0 0 0">
          {[role, company].filter(Boolean).join(' / ')}
        </SpText>
      )}
    </FlexBox>
  </Slide>
);

QuoteSlide.displayName = 'QuoteSlide';
