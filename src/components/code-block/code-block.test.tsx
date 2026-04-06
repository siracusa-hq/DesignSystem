import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { CodeBlock } from './code-block';

describe('CodeBlock', () => {
  it('renders code content', () => {
    render(<CodeBlock>{'const x = 1;'}</CodeBlock>);
    expect(screen.getByText('const x = 1;')).toBeInTheDocument();
  });

  it('shows language label', () => {
    render(<CodeBlock language="typescript">{'const x = 1;'}</CodeBlock>);
    expect(screen.getByText('typescript')).toBeInTheDocument();
  });

  it('shows title when provided', () => {
    render(
      <CodeBlock language="typescript" title="example.ts">
        {'const x = 1;'}
      </CodeBlock>,
    );
    expect(screen.getByText('example.ts')).toBeInTheDocument();
  });

  it('shows line numbers when enabled', () => {
    render(
      <CodeBlock language="js" showLineNumbers>
        {'line1\nline2\nline3'}
      </CodeBlock>,
    );
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('copy button copies code and shows copied state', async () => {
    const user = userEvent.setup();
    render(<CodeBlock language="js">{'const x = 1;'}</CodeBlock>);
    const copyButton = screen.getByRole('button', { name: 'Copy code' });
    await user.click(copyButton);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
    });
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <CodeBlock language="typescript">{'const x = 1;'}</CodeBlock>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
