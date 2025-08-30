<template>
  <div class="theme-switcher">
    <div class="flex items-center space-x-2 mb-2">
      <label :class="labelClass">Thème de couleurs</label>
      <button 
        v-if="!showPalette" 
        @click="togglePalette" 
        :class="buttonClass"
      >
        <Icon icon="ph:palette" class="w-5 h-5" />
      </button>
    </div>
    
    <transition name="fade">
      <div v-if="showPalette" class="theme-palette">
        <div class="flex items-center justify-between mb-3">
          <h3 :class="titleClass">Personnalisation du thème</h3>
          <button 
            @click="togglePalette" 
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Icon icon="ph:x" class="w-5 h-5" />
          </button>
        </div>
        
        <div class="mb-4">
          <div class="grid grid-cols-3 gap-3">
            <div 
              v-for="(theme, index) in themes" 
              :key="index"
              @click="selectTheme(theme)"
              :data-theme-id="theme.id"
              class="theme-option rounded-lg p-2 cursor-pointer transition-all border-2"
              :class="{ 
                'border-primary-500 theme-selected': currentTheme === theme.id,
                'border-transparent': currentTheme !== theme.id,
                'hover:border-gray-300 dark:hover:border-gray-600': currentTheme !== theme.id
              }"
            >
              <div class="flex flex-col items-center">
                <div class="w-full h-12 rounded-md mb-1 theme-preview" :style="getThemePreviewStyle(theme)"></div>
                <span class="text-xs" :class="labelClass">{{ theme.name }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mb-4">
          <label :class="labelClass" class="block mb-2">Couleur principale</label>
          <div class="grid grid-cols-5 gap-2">
            <div 
              v-for="color in primaryColors" 
              :key="color.id"
              @click="selectPrimaryColor(color.id)"
              :data-color-id="color.id"
              class="color-option w-8 h-8 rounded-full border-2 cursor-pointer transition-all overflow-hidden relative"
              :class="{ 'scale-110 border-gray-200 dark:border-gray-700 color-selected': customPrimaryColor === color.id }"
              :style="{ backgroundColor: color.value }"
            ></div>
          </div>
        </div>
        
        <div class="mb-4">
          <label :class="labelClass" class="block mb-2">Saturation</label>
          <input 
            :value="saturation" 
            @input="e => updateSaturation(parseInt(e.target.value))" 
            type="range" 
            min="0" 
            max="100" 
            step="5"
            class="w-full saturation-slider" 
          />
        </div>
        
        <div class="flex justify-between">
          <button 
            @click="resetToDefault" 
            :class="secondaryButtonClass"
          >
            Réinitialiser
          </button>
          <button 
            @click="applyTheme" 
            :class="primaryButtonClass"
          >
            Appliquer
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import { Icon } from '@iconify/vue';
import { useDarkMode } from '../composables/useDarkMode';

// Utiliser le composable pour la gestion des thèmes
const {
  isDarkMode,
  currentTheme,
  customPrimaryColor,
  saturation,
  themes,
  primaryColors,
  applyTheme: applyThemeComposable,
  resetToDefault: resetToDefaultComposable
} = useDarkMode();

// Injecter la fonction showToast
const showToast = inject('showToast', () => {});

// États locaux
const showPalette = ref(false);

// Classes CSS basées sur le mode sombre
const labelClass = computed(() => 
  isDarkMode.value ? 'text-gray-300' : 'text-gray-700'
);

const titleClass = computed(() => 
  isDarkMode.value ? 'text-gray-200 font-medium' : 'text-gray-800 font-medium'
);

const buttonClass = computed(() => 
  isDarkMode.value 
    ? 'p-1 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300' 
    : 'p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700'
);

const primaryButtonClass = computed(() => 
  'px-4 py-2 rounded-md bg-primary-500 hover:bg-primary-600 text-white font-medium'
);

const secondaryButtonClass = computed(() => 
  isDarkMode.value 
    ? 'px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-200' 
    : 'px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700'
);

// Méthodes
const togglePalette = () => {
  showPalette.value = !showPalette.value;
};

const selectTheme = (theme) => {
  if (theme.id !== 'custom') {
    const themeColor = primaryColors.value.find(c => c.id === theme.id);
    if (themeColor) {
      // Ajouter un effet visuel sur l'élément sélectionné
      const themeElements = document.querySelectorAll('.theme-option');
      themeElements.forEach(el => el.classList.remove('theme-selected'));
      
      // Trouver l'élément actuel et ajouter la classe
      const currentElement = document.querySelector(`.theme-option[data-theme-id="${theme.id}"]`);
      if (currentElement) {
        currentElement.classList.add('theme-selected');
      }
      
      // Utiliser la fonction applyTheme pour mettre à jour le thème
      applyThemeComposable(theme.id, themeColor.id, saturation.value);
    }
  }
};

const selectPrimaryColor = (colorId) => {
  // Ajouter un effet visuel sur l'élément sélectionné
  const colorElements = document.querySelectorAll('.color-option');
  colorElements.forEach(el => el.classList.remove('color-selected'));
  
  // Trouver l'élément actuel et ajouter la classe
  const currentElement = document.querySelector(`.color-option[data-color-id="${colorId}"]`);
  if (currentElement) {
    currentElement.classList.add('color-selected');
    
    // Ajouter un effet de ripple
    const ripple = document.createElement('span');
    ripple.classList.add('color-ripple');
    currentElement.appendChild(ripple);
    
    // Supprimer l'élément ripple après l'animation
    setTimeout(() => {
      ripple.remove();
    }, 1000);
  }
  
  // Utiliser la fonction applyTheme pour mettre à jour la couleur primaire
  applyThemeComposable(currentTheme.value, colorId, saturation.value);
  updateCustomTheme();
};

const updateCustomTheme = () => {
  // Trouver le thème personnalisé et mettre à jour sa couleur
  const customTheme = themes.value.find(t => t.id === 'custom');
  if (customTheme) {
    const color = primaryColors.value.find(c => c.id === customPrimaryColor.value);
    if (color) {
      // Utiliser la fonction applyTheme pour mettre à jour le thème personnalisé
      applyThemeComposable('custom', customPrimaryColor.value, saturation.value);
    }
  }
};

// Fonction pour mettre à jour la saturation
const updateSaturation = (value) => {
  // Ajouter un effet visuel sur le curseur
  const saturationSlider = document.querySelector('.saturation-slider');
  if (saturationSlider) {
    saturationSlider.classList.add('slider-active');
    
    // Supprimer la classe après l'animation
    setTimeout(() => {
      saturationSlider.classList.remove('slider-active');
    }, 500);
  }
  
  // Utiliser la fonction applyTheme pour mettre à jour la saturation
  applyThemeComposable(currentTheme.value, customPrimaryColor.value, value);
};

const getThemePreviewStyle = (theme) => {
  return {
    background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primary}80 50%, ${theme.secondary}80 50%, ${theme.secondary} 100%)`
  };
};

const applyTheme = () => {
  // Récupérer le thème sélectionné
  const theme = themes.value.find(t => t.id === currentTheme.value);
  if (!theme) return;
  
  // Ajouter une animation de transition sur le body
  document.body.classList.add('theme-transition');
  
  // Ajouter un effet de pulsation
  document.body.classList.add('theme-pulse');
  
  // Appliquer le thème via le composable
  applyThemeComposable(currentTheme.value, customPrimaryColor.value, saturation.value);
  
  // Fermer la palette
  showPalette.value = false;
  
  // Supprimer les classes d'animation après la transition
  setTimeout(() => {
    document.body.classList.remove('theme-transition');
    document.body.classList.remove('theme-pulse');
  }, 1000);
  
  // Afficher une notification
  showToast({
    message: `Thème ${theme.name} appliqué avec succès`,
    type: 'success'
  });
};

const resetToDefault = () => {
  resetToDefaultComposable();
  showToast({
    message: 'Thème réinitialisé aux valeurs par défaut',
    type: 'info'
  });
};
</script>

<style scoped>
.theme-switcher {
  position: relative;
}

.theme-palette {
  position: absolute;
  width: 280px;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 10;
  top: 100%;
  right: 0;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:root[data-theme="light"] .theme-palette {
  background-color: white;
  border: 1px solid #e5e7eb;
}

:root[data-theme="dark"] .theme-palette {
  background-color: #1f2937;
  border: 1px solid #374151;
}

.theme-preview {
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.theme-option:hover .theme-preview {
  transform: translateY(-2px);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15);
}

.theme-selected .theme-preview {
  transform: translateY(-3px);
  box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.2);
}

@keyframes theme-selected-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
}

.theme-selected {
  animation: theme-selected-pulse 0.5s ease-in-out;
}

.color-option {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.color-option:hover {
  transform: scale(1.1);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

.color-selected {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.color-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ripple 1s ease-out;
}

@keyframes ripple {
  to {
    width: 200%;
    height: 200%;
    opacity: 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Style pour le curseur de saturation */
.saturation-slider {
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(to right, #d1d5db, var(--primary-500));
  outline: none;
  transition: all 0.3s ease;
}

.saturation-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--primary-500);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.saturation-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--primary-500);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.saturation-slider:hover::-webkit-slider-thumb {
  transform: scale(1.2);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.saturation-slider:hover::-moz-range-thumb {
  transform: scale(1.2);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.slider-active::-webkit-slider-thumb {
  transform: scale(1.3);
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.4);
}

.slider-active::-moz-range-thumb {
  transform: scale(1.3);
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.4);
}

/* Animation pour le changement de thème global */
:global(.theme-transition) {
  transition: background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease !important;
}

/* Animation de pulsation lors du changement de thème */
@keyframes themePulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.01); }
  100% { transform: scale(1); }
}

:global(.theme-pulse) {
  animation: themePulse 0.5s ease-in-out;
}
</style>
