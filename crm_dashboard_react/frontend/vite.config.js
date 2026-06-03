import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The React dev server runs on port 5173. Any request it receives that starts
// with /api is transparently forwarded to the Node backend on port 4000, so
// the frontend can call the API with same-origin relative URLs (no CORS pain).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
