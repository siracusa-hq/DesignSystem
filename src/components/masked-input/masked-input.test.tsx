import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { MaskedInput, MASK_PHONE_JP, MASK_POSTAL_JP } from './masked-input';

describe('MaskedInput', () => {
  it('renders an input element', () => {
    render(<MaskedInput mask={MASK_PHONE_JP} aria-label="Phone" />);
    expect(screen.getByRole('textbox', { name: 'Phone' })).toBeInTheDocument();
  });

  it('applies phone mask format', () => {
    render(<MaskedInput mask={MASK_PHONE_JP} value="09012345678" aria-label="Phone" />);
    const input = screen.getByRole('textbox', { name: 'Phone' }) as HTMLInputElement;
    expect(input.value).toBe('090-1234-5678');
  });

  it('applies postal mask format', () => {
    render(<MaskedInput mask={MASK_POSTAL_JP} value="1234567" aria-label="Postal" />);
    const input = screen.getByRole('textbox', { name: 'Postal' }) as HTMLInputElement;
    expect(input.value).toBe('123-4567');
  });

  it('merges className', () => {
    render(<MaskedInput mask={MASK_PHONE_JP} className="custom-class" aria-label="Phone" />);
    const input = screen.getByRole('textbox', { name: 'Phone' });
    expect(input.className).toContain('custom-class');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <MaskedInput mask={MASK_PHONE_JP} aria-label="Phone number" />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
