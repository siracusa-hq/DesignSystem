import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Section } from './section';

describe('Section', () => {
  it('section要素としてレンダリングする', () => {
    render(<Section>セクション内容</Section>);
    const el = screen.getByText('セクション内容');
    expect(el.tagName).toBe('SECTION');
  });

  it('spacingバリアントを適用する', () => {
    const { container } = render(<Section spacing="lg">内容</Section>);
    expect(container.firstChild).toHaveClass('spacingLg');
  });

  it('backgroundバリアントを適用する', () => {
    const { container } = render(<Section background="dark">内容</Section>);
    expect(container.firstChild).toHaveClass('bgDark');
  });

  it('a11y違反がない', async () => {
    const { container } = render(<Section aria-label="テストセクション">内容</Section>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
