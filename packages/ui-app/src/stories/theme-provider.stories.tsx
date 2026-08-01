import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider, useTheme } from '../components/theme-provider';
import { Button } from '../components/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/card';
import { Input } from '../components/input';
import { Badge } from '../components/badge';

const meta: Meta = {
  title: 'Theme/ThemeProvider',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Theme Switcher</CardTitle>
        <CardDescription>
          Current theme: <Badge variant="outline">{theme}</Badge>{' '}
          Resolved: <Badge>{resolvedTheme}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <Input placeholder="Sample input field" />
          <div className="flex gap-2">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('light')}
            >
              Light
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('dark')}
            >
              Dark
            </Button>
            <Button
              variant={theme === 'system' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('system')}
            >
              System
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const Default: Story = {
  render: () => (
    <ThemeProvider>
      <ThemeSwitcher />
    </ThemeProvider>
  ),
};
