<template>
  <div 
    ref="containerRef" 
    class="lazy-image-container"
    :class="{ 'loading': isLoading, 'error': hasError }"
  >
    <!-- Placeholder de chargement -->
    <div v-if="isLoading" class="lazy-image-placeholder">
      <div class="skeleton-loader" :style="{ width: width, height: height }">
        <div class="skeleton-content">
          <Icon icon="ph:image" class="skeleton-icon" />
          <span class="skeleton-text">Chargement...</span>
        </div>
      </div>
    </div>

    <!-- Image chargée -->
    <img
      v-else-if="!hasError && imageSrc"
      :src="imageSrc"
      :alt="alt"
      :width="width"
      :height="height"
      :class="imageClass"
      @load="onImageLoad"
      @error="onImageError"
      loading="lazy"
    />

    <!-- Placeholder d'erreur -->
    <div v-else-if="hasError" class="lazy-image-error">
      <div class="error-content" :style="{ width: width, height: height }">
        <Icon icon="ph:warning" class="error-icon" />
        <span class="error-text">{{ errorText }}</span>
        <button v-if="retryable" @click="retryLoad" class="retry-button">
          Réessayer
        </button>
      </div>
    </div>

    <!-- Placeholder par défaut si pas d'image -->
    <div v-else class="lazy-image-default" :style="{ width: width, height: height }">
      <Icon icon="ph:image" class="default-icon" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: '100%'
  },
  height: {
    type: [String, Number],
    default: '200px'
  },
  imageClass: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  errorText: {
    type: String,
    default: 'Erreur de chargement'
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
  }
})

const emit = defineEmits(['load', 'error', 'retry'])

// État réactif
const containerRef = ref(null)
const isLoading = ref(true)
const hasError = ref(false)
const isVisible = ref(false)
const observer = ref(null)

// Image source calculée
const imageSrc = computed(() => {
  if (!isVisible.value) return null
  return props.src
})

// Méthodes
const onImageLoad = () => {
  isLoading.value = false
  hasError.value = false
  emit('load')
}

const onImageError = () => {
  isLoading.value = false
  hasError.value = true
  emit('error')
}

const retryLoad = () => {
  hasError.value = false
  isLoading.value = true
  emit('retry')
}

const setupIntersectionObserver = () => {
  if (!containerRef.value) return

  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
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
}

// Watchers
watch(() => props.src, () => {
  if (props.src) {
    isLoading.value = true
    hasError.value = false
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
.lazy-image-container {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.lazy-image-placeholder,
.lazy-image-error,
.lazy-image-default {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
}

.skeleton-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.skeleton-icon {
  font-size: 2rem;
  color: #9ca3af;
}

.skeleton-text {
  font-size: 0.875rem;
  color: #6b7280;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 1rem;
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

.default-icon {
  font-size: 3rem;
  color: #d1d5db;
}

.lazy-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  transition: opacity 0.3s ease;
}

.lazy-image-container.loading img {
  opacity: 0;
}

.lazy-image-container:not(.loading) img {
  opacity: 1;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Mode sombre */
.dark .lazy-image-placeholder,
.dark .lazy-image-error,
.dark .lazy-image-default {
  background-color: #374151;
  border-color: #4b5563;
}

.dark .skeleton-loader {
  background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
  background-size: 200% 100%;
}

.dark .skeleton-icon,
.dark .default-icon {
  color: #6b7280;
}

.dark .skeleton-text,
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
