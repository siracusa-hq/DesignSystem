import * as React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { CTABand } from './cta-band';
import { Page } from '@/components/layout/page';
import { resolvePageSurface } from '@/lib/page-surface';

const band = (
  <CTABand
    title="まずは資料からご覧ください"
    note="無料・1分で完了"
    actions={[
      { label: '資料をダウンロード', href: '#dl' },
      { label: '料金を見る', href: '#price' },
    ]}
  />
);

afterEach(() => {
  vi.restoreAllMocks();
});

describe('CTABand', () => {
  it('タイトル・補足・2オファーを描画し、1つ目が cta / 2つ目が secondary', () => {
    render(band);
    expect(screen.getByText('まずは資料からご覧ください')).toBeInTheDocument();
    expect(screen.getByText('無料・1分で完了')).toBeInTheDocument();
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent('資料をダウンロード');
  });

  it('タイトルは見出しタグではない（反復配置でアウトラインを汚さない）', () => {
    render(band);
    expect(screen.queryByRole('heading')).toBeNull();
  });

  it('actions は最大2件に切り詰める', () => {
    render(
      <CTABand
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

  it('pageSurface は accent（Page のリズムから除外される）', () => {
    expect(resolvePageSurface(CTABand, {})).toBe('accent');
  });

  it('同じ2種のラベルの反復（実測上限の2回）では警告しない', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <Page>
        {band}
        {band}
      </Page>,
    );
    expect(warn).not.toHaveBeenCalled();
  });

  it('Page 配下に3つ以上置くと dev 警告を出す（面を持つ帯の反復上限）', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <Page>
        {band}
        {band}
        {band}
      </Page>,
    );
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0][0]).toContain('強調面');
  });

  it('Page 配下でプライマリ CTA のラベルが3種類になると dev 警告を出す', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <Page>
        <CTABand title="t" actions={[{ label: '資料をダウンロード', href: '#' }]} />
        <CTABand title="t" actions={[{ label: '料金を見る', href: '#' }]} />
        <CTABand title="t" actions={[{ label: 'デモを予約', href: '#' }]} />
      </Page>,
    );
    // 帯3つなので反復警告も同時に出る。ここで検証するのはラベル警告のほう
    const labelWarnings = warn.mock.calls.filter((c) => String(c[0]).includes('3種類'));
    expect(labelWarnings).toHaveLength(1);
  });

  it('secondary（2つ目のオファー）はラベル種類の検査対象外', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <Page>
        <CTABand
          title="t"
          actions={[
            { label: '資料をダウンロード', href: '#' },
            { label: '料金を見る', href: '#' },
          ]}
        />
        <CTABand
          title="t"
          actions={[
            { label: '資料をダウンロード', href: '#' },
            { label: '導入事例を見る', href: '#' },
          ]}
        />
      </Page>,
    );
    expect(warn).not.toHaveBeenCalled();
  });

  it('a11y 違反なし', async () => {
    const { container } = render(band);
    expect(await axe(container)).toHaveNoViolations();
  });
});
