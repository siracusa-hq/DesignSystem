import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { InstallPrompt } from './install-prompt';

describe('InstallPrompt', () => {
  const defaultProps = {
    canInstall: true,
    onInstall: vi.fn(),
    onDismiss: vi.fn(),
  };

  it('renders nothing when canInstall is false', () => {
    const { container } = render(
      <InstallPrompt {...defaultProps} canInstall={false} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders dialog when canInstall is true', () => {
    render(<InstallPrompt {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows default title and description', () => {
    render(<InstallPrompt {...defaultProps} />);
    expect(screen.getByText('アプリをインストール')).toBeInTheDocument();
    expect(
      screen.getByText(
        'ホーム画面に追加すると、すぐにアクセスできます。',
      ),
    ).toBeInTheDocument();
  });

  it('calls onInstall when install button clicked', async () => {
    const user = userEvent.setup();
    const onInstall = vi.fn();
    render(<InstallPrompt {...defaultProps} onInstall={onInstall} />);
    await user.click(screen.getByText('インストール'));
    expect(onInstall).toHaveBeenCalledTimes(1);
  });

  it('calls onDismiss when dismiss button clicked', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<InstallPrompt {...defaultProps} onDismiss={onDismiss} />);
    await user.click(screen.getByText('後で'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('supports custom labels', () => {
    render(
      <InstallPrompt
        {...defaultProps}
        title="Install App"
        installLabel="Install"
        dismissLabel="Later"
      />,
    );
    expect(screen.getByText('Install')).toBeInTheDocument();
    expect(screen.getByText('Later')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = vi.fn<(el: HTMLDivElement | null) => void>();
    render(<InstallPrompt {...defaultProps} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<InstallPrompt {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
