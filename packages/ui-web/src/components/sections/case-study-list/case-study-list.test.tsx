import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { CaseStudyListSection, type CaseStudyListItem } from './case-study-list';
import { resolvePageSurface } from '@/lib/page-surface';

const cases: CaseStudyListItem[] = [
  {
    companyName: 'あさひ製作所',
    summary: '書類回収の催促がゼロになりました。',
    service: 'タックスピア',
    industry: '製造業',
    employeeRange: '51〜300名',
    challenges: ['書類回収', '月次決算'],
    href: '/case/asahi',
  },
  {
    companyName: 'みなと商事',
    summary: '月次決算が5営業日早まりました。',
    service: 'タックスピア',
    industry: '卸売業',
    employeeRange: '1〜50名',
    challenges: ['月次決算'],
  },
  {
    companyName: 'そらまめ工業',
    summary: '書類の紛失がなくなりました。',
    service: 'ピアデスク',
    industry: '製造業',
    employeeRange: '301名〜',
    challenges: ['書類回収'],
  },
  {
    companyName: 'かもめ運輸',
    summary: '問い合わせ対応の工数が半減しました。',
    service: 'ピアデスク',
    industry: '運輸業',
    employeeRange: '51〜300名',
  },
];

/** ページネーション検証用: n 件の最小データ */
const many = (n: number): CaseStudyListItem[] =>
  Array.from({ length: n }, (_, i) => ({
    companyName: `会社${i + 1}`,
    summary: `要約${i + 1}`,
  }));

const list = (props: Partial<React.ComponentProps<typeof CaseStudyListSection>> = {}) => (
  <CaseStudyListSection title="導入事例" cases={cases} {...props} />
);

describe('CaseStudyListSection', () => {
  it('全件を描画し、件数を表示する', () => {
    render(list());
    expect(screen.getByText('あさひ製作所')).toBeInTheDocument();
    expect(screen.getByText('4件中 4件')).toBeInTheDocument();
  });

  it('フィルタ軸はデータに値が存在する軸だけ自動表示する', () => {
    render(list());
    expect(screen.getByLabelText('サービス')).toBeInTheDocument();
    expect(screen.getByLabelText('業種')).toBeInTheDocument();
    expect(screen.getByLabelText('従業員規模')).toBeInTheDocument();
    expect(screen.getByLabelText('課題')).toBeInTheDocument();
  });

  it('軸の値を持たないデータでは select を出さない', () => {
    render(<CaseStudyListSection title="事例" cases={many(3)} />);
    expect(screen.queryByLabelText('業種')).toBeNull();
    expect(screen.queryByLabelText('サービス')).toBeNull();
  });

  it('filterAxes で表示する軸を絞れる', () => {
    render(list({ filterAxes: ['industry'] }));
    expect(screen.getByLabelText('業種')).toBeInTheDocument();
    expect(screen.queryByLabelText('サービス')).toBeNull();
  });

  it('選択肢はデータから重複除去・出現順で生成する', () => {
    render(list({ filterAxes: ['industry'] }));
    const options = within(screen.getByLabelText('業種')).getAllByRole('option');
    expect(options.map((o) => o.textContent)).toEqual(['すべて', '製造業', '卸売業', '運輸業']);
  });

  it('軸間は AND で絞り込む', async () => {
    const user = userEvent.setup();
    render(list());
    await user.selectOptions(screen.getByLabelText('業種'), '製造業');
    expect(screen.getByText('4件中 2件')).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('サービス'), 'タックスピア');
    expect(screen.getByText('4件中 1件')).toBeInTheDocument();
    expect(screen.getByText('あさひ製作所')).toBeInTheDocument();
    expect(screen.queryByText('そらまめ工業')).toBeNull();
  });

  it('challenges は配列が値を含むかで判定する', async () => {
    const user = userEvent.setup();
    render(list());
    await user.selectOptions(screen.getByLabelText('課題'), '月次決算');
    // あさひ（2値の配列）とみなと（1値）が残り、かもめ（未設定）は落ちる
    expect(screen.getByText('4件中 2件')).toBeInTheDocument();
    expect(screen.getByText('あさひ製作所')).toBeInTheDocument();
    expect(screen.queryByText('かもめ運輸')).toBeNull();
  });

  it('「すべて」でフィルタを解除する', async () => {
    const user = userEvent.setup();
    render(list());
    await user.selectOptions(screen.getByLabelText('業種'), '製造業');
    expect(screen.getByText('4件中 2件')).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText('業種'), 'すべて');
    expect(screen.getByText('4件中 4件')).toBeInTheDocument();
  });

  it('0件のときは空状態メッセージを出す', async () => {
    const user = userEvent.setup();
    render(list());
    await user.selectOptions(screen.getByLabelText('業種'), '運輸業');
    await user.selectOptions(screen.getByLabelText('サービス'), 'タックスピア');
    expect(screen.getByText('4件中 0件')).toBeInTheDocument();
    expect(screen.getByText(/条件に一致する事例はありません/)).toBeInTheDocument();
  });

  it('件数は aria-live="polite" で通知する', () => {
    render(list());
    const live = screen.getByText('4件中 4件').closest('[aria-live]');
    expect(live).toHaveAttribute('aria-live', 'polite');
  });

  it('1ページに収まるときはページネーションを出さない', () => {
    render(<CaseStudyListSection title="事例" cases={many(12)} pageSize={12} />);
    expect(screen.queryByRole('navigation')).toBeNull();
  });

  it('ページ送り: 現在ページに aria-current、次へで内容が入れ替わる', async () => {
    const user = userEvent.setup();
    render(<CaseStudyListSection title="事例" cases={many(15)} pageSize={12} />);
    const nav = screen.getByRole('navigation', { name: '事例一覧のページ送り' });
    expect(within(nav).getByRole('button', { name: '1' })).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByRole('button', { name: '前へ' })).toBeDisabled();
    expect(screen.getByText('会社1')).toBeInTheDocument();
    expect(screen.queryByText('会社13')).toBeNull();

    await user.click(within(nav).getByRole('button', { name: '次へ' }));
    expect(screen.getByText('会社13')).toBeInTheDocument();
    expect(screen.queryByText('会社1')).toBeNull();
    expect(within(nav).getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByRole('button', { name: '次へ' })).toBeDisabled();

    await user.click(within(nav).getByRole('button', { name: '1' }));
    expect(screen.getByText('会社1')).toBeInTheDocument();
  });

  it('フィルタを変えるとページは1に戻る', async () => {
    const user = userEvent.setup();
    const data: CaseStudyListItem[] = [
      ...Array.from({ length: 13 }, (_, i) => ({
        companyName: `製造${i + 1}`,
        summary: 's',
        industry: '製造業',
      })),
      ...Array.from({ length: 13 }, (_, i) => ({
        companyName: `小売${i + 1}`,
        summary: 's',
        industry: '小売業',
      })),
    ];
    render(<CaseStudyListSection title="事例" cases={data} pageSize={12} />);
    await user.click(screen.getByRole('button', { name: '3' }));
    expect(screen.getByText('小売13')).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('業種'), '製造業');
    expect(screen.getByRole('button', { name: '1' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('製造1')).toBeInTheDocument();
  });

  it('pickup はフィルタ・ページネーションの影響を受けず常に先頭に出る', async () => {
    const user = userEvent.setup();
    render(
      list({
        pickup: [
          { companyName: 'ピックアップ社', summary: '注目の事例です。', industry: '金融業' },
        ],
      }),
    );
    expect(screen.getByText('ピックアップ社')).toBeInTheDocument();
    // pickup は選択肢の生成元にもならない（cases だけから作る）
    expect(
      within(screen.getByLabelText('業種')).queryByRole('option', { name: '金融業' }),
    ).toBeNull();

    await user.selectOptions(screen.getByLabelText('業種'), '運輸業');
    await user.selectOptions(screen.getByLabelText('サービス'), 'タックスピア');
    expect(screen.getByText(/条件に一致する事例はありません/)).toBeInTheDocument();
    // 0件でもピックアップは残る
    expect(screen.getByText('ピックアップ社')).toBeInTheDocument();
    // 件数にも含まれない
    expect(screen.getByText('4件中 0件')).toBeInTheDocument();
  });

  it('labels で UI 語彙を英語に差し替えられる', () => {
    render(
      list({
        labels: {
          industry: 'Industry',
          all: 'All',
          resultCount: (shown, total) => `${shown} of ${total}`,
        },
        filterAxes: ['industry'],
      }),
    );
    expect(screen.getByLabelText('Industry')).toBeInTheDocument();
    expect(screen.getByText('4 of 4')).toBeInTheDocument();
  });

  it('ページタイトルは h1（ヒーローを持たないページ型のため）', () => {
    render(list());
    expect(screen.getByRole('heading', { level: 1, name: '導入事例' })).toBeInTheDocument();
  });

  it('pageSurface は default（Page の面リズムに従う）', () => {
    expect(resolvePageSurface(CaseStudyListSection, {})).toBe('default');
  });

  it('a11y 違反なし', async () => {
    const { container } = render(
      list({ pickup: [{ companyName: 'ピックアップ社', summary: '注目の事例です。' }] }),
    );
    expect(await axe(container)).toHaveNoViolations();
  }, 15000);
});
