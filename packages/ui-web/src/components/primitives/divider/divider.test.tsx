import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Divider } from './divider';

describe('Divider', () => {
  it('hr要素としてレンダリングする', () => {
    const { container } = render(<Divider />);
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('variantを適用する', () => {
    const { container } = render(<Divider variant="brand" />);
    expect(container.firstChild).toHaveClass('brand');
  });

  it('spacingを適用する', () => {
    const { container } = render(<Divider spacing="lg" />);
    expect(container.firstChild).toHaveClass('spacingLg');
  });

  it('a11y違反がない', async () => {
    const { container } = render(<Divider />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
