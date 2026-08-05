import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { CodeBlock } from './code-block';

const sampleCode = `import { PolaAuth } from '@siracusahq/auth';

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

  it('description が無ければ中央寄せ、あれば横並びになる（layout prop は持たない）', () => {
    const centered = render(<CodeBlock code={sampleCode} title="t" />).container;
    expect(centered.querySelector('.split')).not.toBeInTheDocument();

    const split = render(
      <CodeBlock code={sampleCode} title="t" description={<p>補足</p>} />,
    ).container;
    expect(split.querySelector('.split')).toBeInTheDocument();
    expect(split).toHaveTextContent('補足');
  });

  it('a11y違反がない', async () => {
    const { container } = render(<CodeBlock code={sampleCode} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
