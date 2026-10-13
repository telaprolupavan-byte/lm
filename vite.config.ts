import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Stamped at build time, e.g. "Oct 2026" — the Dashboard shows when the site was last built.
  define: {
    __BUILD_MONTH__: JSON.stringify(new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })),
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: { motion: ['framer-motion'], react: ['react', 'react-dom'] },
      },
    },
  },
});
