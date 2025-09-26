<template>
  <div class="lazy-loading-example">
    <h2 class="text-2xl font-bold mb-6">Exemples de Lazy Loading</h2>
    
    <!-- Exemple 1: Lazy Loading d'images -->
    <section class="mb-8">
      <h3 class="text-xl font-semibold mb-4">Images avec Lazy Loading</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <LazyImage
          v-for="(image, index) in images"
          :key="index"
          :src="image.src"
          :alt="image.alt"
          width="100%"
          height="200px"
          image-class="w-full h-48 object-cover rounded-lg"
          :placeholder="'/placeholder-recipe.jpg'"
          :error-text="'Image non disponible'"
          @load="onImageLoad"
          @error="onImageError"
        />
      </div>
    </section>

    <!-- Exemple 2: Lazy Loading de composants -->
    <section class="mb-8">
      <h3 class="text-xl font-semibold mb-4">Composants avec Lazy Loading</h3>
      <div class="space-y-4">
        <LazyComponent
          v-for="(component, index) in components"
          :key="index"
          :component="component.name"
          :component-props="component.props"
          :loading-text="`Chargement de ${component.name}...`"
          :error-text="`Erreur lors du chargement de ${component.name}`"
          :delay="component.delay"
          @load="onComponentLoad"
          @error="onComponentError"
        />
      </div>
    </section>

    <!-- Exemple 3: Liste virtuelle -->
    <section class="mb-8">
      <h3 class="text-xl font-semibold mb-4">Liste Virtuelle ({{ items.length }} éléments)</h3>
      <VirtualList
        :items="items"
        :item-height="60"
        :container-height="300"
        :loading="loadingMore"
        @load-more="loadMoreItems"
      >
        <template #default="{ item, index }">
          <div class="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div class="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
              {{ index + 1 }}
            </div>
            <div class="flex-1">
              <h4 class="font-semibold text-gray-900 dark:text-white">{{ item.title }}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ item.description }}</p>
            </div>
            <div class="text-right">
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ item.category }}</span>
            </div>
          </div>
        </template>
      </VirtualList>
    </section>

    <!-- Exemple 4: Lazy Loading de données -->
    <section class="mb-8">
      <h3 class="text-xl font-semibold mb-4">Données avec Lazy Loading</h3>
      <div ref="dataContainer" class="p-4 border rounded-lg">
        <div v-if="dataLoading" class="text-center py-8">
          <Icon icon="ph:spinner" class="spinning text-2xl mb-2" />
          <p>Chargement des données...</p>
        </div>
        <div v-else-if="dataError" class="text-center py-8 text-red-500">
          <Icon icon="ph:warning" class="text-2xl mb-2" />
          <p>Erreur: {{ dataError.message }}</p>
          <button @click="retryDataLoad" class="mt-2 px-4 py-2 bg-red-500 text-white rounded">
            Réessayer
          </button>
        </div>
        <div v-else-if="data" class="space-y-2">
          <div v-for="(item, index) in data" :key="index" class="p-2 bg-gray-100 dark:bg-gray-700 rounded">
            {{ item }}
          </div>
        </div>
      </div>
    </section>

    <!-- Statistiques -->
    <section class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
      <h3 class="text-lg font-semibold mb-2">Statistiques de Performance</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span class="font-medium">Images chargées:</span>
          <span class="ml-1">{{ loadedImages }}/{{ images.length }}</span>
        </div>
        <div>
          <span class="font-medium">Composants chargés:</span>
          <span class="ml-1">{{ loadedComponents }}/{{ components.length }}</span>
        </div>
        <div>
          <span class="font-medium">Éléments de liste:</span>
          <span class="ml-1">{{ items.length }}</span>
        </div>
        <div>
          <span class="font-medium">Données chargées:</span>
          <span class="ml-1">{{ data ? 'Oui' : 'Non' }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useLazyData } from '../composables/useLazyLoading'

// Données d'exemple
const images = ref([
  { src: 'https://picsum.photos/400/300?random=1', alt: 'Image 1' },
  { src: 'https://picsum.photos/400/300?random=2', alt: 'Image 2' },
  { src: 'https://picsum.photos/400/300?random=3', alt: 'Image 3' },
  { src: 'https://picsum.photos/400/300?random=4', alt: 'Image 4' },
  { src: 'https://picsum.photos/400/300?random=5', alt: 'Image 5' },
  { src: 'https://picsum.photos/400/300?random=6', alt: 'Image 6' }
])

const components = ref([
  { name: 'AdvancedSearch', props: {}, delay: 500 },
  { name: 'ThemeSwitcher', props: {}, delay: 1000 },
  { name: 'NetworkStatus', props: { position: 'top-0 right-0' }, delay: 1500 }
])

const items = ref([])
const loadingMore = ref(false)

// Statistiques
const loadedImages = ref(0)
const loadedComponents = ref(0)

// Lazy loading de données
const dataContainer = ref(null)
const { data, isLoading: dataLoading, error: dataError, loadData, retry: retryDataLoad } = useLazyData(
  async () => {
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 2000))
    return [
      'Donnée 1 chargée avec succès',
      'Donnée 2 chargée avec succès',
      'Donnée 3 chargée avec succès',
      'Donnée 4 chargée avec succès'
    ]
  },
  { immediate: false }
)

// Méthodes
const onImageLoad = () => {
  loadedImages.value++
}

const onImageError = () => {
  console.error('Erreur de chargement d\'image')
}

const onComponentLoad = () => {
  loadedComponents.value++
}

const onComponentError = () => {
  console.error('Erreur de chargement de composant')
}

const loadMoreItems = () => {
  loadingMore.value = true
  
  setTimeout(() => {
    const newItems = Array.from({ length: 20 }, (_, i) => ({
      id: items.value.length + i + 1,
      title: `Élément ${items.value.length + i + 1}`,
      description: `Description de l'élément ${items.value.length + i + 1}`,
      category: `Catégorie ${Math.floor(Math.random() * 5) + 1}`
    }))
    
    items.value.push(...newItems)
    loadingMore.value = false
  }, 1000)
}

// Initialisation
onMounted(() => {
  // Charger les premiers éléments
  loadMoreItems()
})
</script>

<style scoped>
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
</style>
