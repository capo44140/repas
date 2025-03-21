<template>
  <div class="p-6">
    <!-- Repas en vedette -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Repas en vedette</h2>
      <div class="flex flex-col md:flex-row gap-6">
        <div class="md:w-1/2">
          <img 
            :src="featuredMeal.image" 
            :alt="featuredMeal.name" 
            class="w-full h-64 object-cover rounded-lg"
          />
        </div>
        <div class="md:w-1/2">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{{ featuredMeal.name }}</h3>
          <div class="mb-3">
            <span class="inline-block px-2 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 mr-2">
              {{ featuredMeal.season }}
            </span>
            <span class="inline-block px-2 py-1 rounded-full text-xs font-medium bg-success-100 dark:bg-success-900 text-success-800 dark:text-success-200">
              {{ featuredMeal.type }}
            </span>
          </div>
          <p class="text-gray-600 dark:text-gray-400 mb-4">{{ featuredMeal.description }}</p>
          <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Icon icon="ph:clock" class="w-4 h-4 mr-2" />
            <span>Temps de préparation: environ {{ featuredMeal.prepTime }} minutes</span>
          </div>
          <button 
            @click="openRecipeDetail"
            class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors duration-200"
          >
            Voir la recette complète
          </button>
        </div>
      </div>
    </div>

    <!-- Cartes de statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <!-- Carte des repas -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center mb-4">
          <Icon icon="ph:fork-knife" class="w-6 h-6 text-primary-500 dark:text-primary-400" />
          <h3 class="ml-2 text-lg font-semibold text-gray-800 dark:text-gray-200">Repas</h3>
        </div>
        <div class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ totalMeals }}
        </div>
        <div class="flex items-center text-sm">
          <span class="text-success-500 flex items-center" v-if="mealsGrowth > 0">
            <Icon icon="ph:trend-up" class="w-4 h-4 mr-1" />
            +{{ mealsGrowth }}%
          </span>
          <span class="text-red-500 flex items-center" v-else>
            <Icon icon="ph:trend-down" class="w-4 h-4 mr-1" />
            {{ mealsGrowth }}%
          </span>
          <span class="text-gray-500 dark:text-gray-400 ml-2">vs mois dernier</span>
        </div>
      </div>

      <!-- Carte des saisons -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center mb-4">
          <Icon icon="ph:sun" class="w-6 h-6 text-primary-500 dark:text-primary-400" />
          <h3 class="ml-2 text-lg font-semibold text-gray-800 dark:text-gray-200">Saisons</h3>
        </div>
        <div class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          4
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          Toutes les saisons couvertes
        </div>
      </div>

      <!-- Carte des menus générés -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center mb-4">
          <Icon icon="ph:chart-line" class="w-6 h-6 text-primary-500 dark:text-primary-400" />
          <h3 class="ml-2 text-lg font-semibold text-gray-800 dark:text-gray-200">Menus générés</h3>
        </div>
        <div class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ generatedMenus }}
        </div>
        <div class="flex items-center text-sm">
          <span class="text-success-500 flex items-center">
            <Icon icon="ph:trend-up" class="w-4 h-4 mr-1" />
            +{{ menusGrowth }}%
          </span>
          <span class="text-gray-500 dark:text-gray-400 ml-2">cette semaine</span>
        </div>
      </div>
    </div>

    <!-- Graphique des repas par mois -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Repas mensuels</h3>
        <button class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <Icon icon="ph:dots-three-vertical" class="w-5 h-5" />
        </button>
      </div>
      <div class="h-64">
        <!-- Ici nous ajouterons le graphique avec une bibliothèque comme Chart.js -->
        <MonthlyMealsChart />
      </div>
    </div>

    <!-- Statistiques détaillées -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Statistiques</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Objectifs mensuels</p>
        </div>
        <div class="flex space-x-2">
          <button class="px-3 py-1 rounded-md bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400">
            Vue d'ensemble
          </button>
          <button class="px-3 py-1 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            Repas
          </button>
          <button class="px-3 py-1 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            Saisons
          </button>
        </div>
      </div>
      <div class="h-64">
        <StatisticsChart />
      </div>
    </div>
    
    <!-- Ajout du modal pour les détails de recette -->
    <RecipeDetailModal 
      :is-open="isRecipeModalOpen" 
      :recipe="featuredMeal" 
      @close="closeRecipeDetail" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import MonthlyMealsChart from '../components/MonthlyMealsChart.vue';
import StatisticsChart from '../components/StatisticsChart.vue';
import RecipeDetailModal from '../components/RecipeDetailModal.vue';
import { useRouter } from 'vue-router';

// Données simulées pour le tableau de bord
const totalMeals = ref(382);
const mealsGrowth = ref(11.01);
const generatedMenus = ref(215);
const menusGrowth = ref(9.05);

// Variables pour le modal de recette
const isRecipeModalOpen = ref(false);
const router = useRouter();

// Function to open the recipe detail modal
const openRecipeDetail = () => {
  isRecipeModalOpen.value = true;
};

// Function to close the recipe detail modal
const closeRecipeDetail = () => {
  isRecipeModalOpen.value = false;
};

// You can also keep the existing navigation function if you want both options
const showRecipeDetails = (meal) => {
  if (meal) {
    const recipeData = encodeURIComponent(JSON.stringify(meal));
    router.push(`/recipe/${recipeData}`);
  }
};

// Données des repas (simulées)
const meals = [
  {
    id: 1,
    name: 'Gratin dauphinois',
    season: 'Hiver',
    type: 'Plat',
    description: 'Un délicieux gratin de pommes de terre avec de la crème et du fromage, parfait pour accompagner une viande ou servir comme plat principal avec une salade.',
    prepTime: 45,
    image: 'https://images.unsplash.com/photo-1568600891621-50f697b9a1c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JhdGluJTIwZGF1cGhpbm9pc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 2,
    name: 'Salade niçoise',
    season: 'Été',
    type: 'Entrée',
    description: 'Cette salade méditerranéenne fraîche combine des tomates, des œufs durs, du thon, des olives noires et des haricots verts pour un repas léger mais complet.',
    prepTime: 20,
    image: 'https://images.unsplash.com/photo-1595587870672-c79b47875c6a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2FsYWRlJTIwbmljb2lzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 3,
    name: 'Soupe à l\'oignon',
    season: 'Automne',
    type: 'Entrée',
    description: 'Un classique français réconfortant, avec des oignons caramélisés mijotés dans un bouillon savoureux, garni de croûtons et de fromage gratiné.',
    prepTime: 60,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8b25pb24lMjBzb3VwfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 4,
    name: 'Ratatouille',
    season: 'Été',
    type: 'Plat',
    description: 'Un ragoût provençal coloré de légumes d\'été, comprenant des aubergines, des courgettes, des poivrons et des tomates, parfumé à l\'huile d\'olive et aux herbes de Provence.',
    prepTime: 50,
    image: 'https://images.unsplash.com/photo-1572453800999-e8d2d0d95b0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmF0YXRvdWlsbGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 5,
    name: 'Tarte Tatin',
    season: 'Automne',
    type: 'Dessert',
    description: 'Un dessert traditionnel français où des pommes caramélisées sont recouvertes d\'une pâte feuilletée et cuites ensemble, puis renversées pour servir.',
    prepTime: 55,
    image: 'https://images.unsplash.com/photo-1557943819-b09ae56a3a13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGFydGUlMjB0YXRpbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'
  }
];

// Sélectionner un repas aléatoire pour mettre en vedette
const featuredMeal = ref({});

onMounted(() => {
  // Sélectionner un repas aléatoire
  const randomIndex = Math.floor(Math.random() * meals.length);
  featuredMeal.value = meals[randomIndex];
});
</script>

<style scoped>
.grid {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
</style>