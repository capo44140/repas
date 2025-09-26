<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recherche avancée</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <!-- Recherche par texte -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nom ou ingrédient
        </label>
        <input 
          v-model="searchQuery.text" 
          type="text" 
          placeholder="Rechercher..." 
          class="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>
      
      <!-- Filtres par saison -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Saison
        </label>
        <select 
          v-model="searchQuery.saison" 
          class="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Toutes les saisons</option>
          <option value="hiver">Hiver</option>
          <option value="printemps">Printemps</option>
          <option value="ete">Été</option>
          <option value="automne">Automne</option>
        </select>
      </div>
      
      <!-- Filtres par type -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Type
        </label>
        <select 
          v-model="searchQuery.type" 
          class="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Tous les types</option>
          <option value="Entrée">Entrée</option>
          <option value="Plat principal">Plat principal</option>
          <option value="Dessert">Dessert</option>
          <option value="Accompagnement">Accompagnement</option>
        </select>
      </div>
      
      <!-- Filtres par temps de préparation -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Temps de préparation max (min)
        </label>
        <input 
          v-model="searchQuery.maxPrepTime" 
          type="number" 
          min="0"
          class="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>
      
      <!-- Filtres par difficulté -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Difficulté
        </label>
        <select 
          v-model="searchQuery.difficulte" 
          class="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Toutes les difficultés</option>
          <option value="Facile">Facile</option>
          <option value="Moyen">Moyen</option>
          <option value="Difficile">Difficile</option>
        </select>
      </div>
      
      <!-- Filtres par calories -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Calories max
        </label>
        <input 
          v-model="searchQuery.maxCalories" 
          type="number" 
          min="0"
          class="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>
    </div>
    
    <!-- Options avancées (collapsible) -->
    <div class="mb-6">
      <button 
        @click="showAdvanced = !showAdvanced"
        class="flex items-center text-primary-600 dark:text-primary-400 hover:underline"
      >
        <span>{{ showAdvanced ? 'Masquer' : 'Afficher' }} les options avancées</span>
        <Icon :icon="showAdvanced ? 'ph:caret-up' : 'ph:caret-down'" class="ml-1 w-4 h-4" />
      </button>
      
      <div v-if="showAdvanced" class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Ingrédients inclus -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ingrédients inclus
          </label>
          <div class="flex">
            <input 
              v-model="newIncludedIngredient" 
              type="text" 
              placeholder="Ajouter un ingrédient..." 
              class="flex-1 px-4 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              @keyup.enter="addIncludedIngredient"
            />
            <button 
              @click="addIncludedIngredient"
              class="px-4 py-2 bg-primary-600 text-white rounded-r-md hover:bg-primary-700"
            >
              +
            </button>
          </div>
          <div class="mt-2 flex flex-wrap gap-2">
            <span 
              v-for="(ingredient, index) in searchQuery.includedIngredients" 
              :key="index"
              class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200"
            >
              {{ ingredient }}
              <button @click="removeIncludedIngredient(index)" class="ml-1 text-primary-600 dark:text-primary-400">
                &times;
              </button>
            </span>
          </div>
        </div>
        
        <!-- Ingrédients exclus -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ingrédients exclus
          </label>
          <div class="flex">
            <input 
              v-model="newExcludedIngredient" 
              type="text" 
              placeholder="Exclure un ingrédient..." 
              class="flex-1 px-4 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              @keyup.enter="addExcludedIngredient"
            />
            <button 
              @click="addExcludedIngredient"
              class="px-4 py-2 bg-red-600 text-white rounded-r-md hover:bg-red-700"
            >
              +
            </button>
          </div>
          <div class="mt-2 flex flex-wrap gap-2">
            <span 
              v-for="(ingredient, index) in searchQuery.excludedIngredients" 
              :key="index"
              class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
            >
              {{ ingredient }}
              <button @click="removeExcludedIngredient(index)" class="ml-1 text-red-600 dark:text-red-400">
                &times;
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Boutons d'action -->
    <div class="flex justify-end space-x-4">
      <button 
        @click="resetSearch"
        class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        Réinitialiser
      </button>
      <button 
        @click="search"
        class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
      >
        Rechercher
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, inject } from 'vue';
import { Icon } from '@iconify/vue';

// Utiliser le store des repas
const mealsStore = inject('mealsStore');

const showAdvanced = ref(false);
const newIncludedIngredient = ref('');
const newExcludedIngredient = ref('');

// Utiliser les filtres du store
const searchQuery = reactive(mealsStore.searchFilters);

const emit = defineEmits(['search']);

// Ajouter un ingrédient à inclure
const addIncludedIngredient = () => {
  if (newIncludedIngredient.value.trim()) {
    searchQuery.includedIngredients.push(newIncludedIngredient.value.trim());
    newIncludedIngredient.value = '';
  }
};

// Supprimer un ingrédient à inclure
const removeIncludedIngredient = (index) => {
  searchQuery.includedIngredients.splice(index, 1);
};

// Ajouter un ingrédient à exclure
const addExcludedIngredient = () => {
  if (newExcludedIngredient.value.trim()) {
    searchQuery.excludedIngredients.push(newExcludedIngredient.value.trim());
    newExcludedIngredient.value = '';
  }
};

// Supprimer un ingrédient à exclure
const removeExcludedIngredient = (index) => {
  searchQuery.excludedIngredients.splice(index, 1);
};

// Réinitialiser la recherche
const resetSearch = () => {
  mealsStore.clearSearchFilters();
  // Mettre à jour la référence locale
  Object.assign(searchQuery, mealsStore.searchFilters);
};

// Lancer la recherche
const search = () => {
  // Mettre à jour les filtres dans le store
  mealsStore.setSearchFilters(searchQuery);
  emit('search', { ...searchQuery });
};
</script>