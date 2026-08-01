import * as React from 'react';

/**
 * 型安全なReactコンテキストファクトリ。
 * Provider外での使用時に明確なエラーメッセージを提供する。
 */
export function createContext<T>(displayName: string) {
  const Context = React.createContext<T | undefined>(undefined);
  Context.displayName = displayName;

  function useContext() {
    const context = React.useContext(Context);
    if (context === undefined) {
      throw new Error(`use${displayName} must be used within a ${displayName}Provider`);
    }
    return context;
  }

  return [Context.Provider, useContext] as const;
}
