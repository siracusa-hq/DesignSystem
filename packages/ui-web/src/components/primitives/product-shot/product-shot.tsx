import * as React from 'react';
import { cn } from '@/lib/cn';
import styles from './product-shot.module.css';

export interface ProductShotProps {
  src?: string;
  alt?: string;
  /** スクショ以外（動画等）を流す場合 */
  children?: React.ReactNode;
  /** browser = ブラウザクローム付き（既定）/ none = 素の面 */
  frame?: 'browser' | 'none';
  /** 下端フェード（ヒーローの画像下配置と相性が良い） */
  fade?: boolean;
}

/**
 * ProductShot — プロダクト画面の見せ方を1つに固定するプリミティブ。
 * 傾き・パース・自由な影は提供しない（実測8社で傾きスクショは0件。
 * 「毎回違う扱いの画像」がページの統一感を最初に壊す）。
 */
export const ProductShot = React.forwardRef<HTMLDivElement, ProductShotProps>(
  ({ src, alt, children, frame = 'browser', fade = false }, ref) => (
    <div ref={ref} className={cn(styles.shot, fade && styles.fade)}>
      {frame === 'browser' && (
        <div className={styles.chrome} aria-hidden="true">
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
      )}
      <div className={styles.body}>
        {src ? (
          <img src={src} alt={alt ?? ''} className={styles.media} loading="lazy" />
        ) : children ? (
          <div className={styles.slot}>{children}</div>
        ) : (
          <div className={styles.wire} aria-hidden="true">
            <div className={styles.wireSidebar} />
            <div className={styles.wireMain}>
              {[64, 88, 76, 52, 68].map((w, i) => (
                <div
                  key={i}
                  className={cn(styles.wireRow, i === 0 && styles.wireRowAccent)}
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  ),
);
ProductShot.displayName = 'ProductShot';
