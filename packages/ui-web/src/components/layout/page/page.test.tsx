import * as React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { resolveAllBrands } from '@siracusahq/tokens';
import { Page, PAGE_BRANDS } from './page';
import { MarketingButton } from '@/components/primitives/marketing-button';
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

  it('強調面（accent）の直前のセクションには muted を割り当てない（面差の確保）', () => {
    const Accent = markPageSurface(
      ({ label }: { label: string }) => <section>{label}</section>,
      'accent',
    );
    const { getByText } = render(
      <Page>
        <Plain label="a" />
        <Plain label="b" />
        <Accent label="band" />
        <Plain label="c" />
        <Plain label="d" />
      </Page>,
    );
    // b は交互割当なら muted だが、直後が accent（淡面）なので default に倒す。
    // accent 後は default から再開し、d が muted
    expect(mutedSlotOf(getByText('a'))).toBeNull();
    expect(mutedSlotOf(getByText('b'))).toBeNull();
    expect(mutedSlotOf(getByText('band'))).toBeNull();
    expect(mutedSlotOf(getByText('c'))).toBeNull();
    expect(mutedSlotOf(getByText('d'))).not.toBeNull();
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

  it('h1 が2つ以上あると dev 警告を出す（1つなら出さない）', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <Page>
        <section>
          <h1>ページタイトル</h1>
        </section>
        <section>
          <h2>セクション見出し</h2>
        </section>
      </Page>,
    );
    expect(warn).not.toHaveBeenCalled();

    render(
      <Page>
        <section>
          <h1>ページタイトル</h1>
        </section>
        <section>
          <h1>もう1つの h1</h1>
        </section>
      </Page>,
    );
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0][0]).toContain('h1 が 2 個');
  });

  it('h1 が無くても警告しない（ページの型によっては Page の外に出る）', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <Page>
        <Plain label="a" />
      </Page>,
    );
    expect(warn).not.toHaveBeenCalled();
  });

  it('Page の外の h1 は数えない（自ルート配下だけを見る）', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <div>
        <h1>ヘッダーの外側</h1>
        <Page>
          <section>
            <h1>ページタイトル</h1>
          </section>
        </Page>
      </div>,
    );
    expect(warn).not.toHaveBeenCalled();
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

  it('ref をルート要素に転送する（h1 検査の内部 ref と両立する）', () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(
      <Page ref={ref}>
        <Plain label="a" />
      </Page>,
    );
    expect(ref.current).toBe(container.firstElementChild);
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

describe('Page.onCTAClick（計測フック・Stage 4 Slice 0）', () => {
  it('data-cta を持つ CTA のクリックで id / label / href が届く', async () => {
    const onCTAClick = vi.fn();
    render(
      <Page onCTAClick={onCTAClick}>
        <section>
          <MarketingButton ctaId="hero-0" href="#dl">
            資料をダウンロード
          </MarketingButton>
        </section>
      </Page>,
    );
    await userEvent.click(screen.getByRole('link', { name: '資料をダウンロード' }));
    expect(onCTAClick).toHaveBeenCalledOnce();
    expect(onCTAClick.mock.calls[0][0]).toEqual({
      id: 'hero-0',
      label: '資料をダウンロード',
      href: '#dl',
    });
    // 第2引数は元の React イベント（preventDefault 等を呼べる）
    expect(typeof onCTAClick.mock.calls[0][1].preventDefault).toBe('function');
  });

  it('button（href なし）では href が undefined になる', async () => {
    const onCTAClick = vi.fn();
    render(
      <Page onCTAClick={onCTAClick}>
        <section>
          <MarketingButton ctaId="hero-1">相談する</MarketingButton>
        </section>
      </Page>,
    );
    await userEvent.click(screen.getByRole('button', { name: '相談する' }));
    expect(onCTAClick.mock.calls[0][0]).toEqual({
      id: 'hero-1',
      label: '相談する',
      href: undefined,
    });
  });

  it('data-cta を持たないボタンでは発火しない', async () => {
    const onCTAClick = vi.fn();
    render(
      <Page onCTAClick={onCTAClick}>
        <section>
          <MarketingButton href="#docs">ドキュメント</MarketingButton>
          <button type="button">素のボタン</button>
        </section>
      </Page>,
    );
    await userEvent.click(screen.getByRole('link', { name: 'ドキュメント' }));
    await userEvent.click(screen.getByRole('button', { name: '素のボタン' }));
    expect(onCTAClick).not.toHaveBeenCalled();
  });

  it('CTA の内側（アイコン等）をクリックしても closest で親の CTA まで遡る', async () => {
    const onCTAClick = vi.fn();
    render(
      <Page onCTAClick={onCTAClick}>
        <section>
          <MarketingButton ctaId="cta-band-0" href="#dl" rightIcon={<span>→</span>}>
            資料をダウンロード
          </MarketingButton>
        </section>
      </Page>,
    );
    await userEvent.click(screen.getByText('→'));
    expect(onCTAClick).toHaveBeenCalledOnce();
    expect(onCTAClick.mock.calls[0][0].id).toBe('cta-band-0');
    // label は rightIcon を含む textContent（空白正規化済み）
    expect(onCTAClick.mock.calls[0][0].label).toBe('資料をダウンロード→');
  });

  it('onCTAClick 未指定でも onClickCapture は素通しする', async () => {
    const onClickCapture = vi.fn();
    render(
      <Page onClickCapture={onClickCapture}>
        <section>
          <MarketingButton ctaId="hero-0">押す</MarketingButton>
        </section>
      </Page>,
    );
    await userEvent.click(screen.getByRole('button', { name: '押す' }));
    expect(onClickCapture).toHaveBeenCalledOnce();
  });
});
