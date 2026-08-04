import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { ProductShot } from './product-shot';

describe('ProductShot', () => {
  it('既定でブラウザクロームが付く', () => {
    const { container } = render(<ProductShot />);
    expect(container.querySelector('.chrome')).toBeInTheDocument();
  });
  it('frame=none でクロームなし', () => {
    const { container } = render(<ProductShot frame="none" />);
    expect(container.querySelector('.chrome')).not.toBeInTheDocument();
  });
  it('fade クラスが付く', () => {
    const { container } = render(<ProductShot fade />);
    expect(container.firstChild).toHaveClass('fade');
  });
  it('src で画像を描画する', () => {
    render(<ProductShot src="/shot.png" alt="管理画面" />);
    expect(screen.getByRole('img', { name: '管理画面' })).toBeInTheDocument();
  });
  it('a11y違反がない', async () => {
    const { container } = render(<ProductShot src="/shot.png" alt="管理画面" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
