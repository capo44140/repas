<template>
  <div class="virtual-recipe-list">
    <!-- Barre de recherche et filtres -->
    <div class="mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Recherche -->
        <div class="flex-1">
          <div class="relative">
            <Icon 
              icon="ph:magnifying-glass" 
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher une recette..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              @input="onSearch"
            />
          </div>
        </div>

        <!-- Filtres rapides -->
        <div class="flex gap-2">
          <select 
            v-model="selectedSeason"
            @change="onFilterChange"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Toutes les saisons</option>
            <option value="hiver">Hiver</option>
            <option value="printemps">Printemps</option>
            <option value="ete">Été</option>
            <option value="automne">Automne</option>
          </select>

          <select 
            v-model="selectedType"
            @change="onFilterChange"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tous les types</option>
            <option value="midi">Midi</option>
            <option value="soir">Soir</option>
            <option value="dimanche_midi">Dimanche midi</option>
          </select>
        </div>
      </div>

      <!-- Statistiques de recherche -->
      <div class="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>
          {{ filteredRecipes.length }} recette{{ filteredRecipes.length > 1 ? 's' : '' }} trouvée{{ filteredRecipes.length > 1 ? 's' : '' }}
          <span v-if="searchQuery || selectedSeason || selectedType">
            (sur {{ totalRecipes }} au total)
          </span>
        </span>
        <div class="flex items-center gap-4">
          <button
            @click="toggleViewMode"
            class="flex items-center gap-2 px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Icon :icon="viewMode === 'grid' ? 'ph:list' : 'ph:grid-four'" class="w-4 h-4" />
            {{ viewMode === 'grid' ? 'Liste' : 'Grille' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Liste virtuelle -->
    <div 
      ref="containerRef"
      class="virtual-container"
      :class="{
        'grid-view': viewMode === 'grid',
        'list-view': viewMode === 'list'
      }"
      :style="{ height: containerHeight + 'px' }"
      @scroll="handleScroll"
    >
      <!-- Spacer pour la hauteur totale -->
      <div :style="{ height: totalHeight + 'px' }" class="virtual-spacer">
        <!-- Contenu visible -->
        <div 
          :style="{ 
            transform: `translateY(${offsetY}px)`,
            height: visibleHeight + 'px'
          }"
          class="virtual-content"
        >
          <div
            v-for="(recipe, index) in visibleRecipes"
            :key="getRecipeKey(recipe, startIndex + index)"
            :style="{ height: itemHeight + 'px' }"
            class="virtual-item"
          >
            <RecipeCard
              :recipe="recipe"
              :index="startIndex + index"
              :view-mode="viewMode"
              :is-visible="true"
              @click="onRecipeClick"
              @favorite="onRecipeFavorite"
              @share="onRecipeShare"
            />
          </div>
        </div>
      </div>

      <!-- Indicateur de chargement -->
      <div v-if="loading" class="loading-overlay">
        <div class="loading-content">
          <Icon icon="ph:spinner" class="spinning text-2xl mb-2" />
          <span>Chargement des recettes...</span>
        </div>
      </div>

      <!-- Message si aucune recette -->
      <div v-if="!loading && filteredRecipes.length === 0" class="empty-state">
        <Icon icon="ph:fork-knife" class="text-6xl text-gray-400 mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Aucune recette trouvée
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ searchQuery || selectedSeason || selectedType 
            ? 'Essayez de modifier vos critères de recherche.' 
            : 'Commencez par ajouter des recettes à votre collection.' 
          }}
        </p>
        <button
          v-if="!searchQuery && !selectedSeason && !selectedType"
          @click="$emit('add-recipe')"
          class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Ajouter une recette
        </button>
      </div>
    </div>

    <!-- Pagination ou bouton "Charger plus" -->
    <div v-if="hasMore && !loading" class="mt-6 text-center">
      <button
        @click="loadMore"
        class="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        Charger plus de recettes
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import RecipeCard from './RecipeCard.vue'

const props = defineProps({
  recipes: {
    type: Array,
    required: true
  },
  containerHeight: {
    type: Number,
    default: 600
  },
  itemHeight: {
    type: Number,
    default: 200
  },
  gridItemHeight: {
    type: Number,
    default: 280
  },
  overscan: {
    type: Number,
    default: 5
  },
  loading: {
    type: Boolean,
    default: false
  },
  hasMore: {
    type: Boolean,
    default: false
  },
  searchable: {
    type: Boolean,
    default: true
  },
  filterable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits([
  'recipe-click',
  'recipe-favorite', 
  'recipe-share',
  'search',
  'filter-change',
  'load-more',
  'add-recipe'
])

// État réactif
const containerRef = ref(null)
const scrollTop = ref(0)
const searchQuery = ref('')
const selectedSeason = ref('')
const selectedType = ref('')
const viewMode = ref('grid') // 'grid' ou 'list'
const allRecipes = ref([...props.recipes])

// Calculs
const totalRecipes = computed(() => allRecipes.value.length)

const filteredRecipes = computed(() => {
  let filtered = [...allRecipes.value]

  // Filtre par recherche textuelle
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(recipe => 
      recipe.nom.toLowerCase().includes(query) ||
      recipe.ingredients?.some(ingredient => 
        ingredient.toLowerCase().includes(query)
      ) ||
      recipe.notes?.toLowerCase().includes(query)
    )
  }

  // Filtre par saison
  if (selectedSeason.value) {
    filtered = filtered.filter(recipe => recipe.saison === selectedSeason.value)
  }

  // Filtre par type
  if (selectedType.value) {
    filtered = filtered.filter(recipe => recipe.type === selectedType.value)
  }

  return filtered
})

const totalHeight = computed(() => {
  const itemHeight = viewMode.value === 'grid' ? props.gridItemHeight : props.itemHeight
  return filteredRecipes.value.length * itemHeight
})

const visibleCount = computed(() => {
  const itemHeight = viewMode.value === 'grid' ? props.gridItemHeight : props.itemHeight
  return Math.ceil(props.containerHeight / itemHeight)
})

const startIndex = computed(() => {
  const itemHeight = viewMode.value === 'grid' ? props.gridItemHeight : props.itemHeight
  return Math.max(0, Math.floor(scrollTop.value / itemHeight) - props.overscan)
})

const endIndex = computed(() => {
  return Math.min(
    filteredRecipes.value.length - 1,
    startIndex.value + visibleCount.value + props.overscan * 2
  )
})

const visibleRecipes = computed(() => 
  filteredRecipes.value.slice(startIndex.value, endIndex.value + 1)
)

const offsetY = computed(() => {
  const itemHeight = viewMode.value === 'grid' ? props.gridItemHeight : props.itemHeight
  return startIndex.value * itemHeight
})

const visibleHeight = computed(() => {
  const itemHeight = viewMode.value === 'grid' ? props.gridItemHeight : props.itemHeight
  return (endIndex.value - startIndex.value + 1) * itemHeight
})

const currentItemHeight = computed(() => 
  viewMode.value === 'grid' ? props.gridItemHeight : props.itemHeight
)

// Méthodes
const getRecipeKey = (recipe, index) => {
  return recipe.id || `recipe-${index}`
}

const handleScroll = (event) => {
  scrollTop.value = event.target.scrollTop
  emit('scroll', {
    scrollTop: scrollTop.value,
    scrollLeft: event.target.scrollLeft
  })

  // Charger plus d'éléments si on approche de la fin
  const scrollPercentage = (scrollTop.value + props.containerHeight) / totalHeight.value
  if (scrollPercentage > 0.8 && props.hasMore) {
    emit('load-more')
  }
}

const onSearch = () => {
  emit('search', {
    query: searchQuery.value,
    season: selectedSeason.value,
    type: selectedType.value
  })
}

const onFilterChange = () => {
  emit('filter-change', {
    season: selectedSeason.value,
    type: selectedType.value
  })
}

const onRecipeClick = (recipe) => {
  emit('recipe-click', recipe)
}

const onRecipeFavorite = (recipe) => {
  emit('recipe-favorite', recipe)
}

const onRecipeShare = (recipe) => {
  emit('recipe-share', recipe)
}

const loadMore = () => {
  emit('load-more')
}

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
  // Recalculer la position après le changement de mode
  nextTick(() => {
    if (containerRef.value) {
      const itemHeight = currentItemHeight.value
      const newScrollTop = Math.floor(scrollTop.value / itemHeight) * itemHeight
      containerRef.value.scrollTop = newScrollTop
    }
  })
}

const scrollToRecipe = (recipeId) => {
  const index = filteredRecipes.value.findIndex(recipe => recipe.id === recipeId)
  if (index !== -1 && containerRef.value) {
    const itemHeight = currentItemHeight.value
    const targetScrollTop = index * itemHeight
    containerRef.value.scrollTop = targetScrollTop
  }
}

const scrollToTop = () => {
  if (containerRef.value) {
    containerRef.value.scrollTop = 0
  }
}

// Watchers
watch(() => props.recipes, (newRecipes) => {
  allRecipes.value = [...newRecipes]
}, { deep: true })

// Exposer les méthodes
defineExpose({
  scrollToRecipe,
  scrollToTop,
  toggleViewMode
})
</script>

<style scoped>
.virtual-recipe-list {
  width: 100%;
}

.virtual-container {
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background-color: white;
}

.dark .virtual-container {
  background-color: #1f2937;
  border-color: #374151;
}

.virtual-container.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.virtual-container.list-view {
  display: block;
}

.virtual-spacer {
  position: relative;
}

.virtual-content {
  position: relative;
}

.virtual-item {
  display: flex;
  align-items: stretch;
}

.grid-view .virtual-item {
  width: 100%;
}

.list-view .virtual-item {
  width: 100%;
  margin-bottom: 1rem;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 10;
}

.dark .loading-overlay {
  background-color: rgba(31, 41, 55, 0.9);
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.dark .loading-content {
  background-color: #374151;
  color: #f9fafb;
}

.empty-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  padding: 2rem;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Scrollbar personnalisée */
.virtual-container::-webkit-scrollbar {
  width: 8px;
}

.virtual-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.virtual-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.virtual-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark .virtual-container::-webkit-scrollbar-track {
  background: #374151;
}

.dark .virtual-container::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark .virtual-container::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Responsive */
@media (max-width: 768px) {
  .virtual-container.grid-view {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 0.5rem;
  }
  
  .virtual-item {
    margin-bottom: 0.5rem;
  }
}
</style>
