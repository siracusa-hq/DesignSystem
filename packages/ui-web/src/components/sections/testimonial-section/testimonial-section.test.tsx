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

  it('a11y違反がない', async () => {
    const { container } = render(<TestimonialSection testimonials={testimonials} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
