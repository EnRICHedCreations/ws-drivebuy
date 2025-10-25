import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Virtual D4D - Vite Configuration
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_URL || '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          maps: ['@googlemaps/js-api-loader']
        }
      }
    }
  }
});
