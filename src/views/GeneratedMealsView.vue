<template>
  <div class="space-y-6">
    <!-- En-tête avec titre et sélecteur de source -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Recherche de repas</h1>
      <div class="flex items-center space-x-4">
        <label class="text-sm font-medium">Source de données:</label>
        <select 
          v-model="dataSource" 
          @change="changeDataSource"
          class="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          :class="{
            'bg-white': !isDarkMode,
            'bg-gray-700 border-gray-600': isDarkMode
          }"
        >
          <option value="csv">Fichier CSV</option>
          <option value="neon">Base de données Neon</option>
        </select>
      </div>
    </div>

    <!-- Filtres -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium mb-1">Type de repas</label>
        <select 
          v-model="filters.type" 
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          :class="{
            'bg-white': !isDarkMode,
            'bg-gray-700 border-gray-600': isDarkMode
          }"
        >
          <option value="">Tous</option>
          <option v-for="type in types" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Saison</label>
        <select 
          v-model="filters.saison" 
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          :class="{
            'bg-white': !isDarkMode,
            'bg-gray-700 border-gray-600': isDarkMode
          }"
        >
          <option value="">Toutes</option>
          <option v-for="saison in saisons" :key="saison" :value="saison">{{ saison }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Difficulté</label>
        <select 
          v-model="filters.difficulte" 
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          :class="{
            'bg-white': !isDarkMode,
            'bg-gray-700 border-gray-600': isDarkMode
          }"
        >
          <option value="">Toutes</option>
          <option v-for="difficulte in difficultes" :key="difficulte" :value="difficulte">{{ difficulte }}</option>
        </select>
      </div>
    </div>

    <!-- Liste des repas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="repas in filteredRepas" 
        :key="repas.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
        :class="{
          'bg-gray-800': isDarkMode
        }"
      >
        <img 
          :src="repas.image_url || '/placeholder.jpg'" 
          :alt="repas.nom"
          class="w-full h-48 object-cover"
        />
        <div class="p-4">
          <h3 class="text-lg font-semibold mb-2">{{ repas.nom }}</h3>
          <div class="flex flex-wrap gap-2 mb-4">
            <span 
              class="px-2 py-1 rounded-full text-xs font-medium"
              :class="{
                'bg-primary-100 text-primary-800': !isDarkMode,
                'bg-primary-900 text-primary-200': isDarkMode
              }"
            >
              {{ repas.type }}
            </span>
            <span 
              class="px-2 py-1 rounded-full text-xs font-medium"
              :class="{
                'bg-green-100 text-green-800': !isDarkMode,
                'bg-green-900 text-green-200': isDarkMode
              }"
            >
              {{ repas.saison }}
            </span>
            <span 
              class="px-2 py-1 rounded-full text-xs font-medium"
              :class="{
                'bg-yellow-100 text-yellow-800': !isDarkMode,
                'bg-yellow-900 text-yellow-200': isDarkMode
              }"
            >
              {{ repas.difficulte }}
            </span>
          </div>
          <div class="space-y-2 text-sm">
            <p class="flex justify-between">
              <span>Temps total:</span>
              <span>{{ repas.temps_total }} min</span>
            </p>
            <p class="flex justify-between">
              <span>Calories:</span>
              <span>{{ repas.calories }} kcal</span>
            </p>
            <p class="flex justify-between">
              <span>Coût:</span>
              <span>{{ repas.cout }}</span>
            </p>
          </div>
          <button 
            @click="showDetails(repas)"
            class="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors duration-200"
          >
            Voir les détails
          </button>
        </div>
      </div>
    </div>

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
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { dataSourceService } from '../services/dataSource';
import { useDarkMode } from '../composables/useDarkMode';

const { isDarkMode } = useDarkMode();

const repasList = ref([]);
const selectedRepas = ref(null);
const dataSource = ref('csv');

// Filtres
const filters = ref({
  type: '',
  saison: '',
  difficulte: ''
});

// Charger les repas
const loadRepas = async () => {
  try {
    repasList.value = await dataSourceService.loadRepas();
  } catch (error) {
    console.error('Erreur lors du chargement des repas:', error);
  }
};

// Changer la source de données
const changeDataSource = async () => {
  try {
    dataSourceService.setDataSource(dataSource.value);
    await loadRepas();
  } catch (error) {
    console.error('Erreur lors du changement de source:', error);
  }
};

// Liste des options pour les filtres
const types = computed(() => [...new Set(repasList.value.map(r => r.type))]);
const saisons = computed(() => [...new Set(repasList.value.map(r => r.saison))]);
const difficultes = computed(() => [...new Set(repasList.value.map(r => r.difficulte))]);

// Filtrer les repas
const filteredRepas = computed(() => {
  return repasList.value.filter(repas => {
    return (!filters.value.type || repas.type === filters.value.type) &&
           (!filters.value.saison || repas.saison === filters.value.saison) &&
           (!filters.value.difficulte || repas.difficulte === filters.value.difficulte);
  });
});

// Afficher les détails d'un repas
const showDetails = (repas) => {
  selectedRepas.value = repas;
};

// Charger les repas au montage du composant
onMounted(loadRepas);
</script>

<style scoped>
.dark {
  color-scheme: dark;
}
</style> 