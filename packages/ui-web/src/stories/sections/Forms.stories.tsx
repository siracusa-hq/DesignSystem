import type { Meta, StoryObj } from '@storybook/react';
import { ContactForm, ResourceRequestForm, DemoRequestForm } from '../../components/sections/form';

const meta: Meta = {
  title: 'Sections/Forms',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Contact: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <ContactForm
        eyebrow={isJa ? 'お問い合わせ' : 'CONTACT'}
        title={isJa ? 'お気軽にご相談ください' : 'Get in touch'}
        subtitle={
          isJa
            ? '技術的なご質問や導入のご相談、お見積りなど、何でもお問い合わせください。'
            : 'Have questions about pricing, features, or implementation? We are here to help.'
        }
        formspreeId="your-formspree-id"
      />
    );
  },
};

export const ResourceRequest: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <ResourceRequestForm
        eyebrow={isJa ? '資料請求' : 'RESOURCES'}
        title={isJa ? '製品資料をダウンロード' : 'Download product resources'}
        subtitle={
          isJa
            ? 'Polastackの詳細な機能説明、導入事例、料金体系をまとめた資料をお送りします。'
            : 'Get our detailed product guide with features, case studies, and pricing.'
        }
        formspreeId="your-formspree-id"
        resourceName="Polastack Product Guide"
        background="muted"
      />
    );
  },
};

export const DemoRequest: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <DemoRequestForm
        eyebrow={isJa ? 'デモ予約' : 'BOOK A DEMO'}
        title={isJa ? 'デモを予約する' : 'Book a demo'}
        subtitle={
          isJa
            ? '30分のオンラインデモで、Polastackがどのように開発を加速するかをご確認いただけます。'
            : 'See how Polastack accelerates development in a 30-minute online demo.'
        }
        formspreeId="your-formspree-id"
      />
    );
  },
};

export const ContactDark: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <ContactForm
        eyebrow={isJa ? 'お問い合わせ' : 'CONTACT'}
        title={isJa ? 'お気軽にご相談ください' : 'Get in touch'}
        background="dark"
        formspreeId="your-formspree-id"
      />
    );
  },
};
