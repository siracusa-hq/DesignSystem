import * as React from 'react';
import { cn } from '@/lib/cn';
import styles from './avatar.module.css';

export interface AvatarProps {
  src?: string;
  /** 表示名（src 無し時はイニシャルを表示。img の alt にも使う） */
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASS = { sm: styles.sizeSm, md: styles.sizeMd, lg: styles.sizeLg } as const;

/** Avatar — 1:1・円形固定。src 無しはイニシャルにフォールバック */
export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ src, name, size = 'md' }, ref) => (
    <span ref={ref} className={cn(styles.avatar, SIZE_CLASS[size])}>
      {src ? (
        <img src={src} alt={name} className={styles.img} loading="lazy" />
      ) : (
        <span aria-hidden="true">{name.slice(0, 2)}</span>
      )}
    </span>
  ),
);
Avatar.displayName = 'Avatar';
