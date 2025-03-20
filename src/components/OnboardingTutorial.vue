<template>
  <div v-if="isVisible" class="onboarding-container">
    <!-- Overlay semi-transparent -->
    <div class="fixed inset-0 bg-black bg-opacity-50 z-40" @click.self="skipTutorial"></div>
    
    <!-- Tutoriel -->
    <div 
      class="tutorial-step fixed z-50 p-5 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-w-sm"
      :style="positionStyle"
    >
      <button 
        @click="skipTutorial" 
        class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" 
        aria-label="Fermer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <div class="flex items-center mb-3">
        <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-300 mr-3">
          <span class="text-lg font-semibold">{{ currentStep + 1 }}</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ currentTutorialStep.title }}</h3>
      </div>
      
      <p class="text-gray-600 dark:text-gray-300 mb-4">{{ currentTutorialStep.description }}</p>
      
      <div class="flex justify-between mt-4">
        <button 
          v-if="currentStep > 0" 
          @click="prevStep" 
          class="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Précédent
        </button>
        <div v-else></div>
        
        <div class="flex space-x-1">
          <span 
            v-for="(_, index) in tutorialSteps" 
            :key="index" 
            class="w-2 h-2 rounded-full"
            :class="index === currentStep 
              ? 'bg-primary-500' 
              : 'bg-gray-300 dark:bg-gray-600'"
          ></span>
        </div>
        
        <button 
          v-if="currentStep < tutorialSteps.length - 1" 
          @click="nextStep" 
          class="px-3 py-1.5 text-sm text-white bg-primary-600 rounded hover:bg-primary-700 transition-colors"
        >
          Suivant
        </button>
        <button 
          v-else 
          @click="completeTutorial" 
          class="px-3 py-1.5 text-sm text-white bg-success-600 rounded hover:bg-success-700 transition-colors"
        >
          Terminer
        </button>
      </div>
    </div>
    
    <!-- Flèche de pointage -->
    <div 
      v-if="showArrow" 
      class="tutorial-arrow fixed w-8 h-8 z-50 pointer-events-none"
      :style="arrowStyle"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="text-primary-500 animate-bounce">
        <path d="M12 5l-8 8h5v6h6v-6h5z"></path>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
  tutorialId: {
    type: String,
    required: true
  },
  startAtStep: {
    type: Number,
    default: 0
  },
  autoShow: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['tutorial-completed', 'tutorial-skipped', 'step-changed']);

const isVisible = ref(false);
const currentStep = ref(props.startAtStep);
const showArrow = ref(true);

// Exemple de tutoriel
const tutorialSteps = ref([
  {
    title: 'Bienvenue !',
    description: 'Découvrez les nouvelles fonctionnalités de l\'application de planification de repas.',
    targetSelector: null,
    position: 'center'
  },
  {
    title: 'Personnalisation',
    description: 'Vous pouvez maintenant configurer vos préférences alimentaires et définir les aliments à éviter.',
    targetSelector: '.user-preferences-panel',
    position: 'right'
  },
  {
    title: 'Glisser-déposer',
    description: 'Réorganisez vos repas facilement en les glissant vers leur nouvelle position.',
    targetSelector: '.draggable-item',
    position: 'bottom'
  },
  {
    title: 'Statistiques améliorées',
    description: 'Visualisez vos habitudes alimentaires et suivez vos progrès grâce aux graphiques interactifs.',
    targetSelector: '.stats-chart',
    position: 'left'
  },
  {
    title: 'C\'est terminé !',
    description: 'Vous connaissez maintenant toutes les nouvelles fonctionnalités. Bonne planification !',
    targetSelector: null,
    position: 'center'
  }
]);

const currentTutorialStep = computed(() => {
  return tutorialSteps.value[currentStep.value] || {};
});

const positionStyle = computed(() => {
  const step = currentTutorialStep.value;
  const position = step.position || 'center';
  const targetEl = step.targetSelector ? document.querySelector(step.targetSelector) : null;
  
  if (!targetEl || position === 'center') {
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
  }
  
  const rect = targetEl.getBoundingClientRect();
  const popupWidth = 320; // Largeur approximative de la popup
  const popupHeight = 200; // Hauteur approximative de la popup
  
  switch (position) {
    case 'top':
      return {
        left: `${rect.left + rect.width / 2 - popupWidth / 2}px`,
        bottom: `${window.innerHeight - rect.top + 10}px`
      };
    case 'right':
      return {
        left: `${rect.right + 10}px`,
        top: `${rect.top + rect.height / 2 - popupHeight / 2}px`
      };
    case 'bottom':
      return {
        left: `${rect.left + rect.width / 2 - popupWidth / 2}px`,
        top: `${rect.bottom + 10}px`
      };
    case 'left':
      return {
        right: `${window.innerWidth - rect.left + 10}px`,
        top: `${rect.top + rect.height / 2 - popupHeight / 2}px`
      };
    default:
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
  }
});

const arrowStyle = computed(() => {
  const step = currentTutorialStep.value;
  const targetEl = step.targetSelector ? document.querySelector(step.targetSelector) : null;
  
  if (!targetEl || step.position === 'center') {
    return { display: 'none' };
  }
  
  const rect = targetEl.getBoundingClientRect();
  
  return {
    top: `${rect.top + rect.height / 2 - 12}px`,
    left: `${rect.left + rect.width / 2 - 12}px`
  };
});

function nextStep() {
  if (currentStep.value < tutorialSteps.value.length - 1) {
    currentStep.value++;
    emit('step-changed', currentStep.value);
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--;
    emit('step-changed', currentStep.value);
  }
}

function skipTutorial() {
  isVisible.value = false;
  emit('tutorial-skipped');
  localStorage.setItem(`tutorial_${props.tutorialId}_skipped`, 'true');
}

function completeTutorial() {
  isVisible.value = false;
  emit('tutorial-completed');
  localStorage.setItem(`tutorial_${props.tutorialId}_completed`, 'true');
}

function showTutorial() {
  const isCompleted = localStorage.getItem(`tutorial_${props.tutorialId}_completed`) === 'true';
  const isSkipped = localStorage.getItem(`tutorial_${props.tutorialId}_skipped`) === 'true';
  
  if (!isCompleted && !isSkipped) {
    isVisible.value = true;
  }
}

onMounted(() => {
  if (props.autoShow) {
    // Léger délai pour que l'UI se charge complètement
    setTimeout(showTutorial, 1000);
  }
  
  // Observer les changements dans la position des éléments cibles
  window.addEventListener('resize', updatePositions);
  window.addEventListener('scroll', updatePositions);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updatePositions);
  window.removeEventListener('scroll', updatePositions);
});

watch(currentStep, () => {
  // Réinitialiser l'animation de la flèche
  showArrow.value = false;
  setTimeout(() => {
    showArrow.value = true;
  }, 50);
});

function updatePositions() {
  // Forcer une mise à jour des positions calculées
  currentStep.value = currentStep.value;
}

// Méthodes exposées pour l'API publique
defineExpose({
  show: () => { isVisible.value = true; },
  hide: () => { isVisible.value = false; },
  goToStep: (stepIndex) => { currentStep.value = stepIndex; }
});
</script>

<style scoped>
.tutorial-step {
  transition: all 0.3s ease;
}

.tutorial-arrow {
  transition: all 0.3s ease;
}
</style> 