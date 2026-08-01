import type { Meta, StoryObj } from '@storybook/react';
import { FeatureGrid } from '../../components/sections/feature-grid';

const meta: Meta<typeof FeatureGrid> = {
  title: 'Sections/FeatureGrid',
  component: FeatureGrid,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof FeatureGrid>;

const modulesJa = [
  { title: 'PolaKey', description: '統合DXプラットフォーム。SDK・CLI・管理GUI・API Docsを統一。' },
  { title: 'PolaVault', description: '統合CaCエンジン。テナントシークレット管理、設定ドリフト防止。' },
  { title: 'PolaAuth', description: '認証・アイデンティティ基盤。WorkOS統合でSSO/SAML/SCIMをDay 1から標準搭載。' },
  { title: 'PolaGate', description: '統合エッジAPI & Runtime Gateway。SDK・OpenAPI・MCPサーバーを自動生成。' },
  { title: 'PolaStore', description: 'メタデータ駆動DB & ガバナンス。RLS/FLS・監査ログをDB最下層で強制。' },
  { title: 'PolaFind', description: '超高速全文検索。日本語typo tolerant、Meilisearchベース。' },
  { title: 'PolaLens', description: '分析・セマンティック基盤。BigQuery + Cube Dynamic Schemaを統合。' },
  { title: 'PolaCast', description: 'イベント駆動型外部連携ハブ。CDC・Webhookをリアルタイム処理。' },
  { title: 'PolaWatch', description: '可観測性・テナント管理コントロールプレーン。分散トレーシング標準装備。' },
  { title: 'PolaNest', description: 'フロントエンド・ホスティング基盤。GitOps・PRプレビュー・Zero DevOps。' },
  { title: 'PolaBill', description: '課金・決済・請求基盤。Stripe Billing統合でサブスクリプション管理。' },
];

const modulesEn = [
  { title: 'PolaKey', description: 'Unified DX platform. SDK, CLI, admin GUI, API Docs in one place.' },
  { title: 'PolaVault', description: 'Unified CaC engine. Tenant secret management, drift prevention.' },
  { title: 'PolaAuth', description: 'Auth & identity. WorkOS-powered SSO/SAML/SCIM from Day 1.' },
  { title: 'PolaGate', description: 'Unified edge API & Runtime Gateway. Auto-generates SDK, OpenAPI, MCP server.' },
  { title: 'PolaStore', description: 'Metadata-driven DB & governance. RLS/FLS, audit logs enforced at DB layer.' },
  { title: 'PolaFind', description: 'Ultra-fast full-text search. Japanese typo tolerant, Meilisearch-based.' },
  { title: 'PolaLens', description: 'Analytics & semantic layer. BigQuery + Cube Dynamic Schema integrated.' },
  { title: 'PolaCast', description: 'Event-driven integration hub. Real-time CDC & Webhook processing.' },
  { title: 'PolaWatch', description: 'Observability & tenant control plane. Distributed tracing built-in.' },
  { title: 'PolaNest', description: 'Frontend hosting. GitOps, PR previews, Zero DevOps.' },
  { title: 'PolaBill', description: 'Billing & payments. Stripe Billing integration for subscription management.' },
];

export const ElevenModules: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <FeatureGrid
        eyebrow={isJa ? 'モジュール' : 'MODULES'}
        title={isJa ? '11の統合モジュール' : '11 Integrated Modules'}
        subtitle={
          isJa
            ? 'AIがコードを書く時代。業務に耐える裏側は、Polastackが引き受ける。'
            : 'In the age of AI-generated code, Polastack handles the enterprise backend.'
        }
        features={isJa ? modulesJa : modulesEn}
        columns={4}
      />
    );
  },
};

export const ThreeColumns: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    const features = (isJa ? modulesJa : modulesEn).slice(0, 3);
    return (
      <FeatureGrid
        title={isJa ? '主要機能' : 'Key Features'}
        features={features}
        columns={3}
        background="muted"
      />
    );
  },
};
