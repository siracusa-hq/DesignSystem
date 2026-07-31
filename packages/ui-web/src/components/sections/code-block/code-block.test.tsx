import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { CodeBlock } from './code-block';

const sampleCode = `import { PolaAuth } from '@polastack/auth';

const auth = new PolaAuth({ tenant: 'my-app' });`;

describe('CodeBlock', () => {
  it('コードを表示する', () => {
    render(<CodeBlock code={sampleCode} />);
    expect(screen.getByText(/PolaAuth/)).toBeInTheDocument();
  });

  it('ファイル名を表示する', () => {
    render(<CodeBlock code={sampleCode} filename="auth.ts" />);
    expect(screen.getByText('auth.ts')).toBeInTheDocument();
  });

  it('コピーボタンを表示する', () => {
    render(<CodeBlock code={sampleCode} filename="auth.ts" />);
    expect(screen.getByText('Copy')).toBeInTheDocument();
  });

  it('タイトルを表示する', () => {
    render(<CodeBlock code={sampleCode} title="コード例" />);
    expect(screen.getByText('コード例')).toBeInTheDocument();
  });

  it('section要素としてレンダリングする', () => {
    const { container } = render(<CodeBlock code={sampleCode} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('a11y違反がない', async () => {
    const { container } = render(<CodeBlock code={sampleCode} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
