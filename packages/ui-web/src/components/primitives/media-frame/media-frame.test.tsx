import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { MediaFrame } from './media-frame';

describe('MediaFrame', () => {
  it('src で画像を描画し alt が付く', () => {
    render(<MediaFrame src="/a.png" alt="画面例" />);
    expect(screen.getByRole('img', { name: '画面例' })).toBeInTheDocument();
  });
  it('素材が無ければプレースホルダ（aria-hidden）を出す', () => {
    const { container } = render(<MediaFrame ratio="4:3" />);
    const ph = container.querySelector('[aria-hidden="true"]');
    expect(ph).toHaveTextContent('4:3');
  });
  it('a11y違反がない', async () => {
    const { container } = render(<MediaFrame src="/a.png" alt="画面例" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
