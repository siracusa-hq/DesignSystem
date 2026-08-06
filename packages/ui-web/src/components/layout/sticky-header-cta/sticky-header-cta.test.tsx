import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { StickyHeaderCTA } from './sticky-header-cta';
import { PageLayout } from '@/components/layout/page-layout';
import { createCTAClickCapture, type PageCTA } from '@/lib/cta-click';

const actions = [
  { label: '資料をダウンロード', href: '#dl' },
  { label: 'お問い合わせ', href: '#contact' },
];

const header = <StickyHeaderCTA actions={actions} />;

describe('StickyHeaderCTA', () => {
  it('CTA を2本描画し、1つ目が cta / 2つ目が secondary', () => {
    render(header);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent('資料をダウンロード');
    expect(links[0]).toHaveClass('cta');
    expect(links[1]).toHaveClass('secondary');
  });

  it('actions は最大2件に切り詰める', () => {
    render(
      <StickyHeaderCTA
        actions={[
          { label: 'a', href: '#' },
          { label: 'b', href: '#' },
          { label: 'c', href: '#' },
        ]}
      />,
    );
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('固定ヘッダー（position: fixed のクラス）として描画される', () => {
    const { container } = render(header);
    expect(container.querySelector('header')).toHaveClass('header');
  });

  it('高さぶんのスペーサーを内蔵し、固定ヘッダーの直後に出す', () => {
    const { container } = render(header);
    const spacer = container.querySelector('.spacer');
    expect(spacer).not.toBeNull();
    // 固定要素の直後の兄弟であること（本文を押し下げる位置）
    expect(container.querySelector('header')?.nextElementSibling).toBe(spacer);
    // 支援技術には読ませない
    expect(spacer).toHaveAttribute('aria-hidden', 'true');
  });

  it('CTA はモバイル 45vw / 40px を当てる .actions の直下に並ぶ', () => {
    const { container } = render(header);
    const box = container.querySelector('.actions');
    expect(box).not.toBeNull();
    // CSS 側で .actions > * に flex: 0 0 45vw / height: 2.5rem（実測値）が当たる
    expect(box?.children).toHaveLength(2);
    expect(box?.children[0].tagName).toBe('A');
  });

  it('ロゴは省略時に既定ロゴ、指定時は差し替わる', () => {
    const { container, rerender } = render(header);
    expect(container.querySelector('.logoBox svg')).not.toBeNull();
    rerender(<StickyHeaderCTA actions={actions} logo={<span data-testid="own-logo">ACME</span>} />);
    expect(screen.getByTestId('own-logo')).toBeInTheDocument();
  });

  it('ナビゲーションを持たない（フルナビは MarketingHeader の領分）', () => {
    render(header);
    expect(screen.queryByRole('navigation')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('data-cta に sticky-header-${i} を自動割当する', () => {
    render(header);
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('data-cta', 'sticky-header-0');
    expect(links[1]).toHaveAttribute('data-cta', 'sticky-header-1');
  });

  it('PageLayout 配下ではクリックが委譲される（Page の外に出る部品）', () => {
    const seen: PageCTA[] = [];
    render(
      <PageLayout
        header={header}
        onClickCapture={createCTAClickCapture<HTMLDivElement>((cta) => seen.push(cta), undefined)}
      >
        <div>本文</div>
      </PageLayout>,
    );
    fireEvent.click(screen.getByText('資料をダウンロード'));
    expect(seen).toEqual([{ id: 'sticky-header-0', label: '資料をダウンロード', href: '#dl' }]);
  });

  it('a11y 違反なし', async () => {
    const { container } = render(header);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('ref はヘッダー要素に届く', () => {
    const ref = React.createRef<HTMLElement>();
    render(<StickyHeaderCTA ref={ref} actions={actions} />);
    expect(ref.current?.tagName).toBe('HEADER');
  });
});
