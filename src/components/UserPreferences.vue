<template>
  <div class="user-preferences-panel p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Préférences utilisateur</h2>
    
    <div class="space-y-4">
      <!-- Section Profil -->
      <div class="mb-4">
        <h3 class="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">Profil</h3>
        <div class="flex flex-col space-y-2">
          <div>
            <label for="userName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
            <input 
              type="text" 
              id="userName" 
              v-model="preferences.userName" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>
      
      <!-- Section Préférences alimentaires -->
      <div class="mb-4">
        <h3 class="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">Préférences alimentaires</h3>
        <div class="space-y-3">
          <div class="flex items-center">
            <input 
              type="checkbox" 
              id="preference-vegetarian" 
              v-model="preferences.vegetarian"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <label for="preference-vegetarian" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Végétarien
            </label>
          </div>
          
          <div class="flex items-center">
            <input 
              type="checkbox" 
              id="preference-vegan" 
              v-model="preferences.vegan"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <label for="preference-vegan" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Végétalien
            </label>
          </div>
          
          <div class="flex items-center">
            <input 
              type="checkbox" 
              id="preference-glutenFree" 
              v-model="preferences.glutenFree"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <label for="preference-glutenFree" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Sans gluten
            </label>
          </div>
          
          <div class="flex items-center">
            <input 
              type="checkbox" 
              id="preference-lactoseFree" 
              v-model="preferences.lactoseFree"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <label for="preference-lactoseFree" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Sans lactose
            </label>
          </div>
        </div>
      </div>
      
      <!-- Section Aliments exclus -->
      <div class="mb-4">
        <h3 class="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">Aliments à éviter</h3>
        <div class="space-y-2">
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="(item, index) in preferences.excludedFoods" 
              :key="index" 
              class="inline-flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md text-sm"
            >
              {{ item }}
              <button 
                @click="removeExcludedFood(index)" 
                class="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Supprimer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </span>
            <input 
              type="text" 
              v-model="newExcludedFood" 
              @keydown.enter="addExcludedFood"
              placeholder="Ajouter..." 
              class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>
      
      <!-- Section Interface -->
      <div class="mb-4">
        <h3 class="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">Affichage</h3>
        <div class="space-y-3">
          <div>
            <label for="mealsPerPage" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Repas par page</label>
            <select 
              id="mealsPerPage" 
              v-model="preferences.mealsPerPage" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>
          
          <div class="flex items-center">
            <input 
              type="checkbox" 
              id="showNutrition" 
              v-model="preferences.showNutrition"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <label for="showNutrition" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Afficher les informations nutritionnelles
            </label>
          </div>
        </div>
      </div>
      
      <!-- Section Notifications -->
      <div class="mb-4">
        <h3 class="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">Notifications</h3>
        <div class="space-y-3">
          <div class="flex items-center">
            <input 
              type="checkbox" 
              id="enableReminders" 
              v-model="preferences.enableReminders"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <label for="enableReminders" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Activer les rappels de préparation
            </label>
          </div>
          
          <div v-if="preferences.enableReminders">
            <label for="reminderTime" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Heure de rappel</label>
            <input 
              type="time" 
              id="reminderTime" 
              v-model="preferences.reminderTime" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
    
    <div class="flex justify-end mt-6 space-x-3">
      <button 
        @click="resetPreferences" 
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
      >
        Réinitialiser
      </button>
      <button 
        @click="savePreferences" 
        class="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        Enregistrer
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

const DEFAULT_PREFERENCES = {
  userName: '',
  vegetarian: false,
  vegan: false,
  glutenFree: false,
  lactoseFree: false,
  excludedFoods: [],
  mealsPerPage: 10,
  showNutrition: true,
  enableReminders: false,
  reminderTime: '18:00'
};

const newExcludedFood = ref('');
const preferences = reactive({...DEFAULT_PREFERENCES});

onMounted(() => {
  // Charger les préférences depuis le localStorage
  const savedPreferences = localStorage.getItem('userPreferences');
  if (savedPreferences) {
    try {
      const parsedPreferences = JSON.parse(savedPreferences);
      Object.assign(preferences, parsedPreferences);
    } catch (error) {
      console.error('Erreur lors du chargement des préférences:', error);
    }
  }
});

function addExcludedFood() {
  if (newExcludedFood.value.trim() && !preferences.excludedFoods.includes(newExcludedFood.value.trim())) {
    preferences.excludedFoods.push(newExcludedFood.value.trim());
    newExcludedFood.value = '';
  }
}

function removeExcludedFood(index) {
  preferences.excludedFoods.splice(index, 1);
}

function savePreferences() {
  // Sauvegarder les préférences dans le localStorage
  localStorage.setItem('userPreferences', JSON.stringify(preferences));
  
  // Émettre un événement pour informer d'autres composants
  window.dispatchEvent(new CustomEvent('user-preferences-updated', {
    detail: { ...preferences }
  }));
  
  // Afficher une notification de confirmation
  showNotification('Préférences enregistrées');
}

function resetPreferences() {
  Object.assign(preferences, DEFAULT_PREFERENCES);
}

function showNotification(message) {
  // Cette fonction pourrait être remplacée par votre système de notification
  console.log('Notification:', message);
}
</script> 