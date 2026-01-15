import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src'],
      outDir: 'dist',
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'components/index': resolve(__dirname, 'src/components/index.ts'),
        'hooks/index': resolve(__dirname, 'src/hooks/index.ts'),
        'services/index': resolve(__dirname, 'src/services/index.ts'),
        'types/index': resolve(__dirname, 'src/types/index.ts'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'firebase',
        'firebase/app',
        'firebase/firestore',
        'firebase/auth',
        '@radix-ui/themes',
        '@radix-ui/react-icons',
        '@capacitor/preferences',
        'lucide-react',
        'zustand',
        'zustand/middleware',
      ],
      output: {
        preserveModules: false,
        exports: 'named',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          firebase: 'firebase',
          'firebase/app': 'firebaseApp',
          'firebase/firestore': 'firebaseFirestore',
          'firebase/auth': 'firebaseAuth',
          '@radix-ui/themes': 'RadixThemes',
          '@capacitor/preferences': 'CapacitorPreferences',
          zustand: 'zustand',
        },
      },
    },
    sourcemap: true,
    minify: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
