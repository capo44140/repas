<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Préférences utilisateur</h1>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="p-6">
          <UserPreferences />
        </div>
      </div>
      
      <div class="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Notifications</h2>
          
          <div class="space-y-4">
            <div>
              <p class="text-gray-600 dark:text-gray-300 mb-3">
                Configurez les notifications pour rester informé de vos planifications de repas.
              </p>
              
              <button 
                @click="requestNotificationPermission" 
                class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                {{ hasPermission ? 'Notifications activées' : 'Activer les notifications' }}
              </button>
            </div>
            
            <div v-if="hasPermission" class="mt-4">
              <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Rappels disponibles</h3>
              
              <div class="space-y-3">
                <div class="flex items-start">
                  <input 
                    type="checkbox" 
                    id="weeklyReminder" 
                    v-model="weeklyReminders" 
                    class="h-4 w-4 mt-1 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div class="ml-3">
                    <label for="weeklyReminder" class="text-gray-700 dark:text-gray-300 font-medium">Rappel hebdomadaire</label>
                    <p class="text-gray-500 dark:text-gray-400 text-sm">Recevez un rappel chaque semaine pour planifier vos repas</p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <input 
                    type="checkbox" 
                    id="mealPrepReminder" 
                    v-model="mealPrepReminders" 
                    class="h-4 w-4 mt-1 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div class="ml-3">
                    <label for="mealPrepReminder" class="text-gray-700 dark:text-gray-300 font-medium">Préparation des repas</label>
                    <p class="text-gray-500 dark:text-gray-400 text-sm">Recevez un rappel avant chaque repas pour vous préparer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Accessibilité</h2>
          
          <div class="space-y-4">
            <div class="flex items-start">
              <input 
                type="checkbox" 
                id="highContrast" 
                v-model="highContrast" 
                class="h-4 w-4 mt-1 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <div class="ml-3">
                <label for="highContrast" class="text-gray-700 dark:text-gray-300 font-medium">Mode haut contraste</label>
                <p class="text-gray-500 dark:text-gray-400 text-sm">Augmente le contraste des couleurs pour une meilleure lisibilité</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <input 
                type="checkbox" 
                id="reducedMotion" 
                v-model="reducedMotion" 
                class="h-4 w-4 mt-1 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <div class="ml-3">
                <label for="reducedMotion" class="text-gray-700 dark:text-gray-300 font-medium">Réduire les animations</label>
                <p class="text-gray-500 dark:text-gray-400 text-sm">Désactive ou réduit les animations dans l'application</p>
              </div>
            </div>
            
            <div>
              <label for="fontSize" class="block text-gray-700 dark:text-gray-300 font-medium mb-1">Taille du texte</label>
              <div class="flex items-center">
                <span class="text-sm text-gray-500 dark:text-gray-400">A</span>
                <input 
                  type="range" 
                  id="fontSize" 
                  v-model="fontSize" 
                  min="80" 
                  max="120" 
                  step="10" 
                  class="mx-2 w-full max-w-xs"
                />
                <span class="text-lg text-gray-500 dark:text-gray-400">A</span>
              </div>
              <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">{{ fontSize }}% de la taille normale</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Données</h2>
          
          <div class="space-y-4">
            <div>
              <p class="text-gray-600 dark:text-gray-300 mb-3">
                Toutes vos données sont stockées localement sur votre appareil pour plus de confidentialité.
              </p>
              
              <div class="flex space-x-3">
                <button 
                  @click="exportData" 
                  class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  Exporter les données
                </button>
                
                <button 
                  @click="confirmResetData" 
                  class="px-4 py-2 bg-white text-red-600 border border-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-800"
                >
                  Réinitialiser les données
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import UserPreferences from '../components/UserPreferences.vue';
import NotificationService from '../services/NotificationService';

// Notifications
const hasPermission = ref(false);
const weeklyReminders = ref(false);
const mealPrepReminders = ref(false);

// Accessibilité
const highContrast = ref(false);
const reducedMotion = ref(false);
const fontSize = ref(100);

// Charger les préférences
onMounted(() => {
  // Vérifier les permissions de notification
  hasPermission.value = NotificationService.hasPermission();
  
  // Charger les préférences d'accessibilité
  const savedPrefs = JSON.parse(localStorage.getItem('accessibility') || '{}');
  highContrast.value = savedPrefs.highContrast || false;
  reducedMotion.value = savedPrefs.reducedMotion || false;
  fontSize.value = savedPrefs.fontSize || 100;
  
  // Charger les préférences de notification
  const notifPrefs = JSON.parse(localStorage.getItem('notificationPrefs') || '{}');
  weeklyReminders.value = notifPrefs.weeklyReminders || false;
  mealPrepReminders.value = notifPrefs.mealPrepReminders || false;
  
  // Appliquer les préférences
  applyAccessibilitySettings();
});

// Observer les changements des préférences d'accessibilité
watch([highContrast, reducedMotion, fontSize], () => {
  saveAndApplyAccessibilitySettings();
});

// Observer les changements des préférences de notification
watch([weeklyReminders, mealPrepReminders], () => {
  saveNotificationPreferences();
});

async function requestNotificationPermission() {
  const permission = await NotificationService.requestPermission();
  hasPermission.value = permission === 'granted';
  
  if (hasPermission.value) {
    // Activer par défaut les rappels hebdomadaires
    weeklyReminders.value = true;
    saveNotificationPreferences();
  }
}

function saveAndApplyAccessibilitySettings() {
  // Enregistrer les préférences
  localStorage.setItem('accessibility', JSON.stringify({
    highContrast: highContrast.value,
    reducedMotion: reducedMotion.value,
    fontSize: fontSize.value
  }));
  
  // Appliquer les préférences
  applyAccessibilitySettings();
}

function applyAccessibilitySettings() {
  // Appliquer les classes CSS pour le contraste élevé
  if (highContrast.value) {
    document.documentElement.classList.add('high-contrast');
  } else {
    document.documentElement.classList.remove('high-contrast');
  }
  
  // Appliquer les classes CSS pour la réduction du mouvement
  if (reducedMotion.value) {
    document.documentElement.classList.add('reduced-motion');
  } else {
    document.documentElement.classList.remove('reduced-motion');
  }
  
  // Appliquer la taille de police
  document.documentElement.style.fontSize = `${fontSize.value}%`;
}

function saveNotificationPreferences() {
  const preferences = {
    weeklyReminders: weeklyReminders.value,
    mealPrepReminders: mealPrepReminders.value
  };
  
  localStorage.setItem('notificationPrefs', JSON.stringify(preferences));
  
  // Configurer les rappels
  if (hasPermission.value) {
    if (weeklyReminders.value) {
      NotificationService.scheduleWeeklyMenuReminder();
    }
  }
}

function exportData() {
  try {
    // Récupérer toutes les données du localStorage
    const exportData = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      exportData[key] = localStorage.getItem(key);
    }
    
    // Créer un blob pour le téléchargement
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Créer un lien de téléchargement
    const a = document.createElement('a');
    a.href = url;
    a.download = `repas-data-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Nettoyer
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Erreur lors de l\'exportation des données:', error);
    alert('Une erreur est survenue lors de l\'exportation des données.');
  }
}

function confirmResetData() {
  if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données ? Cette action ne peut pas être annulée.')) {
    resetAllData();
  }
}

function resetAllData() {
  try {
    localStorage.clear();
    alert('Toutes les données ont été réinitialisées. L\'application va se recharger.');
    window.location.reload();
  } catch (error) {
    console.error('Erreur lors de la réinitialisation des données:', error);
    alert('Une erreur est survenue lors de la réinitialisation des données.');
  }
}
</script>

<style>
/* Styles pour le mode contraste élevé */
.high-contrast {
  --contrast-factor: 1.5;
}

/* Styles pour la réduction des animations */
.reduced-motion * {
  animation-duration: 0.001s !important;
  transition-duration: 0.001s !important;
}
</style> 