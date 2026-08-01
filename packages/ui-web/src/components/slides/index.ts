export { SlideDeck, type SlideDeckProps } from './slide-deck';
export { polastackTheme, polastackDarkTheme } from './theme';

// 基本レイアウト（5種）
export {
  TitleSlide,
  ContentSlide,
  SplitSlide,
  StatSlide,
  QuoteSlide,
  type TitleSlideProps,
  type ContentSlideProps,
  type SplitSlideProps,
  type StatSlideProps,
  type StatSlideItem,
  type QuoteSlideProps,
} from './slide-layouts';

// Structure（4種）
export {
  AgendaSlide,
  SectionDividerSlide,
  EndSlide,
  TeamSlide,
  type AgendaItem,
  type AgendaSlideProps,
  type SectionDividerSlideProps,
  type ContactItem,
  type EndSlideProps,
  type TeamMember,
  type TeamSlideProps,
} from './slide-layouts-structure';

// Content（5種）
export {
  BulletSlide,
  ComparisonSlide,
  ThreeColumnSlide,
  PricingSlide,
  TableSlide,
  type BulletItem,
  type BulletSlideProps,
  type ComparisonSlideProps,
  type ColumnItem,
  type ThreeColumnSlideProps,
  type PricingPlan,
  type PricingSlideProps,
  type TableSlideProps,
} from './slide-layouts-content';

// Visual（5種）
export {
  ImageSlide,
  ImageTextSlide,
  FlowSlide,
  DiagramSlide,
  IconGridSlide,
  type ImageSlideProps,
  type ImageTextSlideProps,
  type FlowStep,
  type FlowSlideProps,
  type DiagramSlideProps,
  type IconGridItem,
  type IconGridSlideProps,
} from './slide-layouts-visual';

// Data（4種）
export {
  TimelineSlide,
  ChartSlide,
  MetricHighlightSlide,
  BeforeAfterMetricSlide,
  type TimelineItem,
  type TimelineSlideProps,
  type ChartSlideProps,
  type MetricHighlightSlideProps,
  type BeforeAfterMetricSlideProps,
} from './slide-layouts-data';

// Social Proof（3種）
export {
  LogoGridSlide,
  CaseStudySlide,
  AwardSlide,
  type LogoGridItem,
  type LogoGridSlideProps,
  type CaseStudySlideProps,
  type AwardItem,
  type AwardSlideProps,
} from './slide-layouts-social';

// Japan-specific（5種）
export {
  SecurityComplianceSlide,
  SupportStructureSlide,
  ImplementationPlanSlide,
  ROICalculationSlide,
  QASlide,
  type CertificationItem,
  type SecurityComplianceSlideProps,
  type SupportTier,
  type SupportStructureSlideProps,
  type ImplementationPhase,
  type ImplementationPlanSlideProps,
  type ROIItem,
  type ROICalculationSlideProps,
  type QAItem,
  type QASlideProps,
} from './slide-layouts-japan';

// Spectacle 基本コンポーネント re-export
export {
  Slide,
  Heading as SlideHeading,
  Text as SlideText,
  FlexBox,
  Box,
  Image,
  OrderedList,
  UnorderedList,
  ListItem,
  CodePane,
  Notes,
  Appear,
} from 'spectacle';
