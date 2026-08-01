import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from './breadcrumb';

function renderBreadcrumb() {
  return render(
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/products">Products</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Detail</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>,
  );
}

describe('Breadcrumb', () => {
  it('renders as nav with aria-label', () => {
    renderBreadcrumb();
    const nav = screen.getByRole('navigation', { name: 'breadcrumb' });
    expect(nav).toBeInTheDocument();
  });

  it('renders an ordered list', () => {
    renderBreadcrumb();
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('renders all breadcrumb links', () => {
    renderBreadcrumb();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '/products');
  });

  it('renders current page with aria-current', () => {
    renderBreadcrumb();
    const page = screen.getByText('Detail');
    expect(page).toHaveAttribute('aria-current', 'page');
    expect(page).toHaveAttribute('aria-disabled', 'true');
  });

  it('hides separators from accessibility tree', () => {
    const { container } = renderBreadcrumb();
    const separators = container.querySelectorAll('[role="presentation"]');
    expect(separators.length).toBeGreaterThanOrEqual(2);
    separators.forEach((sep) => {
      expect(sep).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('supports custom separator', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Page</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(screen.getByText('/')).toBeInTheDocument();
  });

  it('renders ellipsis with sr-only text', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Page</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(screen.getByText('More')).toBeInTheDocument();
    expect(screen.getByText('More')).toHaveClass('sr-only');
  });

  it('supports asChild on BreadcrumbLink', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <a href="/test">Test Link</a>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(screen.getByRole('link', { name: 'Test Link' })).toHaveAttribute('href', '/test');
  });

  it('forwards ref on Breadcrumb', () => {
    const ref = vi.fn<(el: HTMLElement | null) => void>();
    render(<Breadcrumb ref={ref}><BreadcrumbList /></Breadcrumb>);
    expect(ref).toHaveBeenCalled();
  });

  it('merges custom className on BreadcrumbList', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList className="custom">
          <BreadcrumbItem>
            <BreadcrumbPage>Page</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(screen.getByRole('list').className).toContain('custom');
  });

  it('has no accessibility violations', async () => {
    const { container } = renderBreadcrumb();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
