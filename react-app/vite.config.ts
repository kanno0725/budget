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
        name: 'PWA budget App',
        short_name: 'budget app',
        description: 'budget',
        theme_color: '#27272A',
        display: "fullscreen",
        icons: [
          {
            src: 'test192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'test512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
