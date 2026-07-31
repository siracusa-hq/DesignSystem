import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { RadioGroup, RadioGroupItem } from './radio-group';

describe('RadioGroup', () => {
  const renderRadioGroup = (props = {}) =>
    render(
      <RadioGroup aria-label="Fruit" {...props}>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="apple" id="apple" />
          <label htmlFor="apple">Apple</label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="banana" id="banana" />
          <label htmlFor="banana">Banana</label>
        </div>
      </RadioGroup>,
    );

  it('renders radio buttons', () => {
    renderRadioGroup();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('handles default value', () => {
    renderRadioGroup({ defaultValue: 'apple' });
    expect(screen.getByLabelText('Apple')).toHaveAttribute('data-state', 'checked');
    expect(screen.getByLabelText('Banana')).toHaveAttribute('data-state', 'unchecked');
  });

  it('handles onValueChange', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderRadioGroup({ onValueChange });
    await user.click(screen.getByLabelText('Banana'));
    expect(onValueChange).toHaveBeenCalledWith('banana');
  });

  it('forwards ref on RadioGroup', () => {
    let ref: HTMLDivElement | null = null;
    render(
      <RadioGroup ref={(el) => { ref = el; }} aria-label="Test">
        <RadioGroupItem value="a" />
      </RadioGroup>,
    );
    expect(ref).toBeInstanceOf(HTMLDivElement);
  });

  it('merges className', () => {
    const { container } = render(
      <RadioGroup className="custom" aria-label="Test">
        <RadioGroupItem value="a" />
      </RadioGroup>,
    );
    expect(container.firstChild).toHaveClass('custom');
  });

  it('has no accessibility violations', async () => {
    const { container } = renderRadioGroup();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
