<template>
  <div class="p-6">
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
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import MonthlyMealsChart from '../components/MonthlyMealsChart.vue';
import StatisticsChart from '../components/StatisticsChart.vue';

// Données simulées pour le tableau de bord
const totalMeals = ref(382);
const mealsGrowth = ref(11.01);
const generatedMenus = ref(215);
const menusGrowth = ref(9.05);
</script>

<style scoped>
.grid {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
</style> 