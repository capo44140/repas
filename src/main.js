import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css';

const app = createApp(App)
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
