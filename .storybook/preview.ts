import type { Preview, Decorator } from '@storybook/react';
import '../src/styles/globals.css';

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme || 'light';
  const root = document.documentElement;

  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Also set background on the storybook body for visual consistency
  document.body.style.backgroundColor = theme === 'dark' ? '#09090b' : '#ffffff';
  document.body.style.color = theme === 'dark' ? '#fafafa' : '#18181b';

  return Story();
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Theme mode',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [withTheme],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    backgrounds: {
      disable: true,
    },
  },
};

export default preview;
