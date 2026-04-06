import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';

// Mock react-resizable-panels v4 exports (Group, Panel, Separator)
vi.mock('react-resizable-panels', () => {
  const React = require('react');
  return {
    Group: ({ children, className, orientation, ...props }: any) => (
      <div data-panel-group="" data-orientation={orientation} className={className} {...props}>
        {children}
      </div>
    ),
    Panel: ({ children, className, ...props }: any) => (
      <div data-panel="" className={className} {...props}>
        {children}
      </div>
    ),
    Separator: ({ children, className, ...props }: any) => (
      <div data-panel-resize-handle="" className={className} {...props}>
        {children}
      </div>
    ),
  };
});

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from './resizable';

function renderPanels(opts?: { withHandle?: boolean; className?: string }) {
  return render(
    <ResizablePanelGroup orientation="horizontal" className={opts?.className}>
      <ResizablePanel defaultSize={{ unit: '%', value: 50 }}>
        <div>Panel One</div>
      </ResizablePanel>
      <ResizableHandle withHandle={opts?.withHandle} />
      <ResizablePanel defaultSize={{ unit: '%', value: 50 }}>
        <div>Panel Two</div>
      </ResizablePanel>
    </ResizablePanelGroup>,
  );
}

describe('Resizable', () => {
  it('renders panel group', () => {
    const { container } = renderPanels();
    expect(container.querySelector('[data-panel-group]')).toBeInTheDocument();
  });

  it('renders panels and handle', () => {
    const { container } = renderPanels();
    const panels = container.querySelectorAll('[data-panel]');
    expect(panels.length).toBe(2);
    expect(container.querySelector('[data-panel-resize-handle]')).toBeInTheDocument();
  });

  it('renders handle grip when withHandle is true', () => {
    const { container } = renderPanels({ withHandle: true });
    const handle = container.querySelector('[data-panel-resize-handle]');
    expect(handle?.querySelector('div')).not.toBeNull();
  });

  it('does not render grip when withHandle is false', () => {
    const { container } = renderPanels({ withHandle: false });
    const handle = container.querySelector('[data-panel-resize-handle]');
    expect(handle?.querySelector('div')).toBeNull();
  });

  it('merges custom className on panel group', () => {
    const { container } = renderPanels({ className: 'custom-group' });
    const group = container.querySelector('[data-panel-group]');
    expect(group?.className).toContain('custom-group');
  });

  it('has no accessibility violations', async () => {
    const { container } = renderPanels();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
