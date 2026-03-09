import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/tabs';

const meta: Meta = {
  title: 'Data Display/Tabs',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-96">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="text-sm text-neutral-600 p-4">
          Manage your account settings and preferences.
        </p>
      </TabsContent>
      <TabsContent value="password">
        <p className="text-sm text-neutral-600 p-4">
          Change your password and security settings.
        </p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="text-sm text-neutral-600 p-4">
          Configure your application settings.
        </p>
      </TabsContent>
    </Tabs>
  ),
};

export const Underline: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-96">
      <TabsList variant="underline">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p className="text-sm text-neutral-600 p-4">Overview content</p>
      </TabsContent>
      <TabsContent value="analytics">
        <p className="text-sm text-neutral-600 p-4">Analytics content</p>
      </TabsContent>
      <TabsContent value="reports">
        <p className="text-sm text-neutral-600 p-4">Reports content</p>
      </TabsContent>
    </Tabs>
  ),
};

export const WithDisabled: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-96">
      <TabsList>
        <TabsTrigger value="tab1">Active</TabsTrigger>
        <TabsTrigger value="tab2">Also Active</TabsTrigger>
        <TabsTrigger value="tab3" disabled>
          Disabled
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="text-sm text-neutral-600 p-4">First tab content</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="text-sm text-neutral-600 p-4">Second tab content</p>
      </TabsContent>
    </Tabs>
  ),
};
