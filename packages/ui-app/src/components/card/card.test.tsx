import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './card';

describe('Card', () => {
  it('renders with children', () => {
    render(<Card>Content</Card>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders all sub-components', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('CardTitle renders as h3', () => {
    render(<CardTitle>Heading</CardTitle>);
    expect(screen.getByText('Heading').tagName).toBe('H3');
  });

  it('CardDescription renders as p', () => {
    render(<CardDescription>Desc</CardDescription>);
    expect(screen.getByText('Desc').tagName).toBe('P');
  });

  it('merges custom className', () => {
    render(<Card className="custom-card">Content</Card>);
    expect(screen.getByText('Content').className).toContain('custom-card');
  });

  it('forwards ref on Card', () => {
    const ref = vi.fn<(el: HTMLDivElement | null) => void>();
    render(<Card ref={ref}>Content</Card>);
    expect(ref).toHaveBeenCalled();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
