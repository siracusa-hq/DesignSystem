import * as React from 'react';
import { cn } from '@/lib/cn';
import styles from './logo-mark.module.css';

export interface LogoMarkProps {
  /** 画像ロゴの場合。children とどちらか一方 */
  src?: string;
  /** src を渡す場合は必須（企業名） */
  alt?: string;
  /** インラインSVG等を渡す場合 */
  children?: React.ReactNode;
  /** 高さの正規化。ロゴ帯では全ロゴ同じ size を使うこと */
  size?: 'sm' | 'md' | 'lg';
  /** ロゴ帯でのグレースケール表示（ホバーで原色に戻る） */
  grayscale?: boolean;
}

/**
 * LogoMark — ロゴ表示の正規化プリミティブ。
 *
 * `LogoItem.logo: ReactNode` の素通しを置き換える（縦横比バラバラのロゴが
 * 並んだときに高さ・余白・彩度の扱いが毎回違う、を構造的に防ぐ）。
 */
export const LogoMark = React.forwardRef<HTMLSpanElement, LogoMarkProps>(
  ({ src, alt, children, size = 'md', grayscale = false }, ref) => (
    <span
      ref={ref}
      className={cn(
        styles.logoMark,
        size === 'sm' && styles.sizeSm,
        size === 'md' && styles.sizeMd,
        size === 'lg' && styles.sizeLg,
        grayscale && styles.grayscale,
      )}
    >
      {src ? <img src={src} alt={alt ?? ''} className={styles.media} loading="lazy" /> : children}
    </span>
  ),
);
LogoMark.displayName = 'LogoMark';
