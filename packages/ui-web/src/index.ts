/**
 * @siracusahq/gtm-design-system
 * Marketing components and design tokens for Polastack GTM
 */

// Utilities
export { cn } from './lib/cn';

// Tokens (re-export for convenience)
export {
  colors,
  fontFamily,
  fontSize,
  fontWeight,
  spacing,
  sectionSpacing,
  containerWidth,
  gradients,
  shadows,
  radii,
  duration,
  easing,
  zIndex,
  breakpoints,
} from './tokens';
export type { ColorScale, FontSize, FontWeight, GradientName, Breakpoint } from './tokens';

// Primitives - Layout
export {
  Container,
  containerVariants,
  type ContainerProps,
} from './components/primitives/container';
export { Section, sectionVariants, type SectionProps } from './components/primitives/section';
export { Grid, gridVariants, type GridProps } from './components/primitives/grid';

// Primitives - Typography
export { Heading, headingVariants, type HeadingProps } from './components/primitives/heading';
export { Text, textVariants, type TextProps } from './components/primitives/text';
export {
  GradientText,
  gradientTextVariants,
  type GradientTextProps,
} from './components/primitives/gradient-text';

// Primitives - Interactive
export {
  MarketingButton,
  marketingButtonVariants,
  type MarketingButtonProps,
} from './components/primitives/marketing-button';
export {
  SelectField,
  type SelectFieldProps,
  type SelectFieldOption,
} from './components/primitives/select-field';
export { Link, linkVariants, type LinkProps } from './components/primitives/link';

// Primitives - Animation
export {
  AnimateOnScroll,
  type AnimateOnScrollProps,
  type ScrollAnimation,
} from './components/primitives/animate-on-scroll';

// Hooks
export { useInView, type UseInViewOptions } from './hooks/useInView';

// Primitives - Display
export { Logo, type LogoProps } from './components/primitives/logo';
export { Badge, badgeVariants, type BadgeProps } from './components/primitives/badge';
export { Eyebrow, type EyebrowProps } from './components/primitives/eyebrow';
export { LogoMark, type LogoMarkProps } from './components/primitives/logo-mark';
export {
  MediaFrame,
  type MediaFrameProps,
  type MediaRatio,
} from './components/primitives/media-frame';
export { ProductShot, type ProductShotProps } from './components/primitives/product-shot';
export { Avatar, type AvatarProps } from './components/primitives/avatar';
export { Divider, dividerVariants, type DividerProps } from './components/primitives/divider';
export {
  AnimatedCounter,
  type AnimatedCounterProps,
} from './components/primitives/animated-counter';

// Sections
export {
  HeroSection,
  type HeroSectionProps,
  type HeroAction,
} from './components/sections/hero-section';
export {
  FeatureGrid,
  type FeatureGridProps,
  type FeatureItem,
} from './components/sections/feature-grid';
export { PricingTable, type PricingTableProps } from './components/sections/pricing';
export {
  PricingCard,
  type PricingCardProps,
  type PricingFeature,
} from './components/sections/pricing';
export {
  CTASection,
  type CTASectionProps,
  type CTAAction,
} from './components/sections/cta-section';
export { CTABand, type CTABandProps, type CTABandAction } from './components/sections/cta-band';
export {
  ServicePortfolio,
  type ServicePortfolioProps,
  type ServiceCard,
} from './components/sections/service-portfolio';
export { FAQSection, type FAQSectionProps, type FAQItem } from './components/sections/faq-section';

export {
  FeatureShowcase,
  type FeatureShowcaseProps,
  type ShowcaseItem,
} from './components/sections/feature-showcase';
export {
  ComparisonTable,
  type ComparisonTableProps,
  type ComparisonColumn,
  type ComparisonRow,
} from './components/sections/comparison-table';
export {
  TestimonialSection,
  type TestimonialSectionProps,
  type Testimonial,
} from './components/sections/testimonial-section';
export { LogoCloud, type LogoCloudProps, type LogoItem } from './components/sections/logo-cloud';
export {
  StatsSection,
  type StatsSectionProps,
  type StatItem,
} from './components/sections/stats-section';
export { CodeBlock, type CodeBlockProps } from './components/sections/code-block';
export {
  ModuleOverview,
  type ModuleOverviewProps,
  type ModuleInfo,
  type ArchitectureLayer,
} from './components/sections/module-overview';
export {
  MigrationComparison,
  type MigrationComparisonProps,
  type MigrationPath,
  type MigrationTrigger,
} from './components/sections/migration-comparison';
export {
  AirPocketFeature,
  type AirPocketFeatureProps,
  type AirPocket,
} from './components/sections/air-pocket-feature';

export {
  SecurityBadges,
  type SecurityBadgesProps,
  type SecurityBadge,
} from './components/sections/security-badges';
export {
  FormInput,
  FormTextarea,
  FormSelect,
  FormCheckbox,
  FormButton,
  ContactForm,
  ResourceRequestForm,
  DemoRequestForm,
} from './components/sections/form';
export type {
  FormInputProps,
  FormTextareaProps,
  FormSelectProps,
  FormCheckboxProps,
  FormButtonProps,
  ContactFormProps,
  ResourceRequestFormProps,
  DemoRequestFormProps,
  FormSubmitResult,
  /** フォームの追加項目（見た目ではなく項目だけを足す口） */
  ExtraField,
  ConsentOption,
  PhoneOption,
} from './components/sections/form';
export {
  CaseStudySection,
  type CaseStudySectionProps,
  type CaseStudy,
} from './components/sections/case-study-card';
export {
  CaseStudyListSection,
  CASE_STUDY_FILTER_AXES,
  type CaseStudyListSectionProps,
  type CaseStudyListItem,
  type CaseStudyListLabels,
  type CaseStudyFilterAxis,
  /** 一覧カードと事例記事のプロフィールが共有するメタ情報（値を2箇所に書かない） */
  type CaseStudyMeta,
} from './components/sections/case-study-list';
/* コーポレートサイトの下層ページ用（2026-08-15 追加）。
   LP のセクション群と違い、読み物・会社情報という別の面を担う。

   **お知らせ・ブログの一覧と記事は、ここではなく `article-list` /
   `article-detail` のページ型が担う**（article-pages-workorder.md）。
   DocumentArticle は法務文書・静的文書・404 の器であって、記事の器ではない。 */
export {
  ProseSection,
  type ProseSectionProps,
  type ProseSignature,
  type ProseMoreLink,
} from './components/sections/prose-section';
export {
  DocumentArticle,
  type DocumentArticleProps,
  type DocumentArticleLabels,
  type DocumentPanelItem,
} from './components/sections/document-article';
export {
  CompanyProfileSection,
  type CompanyProfileSectionProps,
  type CompanyProfileItem,
} from './components/sections/company-profile';
export {
  LeadershipSection,
  type LeadershipSectionProps,
  type LeadershipMember,
} from './components/sections/leadership';
export {
  HistorySection,
  type HistorySectionProps,
  type HistoryEvent,
} from './components/sections/history';

/* 記事系（article-list / article-detail）。News とブログを1組の部品で賄う。
   カード語彙 ArticleListItem は一覧・関連記事・ContentHub が共有する */
export { ArticleCard, type ArticleCardProps, type ArticleListItem } from './components/sections/article-card';
export {
  ArticleListSection,
  ARTICLE_FILTER_AXES,
  type ArticleListSectionProps,
  type ArticleListLabels,
  type ArticleFilterAxis,
} from './components/sections/article-list';
export {
  ArticleBodySection,
  ArticleRelatedSection,
  type ArticleBodySectionProps,
  type ArticleRelatedSectionProps,
  /** News は著者・目次・更新日・監修者を型として持たない（実測 0/12） */
  type NewsBodyProps,
  type BlogBodyProps,
  type ArticleChapter,
  type ArticlePhoto,
  type ArticlePerson,
  type ArticleBodyLabels,
} from './components/sections/article-body';
export {
  ShareButtons,
  SHARE_SERVICES,
  type ShareButtonsProps,
  type ShareButtonsLabels,
  type ShareService,
} from './components/sections/share-buttons';

/* 獲得系（resources-library / seminar-list / seminar-detail）。
   共有語彙の決定は docs/composition-redesign.md 末尾「共有語彙の決定」 */
export type { ContentImage, ContentPerson } from './lib/content-vocabulary';
export {
  ResourceCard,
  type ResourceCardProps,
  type ResourceListItem,
} from './components/sections/resource-card';
export {
  ResourceListSection,
  type ResourceListSectionProps,
  type ResourceListLabels,
} from './components/sections/resource-list';
export {
  SeminarCard,
  SEMINAR_STATUSES,
  formatSeminarDateTime,
  type SeminarCardProps,
  type SeminarListItem,
  type SeminarStatus,
  type SeminarFormat,
  type SeminarStatusLabels,
  type SeminarFormatLabels,
} from './components/sections/seminar-card';
export {
  SeminarListSection,
  type SeminarListSectionProps,
  type SeminarListLabels,
} from './components/sections/seminar-list';
export {
  SeminarDetailSection,
  type SeminarDetailSectionProps,
  /** status ごとに持てる情報が変わる（アーカイブに開催日時は存在しない） */
  type UpcomingSeminarProps,
  type ClosedSeminarProps,
  type ArchiveSeminarProps,
  type SeminarAgendaItem,
  type EventMetaItem,
  type SeminarDetailLabels,
} from './components/sections/seminar-detail';

/* ContentHub — LP 末尾のコンテンツ回遊（実測 9/13）。
   系統ごとに塊を作る union で受け取る（混在1グリッドは実測 0/11） */
export {
  ContentHubSection,
  type ContentHubSectionProps,
  type ContentHubGroup,
  type ContentHubGroups,
  type ContentHubTile,
} from './components/sections/content-hub';

export {
  CaseStudyArticleSection,
  type CaseStudyArticleSectionProps,
  type CaseStudyArticleLabels,
  type CasePhoto,
  type CaseSpeaker,
  type CaseSpeakerList,
  type CaseQA,
  type CaseChapter,
  type CaseChapterBody,
  type CaseSummary,
} from './components/sections/case-study-article';

// Layout
export {
  MarketingHeader,
  type MarketingHeaderProps,
  type NavItem,
  type HeaderAction,
} from './components/layout/marketing-header';
export {
  MarketingFooter,
  type MarketingFooterProps,
  type FooterLinkGroup,
  type SocialLink,
} from './components/layout/marketing-footer';
export { PageLayout, type PageLayoutProps } from './components/layout/page-layout';
// 追従 CTA（Stage 4 Slice 1）。実測で確認できた2形態のみ
export {
  StickyHeaderCTA,
  type StickyHeaderCTAProps,
  type StickyHeaderCTAAction,
} from './components/layout/sticky-header-cta';
export {
  FloatingCornerCTA,
  type FloatingCornerCTAProps,
  type FloatingCornerCTAAction,
  type FloatingCornerCTALabels,
} from './components/layout/floating-corner-cta';
export {
  Page,
  PAGE_BRANDS,
  PAGE_TONES,
  type PageProps,
  type PageBrand,
  type PageTone,
  type PageCTA,
  type PageCTAClickHandler,
} from './components/layout/page';
/* Page の外に出る追従 CTA を任意の祖先で受けるための委譲ヘルパー。
   StickyHeaderCTA / FloatingCornerCTA は Page の外に置かれるため、
   Page.onCTAClick では拾えない（stage4-workorder.md §7） */
export { createCTAClickCapture } from './lib/cta-click';
export { markPageSurface, type PageSurface } from './lib/page-surface';

// パターン層（Stage 3）: LP 量産のデータ駆動 API
export * from './patterns';
