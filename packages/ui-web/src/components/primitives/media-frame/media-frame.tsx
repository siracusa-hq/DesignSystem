import * as React from 'react';
import { cn } from '@/lib/cn';
import styles from './media-frame.module.css';

export type MediaRatio = '16:9' | '4:3' | '3:2' | '1:1';

const RATIO_CLASS: Record<MediaRatio, string> = {
  '16:9': styles.ratio16x9,
  '4:3': styles.ratio4x3,
  '3:2': styles.ratio3x2,
  '1:1': styles.ratio1x1,
};

export interface MediaFrameProps {
  /** 画像の場合 */
  src?: string;
  /** src を渡す場合は必須 */
  alt?: string;
  /** 動画・iframe 等を渡す場合（絶対配置で全面に敷かれる） */
  children?: React.ReactNode;
  /** 縦横比は固定値のみ（自由比率は許さない） */
  ratio?: MediaRatio;
  /** プレースホルダのラベル（素材未定時） */
  placeholderLabel?: string;
}

/**
 * MediaFrame — 固定アスペクト比のメディアスロット。
 * src / children のどちらも無い場合はプレースホルダを表示するため、
 * 素材が揃う前にページ構造を組める。
 */
export const MediaFrame = React.forwardRef<HTMLDivElement, MediaFrameProps>(
  ({ src, alt, children, ratio = '16:9', placeholderLabel }, ref) => (
    <div ref={ref} className={cn(styles.frame, RATIO_CLASS[ratio])}>
      {src ? (
        <img src={src} alt={alt ?? ''} className={styles.media} loading="lazy" />
      ) : children ? (
        <div className={styles.slot}>{children}</div>
      ) : (
        <div className={styles.placeholder} aria-hidden="true">
          {placeholderLabel ?? `メディア（${ratio}）`}
        </div>
      )}
    </div>
  ),
);
MediaFrame.displayName = 'MediaFrame';
