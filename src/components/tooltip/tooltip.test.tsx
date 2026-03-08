import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

function renderTooltip(content = 'Tooltip text') {
  return render(
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>,
  );
}

describe('Tooltip', () => {
  it('renders trigger', () => {
    renderTooltip();
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('shows content on hover', async () => {
    const user = userEvent.setup();
    renderTooltip();

    await user.hover(screen.getByText('Hover me'));
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Tooltip text');
  });

  it('hides content when not hovered', () => {
    renderTooltip();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
