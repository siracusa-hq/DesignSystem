import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { ProseSection } from './prose-section';

const paragraphs = [
  '企業が大きくなるほど、判断は遅くなります。',
  '人が判断に集中できる状態をつくること。それが私たちの仕事です。',
];

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ProseSection', () => {
  it('段落をすべて表示する', () => {
    render(<ProseSection title="ミッション" paragraphs={paragraphs} />);
    paragraphs.forEach((p) => expect(screen.getByText(p)).toBeInTheDocument());
  });

  it('見出しは h2 で出す（ページタイトルはヒーローの仕事）', () => {
    render(<ProseSection title="ミッション" paragraphs={paragraphs} />);
    expect(screen.getByRole('heading', { level: 2, name: 'ミッション' })).toBeInTheDocument();
  });

  it('署名が無ければミッションとして成立する（役職・氏名を出さない）', () => {
    render(<ProseSection title="ミッション" paragraphs={paragraphs} />);
    expect(screen.queryByText('代表取締役 CEO')).not.toBeInTheDocument();
  });

  it('署名を渡すと役職と氏名を出す', () => {
    render(
      <ProseSection
        title="代表挨拶"
        paragraphs={paragraphs}
        signature={{ role: '代表取締役 CEO', name: '金子 卓也' }}
      />,
    );
    expect(screen.getByText('代表取締役 CEO')).toBeInTheDocument();
    expect(screen.getByText('金子 卓也')).toBeInTheDocument();
  });

  it('署名の写真は alt を出す（人物と文脈を書くため）', () => {
    render(
      <ProseSection
        paragraphs={paragraphs}
        signature={{ name: '金子 卓也', photo: { src: '/ceo.jpg', alt: '代表の金子が語る様子' } }}
      />,
    );
    expect(screen.getByAltText('代表の金子が語る様子')).toBeInTheDocument();
  });

  it('moreLink を渡すとリンクを出す', () => {
    render(
      <ProseSection
        paragraphs={paragraphs}
        moreLink={{ label: '全文を読む', href: '/company/message' }}
      />,
    );
    expect(screen.getByRole('link', { name: /全文を読む/ })).toHaveAttribute(
      'href',
      '/company/message',
    );
  });

  it('a11y違反がない', async () => {
    const { container } = render(
      <ProseSection
        title="代表挨拶"
        paragraphs={paragraphs}
        signature={{ role: '代表取締役 CEO', name: '金子 卓也' }}
        moreLink={{ label: '全文を読む', href: '/company/message' }}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('散文規則の迂回を牽制する dev 警告', () => {
  it('段落が5つ以上あると警告する', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<ProseSection paragraphs={['a', 'b', 'c', 'd', 'e']} />);
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0][0]).toContain('段落が 5 個');
  });

  it('4段落までは警告しない', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<ProseSection paragraphs={['a', 'b', 'c', 'd']} />);
    expect(warn).not.toHaveBeenCalled();
  });
});
