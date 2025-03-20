<template>
  <div class="container mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">Propositions de Menus</h2>
      <button 
        @click="generateSuggestions"
        class="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center"
      >
        <Icon icon="ph:arrows-clockwise" class="w-5 h-5 mr-2" />
        Générer de nouvelles propositions
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="(suggestion, index) in suggestions" 
        :key="index"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Menu {{ index + 1 }}
          </h3>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ suggestion.season }}
          </span>
        </div>
        
        <div class="space-y-4">
          <div>
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Midi</h4>
            <p class="text-gray-800 dark:text-gray-200">{{ suggestion.lunch }}</p>
          </div>
          
          <div>
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Soir</h4>
            <p class="text-gray-800 dark:text-gray-200">{{ suggestion.dinner }}</p>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            @click="selectMenu(suggestion)"
            class="w-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-md hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
          >
            Sélectionner ce menu
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

 

<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

const suggestions = ref([]);

const generateSuggestions = () => {
  // Exemple de données de suggestions
  suggestions.value = [
    {
      season: 'Hiver',
      lunch: 'Soupe de légumes racines',
      dinner: 'Gratin de pâtes aux épinards'
    },
    {
      season: 'Printemps',
      lunch: 'Salade de printemps avec poulet',
      dinner: 'Risotto aux asperges'
    },
    {
      season: 'Été',
      lunch: 'Salade niçoise',
      dinner: 'Ratatouille avec riz'
    },
    {
      season: 'Automne',
      lunch: 'Velouté de potiron',
      dinner: 'Rôti de porc aux pommes'
    }
  ];
};

const selectMenu = (menu) => {
  // Logique pour sélectionner un menu
  console.log('Menu sélectionné:', menu);
};

// Générer des suggestions au chargement de la page
generateSuggestions();
</script> 