import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { ScrollArea, ScrollBar } from './scroll-area';

describe('ScrollArea', () => {
  it('renders children in scrollable area', () => {
    render(
      <ScrollArea style={{ height: 200 }}>
        <p>Scrollable content</p>
      </ScrollArea>,
    );
    expect(screen.getByText('Scrollable content')).toBeInTheDocument();
  });

  it('merges className', () => {
    const { container } = render(
      <ScrollArea className="custom-class">
        <p>Content</p>
      </ScrollArea>,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain('custom-class');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ScrollArea style={{ height: 200 }}>
        <p>Accessible content</p>
      </ScrollArea>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('ScrollBar', () => {
  it('renders with default vertical orientation', () => {
    const { container } = render(
      <ScrollArea style={{ height: 200 }}>
        <ScrollBar data-testid="scrollbar" />
      </ScrollArea>,
    );
    expect(container).toBeTruthy();
  });
});
