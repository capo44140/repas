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
              class="theme-option rounded-lg p-2 cursor-pointer transition-all border-2"
              :class="{ 
                'border-primary-500': currentTheme === theme.id,
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
              class="color-option w-8 h-8 rounded-full border-2 cursor-pointer transition-all"
              :class="{ 'scale-110 border-gray-200 dark:border-gray-700': customPrimaryColor === color.id }"
              :style="{ backgroundColor: color.value }"
            ></div>
          </div>
        </div>
        
        <div class="mb-4">
          <label :class="labelClass" class="block mb-2">Saturation</label>
          <input 
            v-model="saturation" 
            type="range" 
            min="0" 
            max="100" 
            step="5"
            class="w-full" 
            @change="updateCustomTheme"
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
      customPrimaryColor.value = themeColor.id;
    }
  }
};

const selectPrimaryColor = (colorId) => {
  customPrimaryColor.value = colorId;
  updateCustomTheme();
};

const updateCustomTheme = () => {
  // Trouver le thème personnalisé et mettre à jour sa couleur
  const customTheme = themes.value.find(t => t.id === 'custom');
  if (customTheme) {
    const color = primaryColors.value.find(c => c.id === customPrimaryColor.value);
    if (color) {
      customTheme.colors['--primary-color'] = color.value;
    }
  }
};

const getThemePreviewStyle = (theme) => {
  return {
    background: `linear-gradient(135deg, ${theme.colors['--primary-color']} 0%, ${theme.colors['--primary-color']}80 50%, ${theme.colors['--secondary-color']}80 50%, ${theme.colors['--secondary-color']} 100%)`
  };
};

const applyTheme = () => {
  // Récupérer le thème sélectionné
  const theme = themes.value.find(t => t.id === currentTheme.value);
  if (!theme) return;
  
  // Appliquer le thème via le composable
  applyThemeComposable(currentTheme.value, customPrimaryColor.value, saturation.value);
  
  // Fermer la palette
  showPalette.value = false;
  
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
}

.color-option {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, border-color 0.2s;
}

.color-option:hover {
  transform: scale(1.1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style> 
