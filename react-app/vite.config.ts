import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
  },
  plugins: [
    react(),
    // PWAの設定
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      includeAssets: ['assets/favicon.ico'],
      manifest: {
        name: 'PWA Hoge App',
        short_name: 'App Name',
        description: 'test app',
        theme_color: '#27272A',
        display: "fullscreen",
        icons: [
          {
            src: '.src/assets/image/test192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '.src/assets/image/test512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
