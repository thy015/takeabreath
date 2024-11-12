import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import replace from '@rollup/plugin-replace';

export default defineConfig({
    base: '',
    plugins: [
        react(),
        replace({
            preventAssignment: true,
            values: {
                'process.env.VITE_API_KEY': JSON.stringify(process.env.VITE_API_KEY),
                'process.env.CHAT_CLIENT_ID': JSON.stringify(process.env.CHAT_CLIENT_ID),
                'process.env.BE_PORT': JSON.stringify(process.env.BE_PORT),
            },
        }),
    ],
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler'
            }
        }
    },
    optimizeDeps: {
        exclude: ['chunk-FWZAQCPU.js']
    },
    server:{
        host: '0.0.0.0',
        open: true,
        port: 3000,
    },
});
