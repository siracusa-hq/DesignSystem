import type { Meta, StoryObj } from '@storybook/react';
import { SlidePreview } from '../../components/slides/slide-preview';
import {
  SlideThemeProvider,
  PTitleSlide, PAgendaSlide, PSectionDividerSlide, PEndSlide, PTeamSlide,
  PBulletSlide, PComparisonSlide, PThreeColumnSlide, PStatSlide,
  PMetricHighlightSlide, PBeforeAfterMetricSlide, PQuoteSlide,
  PFlowSlide, PLogoGridSlide, PSecuritySlide, PROISlide, PQASlide,
} from '../../components/slides/slide-content';

const meta: Meta = {
  title: 'Slides/All Layouts',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const AllLayouts: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <SlideThemeProvider dark={globals.theme !== 'light'}>
      <SlidePreview dark={globals.theme !== 'light'}>
        <PTitleSlide badge="Structure" title="1. TitleSlide" subtitle={isJa ? '表紙・セクション区切り' : 'Cover & section divider'} />

        <PAgendaSlide
          title={isJa ? '2. AgendaSlide — 目次' : '2. AgendaSlide'}
          items={[
            { number: '01', label: isJa ? '課題' : 'Problem' },
            { number: '02', label: isJa ? '解決策' : 'Solution' },
            { number: '03', label: isJa ? '実績' : 'Traction' },
          ]}
          activeIndex={1}
        />

        <PSectionDividerSlide sectionNumber="03" title="3. SectionDividerSlide" subtitle={isJa ? 'セクション区切り' : 'Section divider'} />

        <PEndSlide
          title={isJa ? '4. EndSlide' : '4. EndSlide'}
          subtitle={isJa ? 'CTA・連絡先エンディング' : 'CTA & contact ending'}
          ctaLabel={isJa ? '無料トライアル' : 'Free Trial'}
          contactItems={[{ label: 'Email', value: 'contact@polastack.io' }, { label: 'Web', value: 'polastack.io' }]}
        />

        <PTeamSlide
          title={isJa ? '5. TeamSlide — チーム' : '5. TeamSlide'}
          members={[
            { name: isJa ? '田中' : 'Tanaka', role: 'CEO' },
            { name: isJa ? '鈴木' : 'Suzuki', role: 'CTO' },
            { name: isJa ? '佐藤' : 'Sato', role: 'VP Eng' },
          ]}
        />

        <PBulletSlide
          title={isJa ? '6. BulletSlide — 箇条書き' : '6. BulletSlide'}
          items={[
            { text: isJa ? '認証基盤の構築が不要' : 'No auth infrastructure needed' },
            { text: isJa ? 'SDK自動生成' : 'Auto SDK generation' },
            { text: isJa ? '全文検索が標準搭載' : 'Full-text search built-in' },
          ]}
        />

        <PComparisonSlide
          title={isJa ? '7. ComparisonSlide — 比較' : '7. ComparisonSlide'}
          leftHeader={isJa ? '従来' : 'Before'}
          rightHeader="Polastack"
          leftItems={[isJa ? '認証3週間' : 'Auth: 3 weeks', isJa ? '手動API' : 'Manual API']}
          rightItems={[isJa ? 'コード0行' : '0 lines', isJa ? 'SDK自動生成' : 'Auto SDK']}
        />

        <PThreeColumnSlide
          title={isJa ? '8. ThreeColumnSlide — 3カラム' : '8. ThreeColumnSlide'}
          columns={[
            { title: isJa ? '高速' : 'Fast', description: isJa ? '<50msレスポンス' : 'Sub-50ms response' },
            { title: isJa ? '安全' : 'Secure', description: isJa ? 'エンタープライズセキュリティ' : 'Enterprise security' },
            { title: isJa ? '統合' : 'Integrated', description: isJa ? '11モジュール一体型' : '11 modules unified' },
          ]}
        />

        <PStatSlide
          title={isJa ? '9. StatSlide — 数値' : '9. StatSlide'}
          stats={[{ value: '70%', label: isJa ? '時間短縮' : 'Time saved' }, { value: '11', label: isJa ? 'モジュール' : 'Modules' }, { value: '99.9%', label: 'SLA' }]}
        />

        <PFlowSlide
          title={isJa ? '10. FlowSlide — フロー' : '10. FlowSlide'}
          steps={[
            { title: isJa ? '定義' : 'Define' },
            { title: isJa ? '生成' : 'Generate' },
            { title: isJa ? '開発' : 'Develop' },
            { title: isJa ? 'デプロイ' : 'Deploy' },
          ]}
        />

        <PMetricHighlightSlide
          context={isJa ? '11. MetricHighlightSlide — 開発時間を' : '11. MetricHighlightSlide — Development time'}
          value="70"
          suffix="%"
          description={isJa ? '削減' : 'reduction'}
        />

        <PBeforeAfterMetricSlide
          title={isJa ? '12. BeforeAfterMetricSlide' : '12. BeforeAfterMetricSlide'}
          beforeValue="26wk"
          beforeLabel={isJa ? '従来' : 'Traditional'}
          afterValue="5wk"
          afterLabel="Polastack"
          improvement="80%↓"
        />

        <PQuoteSlide
          quote={isJa ? '13. QuoteSlide — テスティモニアル引用' : '13. QuoteSlide — Testimonial'}
          author={isJa ? '田中太郎' : 'Taro Tanaka'}
          role="CTO"
          company="Example Inc."
        />

        <PLogoGridSlide title={isJa ? '14. LogoGridSlide — 導入企業' : '14. LogoGridSlide'} />

        <PSecuritySlide
          title={isJa ? '15. SecuritySlide — セキュリティ' : '15. SecuritySlide'}
          items={['ISO 27001', 'SOC 2', isJa ? 'Pマーク' : 'GDPR', 'ISMAP']}
        />

        <PROISlide
          title={isJa ? '16. ROISlide — ROI試算' : '16. ROISlide'}
          items={[
            { category: isJa ? '人件費' : 'Labor', before: '$120K', after: '$36K', savings: '$84K' },
            { category: 'SaaS', before: '$30K', after: '$0', savings: '$30K' },
          ]}
          totalROI="$114K/yr"
        />

        <PQASlide
          title={isJa ? '17. QASlide — Q&A' : '17. QASlide'}
          items={[
            { question: isJa ? '無料プランはありますか？' : 'Is there a free plan?', answer: isJa ? 'はい。Starterは無料です。' : 'Yes. Starter is free.' },
            { question: isJa ? 'オンプレ対応？' : 'On-premise?', answer: isJa ? 'Enterpriseで対応可能。' : 'Available on Enterprise.' },
          ]}
        />
      </SlidePreview>
      </SlideThemeProvider>
    );
  },
};
