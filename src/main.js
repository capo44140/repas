import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css';
import { Icon } from '@iconify/vue'
import ToastNotification from './components/ToastNotification.vue'
import { useDarkMode } from './composables/useDarkMode'

const app = createApp(App)

// Enregistrement des composants globaux
app.component('Icon', Icon)
app.component('ToastNotification', ToastNotification)

// Fournir le composable useDarkMode globalement
app.provide('useDarkMode', useDarkMode)

app.use(router)
app.mount('#app')

// Enregistrement du service worker pour PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker enregistré avec succès:', registration.scope);
      })
      .catch(error => {
        console.log('Erreur lors de l\'enregistrement du Service Worker:', error);
      });
  });
}
