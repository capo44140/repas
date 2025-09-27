import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "Générateur de Repas",
        short_name: "Repas",
        description: "Application de génération de planning de repas",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    include: ["quagga", "canvg", "rgbcolor", "raf"],
  },
  build: {
    commonjsOptions: {
      include: [/quagga/, /canvg/, /rgbcolor/, /raf/],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {
          'canvg': 'canvg',
          'rgbcolor': 'rgbcolor',
          'raf': 'raf'
        },
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'ui-vendor': ['@iconify/vue', '@iconify/json'],
          'chart-vendor': ['chart.js', 'vue-chartjs'],
          'utils-vendor': ['axios', 'papaparse', 'csv-parse'],
          'pdf-vendor': ['jspdf', 'jspdf-autotable']
        }
      }
    }
  },
});
