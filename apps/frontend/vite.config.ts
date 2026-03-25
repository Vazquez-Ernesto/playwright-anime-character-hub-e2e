import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '../../', '');

  return {
    envDir: '../../',
    plugins: [react()],
    server: {
      host: '127.0.0.1',
      port: Number(env.FRONTEND_PORT || 4173),
    },
  };
});
