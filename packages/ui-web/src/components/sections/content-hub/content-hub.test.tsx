import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { ContentHubSection, type ContentHubGroups } from './content-hub';

const statusLabels = { upcoming: '受付中', closed: '受付終了', archive: 'アーカイブ配信中' };
const formatLabels = { online: 'オンライン', venue: '会場開催' };

const groups: ContentHubGroups = [
  {
    kind: 'resource',
    title: 'お役立ち資料',
    more: { label: '資料をもっと見る', href: '/resources' },
    items: [
      { href: '/dl/1', title: '導入チェックリスト' },
      { href: '/dl/2', title: '導入事例集' },
      { href: '/dl/3', title: 'セキュリティ資料' },
    ],
  },
  {
    kind: 'news',
    title: 'お知らせ',
    more: { label: 'お知らせ一覧', href: '/news' },
    items: [
      { href: '/news/1', title: 'SOC 2 Type II を取得しました', publishedAt: '2026-07-30' },
      { href: '/news/2', title: '監査証跡の書き出しに対応', publishedAt: '2026-07-14' },
    ],
  },
];

describe('ContentHubSection', () => {
  it('系統ごとに見出しを立てる', () => {
    render(<ContentHubSection groups={groups} />);
    expect(screen.getByRole('heading', { level: 3, name: 'お役立ち資料' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'お知らせ' })).toBeInTheDocument();
  });

  it('セクション見出しは h2、系統見出しは h3（階層を選ばせない）', () => {
    render(<ContentHubSection title="関連コンテンツ" groups={groups} />);
    expect(screen.getByRole('heading', { level: 2, name: '関連コンテンツ' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
  });

  /* 実測 0/17。「これは資料です」という系統ラベルはどのサイトも出していない */
  it('種別ラベルを出さない', () => {
    render(<ContentHubSection groups={groups} />);
    expect(screen.queryByText('資料')).not.toBeInTheDocument();
    expect(screen.queryByText('ニュース')).not.toBeInTheDocument();
  });

  /* 実測 0/11 ページ・0/17 枠 */
  it('タブ・フィルタを出さない', () => {
    const { container } = render(<ContentHubSection groups={groups} />);
    expect(container.querySelector('select')).toBeNull();
    expect(container.querySelector('[role="tablist"]')).toBeNull();
  });

  it('一覧への導線を出す（任意）', () => {
    render(<ContentHubSection groups={groups} />);
    expect(screen.getByRole('link', { name: /資料をもっと見る/ })).toHaveAttribute(
      'href',
      '/resources',
    );
  });

  it('見出しも導線も省略できる', () => {
    const { container } = render(
      <ContentHubSection groups={[{ kind: 'resource', items: [{ href: '/dl/1', title: '資料' }] }]} />,
    );
    expect(container.querySelectorAll('h3')).toHaveLength(0);
  });

  it('渡した配列の順序で描く（系統の相対順は実測が無いため固定しない）', () => {
    const { container } = render(<ContentHubSection groups={groups} />);
    const headings = [...container.querySelectorAll('h3')].map((h) => h.textContent);
    expect(headings).toEqual(['お役立ち資料', 'お知らせ']);
  });

  it('a11y違反がない', async () => {
    const { container } = render(<ContentHubSection title="関連コンテンツ" groups={groups} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('News の表示形（実測 サムネ 0/7・日付 7/7）', () => {
  it('News はサムネイルを出さず、日付つきの行で出す', () => {
    const { container } = render(
      <ContentHubSection groups={[groups[1]]} />,
    );
    expect(container.querySelectorAll('img')).toHaveLength(0);
    expect(container.querySelector('time[datetime="2026-07-30"]')).toHaveTextContent('2026.07.30');
  });

  /* 同じ ArticleListItem を渡しても、article 枠はカード（サムネ枠あり）で出る。
     語彙は共有し、表示形だけを分ける */
  it('article 枠は同じ語彙をカードで出す', () => {
    const { container } = render(
      <ContentHubSection
        groups={[
          {
            kind: 'article',
            items: [
              {
                href: '/blog/1',
                title: 'コラム',
                publishedAt: '2026-07-30',
                thumbnail: { src: '/t.png', alt: 'コラムのサムネイル' },
              },
            ],
          },
        ]}
      />,
    );
    expect(container.querySelector('img')).toHaveAttribute('alt', 'コラムのサムネイル');
  });
});

describe('入口タイル（実測 n=6 / 5社）', () => {
  const tiles: ContentHubGroups = [
    {
      kind: 'index',
      title: 'お役立ちコンテンツ',
      tiles: [
        { href: '/resources', label: 'お役立ち資料', action: '資料を見る', description: '実務で使える資料。' },
        { href: '/seminar', label: 'セミナー', action: 'セミナーを見る' },
      ],
    },
  ];

  it('一覧ページへのタイルを出す', () => {
    render(<ContentHubSection groups={tiles} />);
    expect(screen.getByRole('link', { name: /お役立ち資料/ })).toHaveAttribute('href', '/resources');
    expect(screen.getByText('資料を見る')).toBeInTheDocument();
  });

  /* 実測でアイテムカードを濃色面に置いた例は 0。濃色は入口タイルだけが持てる */
  it('tone="brand" で濃色になる', () => {
    const { container } = render(
      <ContentHubSection groups={[{ ...tiles[0], tone: 'brand' } as never]} />,
    );
    expect(container.querySelector('.tileBrand')).toBeInTheDocument();
  });

  it('アイテム枠には tone を渡せない（型で塞ぐ）', () => {
    render(
      <ContentHubSection
        groups={[
          // @ts-expect-error 濃色にできるのは入口タイルだけ（実測 0 件）
          { kind: 'resource', tone: 'brand', items: [{ href: '/dl/1', title: '資料' }] },
        ]}
      />,
    );
    expect(screen.getByRole('link', { name: /資料/ })).toBeInTheDocument();
  });

  it('a11y違反がない', async () => {
    const { container } = render(<ContentHubSection groups={tiles} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('union の型契約', () => {
  it('seminar 枠は状態文言の欠落が型エラーになる（実測14通りに割れる）', () => {
    render(
      <ContentHubSection
        groups={[
          // @ts-expect-error statusLabels / formatLabels は必須
          { kind: 'seminar', items: [] },
        ]}
      />,
    );
    expect(document.querySelector('section')).toBeInTheDocument();
  });

  it('seminar 枠はラベルを渡せば描画できる', () => {
    render(
      <ContentHubSection
        groups={[
          {
            kind: 'seminar',
            title: 'セミナー',
            statusLabels,
            formatLabels,
            items: [
              { status: 'upcoming', href: '/s/1', title: '現場DXの始め方', startAt: '2026-09-10T14:00' },
            ],
          },
        ]}
      />,
    );
    expect(screen.getByText('受付中')).toBeInTheDocument();
  });

  /* ハブ内出現 0/17。sold-out / permanent と同じ扱いで型に含めない。
     union へのメンバー追加は非破壊なので、実測が出れば足せる */
  it('事例（case）の枠は存在しない', () => {
    render(
      <ContentHubSection
        groups={[
          // @ts-expect-error 事例は LP 末尾の回遊に現れない（実測 0/17）
          { kind: 'case', items: [] },
        ]}
      />,
    );
    expect(document.querySelector('section')).toBeInTheDocument();
  });
});
