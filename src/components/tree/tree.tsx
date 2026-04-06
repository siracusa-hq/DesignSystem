import * as React from 'react';
import { ChevronRight, File as FileIcon, Folder, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/cn';

/* ---------------------------------------------------------------
   Types
   --------------------------------------------------------------- */

export interface TreeNode {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: TreeNode[];
}

export interface TreeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  data: TreeNode[];
  defaultExpandedIds?: string[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}

/* ---------------------------------------------------------------
   Context
   --------------------------------------------------------------- */

interface TreeContextValue {
  expandedIds: Set<string>;
  toggleExpanded: (id: string) => void;
  selectedId?: string;
  onSelect?: (id: string) => void;
}

const TreeContext = React.createContext<TreeContextValue | null>(null);

function useTreeContext() {
  const ctx = React.useContext(TreeContext);
  if (!ctx) throw new Error('Tree.* must be used within <Tree>');
  return ctx;
}

/* ---------------------------------------------------------------
   Tree (Root)
   --------------------------------------------------------------- */

export const Tree = React.forwardRef<HTMLDivElement, TreeProps>(
  ({ data, defaultExpandedIds = [], selectedId, onSelect, className, ...props }, ref) => {
    const [expandedIds, setExpandedIds] = React.useState(
      () => new Set(defaultExpandedIds),
    );

    const toggleExpanded = React.useCallback((id: string) => {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    }, []);

    const ctx = React.useMemo<TreeContextValue>(
      () => ({ expandedIds, toggleExpanded, selectedId, onSelect }),
      [expandedIds, toggleExpanded, selectedId, onSelect],
    );

    return (
      <TreeContext.Provider value={ctx}>
        <div ref={ref} role="tree" className={cn('text-sm', className)} {...props}>
          <TreeBranch nodes={data} level={0} />
        </div>
      </TreeContext.Provider>
    );
  },
);
Tree.displayName = 'Tree';

/* ---------------------------------------------------------------
   TreeBranch (Internal - recursive)
   --------------------------------------------------------------- */

function TreeBranch({ nodes, level }: { nodes: TreeNode[]; level: number }) {
  return (
    <div role="group">
      {nodes.map((node) => (
        <TreeItem key={node.id} node={node} level={level} />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------
   TreeItem (Internal)
   --------------------------------------------------------------- */

function TreeItem({ node, level }: { node: TreeNode; level: number }) {
  const { expandedIds, toggleExpanded, selectedId, onSelect } = useTreeContext();
  const hasBranch = node.children && node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;

  const handleClick = () => {
    if (hasBranch) {
      toggleExpanded(node.id);
    }
    onSelect?.(node.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    } else if (e.key === 'ArrowRight' && hasBranch && !isExpanded) {
      e.preventDefault();
      toggleExpanded(node.id);
    } else if (e.key === 'ArrowLeft' && hasBranch && isExpanded) {
      e.preventDefault();
      toggleExpanded(node.id);
    }
  };

  const defaultIcon = hasBranch
    ? isExpanded
      ? <FolderOpen className="size-4 text-[var(--color-on-surface-muted)]" />
      : <Folder className="size-4 text-[var(--color-on-surface-muted)]" />
    : <FileIcon className="size-4 text-[var(--color-on-surface-muted)]" />;

  return (
    <div
      role="treeitem"
      aria-expanded={hasBranch ? isExpanded : undefined}
      aria-selected={isSelected}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="outline-none"
    >
      <div
        className={cn(
          'flex h-8 cursor-pointer items-center gap-1 rounded-md px-2 transition-colors',
          'hover:bg-[var(--color-surface-muted)]',
          'focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-1',
          isSelected && 'bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-300',
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasBranch ? (
          <ChevronRight
            className={cn(
              'size-4 shrink-0 text-[var(--color-on-surface-muted)] transition-transform duration-200',
              isExpanded && 'rotate-90',
            )}
          />
        ) : (
          <span className="size-4 shrink-0" />
        )}
        {node.icon ?? defaultIcon}
        <span className="truncate">{node.label}</span>
      </div>
      {hasBranch && isExpanded && (
        <TreeBranch nodes={node.children!} level={level + 1} />
      )}
    </div>
  );
}
