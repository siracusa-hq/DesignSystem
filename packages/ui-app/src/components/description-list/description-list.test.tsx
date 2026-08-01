import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import {
  DescriptionList,
  DescriptionListItem,
  DescriptionListTerm,
  DescriptionListDetails,
} from './description-list';

function renderList(props?: { className?: string }) {
  return render(
    <DescriptionList {...props}>
      <DescriptionListItem>
        <DescriptionListTerm>Name</DescriptionListTerm>
        <DescriptionListDetails>John Doe</DescriptionListDetails>
      </DescriptionListItem>
      <DescriptionListItem>
        <DescriptionListTerm>Email</DescriptionListTerm>
        <DescriptionListDetails>john@example.com</DescriptionListDetails>
      </DescriptionListItem>
    </DescriptionList>,
  );
}

describe('DescriptionList', () => {
  it('renders dl element', () => {
    const { container } = renderList();
    expect(container.querySelector('dl')).toBeInTheDocument();
  });

  it('renders dt and dd elements', () => {
    const { container } = renderList();
    expect(container.querySelectorAll('dt').length).toBe(2);
    expect(container.querySelectorAll('dd').length).toBe(2);
  });

  it('renders items with correct text', () => {
    renderList();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = vi.fn<(el: HTMLDListElement | null) => void>();
    render(
      <DescriptionList ref={ref}>
        <DescriptionListItem>
          <DescriptionListTerm>Term</DescriptionListTerm>
          <DescriptionListDetails>Details</DescriptionListDetails>
        </DescriptionListItem>
      </DescriptionList>,
    );
    expect(ref).toHaveBeenCalled();
  });

  it('merges custom className', () => {
    const { container } = renderList({ className: 'custom-class' });
    expect(container.querySelector('dl')?.className).toContain('custom-class');
  });

  it('has no accessibility violations', async () => {
    const { container } = renderList();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
