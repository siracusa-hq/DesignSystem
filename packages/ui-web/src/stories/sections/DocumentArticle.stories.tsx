import type { Meta, StoryObj } from '@storybook/react';
import { DocumentArticle } from '../../components/sections/document-article';

/**
 * DocumentArticle — 法務文書・静的文書の器。
 *
 * 対象は**プライバシーポリシー・利用規約・特商法表記といった法務文書と、404 等の
 * 静的ページ**。Markdown から生成した本文を `children` に渡すと、組版だけを DS が担う。
 *
 * **お知らせ・ブログの記事はこの部品の担当ではない。** 記事は `article-detail`
 * ページ型（`ArticleBodySection` + 著者 + 目次 + シェア）が担う
 * （docs/article-pages-workorder.md）。記事固有の語彙をここに足さないこと。
 *
 * 組版は CaseStudyArticleSection と同じ実測値（読み幅 46.5rem・本文 16px /
 * 行間 1.80・章見出し 26px）。読み物の組版を2つ持たないため値を共有している。
 */
const meta: Meta<typeof DocumentArticle> = {
  title: 'Sections/DocumentArticle',
  component: DocumentArticle,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof DocumentArticle>;

/** 法務文書（Markdown が生む要素を一通り含む） */
export const LegalDocument: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return isJa ? (
      <DocumentArticle
        title="プライバシーポリシー"
        publishedAt="2024年4月1日 制定"
        updatedAt="2026年8月1日"
      >
        <h2>第1条（個人情報の定義）</h2>
        <p>
          本ポリシーにおいて「個人情報」とは、個人情報保護法にいう個人情報を指し、生存する個人に関する情報であって、当該情報に含まれる氏名等により特定の個人を識別できるものをいいます。
        </p>
        <h2>第2条（利用目的）</h2>
        <p>当社は、取得した個人情報を以下の目的で利用します。</p>
        <ul>
          <li>サービスの提供・運営のため</li>
          <li>お問い合わせへの回答のため</li>
          <li>利用規約に違反した利用者の特定および対応のため</li>
        </ul>
        <h2>第3条（第三者提供）</h2>
        <p>
          当社は、次に掲げる場合を除いて、あらかじめ利用者の同意を得ることなく、第三者に個人情報を提供することはありません。
        </p>
        <ol>
          <li>法令に基づく場合</li>
          <li>人の生命、身体または財産の保護のために必要がある場合</li>
        </ol>
        <h3>委託先の管理</h3>
        <p>
          利用目的の達成に必要な範囲内で個人情報の取扱いを委託する場合、委託先に対して必要かつ適切な監督を行います。委託先の一覧は
          <a href="/privacy/subprocessors">こちら</a>をご覧ください。
        </p>
        <table>
          <thead>
            <tr>
              <th scope="col">委託先の区分</th>
              <th scope="col">委託する業務</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">クラウド事業者</th>
              <td>サーバーおよびデータベースの提供</td>
            </tr>
            <tr>
              <th scope="row">決済代行事業者</th>
              <td>利用料金の決済処理</td>
            </tr>
          </tbody>
        </table>
      </DocumentArticle>
    ) : (
      <DocumentArticle title="Privacy Policy" publishedAt="Established 1 April 2024" updatedAt="1 August 2026">
        <h2>1. Definitions</h2>
        <p>
          &ldquo;Personal information&rdquo; means information about a living individual that can
          identify that individual.
        </p>
        <h2>2. Purpose of use</h2>
        <ul>
          <li>To provide and operate the service</li>
          <li>To respond to enquiries</li>
        </ul>
        <h3>Subprocessors</h3>
        <p>
          Where we delegate handling of personal information, we supervise the subprocessor. The
          list is available <a href="/privacy/subprocessors">here</a>.
        </p>
      </DocumentArticle>
    );
  },
};

/** 特定商取引法に基づく表記（冒頭に要点パネルを置く） */
export const CommercialTransactions: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return isJa ? (
      <DocumentArticle
        title="特定商取引法に基づく表記"
        lead={['本ページは特定商取引法第11条に基づく表記です。']}
        panel={[
          { label: '事業者名', body: 'シラクサ株式会社' },
          { label: '運営責任者', body: '金子 卓也' },
        ]}
      >
        <h2>販売価格</h2>
        <p>各プランのページに表示された金額（消費税込）とします。</p>
        <h2>お支払い方法</h2>
        <ul>
          <li>クレジットカード決済</li>
          <li>銀行振込（法人のお客様のみ）</li>
        </ul>
      </DocumentArticle>
    ) : (
      <DocumentArticle
        title="Commercial Transactions Act notice"
        lead={['This page is provided under Article 11 of the Japanese Act on Specified Commercial Transactions.']}
        panel={[{ label: 'Company', body: 'Siracusa, Inc.' }]}
      >
        <h2>Pricing</h2>
        <p>As displayed on each plan page, including consumption tax.</p>
      </DocumentArticle>
    );
  },
};

/** 404（戻り導線を出す。本文は短い） */
export const NotFound: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return isJa ? (
      <DocumentArticle title="ページが見つかりません" backTo={{ label: 'ホームへ', href: '/' }}>
        <p>
          お探しのページは、移動または削除された可能性があります。URL
          をご確認いただくか、以下からお探しください。
        </p>
        <ul>
          <li>
            <a href="/">トップページ</a>
          </li>
          <li>
            <a href="/contact">お問い合わせ</a>
          </li>
        </ul>
      </DocumentArticle>
    ) : (
      <DocumentArticle title="Page not found" backTo={{ label: 'Back to home', href: '/' }}>
        <p>The page you are looking for may have moved or been removed.</p>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </DocumentArticle>
    );
  },
};
