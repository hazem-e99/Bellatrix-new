import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  optimizeDeps: {
    include: [
      '@dnd-kit/core',
      '@dnd-kit/sortable',
      '@dnd-kit/utilities',
      'socket.io-client',
      'react',
      'react-dom',
      'react-router-dom',
    ],
  },
  build: {
    target: 'es2018',
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
    assetsInlineLimit: 4096, // inline assets < 4KB as base64
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      external: (id) => {
        if (
          id.includes('@tanstack/react-query-devtools') ||
          id.includes('@tanstack/query-devtools')
        ) {
          return true;
        }
        return false;
      },
      output: {
        manualChunks: (id) => {
          // React Router
          if (id.includes('react-router') || id.includes('@remix-run')) {
            return 'router';
          }
          // Framer Motion (large — keep separate)
          if (id.includes('framer-motion')) {
            return 'framer-motion';
          }
          // DnD Kit
          if (id.includes('@dnd-kit')) {
            return 'dnd-kit';
          }
          // MUI Icons (very large — separate chunk)
          if (id.includes('@mui/icons-material')) {
            return 'mui-icons';
          }
          // MUI Core
          if (id.includes('@mui/material') || id.includes('@mui/system') || id.includes('@mui/base')) {
            return 'mui-core';
          }
          // Heroicons
          if (id.includes('@heroicons')) {
            return 'heroicons';
          }
          // Tanstack Query
          if (id.includes('@tanstack/react-query')) {
            return 'react-query';
          }
          // Other node_modules → vendor
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
      maxParallelFileOps: 10,
    },
    chunkSizeWarningLimit: 800,
  },
  resolve: {
    dedupe: ['react', 'react-dom', '@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://www.bellatrixinc.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
