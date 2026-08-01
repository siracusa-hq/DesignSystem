import type { Meta, StoryObj } from '@storybook/react';
import { SlidePreview } from '../../components/slides/slide-preview';
import {
  SlideThemeProvider,
  PTitleSlide, PAgendaSlide, PSectionDividerSlide, PEndSlide,
  PBulletSlide, PComparisonSlide, PStatSlide, PMetricHighlightSlide,
  PQuoteSlide, PFlowSlide, PLogoGridSlide, PSecuritySlide,
  PROISlide, PBeforeAfterMetricSlide,
} from '../../components/slides/slide-content';

const meta: Meta = {
  title: 'Slides/SalesKit',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const PolastackPitchDeck: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <SlideThemeProvider dark={globals.theme !== 'light'}>
      <SlidePreview dark={globals.theme !== 'light'}>
        <PTitleSlide
          badge="Enterprise Agent Stack"
          title="Polastack"
          subtitle={isJa ? 'Agent Coding時代の、消えない複雑性を解決する。' : 'Solve the unsolvable complexity of the Agent Coding era.'}
        />

        <PAgendaSlide
          title={isJa ? '本日の流れ' : 'Agenda'}
          items={[
            { number: '01', label: isJa ? '課題' : 'Problem' },
            { number: '02', label: isJa ? '解決策' : 'Solution' },
            { number: '03', label: isJa ? '導入事例' : 'Case Studies' },
            { number: '04', label: isJa ? '料金・次のステップ' : 'Pricing & Next Steps' },
          ]}
        />

        <PSectionDividerSlide sectionNumber="01" title={isJa ? '課題' : 'Problem'} />

        <PMetricHighlightSlide
          context={isJa ? '開発時間の' : 'Of development time'}
          value="60-70"
          suffix="%"
          description={isJa ? 'は非機能要件に消えている。' : 'is lost to non-functional requirements.'}
        />

        <PBulletSlide
          title={isJa ? 'エンタープライズ開発の現実' : 'Enterprise dev reality'}
          items={[
            { text: isJa ? '認証実装に3-6週間' : 'Auth implementation: 3-6 weeks' },
            { text: isJa ? '検索同期コードの保守コスト' : 'Search sync code maintenance cost' },
            { text: isJa ? 'SaaS連携の複雑性が増大' : 'Growing SaaS integration complexity' },
            { text: isJa ? 'デプロイまで13-26週間' : '13-26 weeks to production' },
          ]}
        />

        <PSectionDividerSlide sectionNumber="02" title={isJa ? '解決策' : 'Solution'} />

        <PComparisonSlide
          title={isJa ? '従来のアプローチとの違い' : 'How we differ'}
          leftHeader={isJa ? '従来' : 'Before'}
          rightHeader="Polastack"
          leftItems={[isJa ? '認証実装3週間' : 'Auth: 3 weeks', isJa ? '検索同期コードの保守' : 'Search sync maintenance', isJa ? '13-26週でデプロイ' : '13-26 weeks to deploy']}
          rightItems={[isJa ? '認証コード0行' : 'Auth: 0 lines', isJa ? 'CDC自動同期' : 'CDC auto-sync', isJa ? '3-5週でデプロイ' : '3-5 weeks to deploy']}
        />

        <PFlowSlide
          title={isJa ? '導入の流れ' : 'How it works'}
          steps={[
            { title: isJa ? 'スキーマ定義' : 'Define Schema' },
            { title: isJa ? 'SDK生成' : 'Generate SDK' },
            { title: isJa ? '開発' : 'Develop' },
            { title: isJa ? 'デプロイ' : 'Deploy' },
          ]}
        />

        <PSectionDividerSlide sectionNumber="03" title={isJa ? '導入事例' : 'Case Studies'} />

        <PStatSlide
          title={isJa ? '導入実績' : 'By the numbers'}
          stats={[
            { value: '70%', label: isJa ? '開発時間短縮' : 'Dev time saved' },
            { value: '11', label: isJa ? '統合モジュール' : 'Modules' },
            { value: '99.9%', label: 'SLA' },
            { value: '<50ms', label: isJa ? '検索レスポンス' : 'Search response' },
          ]}
        />

        <PQuoteSlide
          quote={isJa ? '認証実装に3週間かけていたのが、PolaAuthで初日から本番レベルのSSO/SAMLが使えるようになった。' : 'Authentication that used to take 3 weeks now works from day one with PolaAuth.'}
          author={isJa ? '鈴木一郎' : 'Ichiro Suzuki'}
          role="CTO"
          company={isJa ? 'テックスタートアップ株式会社' : 'Tech Startup Inc.'}
        />

        <PLogoGridSlide title={isJa ? '導入企業' : 'Trusted by'} />

        <PSecuritySlide
          title={isJa ? 'セキュリティ・コンプライアンス' : 'Security & Compliance'}
          items={['ISO 27001', 'SOC 2 Type II', isJa ? 'プライバシーマーク' : 'Privacy Mark', 'ISMAP']}
        />

        <PSectionDividerSlide sectionNumber="04" title={isJa ? '料金・次のステップ' : 'Pricing & Next Steps'} />

        <PROISlide
          title={isJa ? '導入効果シミュレーション' : 'ROI Calculation'}
          items={[
            { category: isJa ? 'エンジニア人件費' : 'Engineer cost', before: isJa ? '¥12M/年' : '$120K/yr', after: isJa ? '¥3.6M/年' : '$36K/yr', savings: isJa ? '¥8.4M' : '$84K' },
            { category: isJa ? 'SaaS連携費用' : 'SaaS integration', before: isJa ? '¥3M/年' : '$30K/yr', after: '¥0', savings: isJa ? '¥3M' : '$30K' },
          ]}
          totalROI={isJa ? '年間 ¥11.4M 削減' : '$114K/yr savings'}
        />

        <PBeforeAfterMetricSlide
          title={isJa ? '開発期間の変化' : 'Development timeline'}
          beforeValue={isJa ? '26週' : '26 wks'}
          beforeLabel={isJa ? '従来の開発期間' : 'Traditional'}
          afterValue={isJa ? '5週' : '5 wks'}
          afterLabel="Polastack"
          improvement={isJa ? '80% 短縮' : '80% reduction'}
        />

        <PEndSlide
          title={isJa ? 'まずは無料で始めましょう' : "Let's get started"}
          subtitle={isJa ? 'クレジットカード不要。全11モジュールを今すぐ試せます。' : 'No credit card required. Try all 11 modules instantly.'}
          ctaLabel={isJa ? '無料トライアル開始' : 'Start Free Trial'}
          contactItems={[
            { label: 'Email', value: 'sales@polastack.io' },
            { label: 'Web', value: 'polastack.io' },
          ]}
        />
      </SlidePreview>
      </SlideThemeProvider>
    );
  },
};
