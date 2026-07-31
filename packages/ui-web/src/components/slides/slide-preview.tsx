'use client';

import * as React from 'react';
import { colors } from '../../tokens/colors';
import { fontFamily } from '../../tokens/typography';

/**
 * Storybook用スライドプレビューコンテナ
 * Spectacle の Deck を使わずに、スライドを1枚ずつプレビューする
 * 矢印キーとクリックでナビゲーション
 */
export const SlidePreview: React.FC<{ children: React.ReactNode; dark?: boolean }> = ({ children, dark = true }) => {
  const slides = React.Children.toArray(children);
  const [current, setCurrent] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const goNext = () => setCurrent((c) => Math.min(c + 1, slides.length - 1));
  const goPrev = () => setCurrent((c) => Math.max(c - 1, 0));

  React.useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
      e.preventDefault();
      goNext();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      goPrev();
    }
  };

  const bg = dark ? colors.neutral[950] : '#ffffff';
  const fg = dark ? colors.neutral[50] : colors.neutral[900];
  const bgNav = dark ? colors.neutral[900] : colors.neutral[100];
  const borderNav = dark ? colors.neutral[800] : colors.neutral[200];
  const borderBtn = dark ? colors.neutral[700] : colors.neutral[300];
  const textBtn = dark ? colors.neutral[300] : colors.neutral[600];
  const textDisabled = dark ? colors.neutral[600] : colors.neutral[400];

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: dark ? colors.neutral[900] : colors.neutral[50],
        display: 'flex',
        flexDirection: 'column',
        outline: 'none',
        fontFamily: fontFamily.sans,
      }}
    >
      {/* スライドエリア */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
        onClick={goNext}
      >
        <div
          style={{
            width: '960px',
            height: '540px',
            backgroundColor: bg,
            color: fg,
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: dark
              ? '0 25px 50px -12px rgba(0,0,0,0.5)'
              : '0 25px 50px -12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'stretch',
            position: 'relative',
          }}
        >
          <div style={{ width: '100%', padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            {slides[current]}
          </div>
        </div>
      </div>

      {/* ナビゲーションバー */}
      <div
        style={{
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          backgroundColor: bgNav,
          borderTop: `1px solid ${borderNav}`,
        }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          disabled={current === 0}
          style={{
            padding: '6px 16px',
            borderRadius: '8px',
            border: `1px solid ${borderBtn}`,
            backgroundColor: 'transparent',
            color: current === 0 ? textDisabled : textBtn,
            cursor: current === 0 ? 'default' : 'pointer',
            fontSize: '14px',
            fontFamily: fontFamily.sans,
          }}
        >
          ← Prev
        </button>
        <span style={{ fontSize: '14px', color: colors.neutral[400], fontFamily: fontFamily.mono }}>
          {current + 1} / {slides.length}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          disabled={current === slides.length - 1}
          style={{
            padding: '6px 16px',
            borderRadius: '8px',
            border: `1px solid ${borderBtn}`,
            backgroundColor: 'transparent',
            color: current === slides.length - 1 ? textDisabled : textBtn,
            cursor: current === slides.length - 1 ? 'default' : 'pointer',
            fontSize: '14px',
            fontFamily: fontFamily.sans,
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

SlidePreview.displayName = 'SlidePreview';
