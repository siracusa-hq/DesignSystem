import type { Meta, StoryObj } from '@storybook/react';
import { AirPocketFeature } from '../../components/sections/air-pocket-feature';

/**
 * 競合が埋めていない「空隙」を1件ずつ交互に見せる帯。
 *
 * コピーの規範（ブランド決定 2026-08-11）: 散文は headline の**1文だけ**。
 * 数値は proof（大きく表示される）へ、仕様・要点は points（最大3点・型で制限）へ。
 * 説明の段落スロットは存在しない — ダラダラした文章の温床だったため廃止した。
 */
const meta: Meta<typeof AirPocketFeature> = {
  title: 'Sections/AirPocketFeature',
  component: AirPocketFeature,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof AirPocketFeature>;

const Placeholder: React.FC<{ label: string }> = ({ label }) => (
  <div
    style={{
      height: '13rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-card)',
      background: 'var(--color-surface-muted)',
      color: 'var(--color-on-surface-muted)',
      fontSize: 'var(--text-body-sm)',
    }}
  >
    {label}
  </div>
);

export const ThreeAirPockets: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <AirPocketFeature
        title={isJa ? '3つのエアポケット' : '3 Air Pockets'}
        subtitle={
          isJa
            ? '競合が標準提供していない、Polastack独自の差別化領域。'
            : 'Differentiation areas where no competitor offers as standard.'
        }
        airPockets={
          isJa
            ? [
                {
                  module: 'PolaFind',
                  headline: '打ち間違えても、見つかる。',
                  points: [
                    '「田中」「たなか」「Tanaka」を横断して検索',
                    'タイプミスを許容する日本語全文検索を標準搭載',
                  ],
                  proof: { value: '100万件 → ミリ秒', label: '全文検索の応答' },
                  competitors: [
                    { name: 'kintone', status: '部分一致のみ' },
                    { name: 'Supabase', status: 'PGroonga拡張が必要' },
                  ],
                  visual: <Placeholder label="PolaFind Demo" />,
                },
                {
                  module: 'PolaStore',
                  headline: '見せたい情報だけ、見せる。',
                  points: [
                    '列単位のアクセス制御をデータベース最下層で強制',
                    '閲覧・変更をすべて監査ログに記録',
                  ],
                  proof: { value: 'SOC2 / ISMS', label: '要件を標準で充足' },
                  competitors: [
                    { name: 'kintone', status: 'FLS部分対応・詳細監査は有料' },
                    { name: 'Supabase', status: 'FLS未成熟・監査ログなし' },
                  ],
                  visual: <Placeholder label="PolaStore Security" />,
                },
                {
                  module: 'PolaLens',
                  headline: 'SQLを書かなくても、分析できる。',
                  points: [
                    'ドラッグ操作でメトリクスを定義・集計',
                    '事前集計により業務データベースに負荷をかけない',
                  ],
                  proof: { value: '数千万行 → ミリ秒', label: '集計クエリの応答' },
                  competitors: [
                    { name: 'kintone', status: '非対応' },
                    { name: 'Supabase', status: '非対応' },
                  ],
                  visual: <Placeholder label="PolaLens Dashboard" />,
                },
              ]
            : [
                {
                  module: 'PolaFind',
                  headline: 'Find it, even with typos.',
                  points: [
                    'Cross-search "田中", "たなか" and "Tanaka"',
                    'Typo-tolerant Japanese full-text search, built in',
                  ],
                  proof: { value: '1M rows → ms', label: 'Full-text search response' },
                  competitors: [
                    { name: 'kintone', status: 'Partial match only' },
                    { name: 'Supabase', status: 'Requires PGroonga extension' },
                  ],
                  visual: <Placeholder label="PolaFind Demo" />,
                },
                {
                  module: 'PolaStore',
                  headline: 'Show only what you intend to show.',
                  points: [
                    'Column-level access control enforced at the database layer',
                    'Every read and write recorded in the audit log',
                  ],
                  proof: { value: 'SOC2 / ISMS', label: 'Requirements met out of the box' },
                  competitors: [
                    { name: 'kintone', status: 'Partial FLS, detailed audit is paid' },
                    { name: 'Supabase', status: 'FLS immature, no audit logs' },
                  ],
                  visual: <Placeholder label="PolaStore Security" />,
                },
                {
                  module: 'PolaLens',
                  headline: 'Analyze without writing SQL.',
                  points: [
                    'Define and aggregate metrics with drag and drop',
                    'Pre-aggregation keeps load off the transaction DB',
                  ],
                  proof: { value: '10M rows → ms', label: 'Aggregation query response' },
                  competitors: [
                    { name: 'kintone', status: 'Not supported' },
                    { name: 'Supabase', status: 'Not supported' },
                  ],
                  visual: <Placeholder label="PolaLens Dashboard" />,
                },
              ]
        }
      />
    );
  },
};
