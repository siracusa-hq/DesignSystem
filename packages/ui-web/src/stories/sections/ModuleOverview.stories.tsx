import type { Meta, StoryObj } from '@storybook/react';
import { ModuleOverview } from '../../components/sections/module-overview';

const meta: Meta<typeof ModuleOverview> = {
  title: 'Sections/ModuleOverview',
  component: ModuleOverview,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof ModuleOverview>;

export const Default: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <ModuleOverview
        eyebrow={isJa ? 'アーキテクチャ' : 'ARCHITECTURE'}
        title={isJa ? '6レイヤー × 11モジュール' : '6 Layers × 11 Modules'}
        subtitle={
          isJa
            ? 'AIがコードを書く時代。業務に耐える裏側は、Polastackが引き受ける。'
            : 'In the age of AI-generated code, Polastack handles the enterprise backend.'
        }
        background="dark"
        layers={
          isJa
            ? [
                {
                  name: 'L0: DX層',
                  modules: [
                    { name: 'PolaKey', label: 'DX', description: '統合DXプラットフォーム・SDK・CLI・管理GUI・API Docs' },
                    { name: 'PolaVault', label: 'CaC', description: '統合CaCエンジン・テナントシークレット管理・設定ドリフト防止' },
                  ],
                },
                {
                  name: 'L1: フロントエンド層',
                  modules: [
                    { name: 'PolaNest', label: 'ホスティング', description: 'GitOps・PRプレビュー・Zero DevOps' },
                  ],
                },
                {
                  name: 'L2: API & セキュリティ層',
                  modules: [
                    { name: 'PolaAuth', label: '認証', description: 'WorkOS統合・SSO/SAML/SCIM・Day 1から標準搭載' },
                    { name: 'PolaGate', label: 'Gateway', description: '統合エッジAPI・SDK/MCP/OpenAPI自動生成' },
                  ],
                },
                {
                  name: 'L3: コア・データ層',
                  modules: [
                    { name: 'PolaStore', label: 'DB', description: 'メタデータ駆動DB・RLS/FLS・監査ログ・DB最下層でセキュリティ強制' },
                  ],
                },
                {
                  name: 'L4: 拡張データ & 連携層',
                  modules: [
                    { name: 'PolaCast', label: '連携', description: 'イベント駆動型外部連携ハブ・CDC・Webhook' },
                    { name: 'PolaLens', label: '分析', description: '分析・セマンティック基盤・BigQuery + Cube Dynamic Schema' },
                    { name: 'PolaFind', label: '検索', description: '超高速全文検索・日本語typo tolerant・Meilisearchベース' },
                  ],
                },
                {
                  name: 'L5: 運用・課金層',
                  modules: [
                    { name: 'PolaWatch', label: '監視', description: '可観測性・テナント管理コントロールプレーン' },
                    { name: 'PolaBill', label: '課金', description: '課金・決済・請求基盤・Stripe Billing統合' },
                  ],
                },
              ]
            : [
                {
                  name: 'L0: DX Layer',
                  modules: [
                    { name: 'PolaKey', label: 'DX', description: 'Unified DX platform — SDK, CLI, admin GUI, API Docs' },
                    { name: 'PolaVault', label: 'CaC', description: 'Unified CaC engine, tenant secrets, drift prevention' },
                  ],
                },
                {
                  name: 'L1: Frontend Layer',
                  modules: [
                    { name: 'PolaNest', label: 'Hosting', description: 'GitOps, PR previews, Zero DevOps' },
                  ],
                },
                {
                  name: 'L2: API & Security Layer',
                  modules: [
                    { name: 'PolaAuth', label: 'Auth', description: 'WorkOS-powered SSO/SAML/SCIM from Day 1' },
                    { name: 'PolaGate', label: 'Gateway', description: 'Unified edge API, auto-generate SDK/MCP/OpenAPI' },
                  ],
                },
                {
                  name: 'L3: Core Data Layer',
                  modules: [
                    { name: 'PolaStore', label: 'DB', description: 'Metadata-driven DB, RLS/FLS, audit logs enforced at DB layer' },
                  ],
                },
                {
                  name: 'L4: Extended Data & Integration Layer',
                  modules: [
                    { name: 'PolaCast', label: 'Integration', description: 'Event-driven integration hub, CDC, Webhooks' },
                    { name: 'PolaLens', label: 'Analytics', description: 'Analytics & semantic layer, BigQuery + Cube Dynamic Schema' },
                    { name: 'PolaFind', label: 'Search', description: 'Ultra-fast full-text search, Japanese typo tolerant, Meilisearch' },
                  ],
                },
                {
                  name: 'L5: Operations & Billing Layer',
                  modules: [
                    { name: 'PolaWatch', label: 'Monitoring', description: 'Observability & tenant control plane' },
                    { name: 'PolaBill', label: 'Billing', description: 'Billing & payments, Stripe Billing integration' },
                  ],
                },
              ]
        }
      />
    );
  },
};
