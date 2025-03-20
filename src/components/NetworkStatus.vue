<template>
  <div 
    v-if="!isOnline || showOfflineMessage" 
    :class="[
      'network-status fixed z-50 transition-all duration-300 ease-in-out',
      isOnline ? 'bg-success-500 slide-up-enter' : 'bg-red-500',
      position
    ]"
  >
    <div class="container mx-auto px-4 py-2 flex items-center justify-between text-white">
      <div class="flex items-center">
        <svg v-if="isOnline" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <span>{{ statusMessage }}</span>
      </div>
      <button 
        v-if="isOnline"
        @click="hideMessage" 
        class="text-white hover:text-gray-100 focus:outline-none"
        aria-label="Fermer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  position: {
    type: String,
    default: 'bottom-0 left-0 right-0' // Alternatives: 'top-0 left-0 right-0'
  },
  autoDismiss: {
    type: Boolean,
    default: true
  },
  dismissDelay: {
    type: Number,
    default: 3000 // 3 secondes
  }
});

const isOnline = ref(navigator.onLine);
const showOfflineMessage = ref(false);
const reconnectedRecently = ref(false);
let autoHideTimeout = null;

const statusMessage = computed(() => {
  if (isOnline.value) {
    return 'Connexion rétablie. Les données seront synchronisées automatiquement.';
  } else {
    return 'Vous êtes hors ligne. Les modifications seront enregistrées localement.';
  }
});

function handleOnline() {
  isOnline.value = true;
  reconnectedRecently.value = true;
  showOfflineMessage.value = true;
  
  if (props.autoDismiss) {
    if (autoHideTimeout) {
      clearTimeout(autoHideTimeout);
    }
    
    autoHideTimeout = setTimeout(() => {
      hideMessage();
    }, props.dismissDelay);
  }
}

function handleOffline() {
  isOnline.value = false;
  showOfflineMessage.value = true;
  
  if (autoHideTimeout) {
    clearTimeout(autoHideTimeout);
    autoHideTimeout = null;
  }
}

function hideMessage() {
  showOfflineMessage.value = false;
  reconnectedRecently.value = false;
  
  if (autoHideTimeout) {
    clearTimeout(autoHideTimeout);
    autoHideTimeout = null;
  }
}

onMounted(() => {
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  // Vérifier l'état initial
  isOnline.value = navigator.onLine;
  showOfflineMessage.value = !isOnline.value;
});

onBeforeUnmount(() => {
  window.removeEventListener('online', handleOnline);
  window.removeEventListener('offline', handleOffline);
  
  if (autoHideTimeout) {
    clearTimeout(autoHideTimeout);
  }
});
</script>

<style scoped>
.network-status {
  width: 100%;
  box-shadow: 0 -1px 6px rgba(0, 0, 0, 0.1);
}

.slide-up-enter {
  animation: slideUp 0.3s ease-out forwards;
}

@keyframes slideUp {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
</style> 