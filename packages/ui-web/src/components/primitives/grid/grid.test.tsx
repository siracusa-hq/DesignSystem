import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Grid } from './grid';

describe('Grid', () => {
  it('子要素をレンダリングする', () => {
    render(
      <Grid>
        <div>アイテム1</div>
        <div>アイテム2</div>
      </Grid>,
    );
    expect(screen.getByText('アイテム1')).toBeInTheDocument();
    expect(screen.getByText('アイテム2')).toBeInTheDocument();
  });

  it('columnsバリアントを適用する', () => {
    const { container } = render(<Grid columns={4}>内容</Grid>);
    expect(container.firstChild).toHaveClass('cols4');
  });

  it('gapバリアントを適用する', () => {
    const { container } = render(<Grid gap="lg">内容</Grid>);
    expect(container.firstChild).toHaveClass('gapLg');
  });

  it('a11y違反がない', async () => {
    const { container } = render(
      <Grid>
        <div>アイテム</div>
      </Grid>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
