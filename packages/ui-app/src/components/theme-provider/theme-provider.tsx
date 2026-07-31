'use client';

import * as React from 'react';
import {
  useTheme as useThemeHook,
  type Theme,
  type ResolvedTheme,
  type UseThemeReturn,
} from '../../hooks/use-theme';

interface ThemeContextValue extends UseThemeReturn {}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);
ThemeContext.displayName = 'ThemeContext';

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey,
}: ThemeProviderProps) {
  const themeValue = useThemeHook({ defaultTheme, storageKey });

  return (
    <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
  );
}

ThemeProvider.displayName = 'ThemeProvider';

export function useTheme(): UseThemeReturn {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export type { Theme, ResolvedTheme };
