<template>
  <div 
    class="recipe-card"
    :class="{
      'grid-card': viewMode === 'grid',
      'list-card': viewMode === 'list',
      'favorite': recipe.isFavorite
    }"
    @click="handleClick"
  >
    <!-- Image de la recette -->
    <div class="recipe-image-container">
      <LazyImage
        :src="recipe.image_url || placeholderImage"
        :alt="recipe.nom"
        :width="'100%'"
        :height="viewMode === 'grid' ? '160px' : '120px'"
        image-class="recipe-image"
        :placeholder="placeholderImage"
        :error-text="'Image non disponible'"
      />
      
      <!-- Badges -->
      <div class="recipe-badges">
        <span 
          class="badge badge-season"
          :class="getSeasonClass(recipe.saison)"
        >
          {{ getSeasonLabel(recipe.saison) }}
        </span>
        <span 
          class="badge badge-type"
          :class="getTypeClass(recipe.type)"
        >
          {{ getTypeLabel(recipe.type) }}
        </span>
      </div>

      <!-- Actions rapides -->
      <div class="recipe-actions">
        <button
          @click.stop="toggleFavorite"
          class="action-btn favorite-btn"
          :class="{ 'active': recipe.isFavorite }"
          :title="recipe.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
        >
          <Icon :icon="recipe.isFavorite ? 'ph:heart-fill' : 'ph:heart'" class="w-4 h-4" />
        </button>
        <button
          @click.stop="handleShare"
          class="action-btn share-btn"
          title="Partager"
        >
          <Icon icon="ph:share" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Contenu de la recette -->
    <div class="recipe-content">
      <!-- En-tête -->
      <div class="recipe-header">
        <h3 class="recipe-title">{{ recipe.nom }}</h3>
        <div class="recipe-meta">
          <div class="meta-item" v-if="recipe.temps_preparation">
            <Icon icon="ph:clock" class="w-4 h-4" />
            <span>{{ recipe.temps_preparation }}min</span>
          </div>
          <div class="meta-item" v-if="recipe.difficulte">
            <Icon icon="ph:star" class="w-4 h-4" />
            <span>{{ recipe.difficulte }}</span>
          </div>
          <div class="meta-item" v-if="recipe.calories">
            <Icon icon="ph:fire" class="w-4 h-4" />
            <span>{{ recipe.calories }} cal</span>
          </div>
        </div>
      </div>

      <!-- Description -->
      <p class="recipe-description" v-if="recipe.notes">
        {{ truncateText(recipe.notes, viewMode === 'grid' ? 80 : 120) }}
      </p>

      <!-- Ingrédients principaux -->
      <div class="recipe-ingredients" v-if="recipe.ingredients && recipe.ingredients.length > 0">
        <div class="ingredients-label">
          <Icon icon="ph:list-bullets" class="w-4 h-4" />
          <span>Ingrédients principaux</span>
        </div>
        <div class="ingredients-list">
          <span 
            v-for="(ingredient, index) in mainIngredients" 
            :key="index"
            class="ingredient-tag"
          >
            {{ ingredient }}
          </span>
          <span v-if="remainingIngredients > 0" class="ingredient-more">
            +{{ remainingIngredients }} autres
          </span>
        </div>
      </div>

      <!-- Footer -->
      <div class="recipe-footer">
        <div class="recipe-stats">
          <div class="stat-item" v-if="recipe.cout">
            <Icon icon="ph:currency-eur" class="w-4 h-4" />
            <span>{{ recipe.cout }}</span>
          </div>
          <div class="stat-item" v-if="recipe.temps_total">
            <Icon icon="ph:timer" class="w-4 h-4" />
            <span>{{ recipe.temps_total }}min total</span>
          </div>
        </div>
        
        <div class="recipe-actions-footer">
          <button
            @click.stop="handleViewDetails"
            class="btn-primary"
          >
            Voir la recette
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  recipe: {
    type: Object,
    required: true
  },
  viewMode: {
    type: String,
    default: 'grid', // 'grid' ou 'list'
    validator: (value) => ['grid', 'list'].includes(value)
  },
  isVisible: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['click', 'favorite', 'share', 'view-details'])

// Données
const placeholderImage = '/placeholder-recipe.jpg'

// Computed
const mainIngredients = computed(() => {
  if (!props.recipe.ingredients) return []
  return props.recipe.ingredients.slice(0, 3)
})

const remainingIngredients = computed(() => {
  if (!props.recipe.ingredients) return 0
  return Math.max(0, props.recipe.ingredients.length - 3)
})

// Méthodes
const handleClick = () => {
  emit('click', props.recipe)
}

const toggleFavorite = () => {
  emit('favorite', { ...props.recipe, isFavorite: !props.recipe.isFavorite })
}

const handleShare = () => {
  emit('share', props.recipe)
}

const handleViewDetails = () => {
  emit('view-details', props.recipe)
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const getSeasonClass = (saison) => {
  const classes = {
    'hiver': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'printemps': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'ete': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'automne': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
  }
  return classes[saison] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

const getSeasonLabel = (saison) => {
  const labels = {
    'hiver': 'Hiver',
    'printemps': 'Printemps',
    'ete': 'Été',
    'automne': 'Automne'
  }
  return labels[saison] || saison
}

const getTypeClass = (type) => {
  const classes = {
    'midi': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'soir': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    'dimanche_midi': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
  }
  return classes[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

const getTypeLabel = (type) => {
  const labels = {
    'midi': 'Midi',
    'soir': 'Soir',
    'dimanche_midi': 'Dimanche'
  }
  return labels[type] || type
}
</script>

<style scoped>
.recipe-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.dark .recipe-card {
  background: #374151;
  border-color: #4b5563;
}

.recipe-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
}

.recipe-card.favorite {
  border-color: #ef4444;
  box-shadow: 0 0 0 1px #ef4444;
}

/* Modes d'affichage */
.grid-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.list-card {
  display: flex;
  flex-direction: row;
  height: 100%;
  min-height: 120px;
}

.list-card .recipe-image-container {
  flex-shrink: 0;
  width: 200px;
}

.list-card .recipe-content {
  flex: 1;
  padding: 1rem;
}

/* Image */
.recipe-image-container {
  position: relative;
  overflow: hidden;
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.recipe-card:hover .recipe-image {
  transform: scale(1.05);
}

/* Badges */
.recipe-badges {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

/* Actions */
.recipe-actions {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.recipe-card:hover .recipe-actions {
  opacity: 1;
}

.action-btn {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
}

.dark .action-btn {
  background: rgba(55, 65, 81, 0.9);
  color: #d1d5db;
}

.action-btn:hover {
  background: white;
  color: #374151;
  transform: scale(1.1);
}

.dark .action-btn:hover {
  background: #1f2937;
  color: #f9fafb;
}

.action-btn.active {
  background: #ef4444;
  color: white;
}

/* Contenu */
.recipe-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.recipe-header {
  margin-bottom: 0.75rem;
}

.recipe-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.dark .recipe-title {
  color: #f9fafb;
}

.recipe-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.dark .meta-item {
  color: #9ca3af;
}

.recipe-description {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 0.75rem;
  flex: 1;
}

.dark .recipe-description {
  color: #9ca3af;
}

/* Ingrédients */
.recipe-ingredients {
  margin-bottom: 0.75rem;
}

.ingredients-label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dark .ingredients-label {
  color: #9ca3af;
}

.ingredients-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.ingredient-tag {
  padding: 0.125rem 0.375rem;
  background: #f3f4f6;
  color: #374151;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.dark .ingredient-tag {
  background: #4b5563;
  color: #d1d5db;
}

.ingredient-more {
  padding: 0.125rem 0.375rem;
  background: #e5e7eb;
  color: #6b7280;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-style: italic;
}

.dark .ingredient-more {
  background: #6b7280;
  color: #d1d5db;
}

/* Footer */
.recipe-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
}

.dark .recipe-footer {
  border-top-color: #4b5563;
}

.recipe-stats {
  display: flex;
  gap: 0.75rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.dark .stat-item {
  color: #9ca3af;
}

.btn-primary {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background: #2563eb;
}

/* Responsive */
@media (max-width: 768px) {
  .list-card {
    flex-direction: column;
  }
  
  .list-card .recipe-image-container {
    width: 100%;
    height: 160px;
  }
  
  .recipe-actions {
    opacity: 1;
  }
}
</style>
