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

  document.body.style.backgroundColor = theme === 'dark' ? '#09090b' : '#ffffff';
  document.body.style.color = theme === 'dark' ? '#fafafa' : '#18181b';

  return Story();
};

const withLocale: Decorator = (Story, context) => {
  const locale = context.globals.locale || 'ja';
  const root = document.documentElement;
  root.setAttribute('lang', locale);
  root.classList.remove('lang-ja', 'lang-en');
  root.classList.add(`lang-${locale}`);

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
    locale: {
      description: 'Language / 言語',
      toolbar: {
        title: 'Locale',
        icon: 'globe',
        items: [
          { value: 'ja', title: '日本語' },
          { value: 'en', title: 'English' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
    locale: 'ja',
  },
  decorators: [withTheme, withLocale],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      source: { type: 'code' },
    },
    layout: 'fullscreen',
    backgrounds: {
      disable: true,
    },
  },
};

export default preview;
