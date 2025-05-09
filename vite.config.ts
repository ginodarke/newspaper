import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { configDefaults } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env vars for the current mode
  const env = loadEnv(mode, process.cwd(), '');
  const isProd = mode === 'production';

  return {
    plugins: [react()],
    publicDir: 'public',
    base: '/',
    build: {
      outDir: 'dist',
      minify: 'esbuild',
      sourcemap: !isProd, // Disable sourcemaps in production to reduce memory usage
      emptyOutDir: true,
      chunkSizeWarningLimit: 1000, // Increase warning limit to reduce noise
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-label', '@radix-ui/react-select', '@radix-ui/react-tabs'],
            three: ['three', '@react-three/fiber', '@react-three/drei'],
            // Additional chunks to further split the bundle
            utils: ['date-fns', 'clsx', 'tailwind-merge'],
            animation: ['framer-motion'],
            icons: ['lucide-react'],
          },
          // Reduce the number of chunks by using fewer hash digits
          entryFileNames: 'assets/[name]-[hash:8].js',
          chunkFileNames: 'assets/[name]-[hash:8].js',
          assetFileNames: 'assets/[name]-[hash:8].[ext]'
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/setupTests.ts'],
      css: false,
      exclude: [...configDefaults.exclude]
    },
    server: {
      port: 3000,
      open: true
    }
  };
}); 