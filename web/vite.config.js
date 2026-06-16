import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
  loadEnv(mode, 'env', '');
  const isDev = mode === 'dev';

  return {
    plugins: [vue()],
    envDir: 'env',
    build: {
      outDir: isDev ? 'dist-dev' : 'dist',
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
    },
    preview: {
      host: '0.0.0.0',
      port: 5173,
    },
  };
});
