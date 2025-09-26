<template>
  <div 
    ref="containerRef" 
    class="lazy-component-container"
    :class="{ 'loading': isLoading, 'error': hasError }"
  >
    <!-- Placeholder de chargement -->
    <div v-if="isLoading" class="lazy-component-placeholder">
      <div class="skeleton-loader">
        <div class="skeleton-content">
          <Icon icon="ph:spinner" class="skeleton-icon spinning" />
          <span class="skeleton-text">{{ loadingText }}</span>
        </div>
      </div>
    </div>

    <!-- Composant chargé -->
    <div v-else-if="!hasError && isVisible && loadedComponent" class="lazy-component-content">
      <component :is="loadedComponent" v-bind="componentProps" v-on="componentEvents" />
    </div>

    <!-- Placeholder d'erreur -->
    <div v-else-if="hasError" class="lazy-component-error">
      <div class="error-content">
        <Icon icon="ph:warning" class="error-icon" />
        <span class="error-text">{{ errorText }}</span>
        <button v-if="retryable" @click="retryLoad" class="retry-button">
          Réessayer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, defineAsyncComponent } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  component: {
    type: [String, Object, Function],
    required: true
  },
  componentProps: {
    type: Object,
    default: () => ({})
  },
  componentEvents: {
    type: Object,
    default: () => ({})
  },
  loadingText: {
    type: String,
    default: 'Chargement...'
  },
  errorText: {
    type: String,
    default: 'Erreur de chargement du composant'
  },
  retryable: {
    type: Boolean,
    default: true
  },
  threshold: {
    type: Number,
    default: 0.1
  },
  rootMargin: {
    type: String,
    default: '50px'
  },
  delay: {
    type: Number,
    default: 0
  },
  timeout: {
    type: Number,
    default: 10000
  }
})

const emit = defineEmits(['load', 'error', 'retry'])

// État réactif
const containerRef = ref(null)
const isLoading = ref(true)
const hasError = ref(false)
const isVisible = ref(false)
const observer = ref(null)
const loadTimeout = ref(null)

// Composant asynchrone
const loadedComponent = computed(() => {
  if (typeof props.component === 'string') {
    try {
      return defineAsyncComponent({
        loader: () => import(`../components/${props.component}.vue`),
        loadingComponent: {
          template: '<div class="loading-spinner"><Icon icon="ph:spinner" class="spinning" /></div>'
        },
        errorComponent: {
          template: '<div class="error-message">Erreur de chargement</div>'
        },
        delay: props.delay,
        timeout: props.timeout
      })
    } catch (error) {
      console.error('Erreur lors du chargement du composant:', error)
      return null
    }
  }
  return props.component
})

// Méthodes
const onComponentLoad = () => {
  isLoading.value = false
  hasError.value = false
  emit('load')
}

const onComponentError = () => {
  isLoading.value = false
  hasError.value = true
  emit('error')
}

const retryLoad = () => {
  hasError.value = false
  isLoading.value = true
  emit('retry')
  loadComponent()
}

const loadComponent = () => {
  if (props.delay > 0) {
    loadTimeout.value = setTimeout(() => {
      isVisible.value = true
      onComponentLoad()
    }, props.delay)
  } else {
    isVisible.value = true
    onComponentLoad()
  }
}

const setupIntersectionObserver = () => {
  if (!containerRef.value) return

  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadComponent()
          observer.value?.disconnect()
        }
      })
    },
    {
      threshold: props.threshold,
      rootMargin: props.rootMargin
    }
  )

  observer.value.observe(containerRef.value)
}

const cleanup = () => {
  if (observer.value) {
    observer.value.disconnect()
    observer.value = null
  }
  if (loadTimeout.value) {
    clearTimeout(loadTimeout.value)
    loadTimeout.value = null
  }
}

// Watchers
watch(() => props.component, () => {
  if (props.component) {
    isLoading.value = true
    hasError.value = false
    isVisible.value = false
  }
})

// Lifecycle
onMounted(() => {
  setupIntersectionObserver()
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
.lazy-component-container {
  position: relative;
  min-height: 100px;
}

.lazy-component-placeholder,
.lazy-component-error {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
  padding: 2rem;
}

.skeleton-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
  padding: 2rem;
  min-width: 200px;
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.skeleton-icon {
  font-size: 2rem;
  color: #9ca3af;
}

.skeleton-icon.spinning {
  animation: spin 1s linear infinite;
}

.skeleton-text {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 2rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  min-width: 200px;
}

.error-icon {
  font-size: 2rem;
  color: #ef4444;
}

.error-text {
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
}

.retry-button {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #2563eb;
}

.lazy-component-content {
  animation: fadeIn 0.3s ease-in-out;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mode sombre */
.dark .skeleton-loader {
  background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
  background-size: 200% 100%;
}

.dark .skeleton-icon {
  color: #6b7280;
}

.dark .skeleton-text {
  color: #9ca3af;
}

.dark .error-content {
  background-color: #1f2937;
  border-color: #374151;
}

.dark .error-text {
  color: #9ca3af;
}

.dark .retry-button {
  background-color: #1d4ed8;
}

.dark .retry-button:hover {
  background-color: #1e40af;
}
</style>
