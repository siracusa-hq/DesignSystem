import type { Meta, StoryObj } from '@storybook/react';
import { LogoCloud } from '../../components/sections/logo-cloud';

const meta: Meta<typeof LogoCloud> = {
  title: 'Sections/LogoCloud',
  component: LogoCloud,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof LogoCloud>;

const PlaceholderLogo: React.FC<{ name: string }> = ({ name }) => (
  <div className="flex h-10 w-32 items-center justify-center rounded bg-neutral-200 text-xs font-medium text-neutral-600">
    {name}
  </div>
);

const logos = [
  { name: 'Company A', logo: <PlaceholderLogo name="Company A" /> },
  { name: 'Company B', logo: <PlaceholderLogo name="Company B" /> },
  { name: 'Company C', logo: <PlaceholderLogo name="Company C" /> },
  { name: 'Company D', logo: <PlaceholderLogo name="Company D" /> },
  { name: 'Company E', logo: <PlaceholderLogo name="Company E" /> },
  { name: 'Company F', logo: <PlaceholderLogo name="Company F" /> },
];

export const Static: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <LogoCloud
        eyebrow={isJa ? '導入企業' : 'TRUSTED BY'}
        title={isJa ? '先進企業に選ばれています' : 'Trusted by leading companies'}
        logos={logos}
      />
    );
  },
};

export const Scrolling: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <LogoCloud
        title={isJa ? '導入企業' : 'Our customers'}
        logos={logos}
        scrolling
        background="muted"
      />
    );
  },
};
