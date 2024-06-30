import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: 'https://huanamigo.github.io/weather-app-recruitment-task/',
  plugins: [react()],
});
