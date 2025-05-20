import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3051',
        changeOrigin: true,
      },
    },
  },
  define: {
    'process.env': {
      OPENAI_KEY: JSON.stringify(process.env.OPENAI_KEY),
      FIREWORKS_KEY: JSON.stringify(process.env.FIREWORKS_KEY),
      OPENAI_ENDPOINT: JSON.stringify(process.env.OPENAI_ENDPOINT),
      CUSTOM_MODEL: JSON.stringify(process.env.CUSTOM_MODEL),
      CONTEXT_SIZE: JSON.stringify(process.env.CONTEXT_SIZE)
    }
  }
});