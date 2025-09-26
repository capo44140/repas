<template>
  <div class="virtual-scrolling-demo">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Démonstration du Virtual Scrolling
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        Cette démonstration montre les performances du virtual scrolling avec {{ totalItems }} éléments.
        Seuls les éléments visibles sont rendus, ce qui améliore considérablement les performances.
      </p>

      <!-- Contrôles -->
      <div class="flex flex-wrap gap-4 mb-6">
        <button
          @click="generateItems"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Générer {{ itemCount }} éléments
        </button>
        <button
          @click="clearItems"
          class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Vider la liste
        </button>
        <button
          @click="scrollToTop"
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Aller en haut
        </button>
        <button
          @click="scrollToMiddle"
          class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          Aller au milieu
        </button>
      </div>

      <!-- Statistiques -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div class="text-2xl font-bold text-blue-600">{{ totalItems }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Total éléments</div>
        </div>
        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div class="text-2xl font-bold text-green-600">{{ visibleItems }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Éléments visibles</div>
        </div>
        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div class="text-2xl font-bold text-purple-600">{{ Math.round(performanceGain) }}%</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Gain de performance</div>
        </div>
        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div class="text-2xl font-bold text-orange-600">{{ scrollPosition }}px</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Position scroll</div>
        </div>
      </div>
    </div>

    <!-- Liste virtuelle -->
    <VirtualList
      ref="virtualListRef"
      :items="items"
      :item-height="80"
      :container-height="500"
      :loading="loading"
      @scroll="handleScroll"
      @load-more="loadMoreItems"
    >
      <template #default="{ item, index }">
        <div class="virtual-demo-item">
          <div class="item-number">{{ index + 1 }}</div>
          <div class="item-content">
            <h3 class="item-title">{{ item.title }}</h3>
            <p class="item-description">{{ item.description }}</p>
            <div class="item-meta">
              <span class="meta-badge">{{ item.category }}</span>
              <span class="meta-badge">{{ item.type }}</span>
              <span class="meta-badge">{{ item.difficulty }}</span>
            </div>
          </div>
          <div class="item-actions">
            <button 
              @click="toggleFavorite(item)"
              class="action-btn"
              :class="{ 'favorite': item.isFavorite }"
            >
              <Icon :icon="item.isFavorite ? 'ph:heart-fill' : 'ph:heart'" class="w-4 h-4" />
            </button>
            <button @click="viewItem(item)" class="action-btn">
              <Icon icon="ph:eye" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </template>
    </VirtualList>

    <!-- Comparaison de performance -->
    <div class="mt-8 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
      <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Comparaison de Performance
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-2">Avec Virtual Scrolling</h4>
          <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• {{ visibleItems }} éléments rendus</li>
            <li>• {{ Math.round(performanceGain) }}% de gain de performance</li>
            <li>• Temps de rendu: ~{{ Math.round(renderTime) }}ms</li>
            <li>• Mémoire utilisée: ~{{ Math.round(memoryUsage) }}MB</li>
          </ul>
        </div>
        <div>
          <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-2">Sans Virtual Scrolling</h4>
          <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• {{ totalItems }} éléments rendus</li>
            <li>• 0% de gain de performance</li>
            <li>• Temps de rendu: ~{{ Math.round(renderTime * (totalItems / visibleItems)) }}ms</li>
            <li>• Mémoire utilisée: ~{{ Math.round(memoryUsage * (totalItems / visibleItems)) }}MB</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import VirtualList from './VirtualList.vue'

// État réactif
const virtualListRef = ref(null)
const items = ref([])
const loading = ref(false)
const itemCount = ref(1000)
const scrollPosition = ref(0)
const renderTime = ref(0)
const memoryUsage = ref(0)

// Données calculées
const totalItems = computed(() => items.value.length)
const visibleItems = computed(() => Math.min(20, totalItems.value)) // Estimation
const performanceGain = computed(() => {
  if (totalItems.value === 0) return 0
  return ((totalItems.value - visibleItems.value) / totalItems.value) * 100
})

// Méthodes
const generateItems = () => {
  const startTime = performance.now()
  loading.value = true

  const newItems = Array.from({ length: itemCount.value }, (_, index) => ({
    id: `item-${index}`,
    title: `Élément ${index + 1}`,
    description: `Description de l'élément ${index + 1}. Ceci est un exemple de contenu pour démontrer le virtual scrolling.`,
    category: ['Recette', 'Ingrédient', 'Menu', 'Saison'][index % 4],
    type: ['Midi', 'Soir', 'Dimanche'][index % 3],
    difficulty: ['Facile', 'Moyen', 'Difficile'][index % 3],
    isFavorite: Math.random() > 0.8,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
  }))

  items.value = newItems

  // Simuler le temps de chargement
  setTimeout(() => {
    const endTime = performance.now()
    renderTime.value = endTime - startTime
    memoryUsage.value = (JSON.stringify(items.value).length / 1024 / 1024) * 0.1 // Estimation
    loading.value = false
  }, 100)
}

const clearItems = () => {
  items.value = []
  scrollPosition.value = 0
}

const scrollToTop = () => {
  if (virtualListRef.value) {
    virtualListRef.value.scrollToTop()
  }
}

const scrollToMiddle = () => {
  if (virtualListRef.value) {
    const middleIndex = Math.floor(totalItems.value / 2)
    virtualListRef.value.scrollToIndex(middleIndex)
  }
}

const handleScroll = (scrollData) => {
  scrollPosition.value = scrollData.scrollTop
}

const loadMoreItems = () => {
  if (loading.value) return
  
  loading.value = true
  setTimeout(() => {
    const currentLength = items.value.length
    const newItems = Array.from({ length: 100 }, (_, index) => ({
      id: `item-${currentLength + index}`,
      title: `Élément ${currentLength + index + 1}`,
      description: `Description de l'élément ${currentLength + index + 1}. Nouvel élément chargé dynamiquement.`,
      category: ['Recette', 'Ingrédient', 'Menu', 'Saison'][(currentLength + index) % 4],
      type: ['Midi', 'Soir', 'Dimanche'][(currentLength + index) % 3],
      difficulty: ['Facile', 'Moyen', 'Difficile'][(currentLength + index) % 3],
      isFavorite: Math.random() > 0.8,
      createdAt: new Date()
    }))
    
    items.value.push(...newItems)
    loading.value = false
  }, 500)
}

const toggleFavorite = (item) => {
  item.isFavorite = !item.isFavorite
}

const viewItem = (item) => {
  console.log('Voir l\'élément:', item)
}

// Initialisation
onMounted(() => {
  generateItems()
})
</script>

<style scoped>
.virtual-scrolling-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.virtual-demo-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;
}

.dark .virtual-demo-item {
  background: #374151;
  border-color: #4b5563;
}

.virtual-demo-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-number {
  width: 3rem;
  height: 3rem;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 1rem;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
  margin-right: 1rem;
}

.item-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
}

.dark .item-title {
  color: #f9fafb;
}

.item-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.dark .item-description {
  color: #9ca3af;
}

.item-meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.meta-badge {
  padding: 0.25rem 0.5rem;
  background: #f3f4f6;
  color: #374151;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.dark .meta-badge {
  background: #4b5563;
  color: #d1d5db;
}

.item-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.action-btn {
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 50%;
  background: #f3f4f6;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dark .action-btn {
  background: #4b5563;
  color: #9ca3af;
}

.action-btn:hover {
  background: #e5e7eb;
  color: #374151;
  transform: scale(1.1);
}

.dark .action-btn:hover {
  background: #6b7280;
  color: #f9fafb;
}

.action-btn.favorite {
  background: #ef4444;
  color: white;
}

.action-btn.favorite:hover {
  background: #dc2626;
}
</style>
