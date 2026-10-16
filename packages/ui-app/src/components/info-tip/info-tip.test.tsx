import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { InfoTip } from './info-tip';

function renderInfoTip() {
  return render(
    <div>
      <span>締め日</span>
      <InfoTip
        label="締め日について"
        content="締め日を過ぎた請求は翌月扱いになります"
        delayDuration={0}
      />
      <button type="button">外側</button>
    </div>,
  );
}

const trigger = () => screen.getByRole('button', { name: '締め日について' });

describe('InfoTip', () => {
  it('renders an icon button with the given accessible name', () => {
    renderInfoTip();
    expect(trigger()).toHaveAttribute('type', 'button');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows content on hover and hides it on unhover', async () => {
    const user = userEvent.setup();
    renderInfoTip();

    await user.hover(trigger());
    expect(await screen.findByRole('tooltip')).toHaveTextContent(
      '締め日を過ぎた請求は翌月扱いになります',
    );

    // Radix はトリガー→コンテンツ間の移動猶予を持つため、外側へポインタを動かして閉じる
    await user.unhover(trigger());
    await user.pointer({
      target: screen.getByRole('button', { name: '外側' }),
      coords: { clientX: 500, clientY: 500 },
    });
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('keeps content open when clicked with a mouse', async () => {
    const user = userEvent.setup();
    renderInfoTip();

    await user.hover(trigger());
    await screen.findByRole('tooltip');
    await user.click(trigger());
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('shows content on keyboard focus and closes with Escape', async () => {
    const user = userEvent.setup();
    renderInfoTip();

    await user.tab();
    expect(trigger()).toHaveFocus();
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
    expect(trigger()).toHaveAttribute('aria-describedby');

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('toggles content on tap for touch devices', async () => {
    const user = userEvent.setup();
    renderInfoTip();

    await user.pointer({ keys: '[TouchA]', target: trigger() });
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();

    await user.pointer({ keys: '[TouchA]', target: trigger() });
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('closes when tapping outside on touch devices', async () => {
    const user = userEvent.setup();
    renderInfoTip();

    await user.pointer({ keys: '[TouchA]', target: trigger() });
    await screen.findByRole('tooltip');

    await user.pointer({ keys: '[TouchA]', target: screen.getByRole('button', { name: '外側' }) });
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('uses the light surface by default and the dark surface with appearance="inverse"', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<InfoTip label="a" content="明るい面" delayDuration={0} />);
    await user.hover(screen.getByRole('button', { name: 'a' }));
    const light = (await screen.findByRole('tooltip')).parentElement!;
    expect(light).toHaveClass('bg-[var(--color-surface-raised)]');
    expect(light).not.toHaveClass('bg-[var(--color-tooltip-bg)]');
    unmount();

    render(<InfoTip label="b" content="黒い面" appearance="inverse" delayDuration={0} />);
    await user.hover(screen.getByRole('button', { name: 'b' }));
    const dark = (await screen.findByRole('tooltip')).parentElement!;
    expect(dark).toHaveClass('bg-[var(--color-tooltip-bg)]');
    expect(dark).not.toHaveClass('bg-[var(--color-surface-raised)]');
  });

  it('has no axe violations when open', async () => {
    const user = userEvent.setup();
    const { container } = renderInfoTip();
    await user.hover(trigger());
    await screen.findByRole('tooltip');
    expect(await axe(container)).toHaveNoViolations();
  });
});
