<template>
  <div
    ref="draggableElement"
    class="draggable-item cursor-move" 
    :class="{ 'is-dragging': isDragging }"
    :draggable="draggable"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @dragover.prevent
    @dragenter.prevent
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  itemId: {
    type: [String, Number],
    required: true
  },
  draggable: {
    type: Boolean,
    default: true
  },
  data: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['dragstart', 'dragend']);
const draggableElement = ref(null);
const isDragging = ref(false);

function handleDragStart(event) {
  isDragging.value = true;
  
  // Ajouter des données au transfert de glisser-déposer
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', JSON.stringify({
      id: props.itemId,
      data: props.data
    }));
    
    // Ajouter une image fantôme personnalisée si nécessaire
    if (draggableElement.value) {
      const rect = draggableElement.value.getBoundingClientRect();
      event.dataTransfer.setDragImage(draggableElement.value, rect.width / 2, rect.height / 2);
    }
  }
  
  emit('dragstart', {
    id: props.itemId,
    data: props.data,
    event
  });
}

function handleDragEnd(event) {
  isDragging.value = false;
  emit('dragend', {
    id: props.itemId,
    data: props.data,
    event
  });
}
</script>

<style scoped>
.draggable-item {
  transition: transform 0.2s, box-shadow 0.2s;
}

.is-dragging {
  opacity: 0.5;
  z-index: 9999;
}
</style> 