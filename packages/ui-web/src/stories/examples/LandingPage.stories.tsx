import type { Meta, StoryObj } from '@storybook/react';
import { PageLayout } from '../../components/layout/page-layout';
import { HeroSection } from '../../components/sections/hero-section';
import { LogoCloud } from '../../components/sections/logo-cloud';
import { ModuleOverview } from '../../components/sections/module-overview';
import { CodeBlock } from '../../components/sections/code-block';
import { AirPocketFeature } from '../../components/sections/air-pocket-feature';
import { BentoGrid } from '../../components/sections/bento-grid';
import { StatsSection } from '../../components/sections/stats-section';
import { CaseStudySection } from '../../components/sections/case-study-card';
import { TestimonialSection } from '../../components/sections/testimonial-section';
import { ComparisonTable } from '../../components/sections/comparison-table';
import { SecurityBadges } from '../../components/sections/security-badges';
import { PricingTable } from '../../components/sections/pricing';
import { FAQSection } from '../../components/sections/faq-section';
import { CTASection } from '../../components/sections/cta-section';
import { AnimateOnScroll } from '../../components/primitives/animate-on-scroll';
import { GradientText } from '../../components/primitives/gradient-text';
import { Heading } from '../../components/primitives/heading';
import { ShieldCheck, Lock, FileCheck, Award } from 'lucide-react';

const meta: Meta = {
  title: 'Examples/LandingPage',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

/* ============================================================
   SDK コード例
   ============================================================ */

const sdkCode = `import { Polastack } from '@polastack/sdk';

const ps = new Polastack({
  apiKey: process.env.POLASTACK_API_KEY,
});

// 型安全なCRUD
const user = await ps.store.users.create({
  name: 'Tanaka Taro',
  role: 'admin',
});

// typo tolerant 全文検索
const results = await ps.find.search('tanaka', {
  limit: 20,
});`;

/* ============================================================
   TopPage — 全16セクション構成の完全LP
   ============================================================ */

export const TopPage: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <PageLayout
        headerProps={{
          navItems: [
            {
              label: isJa ? 'プロダクト' : 'Products',
              href: '#products',
              children: [
                { label: 'PolaAuth', href: '#auth' },
                { label: 'PolaStore', href: '#store' },
                { label: 'PolaGate', href: '#gate' },
                { label: 'PolaFind', href: '#find' },
                { label: 'PolaLens', href: '#lens' },
              ],
            },
            { label: isJa ? '料金' : 'Pricing', href: '#pricing' },
            { label: isJa ? 'ドキュメント' : 'Docs', href: '/docs' },
            { label: isJa ? '事例' : 'Cases', href: '#cases' },
          ],
          actions: [
            { label: isJa ? 'お問い合わせ' : 'Contact', href: '/contact', variant: 'ghost' },
            { label: isJa ? 'ログイン' : 'Log in', href: '/login', variant: 'ghost' },
            { label: isJa ? '無料で始める' : 'Start Free', href: '/signup', variant: 'primary' },
          ],
        }}
        footerProps={{
          description: isJa
            ? 'AIがコードを書く時代。業務に耐える裏側は、Polastackが引き受ける。'
            : 'In the age of AI-generated code, Polastack handles the enterprise backend.',
          linkGroups: [
            {
              title: isJa ? 'プロダクト' : 'Product',
              links: [
                { label: isJa ? '機能概要' : 'Features', href: '/features' },
                { label: isJa ? '料金プラン' : 'Pricing', href: '/pricing' },
                { label: isJa ? 'セキュリティ' : 'Security', href: '/security' },
                { label: isJa ? 'ロードマップ' : 'Roadmap', href: '/roadmap' },
              ],
            },
            {
              title: isJa ? '開発者' : 'Developers',
              links: [
                { label: isJa ? 'ドキュメント' : 'Documentation', href: '/docs' },
                { label: 'API Reference', href: '/api' },
                { label: 'SDK', href: '/sdk' },
                { label: isJa ? 'ステータス' : 'Status', href: '/status' },
              ],
            },
            {
              title: isJa ? '会社情報' : 'Company',
              links: [
                { label: isJa ? 'ブログ' : 'Blog', href: '/blog' },
                { label: isJa ? 'お問い合わせ' : 'Contact', href: '/contact' },
                { label: isJa ? 'パートナー' : 'Partners', href: '/partners' },
                { label: isJa ? '採用' : 'Careers', href: '/careers' },
              ],
            },
            {
              title: isJa ? 'リーガル' : 'Legal',
              links: [
                { label: isJa ? '利用規約' : 'Terms', href: '/terms' },
                { label: isJa ? 'プライバシー' : 'Privacy', href: '/privacy' },
                { label: 'SLA', href: '/sla' },
                { label: isJa ? '特定商取引法' : 'Legal Notice', href: '/legal' },
              ],
            },
          ],
          socialLinks: [
            {
              label: 'GitHub',
              href: 'https://github.com/polastack',
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              ),
            },
            {
              label: 'X',
              href: 'https://x.com/polastack',
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              ),
            },
          ],
          copyright: `© ${new Date().getFullYear()} Polastack, Inc. All rights reserved.`,
          legalLinks: [
            { label: isJa ? 'プライバシーポリシー' : 'Privacy Policy', href: '/privacy' },
            { label: isJa ? '利用規約' : 'Terms of Service', href: '/terms' },
            { label: isJa ? '特定商取引法に基づく表記' : 'Legal Notice', href: '/legal' },
          ],
        }}
      >
        {/* ============================================================
           1. Hero — dark + mesh背景
           ============================================================ */}
        <HeroSection
          layout="centered"
          background="dark"
          backgroundPattern="mesh"
          badge={isJa ? 'Enterprise Agent Stack' : 'Enterprise Agent Stack'}
          title={
            <Heading as="h1" size="display-2xl" className="!text-white">
              {isJa ? (
                <>
                  AIがコードを書く時代。
                  <br />
                  <GradientText as="span">業務に耐える裏側は、Polastackが引き受ける。</GradientText>
                </>
              ) : (
                <>
                  In the age of AI-generated code,
                  <br />
                  <GradientText as="span">Polastack handles the enterprise backend.</GradientText>
                </>
              )}
            </Heading>
          }
          subtitle={
            isJa
              ? 'AIエージェントにAPI仕様を渡すだけで、エンタープライズ品質の検索・分析・認証基盤が即座に立ち上がる。'
              : 'Just pass API specs to an AI agent, and enterprise-grade search, analytics, and auth infrastructure spins up instantly.'
          }
          actions={[
            { label: isJa ? '無料で開発を始める' : 'Start Free', href: '/signup', variant: 'gradient' },
            { label: isJa ? 'デモを予約' : 'Book a Demo', href: '/demo', variant: 'secondary' },
          ]}
        />

        {/* ============================================================
           2. Logo Cloud — 信頼の初期確立
           ============================================================ */}
        <AnimateOnScroll animation="fade-in">
          <LogoCloud
            eyebrow={isJa ? '導入企業' : 'TRUSTED BY'}
            title={isJa ? '先進企業が採用するプラットフォーム' : 'Trusted by forward-thinking teams'}
            scrolling
            logos={Array.from({ length: 10 }).map((_, i) => ({
              name: `Company ${i + 1}`,
              logo: (
                <div className="flex h-8 w-24 items-center justify-center rounded bg-neutral-200 text-xs text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                  Logo {i + 1}
                </div>
              ),
            }))}
          />
        </AnimateOnScroll>

        {/* ============================================================
           3. Module Overview — 11モジュール全体像（dark）
           ============================================================ */}
        <AnimateOnScroll animation="fade-up">
          <ModuleOverview
            eyebrow={isJa ? 'アーキテクチャ' : 'ARCHITECTURE'}
            title={isJa ? '6レイヤー × 11モジュール' : '6 Layers × 11 Modules'}
            subtitle={isJa ? 'AIがコードを書く時代。業務に耐える裏側は、Polastackが引き受ける。' : 'In the age of AI-generated code, Polastack handles the enterprise backend.'}
            background="dark"
            layers={
              isJa
                ? [
                    { name: 'L0: DX層', modules: [{ name: 'PolaKey', label: 'DX', description: 'SDK・CLI・管理GUI・API Docs' }, { name: 'PolaVault', label: 'CaC', description: 'シークレット管理・設定ドリフト防止' }] },
                    { name: 'L1: フロントエンド層', modules: [{ name: 'PolaNest', label: 'ホスティング', description: 'GitOps・PRプレビュー・Zero DevOps' }] },
                    { name: 'L2: API & セキュリティ層', modules: [{ name: 'PolaAuth', label: '認証', description: 'WorkOS統合・SSO/SAML/SCIM' }, { name: 'PolaGate', label: 'Gateway', description: 'SDK/MCP/OpenAPI自動生成' }] },
                    { name: 'L3: コア・データ層', modules: [{ name: 'PolaStore', label: 'DB', description: 'RLS/FLS・監査ログ・DB最下層セキュリティ' }] },
                    { name: 'L4: 拡張データ & 連携層', modules: [{ name: 'PolaCast', label: '連携', description: 'CDC・Webhook' }, { name: 'PolaLens', label: '分析', description: 'BigQuery + Cube' }, { name: 'PolaFind', label: '検索', description: '日本語typo tolerant' }] },
                    { name: 'L5: 運用・課金層', modules: [{ name: 'PolaWatch', label: '監視', description: 'テナント別監視' }, { name: 'PolaBill', label: '課金', description: 'Stripe Billing統合' }] },
                  ]
                : [
                    { name: 'L0: DX Layer', modules: [{ name: 'PolaKey', label: 'DX', description: 'SDK, CLI, Admin GUI, API Docs' }, { name: 'PolaVault', label: 'CaC', description: 'Secret mgmt, drift prevention' }] },
                    { name: 'L1: Frontend Layer', modules: [{ name: 'PolaNest', label: 'Hosting', description: 'GitOps, PR previews, Zero DevOps' }] },
                    { name: 'L2: API & Security Layer', modules: [{ name: 'PolaAuth', label: 'Auth', description: 'WorkOS SSO/SAML/SCIM' }, { name: 'PolaGate', label: 'Gateway', description: 'Auto SDK/MCP/OpenAPI' }] },
                    { name: 'L3: Core Data Layer', modules: [{ name: 'PolaStore', label: 'DB', description: 'RLS/FLS, audit logs at DB layer' }] },
                    { name: 'L4: Extended Data Layer', modules: [{ name: 'PolaCast', label: 'Integration', description: 'CDC, Webhooks' }, { name: 'PolaLens', label: 'Analytics', description: 'BigQuery + Cube' }, { name: 'PolaFind', label: 'Search', description: 'Japanese typo tolerant' }] },
                    { name: 'L5: Ops & Billing Layer', modules: [{ name: 'PolaWatch', label: 'Monitoring', description: 'Per-tenant monitoring' }, { name: 'PolaBill', label: 'Billing', description: 'Stripe Billing integration' }] },
                  ]
            }
          />
        </AnimateOnScroll>

        {/* ============================================================
           4. Code Block — 開発者体験の訴求（split layout）
           ============================================================ */}
        <AnimateOnScroll animation="fade-up">
          <CodeBlock
            layout="split"
            alignment="top"
            eyebrow={isJa ? 'デベロッパーエクスペリエンス' : 'DEVELOPER EXPERIENCE'}
            title={isJa ? '5分でデプロイ、5行で統合' : 'Deploy in 5 min, integrate in 5 lines'}
            subtitle={isJa ? '既存のTypeScriptスキルをそのまま活用。型安全なSDKを自動生成。' : 'Use your existing TypeScript skills. Auto-generated type-safe SDK.'}
            code={sdkCode}
            language="typescript"
            filename="app/api/users.ts"
            showLineNumbers
          />
        </AnimateOnScroll>

        {/* ============================================================
           5. Air Pocket Feature — 競合優位性（muted）
           ============================================================ */}
        <AnimateOnScroll animation="fade-up">
          <AirPocketFeature
            eyebrow={isJa ? 'なぜPolastackか' : 'WHY POLASTACK'}
            title={isJa ? '他では解決できない課題を解く' : 'Solving problems others can\'t'}
            background="muted"
            airPockets={
              isJa
                ? [
                    { module: 'PolaFind', headline: '打ち間違えても、見つかる。', description: '日本語typo tolerant全文検索を標準搭載。100万件でもミリ秒。', proof: '競合完全不在の差別化領域', competitors: [{ name: 'kintone', status: '部分一致のみ' }, { name: 'Supabase', status: 'PGroonga必要' }] },
                    { module: 'PolaStore', headline: '見せたい情報だけ見せる。', description: 'FLS + 監査ログをDB最下層で強制。SOC2/ISMS対応を標準充足。', proof: 'アプリコードに依存しないセキュリティ', competitors: [{ name: 'kintone', status: 'FLS部分対応' }, { name: 'Supabase', status: 'FLS未成熟' }] },
                    { module: 'PolaLens', headline: 'SQLなしで分析できる。', description: 'セマンティックレイヤーで非エンジニアもメトリクス定義可能。', proof: '6競合いずれも標準提供なし', competitors: [{ name: 'kintone', status: '非対応' }, { name: 'Supabase', status: '非対応' }] },
                  ]
                : [
                    { module: 'PolaFind', headline: 'Find it even with typos.', description: 'Japanese typo-tolerant full-text search built-in. Milliseconds even with 1M records.', proof: 'Zero competitors in this space', competitors: [{ name: 'kintone', status: 'Partial match only' }, { name: 'Supabase', status: 'Needs PGroonga' }] },
                    { module: 'PolaStore', headline: 'Show only what you want.', description: 'FLS + audit logs enforced at DB layer. SOC2/ISMS compliant out of the box.', proof: 'Security independent of app code', competitors: [{ name: 'kintone', status: 'Partial FLS' }, { name: 'Supabase', status: 'FLS immature' }] },
                    { module: 'PolaLens', headline: 'Analyze without SQL.', description: 'Semantic layer lets non-engineers define metrics.', proof: 'No competitor offers this as standard', competitors: [{ name: 'kintone', status: 'Not supported' }, { name: 'Supabase', status: 'Not supported' }] },
                  ]
            }
          />
        </AnimateOnScroll>

        {/* ============================================================
           6. Bento Grid — DX機能群
           ============================================================ */}
        <AnimateOnScroll animation="scale">
          <BentoGrid
            eyebrow={isJa ? 'プラットフォーム' : 'PLATFORM'}
            title={isJa ? '開発チームが求める機能' : 'Built for development teams'}
            items={
              isJa
                ? [
                    { title: 'TypeScript SDK', description: '型安全なAPI呼び出し。スキーマからSDKを自動生成。', span: 2, variant: 'featured' },
                    { title: 'ダッシュボード', description: 'テナント管理・ユーザー管理・分析を一画面で。' },
                    { title: 'CLI', description: 'ターミナルからスキーマ定義・マイグレーション・デプロイ。' },
                    { title: 'CI/CD連携', description: 'GitHub Actions対応。PRごとにプレビュー環境を自動構築。', span: 2, variant: 'dark' },
                  ]
                : [
                    { title: 'TypeScript SDK', description: 'Type-safe API calls. Auto-generated SDK from schema.', span: 2, variant: 'featured' },
                    { title: 'Dashboard', description: 'Tenant management, user management, and analytics in one screen.' },
                    { title: 'CLI', description: 'Schema definition, migration, and deployment from your terminal.' },
                    { title: 'CI/CD Integration', description: 'GitHub Actions ready. Auto-provision preview environments per PR.', span: 2, variant: 'dark' },
                  ]
            }
          />
        </AnimateOnScroll>

        {/* ============================================================
           7. Stats — 実績数値（dark + animated）
           ============================================================ */}
        <AnimateOnScroll animation="fade-up">
          <StatsSection
            eyebrow={isJa ? '実績' : 'BY THE NUMBERS'}
            title={isJa ? '信頼の実績' : 'Proven results'}
            background="dark"
            animated
            stats={
              isJa
                ? [
                    { value: '500+', numericValue: 500, suffix: '+', label: '導入企業', description: 'スタートアップからエンタープライズまで' },
                    { value: '99.99%', numericValue: 99.99, suffix: '%', label: 'SLA稼働率' },
                    { value: '<10ms', label: '平均レイテンシ' },
                    { value: '11', numericValue: 11, label: '統合モジュール', description: '認証からホスティングまで' },
                  ]
                : [
                    { value: '500+', numericValue: 500, suffix: '+', label: 'Companies', description: 'From startups to enterprises' },
                    { value: '99.99%', numericValue: 99.99, suffix: '%', label: 'SLA uptime' },
                    { value: '<10ms', label: 'Avg latency' },
                    { value: '11', numericValue: 11, label: 'Modules', description: 'From auth to hosting' },
                  ]
            }
          />
        </AnimateOnScroll>

        {/* ============================================================
           8. Case Study — 導入事例
           ============================================================ */}
        <AnimateOnScroll animation="fade-up">
          <CaseStudySection
            eyebrow={isJa ? '導入事例' : 'CASE STUDIES'}
            title={isJa ? 'お客様の成功事例' : 'Customer success stories'}
            cases={
              isJa
                ? [
                    { companyName: 'テックスタートアップ株式会社', quote: '認証基盤を3週間で構築。以前はSaaS連携だけで2ヶ月かかっていた。', metrics: [{ label: '開発期間短縮', value: '80%' }, { label: '認証コード', value: '0行' }], href: '/cases/startup' },
                    { companyName: '人材サービス株式会社', quote: '100万件超のレコードでもPolaFindなら検索がミリ秒。業務効率が劇的に改善。', metrics: [{ label: '検索速度', value: '<50ms' }, { label: '対応レコード', value: '100万+' }], href: '/cases/hr' },
                  ]
                : [
                    { companyName: 'Tech Startup Inc.', quote: 'Built auth infrastructure in 3 weeks. SaaS integration alone used to take 2 months.', metrics: [{ label: 'Dev time reduced', value: '80%' }, { label: 'Auth code', value: '0 lines' }], href: '/cases/startup' },
                    { companyName: 'HR Services Inc.', quote: 'PolaFind delivers millisecond search even with 1M+ records. Dramatically improved operations.', metrics: [{ label: 'Search speed', value: '<50ms' }, { label: 'Records', value: '1M+' }], href: '/cases/hr' },
                  ]
            }
          />
        </AnimateOnScroll>

        {/* ============================================================
           9. Testimonials — 開発者の声（muted + rating）
           ============================================================ */}
        <AnimateOnScroll animation="fade-up">
          <TestimonialSection
            eyebrow={isJa ? 'お客様の声' : 'TESTIMONIALS'}
            title={isJa ? '開発者からの評価' : 'What developers say'}
            background="muted"
            testimonials={
              isJa
                ? [
                    { quote: '認証実装に3週間かけていたのが、PolaAuthで初日から本番レベルのSSO/SAMLが使えるようになった。', author: '鈴木一郎', role: 'CTO', company: 'テックスタートアップ株式会社', rating: 5 },
                    { quote: 'kintoneでは10万件を超えると検索が使い物にならなかったが、PolaFindなら100万件でもミリ秒。', author: '佐藤花子', role: '開発リード', company: '人材サービス株式会社', rating: 5 },
                    { quote: '11モジュール統合で、これまで個別に組み合わせていたSaaSの連携コストがゼロになった。', author: '高橋健太', role: 'VPoE', company: 'エンタープライズSaaS株式会社', rating: 4 },
                  ]
                : [
                    { quote: 'Auth that used to take 3 weeks now works from day one with PolaAuth — production-grade SSO/SAML.', author: 'Ichiro Suzuki', role: 'CTO', company: 'Tech Startup Inc.', rating: 5 },
                    { quote: 'Search was unusable with kintone past 100K records. PolaFind handles 1M+ in milliseconds.', author: 'Hanako Sato', role: 'Dev Lead', company: 'HR Services Inc.', rating: 5 },
                    { quote: '11 integrated modules eliminated the integration costs of combining separate SaaS tools.', author: 'Kenta Takahashi', role: 'VPoE', company: 'Enterprise SaaS Inc.', rating: 4 },
                  ]
            }
          />
        </AnimateOnScroll>

        {/* ============================================================
           10. Comparison Table — 競合比較
           ============================================================ */}
        <AnimateOnScroll animation="fade-in">
          <ComparisonTable
            eyebrow={isJa ? '比較' : 'COMPARISON'}
            title={isJa ? 'なぜPolastackなのか' : 'Why Polastack'}
            columns={[
              { name: isJa ? '自前構築' : 'Build yourself' },
              { name: 'Firebase + α' },
              { name: 'Polastack', highlighted: true },
            ]}
            rows={
              isJa
                ? [
                    { feature: 'SSO/SAML', values: ['3-6週間実装', 'Auth0別契約', true] },
                    { feature: 'FLS（フィールドレベルセキュリティ）', values: ['自前実装', false, true] },
                    { feature: '監査ログ', values: ['自前実装', false, true] },
                    { feature: '全文検索（日本語typo tolerant）', values: ['Elasticsearch構築', false, true] },
                    { feature: 'セマンティック分析', values: ['BigQuery + dbt構築', false, true] },
                    { feature: 'SDK自動生成', values: [false, false, true] },
                    { feature: 'マルチテナント分離', values: ['自前設計', '手動', true] },
                    { feature: 'ゼロDevOpsホスティング', values: [false, true, true] },
                    { feature: '構築期間', values: ['13-26週', '6-10週', '3-5週'] },
                  ]
                : [
                    { feature: 'SSO/SAML', values: ['3-6 weeks', 'Auth0 addon', true] },
                    { feature: 'FLS (Field-Level Security)', values: ['Build yourself', false, true] },
                    { feature: 'Audit Logs', values: ['Build yourself', false, true] },
                    { feature: 'Full-text Search (JP typo tolerant)', values: ['Elasticsearch setup', false, true] },
                    { feature: 'Semantic Analytics', values: ['BigQuery + dbt setup', false, true] },
                    { feature: 'Auto SDK Generation', values: [false, false, true] },
                    { feature: 'Multi-tenant Isolation', values: ['Build yourself', 'Manual', true] },
                    { feature: 'Zero DevOps Hosting', values: [false, true, true] },
                    { feature: 'Time to Production', values: ['13-26 wks', '6-10 wks', '3-5 wks'] },
                  ]
            }
          />
        </AnimateOnScroll>

        {/* ============================================================
           11. Security Badges — エンタープライズ信頼（muted）
           ============================================================ */}
        <AnimateOnScroll animation="fade-in">
          <SecurityBadges
            eyebrow={isJa ? 'セキュリティ' : 'SECURITY'}
            title={isJa ? 'エンタープライズグレードのセキュリティ' : 'Enterprise-grade security'}
            subtitle={isJa ? '国際基準の認証を取得し、お客様のデータを安全に保護します。' : 'Certified to international standards, keeping your data safe.'}
            background="muted"
            badges={
              isJa
                ? [
                    { name: 'ISMS (ISO 27001)', icon: <ShieldCheck className="h-7 w-7 text-primary-500" />, description: '情報セキュリティ管理' },
                    { name: 'SOC 2 Type II', icon: <Lock className="h-7 w-7 text-primary-500" />, description: 'セキュリティ監査' },
                    { name: 'プライバシーマーク', icon: <FileCheck className="h-7 w-7 text-primary-500" />, description: '個人情報保護' },
                    { name: 'ISMAP', icon: <Award className="h-7 w-7 text-primary-500" />, description: '政府クラウド認定' },
                  ]
                : [
                    { name: 'ISMS (ISO 27001)', icon: <ShieldCheck className="h-7 w-7 text-primary-500" />, description: 'InfoSec management' },
                    { name: 'SOC 2 Type II', icon: <Lock className="h-7 w-7 text-primary-500" />, description: 'Security audit' },
                    { name: 'GDPR', icon: <FileCheck className="h-7 w-7 text-primary-500" />, description: 'Data protection' },
                    { name: 'ISMAP', icon: <Award className="h-7 w-7 text-primary-500" />, description: 'Gov cloud certification' },
                  ]
            }
          />
        </AnimateOnScroll>

        {/* ============================================================
           12. Pricing Table — 4層構造
           ============================================================ */}
        <AnimateOnScroll animation="fade-up">
          <PricingTable
            eyebrow={isJa ? '料金プラン' : 'PRICING'}
            title={isJa ? 'シンプルで透明な料金体系' : 'Simple, transparent pricing'}
            subtitle={isJa ? 'すべてのプランで全11モジュールが利用可能。' : 'All 11 modules on every plan.'}
            plans={[
              {
                name: 'Sandbox',
                description: isJa ? '技術検証・学習専用' : 'Evaluation & learning',
                price: <span className="text-display-sm font-bold tracking-tight md:text-display-md">¥0</span>,
                priceNote: isJa ? '本番運用不可' : 'Not for production',
                features: [
                  { text: isJa ? '全11モジュール' : 'All 11 modules', included: true },
                  { text: isJa ? '1ユーザー' : '1 user', included: true },
                  { text: isJa ? '本番環境' : 'Production', included: false },
                  { text: 'SSO/SAML', included: false },
                ],
                action: { label: isJa ? '無料で始める' : 'Start Free', href: '/signup', variant: 'secondary' as const },
              },
              {
                name: 'Growth',
                description: isJa ? '全利用者向け統一プラン' : 'Unified plan for all',
                badge: isJa ? 'おすすめ' : 'Recommended',
                highlighted: true,
                price: <span className="text-display-sm font-bold tracking-tight md:text-display-md">¥30,000<span className="text-body-md font-normal text-neutral-500">{isJa ? '/月' : '/mo'}</span></span>,
                priceNote: isJa ? '税別' : 'excl. tax',
                features: [
                  { text: isJa ? '全11モジュール統合' : 'All 11 modules', included: true },
                  { text: isJa ? 'メール + チャットサポート' : 'Email + chat support', included: true },
                  { text: isJa ? 'ストレージ 30GB' : '30GB storage', included: true },
                  { text: isJa ? 'SSO/SAML（オプション）' : 'SSO/SAML (addon)', included: true },
                ],
                action: { label: isJa ? '申し込む' : 'Get Started', href: '/signup/growth', variant: 'primary' as const },
              },
              {
                name: 'Partner',
                description: isJa ? 'ISV/受託開発会社向け' : 'For ISVs & agencies',
                price: <span className="text-display-sm font-bold tracking-tight md:text-display-md">¥50,000<span className="text-body-md font-normal text-neutral-500">{isJa ? '/月' : '/mo'}</span></span>,
                priceNote: isJa ? '承認制' : 'Approval required',
                features: [
                  { text: isJa ? '顧客テナント作成' : 'Customer tenants', included: true },
                  { text: isJa ? 'End User課金' : 'End User billing', included: true },
                  { text: isJa ? 'ティア昇格で割引' : 'Tier discounts', included: true },
                  { text: isJa ? '優先サポート' : 'Priority support', included: true },
                ],
                action: { label: isJa ? 'パートナー申請' : 'Apply', href: '/partner', variant: 'secondary' as const },
              },
              {
                name: 'Self-Hosted',
                description: isJa ? '顧客インフラにデプロイ' : 'Your infrastructure',
                price: <span className="text-display-sm font-bold tracking-tight md:text-display-md">{isJa ? 'カスタム' : 'Custom'}</span>,
                priceNote: isJa ? 'データ主権対応' : 'Data sovereignty',
                features: [
                  { text: 'SLA', included: true },
                  { text: isJa ? 'SSO/SCIM込み' : 'SSO/SCIM included', included: true },
                  { text: isJa ? 'オンプレミス' : 'On-premise', included: true },
                  { text: isJa ? 'CTO直通Slack' : 'Direct CTO Slack', included: true },
                ],
                action: { label: isJa ? 'お問い合わせ' : 'Contact Sales', href: '/contact', variant: 'secondary' as const },
              },
            ]}
          />
        </AnimateOnScroll>

        {/* ============================================================
           13. FAQ — 充実版（muted）
           ============================================================ */}
        <AnimateOnScroll animation="fade-in">
          <FAQSection
            eyebrow="FAQ"
            title={isJa ? 'よくある質問' : 'Frequently Asked Questions'}
            background="muted"
            items={
              isJa
                ? [
                    { question: 'Polastackとは何ですか？', answer: 'AIエージェント（Claude Code、Cursor等）にAPI仕様を渡すだけで、エンタープライズ品質の検索・分析・認証基盤が即座に立ち上がる業務アプリ開発プラットフォームです。11の統合モジュールで構成されています。' },
                    { question: 'SandboxからGrowthプランへの移行時にデータは引き継がれますか？', answer: 'はい。Sandboxのデータと設定はGrowthプランに完全に引き継がれます。環境変更の工数はほぼゼロです。' },
                    { question: 'Supabaseとの違いは何ですか？', answer: 'Polastackは11モジュール統合で、SSO・FLS・監査ログ・分析基盤・全文検索・課金が標準に含まれます。Supabaseはこれらを個別に組み合わせる必要があります。' },
                    { question: 'kintoneからの乗り換えは可能ですか？', answer: 'はい。データ移行支援プログラムを提供しています。100万件超のデータ量に対応し、typo tolerant検索・FLS・監査ログも標準搭載です。' },
                    { question: 'フロントエンド技術スタックを変更する必要はありますか？', answer: 'いいえ。ヘッドレスアーキテクチャなので、React / Next.js / Vue等の好きなフレームワークで開発できます。' },
                    { question: '開発から本番デプロイまでの期間は？', answer: '従来の13-26週間から3-5週間に短縮できます。開発者はビジネスロジックだけに集中できるためです。' },
                  ]
                : [
                    { question: 'What is Polastack?', answer: 'An Enterprise Agent Stack — pass API specs to an AI agent and enterprise-grade search, analytics, and auth infrastructure spins up instantly. 11 integrated modules.' },
                    { question: 'Is data preserved when upgrading from Sandbox?', answer: 'Yes. All Sandbox data and configurations are fully preserved when upgrading to Growth.' },
                    { question: 'How is Polastack different from Supabase?', answer: 'Polastack includes SSO, FLS, audit logs, analytics, full-text search, and billing as integrated features across 11 modules.' },
                    { question: 'Can I migrate from kintone?', answer: 'Yes. We provide migration support. Handles 1M+ records with typo-tolerant search, FLS, and audit logs built-in.' },
                    { question: 'Do I need to change my frontend stack?', answer: 'No. Polastack is headless — use React, Next.js, Vue, or any framework.' },
                    { question: 'How long to production?', answer: 'From 13-26 weeks down to 3-5 weeks. Focus solely on business logic.' },
                  ]
            }
          />
        </AnimateOnScroll>

        {/* ============================================================
           14. Final CTA — dark + mesh + socialProof
           ============================================================ */}
        <AnimateOnScroll animation="blur-in">
          <CTASection
            background="dark"
            backgroundMesh
            title={isJa ? '今日から、開発を加速させよう' : 'Accelerate your development today'}
            subtitle={isJa ? '無料プランで即座に開始。クレジットカード不要。' : 'Start instantly with a free plan. No credit card required.'}
            actions={[
              { label: isJa ? '無料で始める' : 'Get Started Free', href: '/signup', variant: 'gradient' },
              { label: isJa ? 'デモを予約' : 'Book a Demo', href: '/demo', variant: 'secondary' },
            ]}
            socialProof={isJa ? '500+ 社が導入' : 'Trusted by 500+ companies'}
            note={isJa ? 'クレジットカード不要 | 5分でデプロイ' : 'No credit card required | Deploy in 5 min'}
          />
        </AnimateOnScroll>
      </PageLayout>
    );
  },
};
