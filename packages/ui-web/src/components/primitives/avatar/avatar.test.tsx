import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Avatar } from './avatar';

describe('Avatar', () => {
  it('src 無しはイニシャルにフォールバック', () => {
    render(<Avatar name="山田花子" />);
    expect(screen.getByText('山田')).toBeInTheDocument();
  });
  it('src ありは name が alt になる', () => {
    render(<Avatar name="山田花子" src="/p.png" />);
    expect(screen.getByRole('img', { name: '山田花子' })).toBeInTheDocument();
  });
  it('a11y違反がない', async () => {
    const { container } = render(<Avatar name="山田" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
