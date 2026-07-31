import * as React from 'react';
import { Slide, Heading as SpHeading, Text as SpText, FlexBox, Box } from 'spectacle';
import { colors } from '../../tokens/colors';

type SlideComponentProps = React.ComponentProps<typeof Slide>;

/* ============================================================
   SecurityComplianceSlide — セキュリティ体制・認証
   ============================================================ */

export interface CertificationItem {
  icon?: React.ReactNode;
  name: string;
  description?: string;
}

export interface SecurityComplianceSlideProps extends Partial<SlideComponentProps> {
  title?: string;
  certifications: CertificationItem[];
  additionalMeasures?: string[];
}

export const SecurityComplianceSlide: React.FC<SecurityComplianceSlideProps> = ({
  title = 'セキュリティ・コンプライアンス',
  certifications,
  additionalMeasures,
  ...props
}) => (
  <Slide {...props}>
    <SpHeading fontSize="40px" fontWeight="700" margin="0 0 40px 0" style={{ letterSpacing: '-0.03em', textAlign: 'center' }}>
      {title}
    </SpHeading>
    <FlexBox justifyContent="center" flexWrap="wrap">
      {certifications.map((cert, i) => (
        <Box key={i} width={`${Math.floor(80 / Math.min(certifications.length, 4))}%`} padding="16px" style={{ textAlign: 'center' }}>
          {cert.icon ? (
            <Box margin="0 0 12px 0">{cert.icon}</Box>
          ) : (
            <Box
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                backgroundColor: colors.primary[900],
                margin: '0 auto 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SpText fontSize="20px" color={colors.primary[400]} margin="0">✓</SpText>
            </Box>
          )}
          <SpText fontSize="16px" fontWeight="600" margin="0">{cert.name}</SpText>
          {cert.description && (
            <SpText fontSize="13px" color={colors.neutral[400]} margin="6px 0 0 0">{cert.description}</SpText>
          )}
        </Box>
      ))}
    </FlexBox>
    {additionalMeasures && additionalMeasures.length > 0 && (
      <Box style={{ marginTop: '32px', borderTop: `1px solid ${colors.neutral[800]}`, paddingTop: '20px' }}>
        <FlexBox justifyContent="center" flexWrap="wrap">
          {additionalMeasures.map((measure, i) => (
            <SpText key={i} fontSize="14px" color={colors.neutral[400]} margin="4px 16px">
              • {measure}
            </SpText>
          ))}
        </FlexBox>
      </Box>
    )}
  </Slide>
);

SecurityComplianceSlide.displayName = 'SecurityComplianceSlide';

/* ============================================================
   SupportStructureSlide — サポート体制
   ============================================================ */

export interface SupportTier {
  name: string;
  description: string;
  responseTime?: string;
  features: string[];
  icon?: React.ReactNode;
}

export interface SupportStructureSlideProps extends Partial<SlideComponentProps> {
  title?: string;
  tiers: SupportTier[];
}

export const SupportStructureSlide: React.FC<SupportStructureSlideProps> = ({
  title = 'サポート体制',
  tiers,
  ...props
}) => (
  <Slide {...props}>
    <SpHeading fontSize="40px" fontWeight="700" margin="0 0 40px 0" style={{ letterSpacing: '-0.03em', textAlign: 'center' }}>
      {title}
    </SpHeading>
    <FlexBox justifyContent="center">
      {tiers.map((tier, i) => (
        <Box
          key={i}
          width={`${Math.floor(80 / tiers.length)}%`}
          margin="0 8px"
          padding="24px"
          style={{
            borderRadius: '16px',
            border: `1px solid ${colors.neutral[800]}`,
            backgroundColor: i === tiers.length - 1 ? colors.primary[950] : 'transparent',
          }}
        >
          {tier.icon && <Box margin="0 0 12px 0">{tier.icon}</Box>}
          <SpText fontSize="20px" fontWeight="700" margin="0 0 4px 0">{tier.name}</SpText>
          <SpText fontSize="14px" color={colors.neutral[400]} margin="0 0 12px 0">{tier.description}</SpText>
          {tier.responseTime && (
            <SpText fontSize="14px" color={colors.primary[400]} fontWeight="600" margin="0 0 12px 0">
              {tier.responseTime}
            </SpText>
          )}
          <Box style={{ borderTop: `1px solid ${colors.neutral[800]}`, paddingTop: '12px' }}>
            {tier.features.map((f, j) => (
              <SpText key={j} fontSize="13px" color={colors.neutral[300]} margin="3px 0">
                ✓ {f}
              </SpText>
            ))}
          </Box>
        </Box>
      ))}
    </FlexBox>
  </Slide>
);

SupportStructureSlide.displayName = 'SupportStructureSlide';

/* ============================================================
   ImplementationPlanSlide — 導入スケジュール
   ============================================================ */

export interface ImplementationPhase {
  phase: string;
  title: string;
  duration: string;
  tasks: string[];
  highlight?: boolean;
}

export interface ImplementationPlanSlideProps extends Partial<SlideComponentProps> {
  title?: string;
  phases: ImplementationPhase[];
  totalDuration?: string;
}

export const ImplementationPlanSlide: React.FC<ImplementationPlanSlideProps> = ({
  title = '導入スケジュール',
  phases,
  totalDuration,
  ...props
}) => (
  <Slide {...props}>
    <SpHeading fontSize="40px" fontWeight="700" margin="0 0 8px 0" style={{ letterSpacing: '-0.03em', textAlign: 'center' }}>
      {title}
    </SpHeading>
    {totalDuration && (
      <SpText fontSize="18px" color={colors.primary[400]} fontWeight="600" margin="0 0 32px 0" style={{ textAlign: 'center' }}>
        {totalDuration}
      </SpText>
    )}
    <FlexBox justifyContent="center" alignItems="flex-start">
      {phases.map((phase, i) => (
        <React.Fragment key={i}>
          <Box
            width={`${Math.floor(70 / phases.length)}%`}
            padding="16px"
            style={{
              borderRadius: '12px',
              border: phase.highlight ? `2px solid ${colors.primary[500]}` : `1px solid ${colors.neutral[800]}`,
              backgroundColor: phase.highlight ? colors.primary[950] : 'transparent',
            }}
          >
            <SpText fontSize="12px" color={colors.primary[400]} fontWeight="600" margin="0" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {phase.phase}
            </SpText>
            <SpText fontSize="18px" fontWeight="600" margin="4px 0 0 0">{phase.title}</SpText>
            <SpText fontSize="13px" color={colors.neutral[400]} margin="2px 0 8px 0">{phase.duration}</SpText>
            {phase.tasks.map((task, j) => (
              <SpText key={j} fontSize="13px" color={colors.neutral[300]} margin="2px 0">• {task}</SpText>
            ))}
          </Box>
          {i < phases.length - 1 && (
            <Box style={{ display: 'flex', alignItems: 'center', padding: '0 4px', marginTop: '40px' }}>
              <SpText fontSize="20px" color={colors.neutral[600]} margin="0">→</SpText>
            </Box>
          )}
        </React.Fragment>
      ))}
    </FlexBox>
  </Slide>
);

ImplementationPlanSlide.displayName = 'ImplementationPlanSlide';

/* ============================================================
   ROICalculationSlide — ROI試算
   ============================================================ */

export interface ROIItem {
  category: string;
  before: string;
  after: string;
  savings?: string;
}

export interface ROICalculationSlideProps extends Partial<SlideComponentProps> {
  title?: string;
  items: ROIItem[];
  totalROI?: string;
  paybackPeriod?: string;
}

export const ROICalculationSlide: React.FC<ROICalculationSlideProps> = ({
  title = '導入効果シミュレーション',
  items,
  totalROI,
  paybackPeriod,
  ...props
}) => (
  <Slide {...props}>
    <SpHeading fontSize="36px" fontWeight="700" margin="0 0 32px 0" style={{ letterSpacing: '-0.03em', textAlign: 'center' }}>
      {title}
    </SpHeading>
    <Box style={{ width: '100%' }}>
      {/* ヘッダー */}
      <FlexBox style={{ borderBottom: `2px solid ${colors.neutral[700]}`, padding: '12px 0' }}>
        <Box width="30%"><SpText fontSize="14px" fontWeight="600" color={colors.neutral[400]} margin="0">項目</SpText></Box>
        <Box width="25%" style={{ textAlign: 'center' }}><SpText fontSize="14px" fontWeight="600" color={colors.neutral[500]} margin="0">Before</SpText></Box>
        <Box width="25%" style={{ textAlign: 'center' }}><SpText fontSize="14px" fontWeight="600" color={colors.primary[400]} margin="0">After</SpText></Box>
        <Box width="20%" style={{ textAlign: 'right' }}><SpText fontSize="14px" fontWeight="600" color={colors.primary[400]} margin="0">削減額</SpText></Box>
      </FlexBox>
      {/* 行 */}
      {items.map((item, i) => (
        <FlexBox key={i} style={{ borderBottom: `1px solid ${colors.neutral[800]}`, padding: '12px 0' }} alignItems="center">
          <Box width="30%"><SpText fontSize="16px" margin="0">{item.category}</SpText></Box>
          <Box width="25%" style={{ textAlign: 'center' }}><SpText fontSize="16px" color={colors.neutral[500]} margin="0">{item.before}</SpText></Box>
          <Box width="25%" style={{ textAlign: 'center' }}><SpText fontSize="16px" color={colors.primary[400]} fontWeight="600" margin="0">{item.after}</SpText></Box>
          <Box width="20%" style={{ textAlign: 'right' }}>
            {item.savings && <SpText fontSize="16px" color={colors.primary[400]} fontWeight="600" margin="0">{item.savings}</SpText>}
          </Box>
        </FlexBox>
      ))}
    </Box>
    {(totalROI || paybackPeriod) && (
      <FlexBox justifyContent="center" style={{ marginTop: '24px' }}>
        {totalROI && (
          <Box padding="0 24px" style={{ textAlign: 'center' }}>
            <SpText fontSize="32px" fontWeight="800" color={colors.primary[400]} margin="0" style={{ letterSpacing: '-0.03em' }}>
              {totalROI}
            </SpText>
            <SpText fontSize="14px" color={colors.neutral[400]} margin="4px 0 0 0">年間削減額</SpText>
          </Box>
        )}
        {paybackPeriod && (
          <Box padding="0 24px" style={{ textAlign: 'center' }}>
            <SpText fontSize="32px" fontWeight="800" color={colors.primary[400]} margin="0" style={{ letterSpacing: '-0.03em' }}>
              {paybackPeriod}
            </SpText>
            <SpText fontSize="14px" color={colors.neutral[400]} margin="4px 0 0 0">投資回収期間</SpText>
          </Box>
        )}
      </FlexBox>
    )}
  </Slide>
);

ROICalculationSlide.displayName = 'ROICalculationSlide';

/* ============================================================
   QASlide — よくある質問
   ============================================================ */

export interface QAItem {
  question: string;
  answer: string;
}

export interface QASlideProps extends Partial<SlideComponentProps> {
  title?: string;
  items: QAItem[];
}

export const QASlide: React.FC<QASlideProps> = ({
  title = 'よくあるご質問',
  items,
  ...props
}) => (
  <Slide {...props}>
    <SpHeading fontSize="40px" fontWeight="700" margin="0 0 40px 0" style={{ letterSpacing: '-0.03em' }}>
      {title}
    </SpHeading>
    <Box>
      {items.map((item, i) => (
        <Box key={i} style={{ marginBottom: '20px', borderBottom: i < items.length - 1 ? `1px solid ${colors.neutral[800]}` : 'none', paddingBottom: '16px' }}>
          <FlexBox alignItems="flex-start">
            <SpText fontSize="18px" fontWeight="700" color={colors.primary[400]} margin="0 12px 0 0">Q</SpText>
            <SpText fontSize="18px" fontWeight="600" margin="0">{item.question}</SpText>
          </FlexBox>
          <FlexBox alignItems="flex-start" style={{ marginTop: '8px' }}>
            <SpText fontSize="18px" fontWeight="700" color={colors.neutral[500]} margin="0 12px 0 0">A</SpText>
            <SpText fontSize="16px" color={colors.neutral[300]} margin="0">{item.answer}</SpText>
          </FlexBox>
        </Box>
      ))}
    </Box>
  </Slide>
);

QASlide.displayName = 'QASlide';
