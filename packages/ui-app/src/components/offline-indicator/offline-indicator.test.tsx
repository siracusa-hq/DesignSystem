import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { OfflineIndicator } from './offline-indicator';

describe('OfflineIndicator', () => {
  it('renders nothing when online', () => {
    const { container } = render(<OfflineIndicator isOffline={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders alert when offline', () => {
    render(<OfflineIndicator isOffline />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows default message', () => {
    render(<OfflineIndicator isOffline />);
    expect(
      screen.getByText('オフラインです。一部の機能が制限されます。'),
    ).toBeInTheDocument();
  });

  it('shows custom message', () => {
    render(<OfflineIndicator isOffline message="No connection" />);
    expect(screen.getByText('No connection')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = vi.fn<(el: HTMLDivElement | null) => void>();
    render(<OfflineIndicator isOffline ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<OfflineIndicator isOffline />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
