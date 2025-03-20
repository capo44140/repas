<template>
  <Teleport to="body">
    <div 
      v-if="show"
      class="fixed z-50 transition-all duration-300 transform"
      :class="[
        positionClasses,
        {
          'translate-y-0 opacity-100': show,
          'translate-y-8 opacity-0': !show
        }
      ]"
    >
      <div 
        class="flex items-center rounded-lg shadow-lg p-4 max-w-md"
        :class="[
          typeClasses,
          { 'animate-shake': shouldShake }
        ]"
      >
        <div class="flex-shrink-0 mr-3">
          <Icon 
            :icon="typeIcon" 
            class="w-5 h-5" 
            :class="typeIconClass"
          />
        </div>
        <div class="mr-3 flex-grow">
          <div v-if="title" class="font-medium" :class="typeTitleClass">
            {{ title }}
          </div>
          <div :class="typeMessageClass">
            {{ message }}
          </div>
        </div>
        <button 
          v-if="dismissible"
          @click="dismiss"
          class="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <Icon icon="ph:x" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000
  },
  position: {
    type: String,
    default: 'bottom-right',
    validator: (value) => [
      'top-right', 'top-center', 'top-left',
      'bottom-right', 'bottom-center', 'bottom-left'
    ].includes(value)
  },
  dismissible: {
    type: Boolean,
    default: true
  },
  shake: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:show', 'dismissed']);

// État local
const shouldShake = ref(props.shake && props.type === 'error');

// Timer pour fermer la notification automatiquement
let timer = null;

// Classes CSS en fonction du type de notification
const typeClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-success-50 dark:bg-success-900 border-l-4 border-success-500';
    case 'error':
      return 'bg-red-50 dark:bg-red-900 border-l-4 border-red-500';
    case 'warning':
      return 'bg-amber-50 dark:bg-amber-900 border-l-4 border-amber-500';
    case 'info':
    default:
      return 'bg-primary-50 dark:bg-primary-900 border-l-4 border-primary-500';
  }
});

// Couleur du texte du titre
const typeTitleClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-success-800 dark:text-success-200';
    case 'error':
      return 'text-red-800 dark:text-red-200';
    case 'warning':
      return 'text-amber-800 dark:text-amber-200';
    case 'info':
    default:
      return 'text-primary-800 dark:text-primary-200';
  }
});

// Couleur du texte du message
const typeMessageClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-success-700 dark:text-success-300';
    case 'error':
      return 'text-red-700 dark:text-red-300';
    case 'warning':
      return 'text-amber-700 dark:text-amber-300';
    case 'info':
    default:
      return 'text-primary-700 dark:text-primary-300';
  }
});

// Icône à afficher
const typeIcon = computed(() => {
  switch (props.type) {
    case 'success':
      return 'ph:check-circle';
    case 'error':
      return 'ph:x-circle';
    case 'warning':
      return 'ph:warning';
    case 'info':
    default:
      return 'ph:info';
  }
});

// Couleur de l'icône
const typeIconClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-success-500';
    case 'error':
      return 'text-red-500';
    case 'warning':
      return 'text-amber-500';
    case 'info':
    default:
      return 'text-primary-500';
  }
});

// Classes de position
const positionClasses = computed(() => {
  switch (props.position) {
    case 'top-right':
      return 'top-4 right-4';
    case 'top-center':
      return 'top-4 left-1/2 -translate-x-1/2';
    case 'top-left':
      return 'top-4 left-4';
    case 'bottom-center':
      return 'bottom-4 left-1/2 -translate-x-1/2';
    case 'bottom-left':
      return 'bottom-4 left-4';
    case 'bottom-right':
    default:
      return 'bottom-4 right-4';
  }
});

// Fermer la notification
const dismiss = () => {
  emit('update:show', false);
  emit('dismissed');
};

// Gérer le timer automatique
watch(() => props.show, (newVal) => {
  if (newVal) {
    // Réinitialiser l'effet shake
    shouldShake.value = props.shake && props.type === 'error';
    
    // Configurer le timer pour fermer automatiquement
    if (props.duration > 0) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        dismiss();
      }, props.duration);
    }
  } else {
    // Nettoyer le timer si la notification est cachée
    clearTimeout(timer);
  }
});

// Nettoyage à la destruction du composant
onUnmounted(() => {
  clearTimeout(timer);
});
</script>

<style scoped>
.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}
</style> 