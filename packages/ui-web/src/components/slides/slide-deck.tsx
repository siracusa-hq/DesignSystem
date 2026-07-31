import * as React from 'react';
import { Deck } from 'spectacle';
import { polastackTheme, polastackDarkTheme } from './theme';

type DeckComponentProps = React.ComponentProps<typeof Deck>;

export interface SlideDeckProps extends Partial<DeckComponentProps> {
  /** ダークテーマを使用 */
  dark?: boolean;
  children: React.ReactNode;
}

/**
 * Polastack ブランドテーマ適用済みスライドデッキ
 * Spectacle の Deck ラッパー
 */
export const SlideDeck: React.FC<SlideDeckProps> = ({
  dark = true,
  children,
  ...props
}) => (
  <Deck theme={dark ? polastackDarkTheme : polastackTheme} {...props}>
    {children}
  </Deck>
);

SlideDeck.displayName = 'SlideDeck';
