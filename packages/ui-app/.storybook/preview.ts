import type { Preview, Decorator } from '@storybook/react';
import '../src/styles/globals.css';
import { resolveAllBrands } from '@siracusahq/tokens';

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme || 'light';
  const root = document.documentElement;
  // ブランド（data-brand。既定はコーポレート = 属性なし）
  const brand = context.globals.brand || 'corporate';
  if (brand === 'corporate') root.removeAttribute('data-brand');
  else root.setAttribute('data-brand', brand);

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
    brand: {
      description: 'ブランド（data-brand）',
      toolbar: {
        title: 'Brand',
        icon: 'circlehollow',
        items: resolveAllBrands().map((b) => ({ value: b.dataBrand, title: b.entry.label })),
        dynamicTitle: true,
      },
    },
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
    brand: 'corporate',
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
