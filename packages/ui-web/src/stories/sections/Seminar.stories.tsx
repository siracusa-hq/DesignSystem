import type { Meta, StoryObj } from '@storybook/react';
import { SeminarListSection } from '../../components/sections/seminar-list';
import { SeminarDetailSection } from '../../components/sections/seminar-detail';
import type { SeminarListItem } from '../../components/sections/seminar-card';
import { ResourceRequestForm } from '../../components/sections/form';
import { photoPlaceholder } from '../support/photo-placeholder';

/**
 * セミナー系（`seminar-list` / `seminar-detail`）。
 *
 * **予定と終了で一覧を分けない**（実測 0/8）。状態の分け方はパターンが決め、
 * 呼び出し側は `status` 付きで全件を渡すだけ。
 *
 * **状態を色だけで区別しない。** 「受付中」と「受付終了」を色相だけで分けると
 * 色覚特性によっては判別できないため、文言を必ず併記している。
 */
const meta: Meta<typeof SeminarListSection> = {
  title: 'Sections/Seminar',
  component: SeminarListSection,
  parameters: { layout: 'fullscreen' },
};
export default meta;

const ja: SeminarListItem[] = [
  {
    status: 'upcoming',
    href: '#s1',
    title: '現場の紙運用を、どこから置き換えるか',
    startAt: '2026-09-10T14:00',
    format: 'online',
    thumbnail: { src: photoPlaceholder('セミナー告知', 'green'), alt: '現場DXセミナーの告知画像' },
  },
  {
    status: 'upcoming',
    href: '#s2',
    title: '監査対応の勘所 — エージェントの実行ログをどう残すか',
    startAt: '2026-09-24T15:00',
    format: 'venue',
    thumbnail: { src: photoPlaceholder('セミナー告知', 'blue'), alt: '監査対応セミナーの告知画像' },
  },
  {
    status: 'archive',
    href: '#s3',
    title: '権限設計の実務（アーカイブ配信）',
    viewableUntil: '2026-12-31',
    format: 'online',
    thumbnail: { src: photoPlaceholder('アーカイブ', 'sand'), alt: '権限設計セミナーの告知画像' },
  },
  {
    status: 'closed',
    href: '#s4',
    title: '生成AI導入の落とし穴',
    startAt: '2026-07-02T13:00',
    format: 'online',
    thumbnail: { src: photoPlaceholder('終了', 'green'), alt: '生成AIセミナーの告知画像' },
  },
];

const en: SeminarListItem[] = ja.map((s, i) => ({
  ...s,
  title: [
    'Where to start replacing paper on the floor',
    'Audit-ready agents: what to log and why',
    'Designing permissions (on demand)',
    'Pitfalls of rolling out generative AI',
  ][i],
}));

const enListLabels = {
  status: { upcoming: 'Open', closed: 'Closed', archive: 'On demand' },
  format: { online: 'Online', venue: 'In person' },
  groupHeading: { upcoming: 'Upcoming', archive: 'On demand', closed: 'Past seminars' },
  empty: 'No seminars are open at the moment.',
  viewableUntil: 'Available until',
};

/** 一覧。開催予定 → アーカイブ → 終了 の順に積む（申し込めるものが先） */
export const List: StoryObj<typeof SeminarListSection> = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <SeminarListSection
        title={isJa ? 'セミナー' : 'Seminars'}
        subtitle={
          isJa
            ? '現場の実務に落とせる内容だけを扱います。参加費は無料です。'
            : 'Practical sessions only. Free to attend.'
        }
        seminars={isJa ? ja : en}
        labels={isJa ? undefined : enListLabels}
      />
    );
  },
};

const detailJa = {
  title: '現場の紙運用を、どこから置き換えるか',
  overview: [
    '紙の点検表をそのままデジタル化しても、現場の手間は減りません。どの帳票から着手するとよいかを、3社の実例をもとに解説します。',
  ],
  recommended: [
    '製造業・食品業の情報システム部の方',
    '現場に紙の点検表・日報が残っている方',
    '過去にデジタル化を試して定着しなかった方',
  ],
  agenda: [
    { time: '14:00-14:05', title: 'オープニング' },
    {
      time: '14:05-14:40',
      title: '着手する帳票の選び方',
      description: '「頻度 × 転記の手間」で優先順位を付ける方法を解説します。',
    },
    { time: '14:40-14:55', title: '3社の実例' },
    { time: '14:55-15:00', title: '質疑応答' },
  ],
  eventMeta: [
    { label: '開催日時', value: '2026年9月10日（木）14:00-15:00' },
    { label: '申込締切', value: '2026年9月9日（水）17:00' },
    { label: '開催形式', value: 'オンライン（Zoom）' },
    { label: '参加費', value: '無料' },
    { label: '定員', value: '100名' },
  ],
  speakers: [
    {
      name: '立花 直人',
      organization: 'シラクサ株式会社',
      role: '取締役 CTO',
      bio: 'Polastack のアーキテクチャ全般を担当。',
      photo: { src: photoPlaceholder('Speaker', 'blue', '1:1'), alt: '登壇者 立花 直人のポートレート' },
    },
  ],
};

/** 詳細（開催予定）。フォーム自体が CTA なので、末尾 CTA は持たない */
export const DetailUpcoming: StoryObj<typeof SeminarDetailSection> = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return isJa ? (
      <SeminarDetailSection
        status="upcoming"
        startAt="2026-09-10T14:00"
        format="online"
        photo={{ src: photoPlaceholder('セミナー告知', 'green', '1.9:1'), alt: '現場DXセミナーの告知画像' }}
        {...detailJa}
        form={<ResourceRequestForm title="お申し込み" submitLabel="セミナーに申し込む" ichisanEnabled={false} />}
      />
    ) : (
      <SeminarDetailSection
        status="upcoming"
        startAt="2026-09-10T14:00"
        format="online"
        title="Where to start replacing paper on the floor"
        overview={['Digitising the same checklist rarely reduces work. We show how to choose the first form to replace.']}
        recommended={['IT leads in manufacturing', 'Teams still running paper checklists']}
        agenda={[
          { time: '14:00-14:05', title: 'Opening' },
          { time: '14:05-14:40', title: 'Choosing the first form', description: 'Prioritise by frequency × transcription effort.' },
        ]}
        eventMeta={[
          { label: 'Date', value: '10 Sep 2026, 14:00-15:00 JST' },
          { label: 'Format', value: 'Online (Zoom)' },
          { label: 'Fee', value: 'Free' },
        ]}
        labels={{
          overview: 'About this seminar',
          recommended: 'Who this is for',
          agenda: 'Programme',
          eventMeta: 'Details',
          speakers: 'Speakers',
          status: { upcoming: 'Open', closed: 'Closed', archive: 'On demand' },
          format: { online: 'Online', venue: 'In person' },
        }}
        form={<ResourceRequestForm title="Register" submitLabel="Register for the seminar" lang="en" ichisanEnabled={false} />}
      />
    );
  },
};

/** 詳細（アーカイブ配信）。**開催日時が型として存在しない** — あるのは視聴期限 */
export const DetailArchive: StoryObj<typeof SeminarDetailSection> = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <SeminarDetailSection
        status="archive"
        viewableUntil="2026-12-31"
        format="online"
        title={isJa ? '権限設計の実務（アーカイブ配信）' : 'Designing permissions (on demand)'}
        overview={
          isJa
            ? ['2026年6月に開催した回のアーカイブです。お申し込み後、視聴用URLをお送りします。']
            : ['A recording of our June 2026 session. We will send the link after you register.']
        }
        eventMeta={
          isJa
            ? [
                { label: '視聴期限', value: '2026年12月31日' },
                { label: '視聴形式', value: 'オンライン（録画）' },
                { label: '参加費', value: '無料' },
              ]
            : [
                { label: 'Available until', value: '31 Dec 2026' },
                { label: 'Format', value: 'Recording' },
                { label: 'Fee', value: 'Free' },
              ]
        }
        labels={
          isJa
            ? undefined
            : {
                overview: 'About this recording',
                eventMeta: 'Details',
                status: { upcoming: 'Open', closed: 'Closed', archive: 'On demand' },
                format: { online: 'Online', venue: 'In person' },
              }
        }
        form={
          <ResourceRequestForm
            title={isJa ? '視聴のお申し込み' : 'Watch the recording'}
            submitLabel={isJa ? 'アーカイブを視聴する' : 'Watch the recording'}
            lang={isJa ? 'ja' : 'en'}
            ichisanEnabled={false}
          />
        }
      />
    );
  },
};

/** 詳細（受付終了）。状態は必ず文言で示す */
export const DetailClosed: StoryObj<typeof SeminarDetailSection> = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <SeminarDetailSection
        status="closed"
        startAt="2026-07-02T13:00"
        format="online"
        title={isJa ? '生成AI導入の落とし穴' : 'Pitfalls of rolling out generative AI'}
        overview={
          isJa
            ? ['本セミナーは終了しました。次回のご案内をご希望の方は、セミナー一覧をご覧ください。']
            : ['This session has ended. See the seminar list for upcoming dates.']
        }
        labels={
          isJa
            ? undefined
            : {
                overview: 'About this seminar',
                status: { upcoming: 'Open', closed: 'Closed', archive: 'On demand' },
                format: { online: 'Online', venue: 'In person' },
              }
        }
      />
    );
  },
};
