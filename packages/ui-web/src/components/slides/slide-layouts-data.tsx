import * as React from 'react';
import { Slide, Heading as SpHeading, Text as SpText, FlexBox, Box } from 'spectacle';
import { colors } from '../../tokens/colors';

type SlideComponentProps = React.ComponentProps<typeof Slide>;

/* ============================================================
   TimelineSlide — タイムライン・ロードマップ
   ============================================================ */

export interface TimelineItem {
  date: string;
  title: string;
  description?: string;
  isCurrent?: boolean;
}

export interface TimelineSlideProps extends Partial<SlideComponentProps> {
  title: string;
  items: TimelineItem[];
}

export const TimelineSlide: React.FC<TimelineSlideProps> = ({ title, items, ...props }) => (
  <Slide {...props}>
    <SpHeading fontSize="40px" fontWeight="700" margin="0 0 48px 0" style={{ letterSpacing: '-0.03em', textAlign: 'center' }}>
      {title}
    </SpHeading>
    <Box style={{ position: 'relative' }}>
      {/* 水平ライン */}
      <Box
        style={{
          position: 'absolute',
          top: '24px',
          left: '10%',
          right: '10%',
          height: '2px',
          backgroundColor: colors.neutral[800],
        }}
      />
      <FlexBox justifyContent="space-around" style={{ position: 'relative' }}>
        {items.map((item, i) => (
          <Box key={i} style={{ textAlign: 'center', width: `${80 / items.length}%` }}>
            {/* ノード */}
            <Box
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: item.isCurrent ? colors.primary[500] : colors.neutral[800],
                border: item.isCurrent ? `3px solid ${colors.primary[400]}` : 'none',
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SpText fontSize="14px" fontWeight="600" color={item.isCurrent ? colors.neutral[50] : colors.neutral[400]} margin="0">
                {item.date}
              </SpText>
            </Box>
            <SpText fontSize="16px" fontWeight="600" color={item.isCurrent ? colors.primary[400] : undefined} margin="0">
              {item.title}
            </SpText>
            {item.description && (
              <SpText fontSize="13px" color={colors.neutral[400]} margin="6px 0 0 0">{item.description}</SpText>
            )}
          </Box>
        ))}
      </FlexBox>
    </Box>
  </Slide>
);

TimelineSlide.displayName = 'TimelineSlide';

/* ============================================================
   ChartSlide — グラフ・チャートフレーム
   ============================================================ */

export interface ChartSlideProps extends Partial<SlideComponentProps> {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footnote?: string;
}

export const ChartSlide: React.FC<ChartSlideProps> = ({
  title,
  subtitle,
  children,
  footnote,
  ...props
}) => (
  <Slide {...props}>
    <SpHeading fontSize="36px" fontWeight="700" margin="0 0 8px 0" style={{ letterSpacing: '-0.03em' }}>
      {title}
    </SpHeading>
    {subtitle && (
      <SpText fontSize="18px" color={colors.neutral[400]} margin="0 0 24px 0">{subtitle}</SpText>
    )}
    <FlexBox justifyContent="center" flex={1}>{children}</FlexBox>
    {footnote && (
      <SpText fontSize="13px" color={colors.neutral[500]} margin="16px 0 0 0">{footnote}</SpText>
    )}
  </Slide>
);

ChartSlide.displayName = 'ChartSlide';

/* ============================================================
   MetricHighlightSlide — 単一数値のドラマティック表示
   ============================================================ */

export interface MetricHighlightSlideProps extends Partial<SlideComponentProps> {
  context?: string;
  value: string;
  suffix?: string;
  description?: string;
}

export const MetricHighlightSlide: React.FC<MetricHighlightSlideProps> = ({
  context,
  value,
  suffix,
  description,
  ...props
}) => (
  <Slide {...props}>
    <FlexBox flexDirection="column" alignItems="center" justifyContent="center" height="100%">
      {context && (
        <SpText fontSize="24px" color={colors.neutral[400]} margin="0 0 16px 0" style={{ textAlign: 'center' }}>
          {context}
        </SpText>
      )}
      <FlexBox alignItems="baseline" justifyContent="center">
        <SpText
          fontSize="120px"
          fontWeight="800"
          color={colors.primary[400]}
          margin="0"
          style={{ letterSpacing: '-0.05em', lineHeight: 1 }}
        >
          {value}
        </SpText>
        {suffix && (
          <SpText fontSize="36px" fontWeight="600" color={colors.primary[400]} margin="0 0 0 8px">
            {suffix}
          </SpText>
        )}
      </FlexBox>
      {description && (
        <SpText fontSize="20px" color={colors.neutral[400]} margin="24px 0 0 0" style={{ textAlign: 'center', maxWidth: '600px' }}>
          {description}
        </SpText>
      )}
    </FlexBox>
  </Slide>
);

MetricHighlightSlide.displayName = 'MetricHighlightSlide';

/* ============================================================
   BeforeAfterMetricSlide — 導入前後比較
   ============================================================ */

export interface BeforeAfterMetricSlideProps extends Partial<SlideComponentProps> {
  title: string;
  beforeValue: string;
  beforeLabel: string;
  afterValue: string;
  afterLabel: string;
  improvement?: string;
  description?: string;
}

export const BeforeAfterMetricSlide: React.FC<BeforeAfterMetricSlideProps> = ({
  title,
  beforeValue,
  beforeLabel,
  afterValue,
  afterLabel,
  improvement,
  description,
  ...props
}) => (
  <Slide {...props}>
    <SpHeading fontSize="40px" fontWeight="700" margin="0 0 48px 0" style={{ letterSpacing: '-0.03em', textAlign: 'center' }}>
      {title}
    </SpHeading>
    <FlexBox justifyContent="center" alignItems="center">
      {/* Before */}
      <Box style={{ textAlign: 'center', padding: '0 32px' }}>
        <SpText fontSize="14px" color={colors.neutral[500]} margin="0 0 8px 0" style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Before
        </SpText>
        <SpText fontSize="64px" fontWeight="800" color={colors.neutral[500]} margin="0" style={{ letterSpacing: '-0.04em' }}>
          {beforeValue}
        </SpText>
        <SpText fontSize="16px" color={colors.neutral[500]} margin="8px 0 0 0">{beforeLabel}</SpText>
      </Box>
      {/* Arrow */}
      <Box style={{ padding: '0 24px' }}>
        <SpText fontSize="40px" color={colors.neutral[600]} margin="0">→</SpText>
      </Box>
      {/* After */}
      <Box style={{ textAlign: 'center', padding: '0 32px' }}>
        <SpText fontSize="14px" color={colors.primary[400]} margin="0 0 8px 0" style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          After
        </SpText>
        <SpText fontSize="64px" fontWeight="800" color={colors.primary[400]} margin="0" style={{ letterSpacing: '-0.04em' }}>
          {afterValue}
        </SpText>
        <SpText fontSize="16px" color={colors.primary[400]} margin="8px 0 0 0">{afterLabel}</SpText>
      </Box>
    </FlexBox>
    {improvement && (
      <SpText fontSize="24px" fontWeight="700" color={colors.primary[400]} margin="32px 0 0 0" style={{ textAlign: 'center' }}>
        {improvement}
      </SpText>
    )}
    {description && (
      <SpText fontSize="16px" color={colors.neutral[400]} margin="8px 0 0 0" style={{ textAlign: 'center' }}>
        {description}
      </SpText>
    )}
  </Slide>
);

BeforeAfterMetricSlide.displayName = 'BeforeAfterMetricSlide';
