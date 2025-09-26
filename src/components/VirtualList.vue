<template>
  <div 
    ref="containerRef" 
    class="virtual-list-container"
    :style="{ height: containerHeight + 'px' }"
    @scroll="handleScroll"
  >
    <!-- Spacer pour simuler la hauteur totale -->
    <div :style="{ height: totalHeight + 'px' }" class="virtual-list-spacer">
      <!-- Contenu visible -->
      <div 
        :style="{ 
          transform: `translateY(${offsetY}px)`,
          height: visibleHeight + 'px'
        }"
        class="virtual-list-content"
      >
        <div
          v-for="(item, index) in visibleItems"
          :key="getItemKey(item, startIndex + index)"
          :style="{ height: itemHeight + 'px' }"
          class="virtual-list-item"
        >
          <slot 
            :item="item" 
            :index="startIndex + index"
            :isVisible="true"
          />
        </div>
      </div>
    </div>

    <!-- Indicateur de chargement -->
    <div v-if="loading" class="virtual-list-loading">
      <Icon icon="ph:spinner" class="spinning" />
      <span>Chargement...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  itemHeight: {
    type: Number,
    required: true
  },
  containerHeight: {
    type: Number,
    default: 400
  },
  overscan: {
    type: Number,
    default: 5
  },
  loading: {
    type: Boolean,
    default: false
  },
  getItemKey: {
    type: Function,
    default: (item, index) => index
  }
})

const emit = defineEmits(['scroll', 'loadMore'])

// État réactif
const containerRef = ref(null)
const scrollTop = ref(0)
const containerWidth = ref(0)

// Calculs
const totalHeight = computed(() => props.items.length * props.itemHeight)
const visibleCount = computed(() => Math.ceil(props.containerHeight / props.itemHeight))
const startIndex = computed(() => Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.overscan))
const endIndex = computed(() => Math.min(
  props.items.length - 1,
  startIndex.value + visibleCount.value + props.overscan * 2
))

const visibleItems = computed(() => 
  props.items.slice(startIndex.value, endIndex.value + 1)
)

const offsetY = computed(() => startIndex.value * props.itemHeight)
const visibleHeight = computed(() => (endIndex.value - startIndex.value + 1) * props.itemHeight)

// Méthodes
const handleScroll = (event) => {
  scrollTop.value = event.target.scrollTop
  emit('scroll', {
    scrollTop: scrollTop.value,
    scrollLeft: event.target.scrollLeft
  })

  // Charger plus d'éléments si on approche de la fin
  const scrollPercentage = (scrollTop.value + props.containerHeight) / totalHeight.value
  if (scrollPercentage > 0.8) {
    emit('loadMore')
  }
}

const scrollToIndex = (index) => {
  if (!containerRef.value) return
  
  const targetScrollTop = index * props.itemHeight
  containerRef.value.scrollTop = targetScrollTop
}

const scrollToTop = () => {
  if (!containerRef.value) return
  containerRef.value.scrollTop = 0
}

const scrollToBottom = () => {
  if (!containerRef.value) return
  containerRef.value.scrollTop = totalHeight.value
}

// Lifecycle
onMounted(() => {
  if (containerRef.value) {
    containerWidth.value = containerRef.value.clientWidth
  }
})

// Exposer les méthodes
defineExpose({
  scrollToIndex,
  scrollToTop,
  scrollToBottom
})
</script>

<style scoped>
.virtual-list-container {
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: white;
}

.virtual-list-spacer {
  position: relative;
}

.virtual-list-content {
  position: relative;
}

.virtual-list-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.virtual-list-item:last-child {
  border-bottom: none;
}

.virtual-list-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
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

/* Mode sombre */
.dark .virtual-list-container {
  background-color: #1f2937;
  border-color: #374151;
}

.dark .virtual-list-item {
  border-bottom-color: #374151;
}

.dark .virtual-list-loading {
  background-color: rgba(31, 41, 55, 0.9);
  color: #f9fafb;
}

/* Scrollbar personnalisée */
.virtual-list-container::-webkit-scrollbar {
  width: 8px;
}

.virtual-list-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.virtual-list-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.virtual-list-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark .virtual-list-container::-webkit-scrollbar-track {
  background: #374151;
}

.dark .virtual-list-container::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark .virtual-list-container::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
