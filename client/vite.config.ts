import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import replace from '@rollup/plugin-replace';

export default defineConfig({
    base: '/',
    plugins: [
        react(),

    ],
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler'
            }
        }
    },
    server:{
        host: '0.0.0.0',
        open: true,
        port: 3000,
    },
    build: {
        outDir: 'dist',
    },
});
