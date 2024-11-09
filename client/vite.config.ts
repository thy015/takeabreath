import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import replace from '@rollup/plugin-replace'; // Import the replace plugin

export default defineConfig({
    base: '',
    plugins: [
        react(),
        replace({
            preventAssignment: true,
            values: {
                'process.env.VITE_API_KEY': JSON.stringify(process.env.VITE_API_KEY),
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
    server: {
        open: true,
        port: 3000,
    },
});
