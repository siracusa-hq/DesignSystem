import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import type { ColumnDef } from '@tanstack/react-table';
import { useResponsiveColumns } from './use-responsive-columns';

interface TestData {
  name: string;
  email: string;
  role: string;
}

const columns: ColumnDef<TestData, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email', meta: { responsive: 'md', popIn: true } },
  { accessorKey: 'role', header: 'Role', meta: { responsive: 'lg' } },
];

describe('useResponsiveColumns', () => {
  it('shows all columns at lg breakpoint', () => {
    const { result } = renderHook(() =>
      useResponsiveColumns(columns, 'lg'),
    );
    expect(result.current.responsiveVisibility).toEqual({});
    expect(result.current.poppedInColumnIds).toEqual([]);
  });

  it('hides lg-only columns at md breakpoint', () => {
    const { result } = renderHook(() =>
      useResponsiveColumns(columns, 'md'),
    );
    expect(result.current.responsiveVisibility).toEqual({ role: false });
    expect(result.current.poppedInColumnIds).toEqual([]);
  });

  it('hides md+ columns at sm breakpoint and pops in those with popIn', () => {
    const { result } = renderHook(() =>
      useResponsiveColumns(columns, 'sm'),
    );
    expect(result.current.responsiveVisibility).toEqual({
      email: false,
      role: false,
    });
    expect(result.current.poppedInColumnIds).toEqual(['email']);
  });

  it('hides md+ columns at base breakpoint', () => {
    const { result } = renderHook(() =>
      useResponsiveColumns(columns, 'base'),
    );
    expect(result.current.responsiveVisibility).toEqual({
      email: false,
      role: false,
    });
    expect(result.current.poppedInColumnIds).toEqual(['email']);
  });

  it('returns empty when no columns have responsive metadata', () => {
    const plainColumns: ColumnDef<TestData, unknown>[] = [
      { accessorKey: 'name', header: 'Name' },
    ];
    const { result } = renderHook(() =>
      useResponsiveColumns(plainColumns, 'base'),
    );
    expect(result.current.responsiveVisibility).toEqual({});
    expect(result.current.poppedInColumnIds).toEqual([]);
  });
});
