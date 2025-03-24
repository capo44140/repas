<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Partager vos recettes</h1>
    
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Sélectionnez une recette à partager</h2>
      
      <!-- Recherche de recettes -->
      <div class="mb-6">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Rechercher une recette..." 
          class="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>
      
      <!-- Liste des recettes -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="recipe in filteredRecipes" 
          :key="recipe.id"
          class="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
        >
          <div class="h-40 overflow-hidden">
            <img 
              v-if="recipe.image_url" 
              :src="recipe.image_url" 
              :alt="recipe.nom" 
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-600">
              <Icon icon="ph:image" class="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
          
          <div class="p-4">
            <h3 class="font-semibold text-gray-800 dark:text-gray-200 mb-2">{{ recipe.nom }}</h3>
            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
              <Icon icon="ph:clock" class="w-4 h-4 mr-1" />
              <span>{{ recipe.temps_total || 0 }} min</span>
              <span class="mx-2">•</span>
              <span>{{ recipe.difficulte }}</span>
            </div>
            
            <div class="flex justify-between items-center">
              <button 
                @click="selectRecipe(recipe)"
                class="px-3 py-1 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors"
              >
                Sélectionner
              </button>
              
              <ShareButtons 
                v-if="selectedRecipe && selectedRecipe.id === recipe.id"
                :content="{ 
                  type: 'recipe', 
                  nom: recipe.nom,
                  id: recipe.id 
                }" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Section de partage de menu -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Partager un menu hebdomadaire</h2>
      
      <div class="mb-6">
        <button 
          @click="shareCurrentMenu"
          class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors"
        >
          Partager mon menu actuel
        </button>
      </div>
      
      <div v-if="showMenuShare" class="mt-4">
        <ShareButtons 
          :content="{ 
            type: 'menu', 
            startDate: new Date(),
            items: currentMenu 
          }" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import ShareButtons from '../components/ShareButtons.vue';
import { neonService } from '../services/neon';

const recipes = ref([]);
const searchQuery = ref('');
const selectedRecipe = ref(null);
const currentMenu = ref([]);
const showMenuShare = ref(false);

// Filtrer les recettes en fonction de la recherche
const filteredRecipes = computed(() => {
  if (!searchQuery.value) return recipes.value;
  
  const query = searchQuery.value.toLowerCase();
  return recipes.value.filter(recipe => 
    recipe.nom.toLowerCase().includes(query) || 
    (recipe.ingredients && typeof recipe.ingredients === 'string' && recipe.ingredients.toLowerCase().includes(query))
  );
});

// Charger les recettes depuis la base de données
const loadRecipes = async () => {
  try {
    const data = await neonService.getAllRepas();
    recipes.value = data;
  } catch (error) {
    console.error('Erreur lors du chargement des recettes:', error);
  }
};

// Sélectionner une recette pour le partage
const selectRecipe = (recipe) => {
  selectedRecipe.value = recipe;
};

// Partager le menu actuel
const shareCurrentMenu = () => {
  // Ici, vous pourriez charger le menu actuel depuis votre service
  // Pour l'exemple, nous utilisons un menu fictif
  currentMenu.value = [
    { day: 'Lundi', moment_journee: 'midi', nom: 'Salade César' },
    { day: 'Lundi', moment_journee: 'soir', nom: 'Poulet rôti' },
    { day: 'Mardi', moment_journee: 'midi', nom: 'Quiche Lorraine' },
    { day: 'Mardi', moment_journee: 'soir', nom: 'Saumon grillé' },
    // ... autres repas de la semaine
  ];
  
  showMenuShare.value = true;
};

onMounted(() => {
  loadRecipes();
});
</script>