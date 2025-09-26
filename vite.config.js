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
    include: ["quagga"],
  },
  build: {
    commonjsOptions: {
      include: [/quagga/],
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Chunks pour les bibliothèques principales
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'ui-vendor': ['@iconify/vue', '@iconify/json'],
          'chart-vendor': ['chart.js', 'vue-chartjs'],
          'utils-vendor': ['axios', 'papaparse', 'csv-parse'],
          'pdf-vendor': ['jspdf', 'jspdf-autotable'],
          'barcode-vendor': ['@zxing/browser', '@zxing/library'],
          'db-vendor': ['@neondatabase/serverless', 'pg'],
          
          // Chunks pour les composants par fonctionnalité
          'components-ui': [
            './src/components/LazyImage.vue',
            './src/components/LazyComponent.vue',
            './src/components/VirtualList.vue',
            './src/components/VirtualRecipeList.vue',
            './src/components/RecipeCard.vue',
            './src/components/ToastNotification.vue',
            './src/components/ThemeSwitcher.vue'
          ],
          'components-forms': [
            './src/components/AdvancedSearch.vue',
            './src/components/CsvImporter.vue',
            './src/components/LoginForm.vue',
            './src/components/UserPreferences.vue'
          ],
          'components-charts': [
            './src/components/MonthlyMealsChart.vue',
            './src/components/StatisticsChart.vue'
          ],
          'components-modals': [
            './src/components/RecipeDetailModal.vue',
            './src/components/EditMealModal.vue'
          ],
          'views-main': [
            './src/views/HomeView.vue',
            './src/views/Home.vue'
          ],
          'views-meals': [
            './src/views/GeneratedMealsView.vue',
            './src/views/GeneratedMeals.vue',
            './src/views/MealSuggestions.vue'
          ],
          'views-admin': [
            './src/views/AdminView.vue',
            './src/views/UserPreferencesView.vue'
          ],
          'views-other': [
            './src/views/ShareRecipesView.vue',
            './src/views/ShoppingListView.vue'
          ],
          'stores': [
            './src/stores/useMealsStore.js',
            './src/stores/useUIStore.js',
            './src/stores/usePreferencesStore.js',
            './src/stores/useMenuStore.js'
          ],
          'services': [
            './src/services/repasService.js',
            './src/services/neon.js',
            './src/services/cacheService.js',
            './src/services/exportService.js'
          ]
        }
      }
    }
  },
});
