import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Slider } from './slider';

describe('Slider', () => {
  it('renders slider role', () => {
    render(<Slider defaultValue={[50]} />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('renders thumb for single slider', () => {
    render(<Slider defaultValue={[50]} />);
    const sliders = screen.getAllByRole('slider');
    expect(sliders.length).toBe(1);
  });

  it('renders two thumbs for range slider', () => {
    render(<Slider defaultValue={[25, 75]} />);
    const sliders = screen.getAllByRole('slider');
    expect(sliders.length).toBe(2);
  });

  it('applies disabled state', () => {
    const { container } = render(<Slider defaultValue={[50]} disabled />);
    const root = container.firstElementChild;
    expect(root).toHaveAttribute('data-disabled', '');
  });

  it('merges custom className', () => {
    const { container } = render(<Slider defaultValue={[50]} className="custom-slider" />);
    const root = container.firstElementChild;
    expect(root?.className).toContain('custom-slider');
  });

  it('forwards ref', () => {
    const ref = vi.fn<(el: HTMLSpanElement | null) => void>();
    render(<Slider defaultValue={[50]} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Slider defaultValue={[50]} aria-label="Volume" />,
    );
    const results = await axe(container, {
      rules: { 'aria-input-field-name': { enabled: false } },
    });
    expect(results).toHaveNoViolations();
  });
});
