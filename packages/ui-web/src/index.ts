/**
 * @polastack/gtm-design-system
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
export { Container, containerVariants, type ContainerProps } from './components/primitives/container';
export { Section, sectionVariants, type SectionProps } from './components/primitives/section';
export { Grid, gridVariants, type GridProps } from './components/primitives/grid';

// Primitives - Typography
export { Heading, headingVariants, type HeadingProps } from './components/primitives/heading';
export { Text, textVariants, type TextProps } from './components/primitives/text';
export { GradientText, gradientTextVariants, type GradientTextProps } from './components/primitives/gradient-text';

// Primitives - Interactive
export { MarketingButton, marketingButtonVariants, type MarketingButtonProps } from './components/primitives/marketing-button';
export { Link, linkVariants, type LinkProps } from './components/primitives/link';

// Primitives - Animation
export { AnimateOnScroll, type AnimateOnScrollProps, type ScrollAnimation } from './components/primitives/animate-on-scroll';

// Hooks
export { useInView, type UseInViewOptions } from './hooks/useInView';

// Primitives - Display
export { Logo, type LogoProps } from './components/primitives/logo';
export { Badge, badgeVariants, type BadgeProps } from './components/primitives/badge';
export { Divider, dividerVariants, type DividerProps } from './components/primitives/divider';
export { AnimatedCounter, type AnimatedCounterProps } from './components/primitives/animated-counter';

// Sections
export { HeroSection, heroSectionVariants, type HeroSectionProps, type HeroAction, type HeroBackgroundPattern } from './components/sections/hero-section';
export { FeatureGrid, type FeatureGridProps, type FeatureItem } from './components/sections/feature-grid';
export { PricingTable, type PricingTableProps } from './components/sections/pricing';
export { PricingCard, pricingCardVariants, type PricingCardProps, type PricingFeature } from './components/sections/pricing';
export { CTASection, ctaSectionVariants, type CTASectionProps, type CTAAction } from './components/sections/cta-section';
export { FAQSection, type FAQSectionProps, type FAQItem } from './components/sections/faq-section';

export { FeatureShowcase, type FeatureShowcaseProps, type ShowcaseItem } from './components/sections/feature-showcase';
export { ComparisonTable, type ComparisonTableProps, type ComparisonColumn, type ComparisonRow } from './components/sections/comparison-table';
export { TestimonialSection, type TestimonialSectionProps, type Testimonial } from './components/sections/testimonial-section';
export { LogoCloud, type LogoCloudProps, type LogoItem } from './components/sections/logo-cloud';
export { StatsSection, type StatsSectionProps, type StatItem } from './components/sections/stats-section';
export { BentoGrid, type BentoGridProps, type BentoItem } from './components/sections/bento-grid';
export { CodeBlock, type CodeBlockProps } from './components/sections/code-block';
export { ModuleOverview, type ModuleOverviewProps, type ModuleInfo, type ArchitectureLayer } from './components/sections/module-overview';
export { MigrationComparison, type MigrationComparisonProps, type MigrationPath, type MigrationTrigger } from './components/sections/migration-comparison';
export { AirPocketFeature, type AirPocketFeatureProps, type AirPocket } from './components/sections/air-pocket-feature';

export { SecurityBadges, type SecurityBadgesProps, type SecurityBadge } from './components/sections/security-badges';
export { FormInput, FormTextarea, FormSelect, FormButton, ContactForm, ResourceRequestForm, DemoRequestForm } from './components/sections/form';
export type { FormInputProps, FormTextareaProps, FormSelectProps, FormButtonProps, ContactFormProps, ResourceRequestFormProps, DemoRequestFormProps } from './components/sections/form';
export { CaseStudySection, type CaseStudySectionProps, type CaseStudy } from './components/sections/case-study-card';

// Layout
export { MarketingHeader, type MarketingHeaderProps, type NavItem, type HeaderAction } from './components/layout/marketing-header';
export { MarketingFooter, type MarketingFooterProps, type FooterLinkGroup, type SocialLink } from './components/layout/marketing-footer';
export { PageLayout, type PageLayoutProps } from './components/layout/page-layout';
