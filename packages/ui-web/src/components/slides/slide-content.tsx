'use client';

/**
 * Storybook プレビュー用のスライドコンテンツコンポーネント
 * Spectacle に依存せず、純粋な React + インラインスタイルで描画
 * ライト/ダークテーマ対応
 */
import * as React from 'react';
import { colors } from '../../tokens/colors';

/* ============================================================
   テーマコンテキスト
   ============================================================ */

const SlideThemeContext = React.createContext<'light' | 'dark'>('light');

export const SlideThemeProvider: React.FC<{ dark?: boolean; children: React.ReactNode }> = ({ dark = false, children }) => (
  <SlideThemeContext.Provider value={dark ? 'dark' : 'light'}>{children}</SlideThemeContext.Provider>
);

function useSlideTheme() {
  const theme = React.useContext(SlideThemeContext);
  const isDark = theme === 'dark';
  return {
    isDark,
    fg: isDark ? colors.neutral[50] : colors.neutral[900],
    fgSecondary: isDark ? colors.neutral[400] : colors.neutral[500],
    fgMuted: isDark ? colors.neutral[500] : colors.neutral[400],
    accent: isDark ? colors.primary[400] : colors.primary[500],
    accentBg: isDark ? colors.primary[900] : colors.primary[50],
    accentFg: isDark ? colors.primary[400] : colors.primary[600],
    border: isDark ? colors.neutral[800] : colors.neutral[200],
    cardBg: isDark ? colors.neutral[900] : colors.neutral[50],
    negativeFg: isDark ? colors.neutral[500] : colors.neutral[400],
  };
}

/* ============================================================
   共通スタイルヘルパー
   ============================================================ */

const h1 = (fg: string): React.CSSProperties => ({ fontSize: '48px', fontWeight: 800, letterSpacing: '-0.04em', margin: 0, lineHeight: 1.1, color: fg });
const h2 = (fg: string): React.CSSProperties => ({ fontSize: '36px', fontWeight: 700, letterSpacing: '-0.03em', margin: 0, lineHeight: 1.2, color: fg });
const body = (c: string): React.CSSProperties => ({ fontSize: '20px', color: c, margin: 0, lineHeight: 1.6 });
const small = (c: string): React.CSSProperties => ({ fontSize: '16px', color: c, margin: 0, lineHeight: 1.5 });
const caption = (c: string): React.CSSProperties => ({ fontSize: '13px', color: c, margin: 0 });
const badgeStyle: React.CSSProperties = { display: 'inline-block', padding: '4px 16px', backgroundColor: colors.primary[500], borderRadius: '9999px', fontSize: '14px', fontWeight: 600, color: '#fff' };

/* ============================================================
   Structure
   ============================================================ */

export const PTitleSlide: React.FC<{ badge?: string; title: string; subtitle?: string }> = ({ badge, title, subtitle }) => {
  const t = useSlideTheme();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
      {badge && <span style={{ ...badgeStyle, marginBottom: '20px' }}>{badge}</span>}
      <h1 style={h1(t.fg)}>{title}</h1>
      {subtitle && <p style={{ ...body(t.fgSecondary), marginTop: '12px', maxWidth: '600px' }}>{subtitle}</p>}
    </div>
  );
};

export const PAgendaSlide: React.FC<{ title?: string; items: { number: string; label: string }[]; activeIndex?: number }> = ({ title = 'Agenda', items, activeIndex }) => {
  const t = useSlideTheme();
  return (
    <div>
      <h2 style={h2(t.fg)}>{title}</h2>
      <div style={{ marginTop: '32px' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: i < items.length - 1 ? `1px solid ${t.border}` : 'none', opacity: activeIndex != null && activeIndex !== i ? 0.3 : 1 }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: activeIndex === i ? t.accent : t.fgMuted, width: '50px' }}>{item.number}</span>
            <span style={{ fontSize: '22px', fontWeight: activeIndex === i ? 600 : 400, color: activeIndex === i ? t.accent : t.fg }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PSectionDividerSlide: React.FC<{ sectionNumber?: string; title: string; subtitle?: string }> = ({ sectionNumber, title, subtitle }) => {
  const t = useSlideTheme();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      {sectionNumber && <span style={{ fontSize: '100px', fontWeight: 800, color: t.isDark ? colors.primary[900] : colors.primary[300], lineHeight: 1 }}>{sectionNumber}</span>}
      <h2 style={{ ...h1(t.fg), marginTop: sectionNumber ? '-16px' : 0, position: 'relative', zIndex: 1 }}>{title}</h2>
      {subtitle && <p style={{ ...body(t.fgSecondary), marginTop: '12px' }}>{subtitle}</p>}
    </div>
  );
};

export const PEndSlide: React.FC<{ title: string; subtitle?: string; ctaLabel?: string; contactItems?: { label: string; value: string }[] }> = ({ title, subtitle, ctaLabel, contactItems }) => {
  const t = useSlideTheme();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <h2 style={h1(t.fg)}>{title}</h2>
      {subtitle && <p style={{ ...body(t.fgSecondary), marginTop: '12px' }}>{subtitle}</p>}
      {ctaLabel && <div style={{ ...badgeStyle, marginTop: '24px', padding: '10px 28px', fontSize: '16px', borderRadius: '12px' }}>{ctaLabel}</div>}
      {contactItems && (
        <div style={{ display: 'flex', gap: '32px', marginTop: '28px' }}>
          {contactItems.map((c, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={caption(t.fgMuted)}>{c.label}</div>
              <div style={{ fontSize: '15px', fontWeight: 500, marginTop: '2px', color: t.fg }}>{c.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const PTeamSlide: React.FC<{ title?: string; members: { name: string; role: string; description?: string }[] }> = ({ title = 'Team', members }) => {
  const t = useSlideTheme();
  return (
    <div>
      <h2 style={{ ...h2(t.fg), textAlign: 'center' }}>{title}</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '32px' }}>
        {members.map((m, i) => (
          <div key={i} style={{ textAlign: 'center', width: `${Math.floor(80 / members.length)}%` }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: t.accentBg, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 600, color: t.accentFg }}>{m.name.charAt(0)}</div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: t.fg }}>{m.name}</div>
            <div style={{ fontSize: '13px', color: t.accent }}>{m.role}</div>
            {m.description && <div style={caption(t.fgMuted)}>{m.description}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ============================================================
   Content
   ============================================================ */

export const PBulletSlide: React.FC<{ title: string; subtitle?: string; items: { text: string; subText?: string }[] }> = ({ title, subtitle, items }) => {
  const t = useSlideTheme();
  return (
    <div>
      <h2 style={h2(t.fg)}>{title}</h2>
      {subtitle && <p style={{ ...body(t.fgSecondary), marginTop: '6px' }}>{subtitle}</p>}
      <div style={{ marginTop: '24px' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', padding: '6px 0' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: t.accent, marginTop: '8px', marginRight: '12px', flexShrink: 0 }} />
            <div>
              <span style={{ fontSize: '18px', fontWeight: 500, color: t.fg }}>{item.text}</span>
              {item.subText && <div style={caption(t.fgMuted)}>{item.subText}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PComparisonSlide: React.FC<{ title: string; leftHeader: string; rightHeader: string; leftItems: string[]; rightItems: string[] }> = ({ title, leftHeader, rightHeader, leftItems, rightItems }) => {
  const t = useSlideTheme();
  return (
    <div>
      <h2 style={h2(t.fg)}>{title}</h2>
      <div style={{ display: 'flex', marginTop: '24px', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '18px', fontWeight: 600, color: t.negativeFg, marginBottom: '16px' }}>{leftHeader}</div>
          {leftItems.map((item, i) => <div key={i} style={{ padding: '6px 0', fontSize: '16px', color: t.negativeFg }}>✕ {item}</div>)}
        </div>
        <div style={{ width: '1px', backgroundColor: t.border, alignSelf: 'stretch' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '18px', fontWeight: 600, color: t.accent, marginBottom: '16px' }}>{rightHeader}</div>
          {rightItems.map((item, i) => <div key={i} style={{ padding: '6px 0', fontSize: '16px', color: t.fg }}><span style={{ color: t.accent }}>✓</span> {item}</div>)}
        </div>
      </div>
    </div>
  );
};

export const PThreeColumnSlide: React.FC<{ title: string; columns: { title: string; description: string }[] }> = ({ title, columns: cols }) => {
  const t = useSlideTheme();
  return (
    <div>
      <h2 style={{ ...h2(t.fg), textAlign: 'center' }}>{title}</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
        {cols.map((col, i) => (
          <div key={i} style={{ width: '30%', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 600, color: t.fg, marginBottom: '6px' }}>{col.title}</div>
            <div style={small(t.fgSecondary)}>{col.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ============================================================
   Data
   ============================================================ */

export const PStatSlide: React.FC<{ title?: string; stats: { value: string; label: string }[] }> = ({ title, stats }) => {
  const t = useSlideTheme();
  return (
    <div>
      {title && <h2 style={{ ...h2(t.fg), textAlign: 'center', marginBottom: '36px' }}>{title}</h2>}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '48px' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '56px', fontWeight: 800, color: t.accent, letterSpacing: '-0.04em', lineHeight: 1 }}>{s.value}</div>
            <div style={{ ...small(t.fgSecondary), marginTop: '8px' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PMetricHighlightSlide: React.FC<{ context?: string; value: string; suffix?: string; description?: string }> = ({ context, value, suffix, description }) => {
  const t = useSlideTheme();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      {context && <p style={{ ...body(t.fgSecondary), marginBottom: '12px' }}>{context}</p>}
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <span style={{ fontSize: '100px', fontWeight: 800, color: t.accent, letterSpacing: '-0.05em', lineHeight: 1 }}>{value}</span>
        {suffix && <span style={{ fontSize: '32px', fontWeight: 600, color: t.accent, marginLeft: '6px' }}>{suffix}</span>}
      </div>
      {description && <p style={{ ...body(t.fgSecondary), marginTop: '16px', textAlign: 'center', maxWidth: '500px' }}>{description}</p>}
    </div>
  );
};

export const PBeforeAfterMetricSlide: React.FC<{ title: string; beforeValue: string; beforeLabel: string; afterValue: string; afterLabel: string; improvement?: string }> = ({ title, beforeValue, beforeLabel, afterValue, afterLabel, improvement }) => {
  const t = useSlideTheme();
  return (
    <div>
      <h2 style={{ ...h2(t.fg), textAlign: 'center', marginBottom: '36px' }}>{title}</h2>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ ...caption(t.negativeFg), textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>Before</div>
          <div style={{ fontSize: '52px', fontWeight: 800, color: t.negativeFg, letterSpacing: '-0.04em' }}>{beforeValue}</div>
          <div style={small(t.negativeFg)}>{beforeLabel}</div>
        </div>
        <span style={{ fontSize: '32px', color: t.fgMuted }}>→</span>
        <div style={{ textAlign: 'center' }}>
          <div style={{ ...caption(t.accent), textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>After</div>
          <div style={{ fontSize: '52px', fontWeight: 800, color: t.accent, letterSpacing: '-0.04em' }}>{afterValue}</div>
          <div style={{ ...small(t.accent) }}>{afterLabel}</div>
        </div>
      </div>
      {improvement && <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '22px', fontWeight: 700, color: t.accent }}>{improvement}</div>}
    </div>
  );
};

/* ============================================================
   Social Proof
   ============================================================ */

export const PQuoteSlide: React.FC<{ quote: string; author: string; role?: string; company?: string }> = ({ quote, author, role, company }) => {
  const t = useSlideTheme();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div style={{ ...caption(t.accent), textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '20px' }}>Testimonial</div>
      <p style={{ fontSize: '28px', fontWeight: 500, textAlign: 'center', maxWidth: '700px', lineHeight: 1.5, margin: 0, color: t.fg }}>&ldquo;{quote}&rdquo;</p>
      <div style={{ fontSize: '16px', fontWeight: 600, marginTop: '24px', color: t.fg }}>{author}</div>
      {(role || company) && <div style={caption(t.fgMuted)}>{[role, company].filter(Boolean).join(' / ')}</div>}
    </div>
  );
};

export const PFlowSlide: React.FC<{ title: string; steps: { title: string; description?: string }[] }> = ({ title, steps }) => {
  const t = useSlideTheme();
  return (
    <div>
      <h2 style={{ ...h2(t.fg), textAlign: 'center' }}>{title}</h2>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginTop: '36px' }}>
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <div style={{ textAlign: 'center', width: `${Math.floor(60 / steps.length)}%` }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: t.accentBg, margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700, color: t.accentFg }}>{i + 1}</div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: t.fg }}>{step.title}</div>
              {step.description && <div style={caption(t.fgMuted)}>{step.description}</div>}
            </div>
            {i < steps.length - 1 && <span style={{ fontSize: '20px', color: t.fgMuted, marginTop: '12px' }}>→</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export const PLogoGridSlide: React.FC<{ title?: string; count?: number }> = ({ title = 'Trusted by', count = 8 }) => {
  const t = useSlideTheme();
  return (
    <div>
      <h2 style={{ ...h2(t.fg), textAlign: 'center', marginBottom: '36px' }}>{title}</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={{ width: '100px', height: '40px', borderRadius: '8px', backgroundColor: t.cardBg, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.6 }}>
            <span style={{ fontSize: '11px', color: t.fgMuted }}>Logo {i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ============================================================
   Japan-specific
   ============================================================ */

export const PSecuritySlide: React.FC<{ title?: string; items: string[] }> = ({ title = 'Security', items }) => {
  const t = useSlideTheme();
  return (
    <div>
      <h2 style={{ ...h2(t.fg), textAlign: 'center' }}>{title}</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '32px' }}>
        {items.map((item, i) => (
          <div key={i} style={{ textAlign: 'center', width: '120px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: t.accentBg, margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.accentFg }}>✓</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: t.fg }}>{item}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PROISlide: React.FC<{ title?: string; items: { category: string; before: string; after: string; savings?: string }[]; totalROI?: string }> = ({ title = 'ROI', items, totalROI }) => {
  const t = useSlideTheme();
  return (
    <div>
      <h2 style={{ ...h2(t.fg), textAlign: 'center', marginBottom: '24px' }}>{title}</h2>
      <div>
        <div style={{ display: 'flex', borderBottom: `2px solid ${t.border}`, padding: '8px 0' }}>
          <div style={{ width: '30%', ...caption(t.fgMuted), fontWeight: 600 }}>項目</div>
          <div style={{ width: '25%', textAlign: 'center', ...caption(t.negativeFg), fontWeight: 600 }}>Before</div>
          <div style={{ width: '25%', textAlign: 'center', ...caption(t.accent), fontWeight: 600 }}>After</div>
          <div style={{ width: '20%', textAlign: 'right', ...caption(t.accent), fontWeight: 600 }}>削減額</div>
        </div>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', borderBottom: `1px solid ${t.border}`, padding: '10px 0', alignItems: 'center' }}>
            <div style={{ width: '30%', fontSize: '15px', color: t.fg }}>{item.category}</div>
            <div style={{ width: '25%', textAlign: 'center', fontSize: '15px', color: t.negativeFg }}>{item.before}</div>
            <div style={{ width: '25%', textAlign: 'center', fontSize: '15px', color: t.accent, fontWeight: 600 }}>{item.after}</div>
            <div style={{ width: '20%', textAlign: 'right', fontSize: '15px', color: t.accent, fontWeight: 600 }}>{item.savings}</div>
          </div>
        ))}
      </div>
      {totalROI && <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '28px', fontWeight: 800, color: t.accent }}>{totalROI}</div>}
    </div>
  );
};

export const PQASlide: React.FC<{ title?: string; items: { question: string; answer: string }[] }> = ({ title = 'Q&A', items }) => {
  const t = useSlideTheme();
  return (
    <div>
      <h2 style={h2(t.fg)}>{title}</h2>
      <div style={{ marginTop: '24px' }}>
        {items.map((item, i) => (
          <div key={i} style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: i < items.length - 1 ? `1px solid ${t.border}` : 'none' }}>
            <div style={{ display: 'flex' }}>
              <span style={{ fontSize: '16px', fontWeight: 700, color: t.accent, marginRight: '10px' }}>Q</span>
              <span style={{ fontSize: '16px', fontWeight: 600, color: t.fg }}>{item.question}</span>
            </div>
            <div style={{ display: 'flex', marginTop: '6px' }}>
              <span style={{ fontSize: '16px', fontWeight: 700, color: t.fgMuted, marginRight: '10px' }}>A</span>
              <span style={small(t.fgSecondary)}>{item.answer}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
