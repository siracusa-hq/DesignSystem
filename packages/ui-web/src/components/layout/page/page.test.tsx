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
const tintedSlotOf = (el: HTMLElement) => el.closest(`.${styles.slotTinted}`);
/** そのセクションに実際に割り当てられた面（スロットの有無から読む） */
const surfaceOf = (el: HTMLElement) =>
  mutedSlotOf(el) ? 'muted' : tintedSlotOf(el) ? 'tinted' : 'default';

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

describe('Page.surfaces（面の明示割当・2026-08）', () => {
  const Accent = markPageSurface(
    ({ label }: { label: string }) => <section>{label}</section>,
    'accent',
  );

  it('tinted / default / muted を添字どおりに割り当てる', () => {
    const { getByText } = render(
      <Page surfaces={['default', 'tinted', 'default', 'muted']}>
        <Plain label="a" />
        <Plain label="b" />
        <Plain label="c" />
        <Plain label="d" />
      </Page>,
    );
    // 自動ゼブラなら a=default / b=muted / c=default / d=muted になるところを上書きする
    expect(surfaceOf(getByText('a'))).toBe('default');
    expect(surfaceOf(getByText('b'))).toBe('tinted');
    expect(surfaceOf(getByText('c'))).toBe('default');
    expect(surfaceOf(getByText('d'))).toBe('muted');
  });

  it("'auto' と配列の不足分は自動ゼブラが処理する（既定挙動の維持）", () => {
    const { getByText } = render(
      <Page surfaces={['auto', 'tinted']}>
        <Plain label="a" />
        <Plain label="b" />
        <Plain label="c" />
        <Plain label="d" />
      </Page>,
    );
    // a は auto → 交互の1番目で default。b は明示の tinted。
    // c / d は配列の外なので自動ゼブラ（明示面でカウンタが 0 に戻り default → muted）
    expect(surfaceOf(getByText('a'))).toBe('default');
    expect(surfaceOf(getByText('b'))).toBe('tinted');
    expect(surfaceOf(getByText('c'))).toBe('default');
    expect(surfaceOf(getByText('d'))).toBe('muted');
  });

  it('明示面の直後の auto は白から再開する（暗面・強調面のリセットと同じ）', () => {
    const { getByText } = render(
      <Page surfaces={['auto', 'auto', 'tinted']}>
        <Plain label="a" />
        <Plain label="b" />
        <Plain label="tint" />
        <Plain label="c" />
        <Plain label="d" />
      </Page>,
    );
    // a=default → b=muted（交互） → tint=明示 → c は default から再開 → d=muted
    expect(surfaceOf(getByText('a'))).toBe('default');
    expect(surfaceOf(getByText('b'))).toBe('muted');
    expect(surfaceOf(getByText('tint'))).toBe('tinted');
    expect(surfaceOf(getByText('c'))).toBe('default');
    expect(surfaceOf(getByText('d'))).toBe('muted');
  });

  it('dark / accent の自己申告が配列より優先される（dev 警告つき）', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { getByText } = render(
      <Page surfaces={['tinted', 'muted', 'tinted']}>
        <Dark label="dark" />
        <Accent label="band" />
        <Plain label="c" />
      </Page>,
    );
    // 塗る/塗らないの判断はセクションの内部事情。外からは上書きできない
    expect(surfaceOf(getByText('dark'))).toBe('default');
    expect(surfaceOf(getByText('band'))).toBe('default');
    expect(surfaceOf(getByText('c'))).toBe('tinted');
    const messages = warn.mock.calls.map((c) => String(c[0]));
    expect(messages.filter((m) => m.includes('を無視しました'))).toHaveLength(1);
  });

  it("直後が accent の 'muted' は dev 警告（面差 1.053:1 で知覚できない）", () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <Page surfaces={['muted']}>
        <Plain label="a" />
        <Accent label="band" />
      </Page>,
    );
    expect(warn.mock.calls.map((c) => String(c[0])).join('\n')).toContain('1.053:1');
  });

  it("直後が accent でも 'tinted' なら警告しない（面差を確保できる）", () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { getByText } = render(
      <Page surfaces={['tinted']}>
        <Plain label="a" />
        <Accent label="band" />
      </Page>,
    );
    expect(surfaceOf(getByText('a'))).toBe('tinted');
    expect(warn).not.toHaveBeenCalled();
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
