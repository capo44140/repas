<template>
  <div
    class="drop-zone"
    :class="{ 
      'drop-zone-active': isActive, 
      'drop-zone-hover': isHovering,
      [customClass]: !!customClass
    }"
    @dragover.prevent="handleDragOver"
    @dragenter.prevent="handleDragEnter"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <slot :is-active="isActive" :is-hovering="isHovering"></slot>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  dropZoneId: {
    type: [String, Number],
    required: true
  },
  acceptIds: {
    type: Array,
    default: () => []
  },
  customClass: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['dragenter', 'dragleave', 'drop']);
const isActive = ref(false);
const isHovering = ref(false);
const dragCounter = ref(0);

function handleDragEnter(event) {
  dragCounter.value++;
  isActive.value = true;
  isHovering.value = true;
  
  emit('dragenter', {
    id: props.dropZoneId,
    event
  });
}

function handleDragLeave(event) {
  dragCounter.value--;
  
  if (dragCounter.value === 0) {
    isHovering.value = false;
  }
  
  emit('dragleave', {
    id: props.dropZoneId,
    event
  });
}

function handleDragOver(event) {
  event.dataTransfer.dropEffect = 'move';
}

function handleDrop(event) {
  isHovering.value = false;
  isActive.value = false;
  dragCounter.value = 0;
  
  try {
    const data = JSON.parse(event.dataTransfer.getData('text/plain'));
    
    // Vérifier si l'élément est acceptable dans cette zone de dépôt
    if (props.acceptIds.length === 0 || props.acceptIds.includes(data.id)) {
      emit('drop', {
        dropZoneId: props.dropZoneId,
        draggedItem: data,
        event
      });
    }
  } catch (error) {
    console.error('Erreur de parsing des données lors du drop:', error);
  }
}
</script>

<style scoped>
.drop-zone {
  position: relative;
  transition: background-color 0.2s, border 0.2s;
}

.drop-zone-active {
  outline: 2px dashed rgba(59, 130, 246, 0.3);
  outline-offset: -2px;
}

.drop-zone-hover {
  background-color: rgba(59, 130, 246, 0.05);
}

.dark .drop-zone-hover {
  background-color: rgba(96, 165, 250, 0.05);
}
</style> 