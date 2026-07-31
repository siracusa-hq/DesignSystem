import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Tree, type TreeNode } from './tree';

const sampleData: TreeNode[] = [
  {
    id: 'folder-1',
    label: 'Documents',
    children: [
      { id: 'file-1', label: 'readme.txt' },
      { id: 'file-2', label: 'notes.md' },
    ],
  },
  { id: 'file-3', label: 'image.png' },
];

describe('Tree', () => {
  it('renders tree role', () => {
    render(<Tree data={sampleData} />);
    expect(screen.getByRole('tree')).toBeInTheDocument();
  });

  it('renders items', () => {
    render(<Tree data={sampleData} />);
    expect(screen.getByText('Documents')).toBeInTheDocument();
    expect(screen.getByText('image.png')).toBeInTheDocument();
  });

  it('expands node on click to show children', async () => {
    const user = userEvent.setup();
    render(<Tree data={sampleData} />);

    expect(screen.queryByText('readme.txt')).not.toBeInTheDocument();
    await user.click(screen.getByText('Documents'));
    expect(screen.getByText('readme.txt')).toBeInTheDocument();
    expect(screen.getByText('notes.md')).toBeInTheDocument();
  });

  it('collapses node on second click', async () => {
    const user = userEvent.setup();
    render(<Tree data={sampleData} />);

    await user.click(screen.getByText('Documents'));
    expect(screen.getByText('readme.txt')).toBeInTheDocument();

    await user.click(screen.getByText('Documents'));
    expect(screen.queryByText('readme.txt')).not.toBeInTheDocument();
  });

  it('renders children when defaultExpandedIds provided', () => {
    render(<Tree data={sampleData} defaultExpandedIds={['folder-1']} />);
    expect(screen.getByText('readme.txt')).toBeInTheDocument();
  });

  it('applies selected state', () => {
    render(<Tree data={sampleData} selectedId="file-3" />);
    const item = screen.getByText('image.png').closest('[role="treeitem"]');
    expect(item).toHaveAttribute('aria-selected', 'true');
  });

  it('calls onSelect callback', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Tree data={sampleData} onSelect={onSelect} />);

    await user.click(screen.getByText('image.png'));
    expect(onSelect).toHaveBeenCalledWith('file-3');
  });

  it('supports keyboard Enter to expand', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Tree data={sampleData} onSelect={onSelect} />);

    const item = screen.getByText('Documents').closest('[role="treeitem"]')!;
    item.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByText('readme.txt')).toBeInTheDocument();
    expect(onSelect).toHaveBeenCalledWith('folder-1');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Tree data={sampleData} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
