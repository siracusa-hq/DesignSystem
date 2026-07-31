import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { FAQSection } from './faq-section';

const mockItems = [
  { question: 'Polastackとは何ですか？', answer: 'Enterprise Agent Stackです。' },
  { question: '料金はいくらですか？', answer: 'Free Planは無料です。' },
];

describe('FAQSection', () => {
  it('全質問を表示する', () => {
    render(<FAQSection items={mockItems} />);
    expect(screen.getByText('Polastackとは何ですか？')).toBeInTheDocument();
    expect(screen.getByText('料金はいくらですか？')).toBeInTheDocument();
  });

  it('タイトルを表示する', () => {
    render(<FAQSection title="よくある質問" items={mockItems} />);
    expect(screen.getByText('よくある質問')).toBeInTheDocument();
  });

  it('クリックで回答を展開する', () => {
    render(<FAQSection items={mockItems} />);
    const button = screen.getByText('Polastackとは何ですか？').closest('button')!;
    fireEvent.click(button);
    expect(screen.getByText('Enterprise Agent Stackです。')).toBeVisible();
  });

  it('アコーディオンのaria-expanded属性を切り替える', () => {
    render(<FAQSection items={mockItems} />);
    const button = screen.getByText('Polastackとは何ですか？').closest('button')!;
    expect(button).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('section要素としてレンダリングする', () => {
    const { container } = render(<FAQSection items={mockItems} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('a11y違反がない', async () => {
    const { container } = render(<FAQSection items={mockItems} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('キーボードでアコーディオンを操作できる', () => {
    render(<FAQSection items={mockItems} />);
    const button = screen.getByText('Polastackとは何ですか？').closest('button')!;
    button.focus();
    expect(document.activeElement).toBe(button);
    fireEvent.keyDown(button, { key: 'Enter' });
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });
});
