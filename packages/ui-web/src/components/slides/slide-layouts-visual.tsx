import * as React from 'react';
import { Slide, Heading as SpHeading, Text as SpText, FlexBox, Box } from 'spectacle';
import { colors } from '../../tokens/colors';

type SlideComponentProps = React.ComponentProps<typeof Slide>;

/* ============================================================
   ImageSlide — 全画面画像
   ============================================================ */

export interface ImageSlideProps extends Partial<SlideComponentProps> {
  title?: string;
  image: React.ReactNode;
  caption?: string;
}

export const ImageSlide: React.FC<ImageSlideProps> = ({ title, image, caption, ...props }) => (
  <Slide {...props}>
    {title && (
      <SpHeading fontSize="36px" fontWeight="700" margin="0 0 24px 0" style={{ letterSpacing: '-0.03em' }}>
        {title}
      </SpHeading>
    )}
    <FlexBox justifyContent="center" flex={1}>
      <Box style={{ maxWidth: '100%', maxHeight: title ? '70%' : '85%' }}>{image}</Box>
    </FlexBox>
    {caption && (
      <SpText fontSize="14px" color={colors.neutral[500]} margin="16px 0 0 0" style={{ textAlign: 'center' }}>
        {caption}
      </SpText>
    )}
  </Slide>
);

ImageSlide.displayName = 'ImageSlide';

/* ============================================================
   ImageTextSlide — 画像 + テキスト横並び
   ============================================================ */

export interface ImageTextSlideProps extends Partial<SlideComponentProps> {
  title: string;
  description: string;
  image: React.ReactNode;
  imagePosition?: 'left' | 'right';
  bullets?: string[];
}

export const ImageTextSlide: React.FC<ImageTextSlideProps> = ({
  title,
  description,
  image,
  imagePosition = 'right',
  bullets,
  ...props
}) => {
  const textContent = (
    <Box width="45%">
      <SpHeading fontSize="36px" fontWeight="700" margin="0 0 16px 0" style={{ letterSpacing: '-0.03em' }}>
        {title}
      </SpHeading>
      <SpText fontSize="18px" color={colors.neutral[300]} margin="0">
        {description}
      </SpText>
      {bullets && bullets.length > 0 && (
        <Box style={{ marginTop: '20px' }}>
          {bullets.map((b, i) => (
            <FlexBox key={i} alignItems="center" style={{ padding: '4px 0' }}>
              <SpText fontSize="16px" color={colors.primary[400]} margin="0 10px 0 0">✓</SpText>
              <SpText fontSize="16px" margin="0">{b}</SpText>
            </FlexBox>
          ))}
        </Box>
      )}
    </Box>
  );
  const imageContent = <Box width="50%">{image}</Box>;

  return (
    <Slide {...props}>
      <FlexBox alignItems="center" justifyContent="space-between" height="100%">
        {imagePosition === 'left' ? (
          <>{imageContent}{textContent}</>
        ) : (
          <>{textContent}{imageContent}</>
        )}
      </FlexBox>
    </Slide>
  );
};

ImageTextSlide.displayName = 'ImageTextSlide';

/* ============================================================
   FlowSlide — プロセスフロー・ステップ
   ============================================================ */

export interface FlowStep {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}

export interface FlowSlideProps extends Partial<SlideComponentProps> {
  title: string;
  subtitle?: string;
  steps: FlowStep[];
}

export const FlowSlide: React.FC<FlowSlideProps> = ({
  title,
  subtitle,
  steps,
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
    <FlexBox justifyContent="center" alignItems="flex-start">
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          <Box width={`${Math.floor(70 / steps.length)}%`} style={{ textAlign: 'center' }}>
            {step.icon ? (
              <Box margin="0 0 12px 0">{step.icon}</Box>
            ) : (
              <Box
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: colors.primary[900],
                  margin: '0 auto 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SpText fontSize="20px" fontWeight="700" color={colors.primary[400]} margin="0">
                  {i + 1}
                </SpText>
              </Box>
            )}
            <SpText fontSize="18px" fontWeight="600" margin="0 0 6px 0">{step.title}</SpText>
            {step.description && (
              <SpText fontSize="14px" color={colors.neutral[400]} margin="0">{step.description}</SpText>
            )}
          </Box>
          {i < steps.length - 1 && (
            <Box style={{ display: 'flex', alignItems: 'center', padding: '0 4px', marginTop: '20px' }}>
              <SpText fontSize="24px" color={colors.neutral[600]} margin="0">→</SpText>
            </Box>
          )}
        </React.Fragment>
      ))}
    </FlexBox>
  </Slide>
);

FlowSlide.displayName = 'FlowSlide';

/* ============================================================
   DiagramSlide — アーキテクチャ図・フリーエリア
   ============================================================ */

export interface DiagramSlideProps extends Partial<SlideComponentProps> {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footnote?: string;
}

export const DiagramSlide: React.FC<DiagramSlideProps> = ({
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
      <SpText fontSize="13px" color={colors.neutral[500]} margin="16px 0 0 0" style={{ textAlign: 'center' }}>
        {footnote}
      </SpText>
    )}
  </Slide>
);

DiagramSlide.displayName = 'DiagramSlide';

/* ============================================================
   IconGridSlide — アイコングリッド
   ============================================================ */

export interface IconGridItem {
  icon: React.ReactNode;
  label: string;
  description?: string;
}

export interface IconGridSlideProps extends Partial<SlideComponentProps> {
  title: string;
  subtitle?: string;
  items: IconGridItem[];
  columns?: 3 | 4;
}

export const IconGridSlide: React.FC<IconGridSlideProps> = ({
  title,
  subtitle,
  items,
  columns = 4,
  ...props
}) => (
  <Slide {...props}>
    <SpHeading fontSize="40px" fontWeight="700" margin="0 0 8px 0" style={{ letterSpacing: '-0.03em', textAlign: 'center' }}>
      {title}
    </SpHeading>
    {subtitle && (
      <SpText fontSize="20px" color={colors.neutral[400]} margin="0 0 32px 0" style={{ textAlign: 'center' }}>
        {subtitle}
      </SpText>
    )}
    <FlexBox justifyContent="center" flexWrap="wrap">
      {items.map((item, i) => (
        <Box key={i} width={`${Math.floor(90 / columns)}%`} padding="12px" style={{ textAlign: 'center' }}>
          <Box margin="0 0 8px 0">{item.icon}</Box>
          <SpText fontSize="16px" fontWeight="600" margin="0">{item.label}</SpText>
          {item.description && (
            <SpText fontSize="13px" color={colors.neutral[400]} margin="4px 0 0 0">{item.description}</SpText>
          )}
        </Box>
      ))}
    </FlexBox>
  </Slide>
);

IconGridSlide.displayName = 'IconGridSlide';
