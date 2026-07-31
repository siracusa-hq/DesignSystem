/**
 * Polastack Spectacle テーマ
 * デザイントークンと統一したスライドテーマ定義
 */

import { colors } from '../../tokens/colors';
import { fontFamily } from '../../tokens/typography';

export const polastackTheme = {
  fonts: {
    header: fontFamily.sans,
    text: fontFamily.sans,
    monospace: fontFamily.mono,
  },
  colors: {
    primary: colors.primary[500],
    secondary: colors.primary[400],
    tertiary: colors.neutral[900],
    quaternary: colors.neutral[50],
  },
  fontSizes: {
    header: '48px',
    text: '24px',
    monospace: '18px',
  },
  space: [0, 8, 16, 24, 32, 48, 64, 96] as number[],
};

export const polastackDarkTheme = {
  ...polastackTheme,
  colors: {
    primary: colors.primary[400],
    secondary: colors.primary[300],
    tertiary: colors.neutral[50],
    quaternary: colors.neutral[950],
  },
};
