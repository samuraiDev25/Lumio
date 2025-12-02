import type { Preview } from '@storybook/nextjs-vite';
import '@/shared/styles/index.scss';
import '../app/globals.scss';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
