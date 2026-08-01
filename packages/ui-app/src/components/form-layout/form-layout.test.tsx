import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { FormLayout, FormSection, FormActions } from './form-layout';

describe('FormLayout', () => {
  it('renders children', () => {
    render(<FormLayout>Content</FormLayout>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies vertical layout by default', () => {
    const { container } = render(<FormLayout>Content</FormLayout>);
    expect(container.firstChild).toHaveClass('flex', 'flex-col');
  });

  it('applies horizontal layout', () => {
    const { container } = render(<FormLayout layout="horizontal">Content</FormLayout>);
    expect(container.firstChild).toHaveClass('grid');
  });

  it('applies grid layout', () => {
    const { container } = render(<FormLayout layout="grid">Content</FormLayout>);
    expect(container.firstChild).toHaveClass('grid');
  });

  it('applies size variants', () => {
    const { container } = render(<FormLayout size="lg">Content</FormLayout>);
    expect(container.firstChild).toHaveClass('gap-6');
  });

  it('applies custom columns for grid layout', () => {
    const { container } = render(
      <FormLayout layout="grid" columns={3}>Content</FormLayout>,
    );
    expect((container.firstChild as HTMLElement).style.gridTemplateColumns).toBe(
      'repeat(3, 1fr)',
    );
  });

  it('forwards ref', () => {
    let ref: HTMLDivElement | null = null;
    render(<FormLayout ref={(el) => { ref = el; }}>Test</FormLayout>);
    expect(ref).toBeInstanceOf(HTMLDivElement);
  });

  it('merges className', () => {
    const { container } = render(<FormLayout className="custom">Test</FormLayout>);
    expect(container.firstChild).toHaveClass('custom');
  });
});

describe('FormSection', () => {
  it('renders as fieldset with legend', () => {
    render(
      <FormSection title="Personal Info">
        <div>Fields</div>
      </FormSection>,
    );
    expect(screen.getByText('Personal Info').tagName).toBe('LEGEND');
    expect(screen.getByText('Fields')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(
      <FormSection title="Info" description="Fill in your details">
        <div>Fields</div>
      </FormSection>,
    );
    expect(screen.getByText('Fill in your details')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <FormSection title="Section">
        <div>Content</div>
      </FormSection>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('FormActions', () => {
  it('renders children', () => {
    render(
      <FormActions>
        <button>Save</button>
        <button>Cancel</button>
      </FormActions>,
    );
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('applies right alignment by default', () => {
    const { container } = render(<FormActions><button>Save</button></FormActions>);
    expect(container.firstChild).toHaveClass('justify-end');
  });

  it('applies custom alignment', () => {
    const { container } = render(
      <FormActions align="between"><button>Save</button></FormActions>,
    );
    expect(container.firstChild).toHaveClass('justify-between');
  });

  it('forwards ref', () => {
    let ref: HTMLDivElement | null = null;
    render(
      <FormActions ref={(el) => { ref = el; }}>
        <button>Save</button>
      </FormActions>,
    );
    expect(ref).toBeInstanceOf(HTMLDivElement);
  });
});
