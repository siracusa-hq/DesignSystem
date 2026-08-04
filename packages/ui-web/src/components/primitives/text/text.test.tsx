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
    expect(container.firstChild).toHaveClass('bodyLg');
  });

  it('toneバリアントを適用する', () => {
    const { container } = render(<Text tone="muted">薄いテキスト</Text>);
    expect(container.firstChild).toHaveClass('toneMuted');
  });

  it('a11y違反がない', async () => {
    const { container } = render(<Text>アクセシブルなテキスト</Text>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('clauseWrap（和文リード文の節ラップ）', () => {
  it('読点・句点で節に分割され、各節が inline-block になる', () => {
    const { container } = render(<Text clauseWrap>{'色が違っても、同じ会社のトーンで。'}</Text>);
    const clauses = container.querySelectorAll('span.clause');
    expect(clauses).toHaveLength(2);
    expect(clauses[0].textContent).toBe('色が違っても、');
    expect(clauses[1].textContent).toBe('同じ会社のトーンで。');
  });

  it('区切りの無い欧文はそのまま', () => {
    const { container } = render(<Text clauseWrap>{'One calm tone across brands'}</Text>);
    expect(container.querySelectorAll('span.clause')).toHaveLength(0);
  });
});
