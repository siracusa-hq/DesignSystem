import type { Meta, StoryObj } from '@storybook/react';
import {
  MaskedInput,
  MASK_PHONE_JP,
  MASK_POSTAL_JP,
  MASK_CREDIT_CARD,
} from '../components/masked-input';

const meta: Meta<typeof MaskedInput> = {
  title: 'Components/MaskedInput',
  component: MaskedInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof MaskedInput>;

export const PhoneNumber: Story = {
  args: {
    mask: MASK_PHONE_JP,
    placeholder: '090-1234-5678',
  },
};

export const PostalCode: Story = {
  args: {
    mask: MASK_POSTAL_JP,
    placeholder: '123-4567',
  },
};

export const CreditCard: Story = {
  args: {
    mask: MASK_CREDIT_CARD,
    placeholder: '4242 4242 4242 4242',
  },
};

export const Custom: Story = {
  args: {
    mask: '##:## - ##:##',
    placeholder: '09:00 - 17:30',
    maskChar: '_',
  },
};
