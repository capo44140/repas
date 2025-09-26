<template>
  <div class="space-y-6">
    <!-- En-tête avec titre -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Recherche de repas</h1>
      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-600 dark:text-gray-400">
          {{ filteredRepas.length }} recette{{ filteredRepas.length > 1 ? 's' : '' }}
        </span>
      </div>
    </div>

    <!-- Liste virtuelle des repas -->
    <VirtualRecipeList
      :recipes="filteredRepas"
      :container-height="600"
      :item-height="200"
      :grid-item-height="280"
      :loading="loading"
      :has-more="hasMore"
      @recipe-click="showDetails"
      @recipe-favorite="toggleFavorite"
      @recipe-share="shareRecipe"
      @search="handleSearch"
      @filter-change="handleFilterChange"
      @load-more="loadMoreRecipes"
      @add-recipe="addNewRecipe"
    />

    <!-- Modal de détails -->
    <div v-if="selectedRepas" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div 
        class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        :class="{
          'bg-gray-800': isDarkMode
        }"
      >
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-2xl font-bold">{{ selectedRepas.nom }}</h2>
            <button 
              @click="selectedRepas = null"
              class="text-gray-500 hover:text-gray-700"
              :class="{
                'text-gray-400 hover:text-gray-200': isDarkMode
              }"
            >
              <Icon icon="ph:x" class="w-6 h-6" />
            </button>
          </div>
          
          <img 
            :src="selectedRepas.image_url || '/placeholder.jpg'" 
            :alt="selectedRepas.nom"
            class="w-full h-64 object-cover rounded-lg mb-6"
          />

          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 class="font-semibold mb-2">Informations</h3>
              <div class="space-y-2">
                <p><span class="font-medium">Type:</span> {{ selectedRepas.type }}</p>
                <p><span class="font-medium">Saison:</span> {{ selectedRepas.saison }}</p>
                <p><span class="font-medium">Difficulté:</span> {{ selectedRepas.difficulte }}</p>
                <p><span class="font-medium">Temps total:</span> {{ selectedRepas.temps_total }} min</p>
                <p><span class="font-medium">Calories:</span> {{ selectedRepas.calories }} kcal</p>
                <p><span class="font-medium">Coût:</span> {{ selectedRepas.cout }}</p>
              </div>
            </div>
            <div>
              <h3 class="font-semibold mb-2">Temps</h3>
              <div class="space-y-2">
                <p><span class="font-medium">Préparation:</span> {{ selectedRepas.temps_preparation }} min</p>
                <p><span class="font-medium">Cuisson:</span> {{ selectedRepas.temps_cuisson }} min</p>
                <p><span class="font-medium">Repos:</span> {{ selectedRepas.temps_repos }} min</p>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <h3 class="font-semibold mb-2">Ingrédients</h3>
            <ul class="list-disc list-inside space-y-1">
              <li v-for="(ingredient, index) in selectedRepas.ingredients" :key="index">
                {{ ingredient }}
              </li>
            </ul>
          </div>

          <div class="mb-6">
            <h3 class="font-semibold mb-2">Instructions</h3>
            <ol class="list-decimal list-inside space-y-2">
              <li v-for="(instruction, index) in selectedRepas.instructions" :key="index">
                {{ instruction }}
              </li>
            </ol>
          </div>

          <div v-if="selectedRepas.notes">
            <h3 class="font-semibold mb-2">Notes</h3>
            <p class="whitespace-pre-line">{{ selectedRepas.notes }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue';
import { Icon } from '@iconify/vue';
import VirtualRecipeList from '../components/VirtualRecipeList.vue';
import { useMealsStore } from '../stores/useMealsStore';
import { useUIStore } from '../stores/useUIStore';

// Utiliser les stores
const mealsStore = useMealsStore();
const uiStore = useUIStore();

// État local
const selectedRepas = ref(null);
const loading = ref(false);
const hasMore = ref(false);
const searchFilters = ref({
  query: '',
  season: '',
  type: ''
});

// Données calculées
const filteredRepas = computed(() => {
  let filtered = [...mealsStore.filteredMeals];

  // Appliquer les filtres de recherche
  if (searchFilters.value.query) {
    const query = searchFilters.value.query.toLowerCase();
    filtered = filtered.filter(recipe => 
      recipe.nom.toLowerCase().includes(query) ||
      recipe.ingredients?.some(ingredient => 
        ingredient.toLowerCase().includes(query)
      ) ||
      recipe.notes?.toLowerCase().includes(query)
    );
  }

  if (searchFilters.value.season) {
    filtered = filtered.filter(recipe => recipe.saison === searchFilters.value.season);
  }

  if (searchFilters.value.type) {
    filtered = filtered.filter(recipe => recipe.type === searchFilters.value.type);
  }

  return filtered;
});

// Méthodes
const loadRepas = async () => {
  loading.value = true;
  try {
    await mealsStore.fetchMeals();
    hasMore.value = false; // Pour l'instant, on charge tout d'un coup
  } catch (error) {
    console.error('Erreur lors du chargement des repas:', error);
    uiStore.showToast({
      message: 'Erreur lors du chargement des recettes',
      type: 'error'
    });
  } finally {
    loading.value = false;
  }
};

const showDetails = (repas) => {
  selectedRepas.value = repas;
};

const toggleFavorite = (recipe) => {
  // TODO: Implémenter la logique de favoris
  uiStore.showToast({
    message: recipe.isFavorite ? 'Recette retirée des favoris' : 'Recette ajoutée aux favoris',
    type: 'success'
  });
};

const shareRecipe = (recipe) => {
  // TODO: Implémenter le partage
  uiStore.showToast({
    message: 'Fonctionnalité de partage à venir',
    type: 'info'
  });
};

const handleSearch = (searchData) => {
  searchFilters.value = { ...searchFilters.value, ...searchData };
};

const handleFilterChange = (filterData) => {
  searchFilters.value = { ...searchFilters.value, ...filterData };
};

const loadMoreRecipes = () => {
  // TODO: Implémenter la pagination
  hasMore.value = false;
};

const addNewRecipe = () => {
  // TODO: Rediriger vers le formulaire d'ajout
  uiStore.showToast({
    message: 'Redirection vers le formulaire d\'ajout',
    type: 'info'
  });
};

// Charger les repas au montage du composant
onMounted(loadRepas);
</script>

<style scoped>
.dark {
  color-scheme: dark;
}
</style> 