import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { LeadershipSection, type LeadershipMember } from './leadership';

const members: LeadershipMember[] = [
  {
    role: '代表取締役 CEO',
    name: '金子 卓也',
    nameEn: 'KANEKO Takuya',
    bio: 'GTM 戦略とパートナーシップを統括。',
  },
  { role: '取締役 CTO', name: '立花 直人', bio: 'Polastack のアーキテクチャを担当。' },
];

describe('LeadershipSection', () => {
  it('役職・氏名・略歴を出す', () => {
    render(<LeadershipSection title="経営陣" members={members} />);
    expect(screen.getByText('代表取締役 CEO')).toBeInTheDocument();
    expect(screen.getByText('金子 卓也')).toBeInTheDocument();
    expect(screen.getByText('GTM 戦略とパートナーシップを統括。')).toBeInTheDocument();
  });

  it('写真の alt を出す（人物と文脈を書くため）', () => {
    render(
      <LeadershipSection
        title="経営陣"
        members={[
          { ...members[0], photo: { src: '/ceo.jpg', alt: '代表取締役 CEO 金子 卓也の顔写真' } },
        ]}
      />,
    );
    expect(screen.getByAltText('代表取締役 CEO 金子 卓也の顔写真')).toBeInTheDocument();
  });

  it('写真が無ければイニシャルで枠を保つ（装飾なので支援技術には出さない）', () => {
    const { container } = render(<LeadershipSection title="経営陣" members={members} />);
    const initial = container.querySelector('.initial');
    expect(initial).toHaveTextContent('金');
    expect(initial).toHaveAttribute('aria-hidden', 'true');
  });

  it('2名までは2列、3名以上は3列（列数は件数から導出する）', () => {
    const { container: two } = render(<LeadershipSection members={members} />);
    expect(two.querySelector('.cols2')).toBeInTheDocument();

    const { container: three } = render(
      <LeadershipSection members={[...members, { role: '取締役', name: '佐藤 花子' }]} />,
    );
    expect(three.querySelector('.cols3')).toBeInTheDocument();
  });

  it('a11y違反がない', async () => {
    const { container } = render(<LeadershipSection title="経営陣" members={members} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
