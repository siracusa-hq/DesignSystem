import type { Meta, StoryObj } from '@storybook/react';
import { ProseSection } from '../../components/sections/prose-section';

/**
 * ProseSection — 箇条書きに割れない文章を置くための唯一のセクション。
 *
 * **GUIDELINES §3 の「セクション内の散文は見出し1文だけ」は説明セクションの規則**で、
 * 読み物の面（ミッション・代表挨拶）には適用しない。機能説明をここへ流し込むのは
 * 規則の迂回にあたるため、段落が5つ以上あると dev 警告が出る。
 */
const meta: Meta<typeof ProseSection> = {
  title: 'Sections/ProseSection',
  component: ProseSection,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof ProseSection>;

/** ミッション（署名なし） */
export const Mission: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <ProseSection
        title={
          isJa ? '意思決定の速度を、組織の大きさから切り離す' : 'Decisions that scale with the team'
        }
        paragraphs={
          isJa
            ? [
                '企業が大きくなるほど、判断は遅くなります。情報が部署に散らばり、確認の往復が増え、決めるべき人の手元に材料が揃うころには状況が変わっている。私たちはこれを、組織の宿命ではなく道具の問題だと考えています。',
                'Polastack は、社内に散在する業務システムの上で、エージェントが調べ・まとめ・下書きまでを担う基盤です。人が判断に集中できる状態をつくること。それが私たちの仕事です。',
              ]
            : [
                'The larger a company grows, the slower it decides. Information scatters across teams, confirmations pile up, and by the time the material reaches the person who must decide, the situation has moved on.',
                'Polastack is a platform where agents research, summarise and draft on top of the systems a company already runs. Our job is to leave people with the decision itself.',
              ]
        }
      />
    );
  },
};

/** 代表挨拶（署名 + 全文への導線） */
export const Message: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <ProseSection
        title={isJa ? '代表挨拶' : 'Message from the CEO'}
        paragraphs={
          isJa
            ? [
                '創業から2年、私たちは一貫して「人が判断に集中できる状態」をつくることに時間を使ってきました。技術の新しさそのものを売るのではなく、現場の手触りが変わったかどうかを唯一の基準にしています。',
                '受託と自社プロダクトの両方を続けているのも同じ理由です。実際の業務に入り込まなければ、どこで人の時間が溶けているかは分かりません。',
              ]
            : [
                'For two years we have spent our time on one thing: leaving people with the decision itself. We do not sell novelty; we ask whether the day-to-day actually changed.',
                'That is also why we keep doing both client work and our own products. You cannot see where time drains away unless you are inside the work.',
              ]
        }
        signature={{
          role: isJa ? '代表取締役 CEO' : 'Co-founder & CEO',
          name: isJa ? '金子 卓也' : 'Takuya Kaneko',
        }}
        moreLink={{
          label: isJa ? '全文を読む' : 'Read the full message',
          href: '/company/message',
        }}
      />
    );
  },
};

/**
 * 段落が5つ以上あると dev 警告が出る。
 * ブラウザのコンソールで確認できる（説明セクションの代用として使われるのを防ぐため）。
 */
export const TooManyParagraphs: Story = {
  render: () => (
    <ProseSection
      title="説明を流し込んだ例（警告が出る）"
      paragraphs={[
        '1つ目の段落です。',
        '2つ目の段落です。',
        '3つ目の段落です。',
        '4つ目の段落です。',
        '5つ目の段落です。ここで dev 警告が出ます。',
      ]}
    />
  ),
};
