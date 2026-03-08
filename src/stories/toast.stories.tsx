import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/button';
import { Toaster } from '../components/toast/toaster';
import { ToastAction } from '../components/toast/toast';
import { useToast } from '../components/toast/use-toast';

const meta: Meta = {
  title: 'Components/Toast',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const { toast } = useToast();
    return (
      <Button
        onClick={() => toast({ title: 'Toast notification', description: 'This is a default toast message.' })}
      >
        Show Toast
      </Button>
    );
  },
};

export const Success: Story = {
  render: () => {
    const { toast } = useToast();
    return (
      <Button
        onClick={() => toast({ title: 'Success!', description: 'Operation completed successfully.', variant: 'success' })}
      >
        Show Success Toast
      </Button>
    );
  },
};

export const Error: Story = {
  render: () => {
    const { toast } = useToast();
    return (
      <Button
        variant="destructive"
        onClick={() => toast({ title: 'Error', description: 'Something went wrong.', variant: 'error' })}
      >
        Show Error Toast
      </Button>
    );
  },
};

export const WithAction: Story = {
  render: () => {
    const { toast } = useToast();
    return (
      <Button
        onClick={() =>
          toast({
            title: 'Record deleted',
            description: 'The record has been removed.',
            action: <ToastAction altText="Undo deletion">Undo</ToastAction>,
          })
        }
      >
        Show Toast with Action
      </Button>
    );
  },
};
