<template>
  <div class="p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Statistiques
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Analysez vos données de repas et découvrez vos tendances
      </p>
    </div>

    <!-- Cartes de statistiques principales -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Icon icon="ph:fork-knife" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Repas</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalMeals }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <Icon icon="ph:calendar-check" class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Menus Générés</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ generatedMenus }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <Icon icon="ph:clock" class="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Temps Moyen</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ averagePrepTime }}min</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <Icon icon="ph:fire" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Calories Moyennes</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ averageCalories }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Graphiques -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Graphique des repas par saison -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Répartition par Saison
        </h3>
        <div class="h-64">
          <LazyComponent
            component="StatisticsChart"
            :component-props="{ 
              type: 'doughnut',
              data: seasonData,
              options: chartOptions
            }"
            :loading-text="'Chargement du graphique...'"
          />
        </div>
      </div>

      <!-- Graphique des repas par type -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Répartition par Type
        </h3>
        <div class="h-64">
          <LazyComponent
            component="StatisticsChart"
            :component-props="{ 
              type: 'bar',
              data: typeData,
              options: chartOptions
            }"
            :loading-text="'Chargement du graphique...'"
          />
        </div>
      </div>
    </div>

    <!-- Graphique des repas mensuels -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Évolution Mensuelle
      </h3>
      <div class="h-80">
        <LazyComponent
          component="MonthlyMealsChart"
          :loading-text="'Chargement du graphique mensuel...'"
        />
      </div>
    </div>

    <!-- Tableau des statistiques détaillées -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Statistiques Détaillées
      </h3>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Catégorie
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Nombre
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Pourcentage
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Tendance
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="stat in detailedStats" :key="stat.category">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ stat.category }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ stat.count }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ stat.percentage }}%
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': stat.trend === 'up',
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': stat.trend === 'down',
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200': stat.trend === 'stable'
                  }"
                >
                  <Icon 
                    :icon="stat.trend === 'up' ? 'ph:trend-up' : stat.trend === 'down' ? 'ph:trend-down' : 'ph:minus'"
                    class="w-3 h-3 mr-1"
                  />
                  {{ stat.trend === 'up' ? 'Hausse' : stat.trend === 'down' ? 'Baisse' : 'Stable' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useMealsStore } from '../stores/useMealsStore'
import { useMenuStore } from '../stores/useMenuStore'

// Utiliser les stores
const mealsStore = useMealsStore()
const menuStore = useMenuStore()

// Données calculées
const totalMeals = computed(() => mealsStore.totalMeals)
const generatedMenus = computed(() => menuStore.totalGeneratedMenus)

const averagePrepTime = computed(() => {
  if (mealsStore.meals.length === 0) return 0
  const total = mealsStore.meals.reduce((sum, meal) => sum + (meal.temps_preparation || 0), 0)
  return Math.round(total / mealsStore.meals.length)
})

const averageCalories = computed(() => {
  if (mealsStore.meals.length === 0) return 0
  const total = mealsStore.meals.reduce((sum, meal) => sum + (meal.calories || 0), 0)
  return Math.round(total / mealsStore.meals.length)
})

// Données pour les graphiques
const seasonData = computed(() => {
  const seasons = mealsStore.mealsBySeason
  return {
    labels: Object.keys(seasons).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    datasets: [{
      data: Object.values(seasons).map(arr => arr.length),
      backgroundColor: [
        '#3B82F6', // Bleu
        '#10B981', // Vert
        '#F59E0B', // Jaune
        '#EF4444'  // Rouge
      ]
    }]
  }
})

const typeData = computed(() => {
  const types = mealsStore.mealsByType
  return {
    labels: Object.keys(types).map(t => t.charAt(0).toUpperCase() + t.slice(1)),
    datasets: [{
      label: 'Nombre de repas',
      data: Object.values(types).map(arr => arr.length),
      backgroundColor: '#3B82F6'
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}

// Statistiques détaillées
const detailedStats = computed(() => {
  const stats = []
  
  // Par saison
  Object.entries(mealsStore.mealsBySeason).forEach(([season, meals]) => {
    stats.push({
      category: `Saison ${season.charAt(0).toUpperCase() + season.slice(1)}`,
      count: meals.length,
      percentage: Math.round((meals.length / totalMeals.value) * 100),
      trend: 'stable' // TODO: Calculer la tendance
    })
  })
  
  // Par type
  Object.entries(mealsStore.mealsByType).forEach(([type, meals]) => {
    stats.push({
      category: `Type ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      count: meals.length,
      percentage: Math.round((meals.length / totalMeals.value) * 100),
      trend: 'stable' // TODO: Calculer la tendance
    })
  })
  
  return stats
})

onMounted(() => {
  // Les données sont déjà chargées par les stores
})
</script>

<style scoped>
/* Styles spécifiques aux statistiques */
</style>
