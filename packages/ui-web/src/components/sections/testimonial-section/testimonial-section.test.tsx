import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { TestimonialSection } from './testimonial-section';

const testimonials = [
  { quote: '開発速度が劇的に向上した', author: '田中太郎', role: 'CTO', company: 'テスト株式会社' },
  { quote: 'Great platform', author: 'John Doe', company: 'Acme Inc.' },
];

describe('TestimonialSection', () => {
  it('全テスティモニアルを表示する', () => {
    render(<TestimonialSection testimonials={testimonials} />);
    expect(screen.getByText(/開発速度が劇的に向上した/)).toBeInTheDocument();
    expect(screen.getByText(/Great platform/)).toBeInTheDocument();
  });

  it('著者情報を表示する', () => {
    render(<TestimonialSection testimonials={testimonials} />);
    expect(screen.getByText('田中太郎')).toBeInTheDocument();
    expect(screen.getByText('CTO / テスト株式会社')).toBeInTheDocument();
  });

  it('タイトルを表示する', () => {
    render(<TestimonialSection title="お客様の声" testimonials={testimonials} />);
    expect(screen.getByText('お客様の声')).toBeInTheDocument();
  });

  it('section要素としてレンダリングする', () => {
    const { container } = render(<TestimonialSection testimonials={testimonials} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('avatarSrc が無くても author 名から Avatar を生成する', () => {
    const { container } = render(<TestimonialSection testimonials={testimonials} />);
    expect(container.querySelectorAll('.avatar')).toHaveLength(2);
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  it('avatarSrc があれば img で表示する（alt は author 名）', () => {
    render(
      <TestimonialSection
        testimonials={[{ quote: 'q', author: '山田花子', avatarSrc: '/a.png' }]}
      />,
    );
    expect(screen.getByAltText('山田花子')).toHaveAttribute('src', '/a.png');
  });

  it('列数を件数から導出する（1→1 / 2→2 / 3件以上→3）', () => {
    const make = (n: number) =>
      Array.from({ length: n }, (_, i) => ({ quote: `q${i}`, author: `a${i}` }));
    const grid = (n: number) =>
      render(<TestimonialSection testimonials={make(n)} />).container.querySelector('.grid');

    expect(grid(1)).toHaveClass('cols1');
    expect(grid(2)).toHaveClass('cols2');
    expect(grid(5)).toHaveClass('cols3');
  });

  it('a11y違反がない', async () => {
    const { container } = render(<TestimonialSection testimonials={testimonials} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
