import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Text } from './text';

describe('Text', () => {
  it('デフォルトでp要素としてレンダリングする', () => {
    render(<Text>テキスト</Text>);
    const el = screen.getByText('テキスト');
    expect(el.tagName).toBe('P');
  });

  it('as propでタグを変更できる', () => {
    render(<Text as="span">スパンテキスト</Text>);
    const el = screen.getByText('スパンテキスト');
    expect(el.tagName).toBe('SPAN');
  });

  it('sizeバリアントを適用する', () => {
    const { container } = render(<Text size="body-lg">大きいテキスト</Text>);
    expect(container.firstChild).toHaveClass('text-body-lg');
  });

  it('toneバリアントを適用する', () => {
    const { container } = render(<Text tone="muted">薄いテキスト</Text>);
    expect(container.firstChild).toHaveClass('text-neutral-500');
  });

  it('a11y違反がない', async () => {
    const { container } = render(<Text>アクセシブルなテキスト</Text>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
