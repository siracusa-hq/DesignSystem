import * as React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { resolveAllBrands } from '@siracusahq/tokens';
import { Page, PAGE_BRANDS } from './page';
import { markPageSurface } from '@/lib/page-surface';
import styles from './page.module.css';

/* Page のリズムはコンポーネント実体に依存しないため、契約だけを持つ
   ダミーセクションで検証する（実セクションの構造変更に巻き込まれない） */
const Plain = ({ label }: { label: string }) => <section>{label}</section>;
const Dark = markPageSurface(
  ({ label }: { label: string }) => <section>{label}</section>,
  'dark',
);
const Conditional = markPageSurface(
  ({ label, night }: { label: string; night?: boolean }) => <section>{label}</section>,
  (p: { night?: boolean }) => (p.night ? 'dark' : 'default'),
);

const mutedSlotOf = (el: HTMLElement) => el.closest(`.${styles.slotMuted}`);

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Page', () => {
  it('brand / tone を data 属性で配下に伝播する（既定: corporate / product）', () => {
    const { container, rerender } = render(<Page />);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute('data-brand', 'corporate');
    expect(root).toHaveAttribute('data-tone', 'product');

    rerender(<Page brand="peerdesk" tone="campaign" />);
    expect(container.firstElementChild).toHaveAttribute('data-brand', 'peerdesk');
    expect(container.firstElementChild).toHaveAttribute('data-tone', 'campaign');
  });

  it('PAGE_BRANDS は brand-registry の全ブランド（配下製品含む）と一致する', () => {
    const registered = resolveAllBrands().map((b) => b.dataBrand);
    expect([...PAGE_BRANDS].sort()).toEqual(registered.sort());
  });

  it('面を default ↔ muted の交互に割り当てる（1つ目は default）', () => {
    const { getByText } = render(
      <Page>
        <Plain label="a" />
        <Plain label="b" />
        <Plain label="c" />
        <Plain label="d" />
      </Page>,
    );
    expect(mutedSlotOf(getByText('a'))).toBeNull();
    expect(mutedSlotOf(getByText('b'))).not.toBeNull();
    expect(mutedSlotOf(getByText('c'))).toBeNull();
    expect(mutedSlotOf(getByText('d'))).not.toBeNull();
  });

  it('自己申告の暗面には割り当てず、交互カウンタをリセットする（暗面直後は default）', () => {
    const { getByText } = render(
      <Page>
        <Plain label="a" />
        <Dark label="dark" />
        <Plain label="b" />
        <Plain label="c" />
      </Page>,
    );
    // a=default → dark は素通し → b は default から再開 → c=muted
    expect(mutedSlotOf(getByText('a'))).toBeNull();
    expect(mutedSlotOf(getByText('dark'))).toBeNull();
    expect(mutedSlotOf(getByText('b'))).toBeNull();
    expect(mutedSlotOf(getByText('c'))).not.toBeNull();
  });

  it('props 依存の pageSurface（関数形）を解決する', () => {
    const { getByText } = render(
      <Page>
        <Plain label="a" />
        <Conditional label="cond" night={false} />
      </Page>,
    );
    // night=false は plain 扱いなので交互割当の2番目 = muted
    expect(mutedSlotOf(getByText('cond'))).not.toBeNull();
  });

  it('暗面が3連続すると dev 警告を出す（2連続では出さない）', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <Page>
        <Dark label="d1" />
        <Dark label="d2" />
      </Page>,
    );
    expect(warn).not.toHaveBeenCalled();
    render(
      <Page>
        <Dark label="d1" />
        <Dark label="d2" />
        <Dark label="d3" />
      </Page>,
    );
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0][0]).toContain('暗い面');
  });

  it('要素以外の子（文字列・null）を壊さない', () => {
    const { container } = render(
      <Page>
        {null}
        <Plain label="a" />
        {false}
      </Page>,
    );
    expect(container.textContent).toBe('a');
  });

  it('className を受け付けない（迂回路を持たない）', () => {
    // @ts-expect-error -- 公開 API から className は全廃済み（Stage 2 Slice 6）
    expect(<Page className="x" />).toBeTruthy();
  });

  it('a11y 違反なし', async () => {
    const { container } = render(
      <Page>
        <Plain label="a" />
        <Plain label="b" />
      </Page>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
