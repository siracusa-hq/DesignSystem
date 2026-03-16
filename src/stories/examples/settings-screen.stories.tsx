import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/tabs';
import {
  FormLayout,
  FormSection,
  FormActions,
} from '../../components/form-layout';
import {
  FormField,
  FormLabel,
  FormControl,
  FormDescription,
} from '../../components/form-field';
import { Input } from '../../components/input';
import { Textarea } from '../../components/textarea';
import { Switch } from '../../components/switch';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../components/select';
import { Button } from '../../components/button';
import { Card, CardContent } from '../../components/card';
import { Separator } from '../../components/separator';
import { Toaster } from '../../components/toast';
import { useToast } from '../../components/toast';

const meta: Meta = {
  title: 'Examples/Settings Screen',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

function SettingsScreen() {
  const { toast } = useToast();

  const handleSave = () => {
    toast({ title: 'Settings saved', description: 'Your changes have been saved.' });
  };

  return (
    <div className="w-[640px] max-w-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[--color-on-surface]">Settings</h1>
        <p className="text-sm text-[--color-on-surface-muted]">Manage your account preferences</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <FormLayout layout="vertical" size="md">
                <FormSection title="Profile" description="Your public profile information">
                  <FormField>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input defaultValue="Tanaka Taro" />
                    </FormControl>
                  </FormField>

                  <FormField>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" defaultValue="tanaka@example.com" />
                    </FormControl>
                  </FormField>

                  <FormField>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Write a short bio..." rows={3} />
                    </FormControl>
                  </FormField>
                </FormSection>

                <Separator />

                <FormSection title="Regional" description="Language and timezone settings">
                  <FormField>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Select defaultValue="ja">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ja">Japanese</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="zh">Chinese</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormField>

                  <FormField>
                    <FormLabel>Timezone</FormLabel>
                    <FormControl>
                      <Select defaultValue="asia-tokyo">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asia-tokyo">Asia/Tokyo (JST)</SelectItem>
                          <SelectItem value="utc">UTC</SelectItem>
                          <SelectItem value="us-pacific">US/Pacific (PST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormField>
                </FormSection>

                <FormActions align="right">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </FormActions>
              </FormLayout>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <FormLayout layout="vertical">
                <FormSection title="Email Notifications" description="Choose what emails you receive">
                  <FormField>
                    <div className="flex items-center justify-between">
                      <div>
                        <FormLabel>Product updates</FormLabel>
                        <FormDescription>Receive emails about new features and improvements</FormDescription>
                      </div>
                      <FormControl>
                        <Switch defaultChecked />
                      </FormControl>
                    </div>
                  </FormField>

                  <Separator />

                  <FormField>
                    <div className="flex items-center justify-between">
                      <div>
                        <FormLabel>Security alerts</FormLabel>
                        <FormDescription>Get notified about security events</FormDescription>
                      </div>
                      <FormControl>
                        <Switch defaultChecked />
                      </FormControl>
                    </div>
                  </FormField>

                  <Separator />

                  <FormField>
                    <div className="flex items-center justify-between">
                      <div>
                        <FormLabel>Marketing emails</FormLabel>
                        <FormDescription>Receive promotional content and offers</FormDescription>
                      </div>
                      <FormControl>
                        <Switch />
                      </FormControl>
                    </div>
                  </FormField>
                </FormSection>

                <FormActions align="right">
                  <Button onClick={handleSave}>Save Preferences</Button>
                </FormActions>
              </FormLayout>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <FormLayout layout="vertical">
                <FormSection title="Theme" description="Customize the look and feel">
                  <FormField>
                    <FormLabel>Color Theme</FormLabel>
                    <FormControl>
                      <Select defaultValue="system">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>Select your preferred color theme</FormDescription>
                  </FormField>

                  <FormField>
                    <div className="flex items-center justify-between">
                      <div>
                        <FormLabel>Compact mode</FormLabel>
                        <FormDescription>Use smaller spacing for dense information</FormDescription>
                      </div>
                      <FormControl>
                        <Switch />
                      </FormControl>
                    </div>
                  </FormField>
                </FormSection>

                <FormActions align="right">
                  <Button onClick={handleSave}>Save Preferences</Button>
                </FormActions>
              </FormLayout>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Toaster />
    </div>
  );
}

export const Default: Story = {
  render: () => <SettingsScreen />,
};
