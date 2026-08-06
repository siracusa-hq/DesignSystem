import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { FloatingCornerCTA } from './floating-corner-cta';
import { PageLayout } from '@/components/layout/page-layout';
import { createCTAClickCapture, type PageCTA } from '@/lib/cta-click';

const actions = [
  { label: '資料をダウンロード', href: '#dl' },
  { label: '料金を見る', href: '#price' },
];

const card = (
  <FloatingCornerCTA
    title="まずは資料からご覧ください"
    description="無料・1分で完了"
    actions={actions}
  />
);

describe('FloatingCornerCTA', () => {
  it('タイトル・補足・2オファーを描画し、1つ目が cta / 2つ目が secondary', () => {
    render(card);
    expect(screen.getByText('まずは資料からご覧ください')).toBeInTheDocument();
    expect(screen.getByText('無料・1分で完了')).toBeInTheDocument();
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveClass('cta');
    expect(links[1]).toHaveClass('secondary');
  });

  it('actions は最大2件に切り詰める', () => {
    render(
      <FloatingCornerCTA
        title="t"
        actions={[
          { label: 'a', href: '#' },
          { label: 'b', href: '#' },
          { label: 'c', href: '#' },
        ]}
      />,
    );
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('右下フローティング（position: fixed のクラス）として描画される', () => {
    const { container } = render(card);
    expect(container.querySelector('aside')).toHaveClass('card');
  });

  it('タイトルは見出しタグではない（本文のアウトラインを汚さない）', () => {
    render(card);
    expect(screen.queryByRole('heading')).toBeNull();
  });

  it('カードは role="complementary" + aria-label（既定は title）', () => {
    render(card);
    const region = screen.getByRole('complementary');
    expect(region).toHaveAttribute('aria-label', 'まずは資料からご覧ください');
  });

  it('領域の読み上げ名は labels.region で差し替えられる', () => {
    render(
      <FloatingCornerCTA title="t" actions={actions} labels={{ region: '資料請求のご案内' }} />,
    );
    expect(screen.getByRole('complementary')).toHaveAttribute('aria-label', '資料請求のご案内');
  });

  it('× ボタンは常に描画され、既定の読み上げ名は「閉じる」', () => {
    render(card);
    expect(screen.getByRole('button', { name: '閉じる' })).toBeInTheDocument();
  });

  it('× の読み上げ名は labels.close で差し替えられる', () => {
    render(<FloatingCornerCTA title="t" actions={actions} labels={{ close: 'Dismiss' }} />);
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('× を押すとカードが消え、onDismiss が発火する', () => {
    const onDismiss = vi.fn();
    render(
      <FloatingCornerCTA title="まずは資料からご覧ください" actions={actions} onDismiss={onDismiss} />,
    );
    fireEvent.click(screen.getByRole('button', { name: '閉じる' }));
    expect(screen.queryByRole('complementary')).toBeNull();
    expect(screen.queryAllByRole('link')).toHaveLength(0);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('閉じたあとは再描画されても復活しない（永続化はしないが再表示もしない）', () => {
    const { rerender } = render(card);
    fireEvent.click(screen.getByRole('button', { name: '閉じる' }));
    rerender(card);
    rerender(
      <FloatingCornerCTA title="別のコピーに差し替え" description="d" actions={actions} />,
    );
    expect(screen.queryByRole('complementary')).toBeNull();
  });

  it('onDismiss 未指定でも閉じられる', () => {
    render(card);
    fireEvent.click(screen.getByRole('button', { name: '閉じる' }));
    expect(screen.queryByRole('complementary')).toBeNull();
  });

  it('data-cta に floating-${i} を自動割当する', () => {
    render(card);
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('data-cta', 'floating-0');
    expect(links[1]).toHaveAttribute('data-cta', 'floating-1');
  });

  it('PageLayout 配下ではクリックが委譲される（Page の外に出る部品）', () => {
    const seen: PageCTA[] = [];
    render(
      <PageLayout
        footer={card}
        onClickCapture={createCTAClickCapture<HTMLDivElement>((cta) => seen.push(cta), undefined)}
      >
        <div>本文</div>
      </PageLayout>,
    );
    fireEvent.click(screen.getByText('料金を見る'));
    expect(seen).toEqual([{ id: 'floating-1', label: '料金を見る', href: '#price' }]);
  });

  it('a11y 違反なし', async () => {
    const { container } = render(card);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('ref はカード要素に届く', () => {
    const ref = React.createRef<HTMLElement>();
    render(<FloatingCornerCTA ref={ref} title="t" actions={actions} />);
    expect(ref.current?.tagName).toBe('ASIDE');
  });
});
