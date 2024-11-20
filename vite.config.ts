import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'terser',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['framer-motion', 'lucide-react', '@headlessui/react'],
          'vendor-form': ['react-hook-form', '@hookform/resolvers/zod', 'zod']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true
  }
});