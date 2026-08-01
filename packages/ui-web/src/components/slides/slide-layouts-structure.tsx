import * as React from 'react';
import { Slide, Heading as SpHeading, Text as SpText, FlexBox, Box } from 'spectacle';
import { colors } from '../../tokens/colors';

type SlideComponentProps = React.ComponentProps<typeof Slide>;

/* ============================================================
   AgendaSlide — 目次・アジェンダ
   ============================================================ */

export interface AgendaItem {
  number: string;
  label: string;
}

export interface AgendaSlideProps extends Partial<SlideComponentProps> {
  title?: string;
  items: AgendaItem[];
  activeIndex?: number;
}

export const AgendaSlide: React.FC<AgendaSlideProps> = ({
  title = 'Agenda',
  items,
  activeIndex,
  ...props
}) => (
  <Slide {...props}>
    <SpHeading fontSize="40px" fontWeight="700" margin="0 0 48px 0" style={{ letterSpacing: '-0.03em' }}>
      {title}
    </SpHeading>
    <Box>
      {items.map((item, i) => (
        <FlexBox
          key={i}
          alignItems="center"
          style={{
            padding: '16px 0',
            borderBottom: i < items.length - 1 ? `1px solid ${colors.neutral[800]}` : 'none',
            opacity: activeIndex != null && activeIndex !== i ? 0.3 : 1,
          }}
        >
          <SpText
            fontSize="32px"
            fontWeight="800"
            color={activeIndex === i ? colors.primary[400] : colors.neutral[600]}
            margin="0"
            style={{ width: '60px', letterSpacing: '-0.02em' }}
          >
            {item.number}
          </SpText>
          <SpText
            fontSize="24px"
            fontWeight={activeIndex === i ? '600' : '400'}
            color={activeIndex === i ? colors.primary[400] : undefined}
            margin="0"
          >
            {item.label}
          </SpText>
        </FlexBox>
      ))}
    </Box>
  </Slide>
);

AgendaSlide.displayName = 'AgendaSlide';

/* ============================================================
   SectionDividerSlide — セクション区切り
   ============================================================ */

export interface SectionDividerSlideProps extends Partial<SlideComponentProps> {
  sectionNumber?: string;
  title: string;
  subtitle?: string;
}

export const SectionDividerSlide: React.FC<SectionDividerSlideProps> = ({
  sectionNumber,
  title,
  subtitle,
  ...props
}) => (
  <Slide {...props}>
    <FlexBox flexDirection="column" alignItems="center" justifyContent="center" height="100%">
      {sectionNumber && (
        <SpText
          fontSize="120px"
          fontWeight="800"
          color={colors.primary[900]}
          margin="0"
          style={{ letterSpacing: '-0.05em', lineHeight: 1 }}
        >
          {sectionNumber}
        </SpText>
      )}
      <SpHeading
        fontSize="48px"
        fontWeight="700"
        margin={sectionNumber ? '-24px 0 0 0' : '0'}
        style={{ letterSpacing: '-0.04em', textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        {title}
      </SpHeading>
      {subtitle && (
        <SpText fontSize="20px" color={colors.neutral[400]} margin="16px 0 0 0" style={{ textAlign: 'center' }}>
          {subtitle}
        </SpText>
      )}
    </FlexBox>
  </Slide>
);

SectionDividerSlide.displayName = 'SectionDividerSlide';

/* ============================================================
   EndSlide — CTA・連絡先エンディング
   ============================================================ */

export interface ContactItem {
  icon?: React.ReactNode;
  label: string;
  value: string;
}

export interface EndSlideProps extends Partial<SlideComponentProps> {
  title: string;
  subtitle?: string;
  contactItems?: ContactItem[];
  ctaLabel?: string;
  ctaUrl?: string;
  logo?: React.ReactNode;
}

export const EndSlide: React.FC<EndSlideProps> = ({
  title,
  subtitle,
  contactItems,
  ctaLabel,
  ctaUrl,
  logo,
  ...props
}) => (
  <Slide {...props}>
    <FlexBox flexDirection="column" alignItems="center" justifyContent="center" height="100%">
      {logo && <Box margin="0 0 32px 0">{logo}</Box>}
      <SpHeading fontSize="48px" fontWeight="700" margin="0 0 16px 0" style={{ letterSpacing: '-0.04em', textAlign: 'center' }}>
        {title}
      </SpHeading>
      {subtitle && (
        <SpText fontSize="20px" color={colors.neutral[400]} margin="0 0 32px 0" style={{ textAlign: 'center' }}>
          {subtitle}
        </SpText>
      )}
      {ctaLabel && (
        <Box
          padding="12px 32px"
          backgroundColor={colors.primary[500]}
          style={{ borderRadius: '12px', marginBottom: '32px' }}
        >
          <SpText fontSize="18px" fontWeight="600" color={colors.neutral[50]} margin="0">
            {ctaUrl ? ctaLabel : ctaLabel}
          </SpText>
        </Box>
      )}
      {contactItems && contactItems.length > 0 && (
        <FlexBox justifyContent="center" flexWrap="wrap">
          {contactItems.map((item, i) => (
            <Box key={i} padding="8px 24px" style={{ textAlign: 'center' }}>
              <SpText fontSize="14px" color={colors.neutral[500]} margin="0">{item.label}</SpText>
              <SpText fontSize="16px" fontWeight="500" margin="4px 0 0 0">{item.value}</SpText>
            </Box>
          ))}
        </FlexBox>
      )}
    </FlexBox>
  </Slide>
);

EndSlide.displayName = 'EndSlide';

/* ============================================================
   TeamSlide — チーム紹介
   ============================================================ */

export interface TeamMember {
  name: string;
  role: string;
  description?: string;
  avatar?: React.ReactNode;
}

export interface TeamSlideProps extends Partial<SlideComponentProps> {
  title?: string;
  members: TeamMember[];
  columns?: 2 | 3 | 4;
}

export const TeamSlide: React.FC<TeamSlideProps> = ({
  title = 'Team',
  members,
  columns = 3,
  ...props
}) => (
  <Slide {...props}>
    <SpHeading fontSize="40px" fontWeight="700" margin="0 0 40px 0" style={{ letterSpacing: '-0.03em', textAlign: 'center' }}>
      {title}
    </SpHeading>
    <FlexBox justifyContent="center" flexWrap="wrap">
      {members.map((m, i) => (
        <Box key={i} width={`${Math.floor(100 / columns) - 4}%`} padding="16px" style={{ textAlign: 'center' }}>
          {m.avatar ? (
            <Box margin="0 0 16px 0">{m.avatar}</Box>
          ) : (
            <Box
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: colors.primary[900],
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SpText fontSize="24px" fontWeight="600" color={colors.primary[400]} margin="0">
                {m.name.charAt(0)}
              </SpText>
            </Box>
          )}
          <SpText fontSize="18px" fontWeight="600" margin="0">{m.name}</SpText>
          <SpText fontSize="14px" color={colors.primary[400]} margin="4px 0 0 0">{m.role}</SpText>
          {m.description && (
            <SpText fontSize="14px" color={colors.neutral[400]} margin="8px 0 0 0">{m.description}</SpText>
          )}
        </Box>
      ))}
    </FlexBox>
  </Slide>
);

TeamSlide.displayName = 'TeamSlide';
