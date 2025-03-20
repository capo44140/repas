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
                'border-primary-500': selectedTheme === theme.id,
                'border-transparent': selectedTheme !== theme.id,
                'hover:border-gray-300 dark:hover:border-gray-600': selectedTheme !== theme.id
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
import { ref, computed, inject, watch } from 'vue';
import { Icon } from '@iconify/vue';

// Injecter le mode sombre
const isDarkMode = inject('isDarkMode', ref(false));
const showToast = inject('showToast', () => {});

// États
const showPalette = ref(false);
const selectedTheme = ref('blue');
const customPrimaryColor = ref('blue');
const saturation = ref(60);

// Thèmes prédéfinis
const themes = [
  { id: 'blue', name: 'Bleu', primary: '#3B82F6', secondary: '#10B981' },
  { id: 'purple', name: 'Violet', primary: '#8B5CF6', secondary: '#EC4899' },
  { id: 'green', name: 'Vert', primary: '#10B981', secondary: '#6366F1' },
  { id: 'red', name: 'Rouge', primary: '#EF4444', secondary: '#F59E0B' },
  { id: 'amber', name: 'Ambre', primary: '#F59E0B', secondary: '#3B82F6' },
  { id: 'custom', name: 'Personnalisé', primary: '#3B82F6', secondary: '#10B981' }
];

// Couleurs principales disponibles
const primaryColors = [
  { id: 'blue', value: '#3B82F6' },
  { id: 'purple', value: '#8B5CF6' },
  { id: 'green', value: '#10B981' },
  { id: 'red', value: '#EF4444' },
  { id: 'amber', value: '#F59E0B' },
  { id: 'pink', value: '#EC4899' },
  { id: 'indigo', value: '#6366F1' },
  { id: 'teal', value: '#14B8A6' },
  { id: 'cyan', value: '#06B6D4' },
  { id: 'orange', value: '#F97316' }
];

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
  selectedTheme.value = theme.id;
  if (theme.id !== 'custom') {
    const themeColor = primaryColors.find(c => c.id === theme.id);
    if (themeColor) {
      customPrimaryColor.value = themeColor.id;
    }
  }
};

const selectPrimaryColor = (colorId) => {
  customPrimaryColor.value = colorId;
  selectedTheme.value = 'custom';
  updateCustomTheme();
};

const updateCustomTheme = () => {
  // Trouver le thème personnalisé et mettre à jour sa couleur
  const customTheme = themes.find(t => t.id === 'custom');
  if (customTheme) {
    const color = primaryColors.find(c => c.id === customPrimaryColor.value);
    if (color) {
      customTheme.primary = color.value;
    }
  }
};

const getThemePreviewStyle = (theme) => {
  return {
    background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primary}80 50%, ${theme.secondary}80 50%, ${theme.secondary} 100%)`
  };
};

const applyTheme = () => {
  // Récupérer le thème sélectionné
  const theme = themes.find(t => t.id === selectedTheme.value);
  if (!theme) return;
  
  // Appliquer les changements (dans une application réelle, cela modifierait des variables CSS)
  updateRootCSSVariables(theme.primary, saturation.value);
  
  // Fermer la palette
  showPalette.value = false;
  
  // Afficher une notification
  showToast({
    message: `Thème ${theme.name} appliqué avec succès`,
    type: 'success'
  });
  
  // Sauvegarder les préférences
  saveThemePreferences();
};

const resetToDefault = () => {
  selectedTheme.value = 'blue';
  customPrimaryColor.value = 'blue';
  saturation.value = 60;
  updateCustomTheme();
};

const updateRootCSSVariables = (color, sat) => {
  // Convertir la couleur hexadécimale en valeurs RGB
  const hex = color.replace('#', '');
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  
  // Ajuster la saturation
  const factor = sat / 100;
  
  // Mettre à jour les variables CSS pour la couleur primaire
  document.documentElement.style.setProperty('--primary-50', adjustColor(r, g, b, 0.95, factor));
  document.documentElement.style.setProperty('--primary-100', adjustColor(r, g, b, 0.9, factor));
  document.documentElement.style.setProperty('--primary-200', adjustColor(r, g, b, 0.8, factor));
  document.documentElement.style.setProperty('--primary-300', adjustColor(r, g, b, 0.7, factor));
  document.documentElement.style.setProperty('--primary-400', adjustColor(r, g, b, 0.6, factor));
  document.documentElement.style.setProperty('--primary-500', color);
  document.documentElement.style.setProperty('--primary-600', adjustColor(r, g, b, 0.4, factor));
  document.documentElement.style.setProperty('--primary-700', adjustColor(r, g, b, 0.3, factor));
  document.documentElement.style.setProperty('--primary-800', adjustColor(r, g, b, 0.2, factor));
  document.documentElement.style.setProperty('--primary-900', adjustColor(r, g, b, 0.1, factor));
  
  // Créer un événement de modification du thème
  const event = new CustomEvent('theme-updated', { 
    detail: { 
      primary: color,
      saturation: sat
    } 
  });
  window.dispatchEvent(event);
};

// Fonction pour ajuster la couleur (clair/foncé)
const adjustColor = (r, g, b, lightnessFactor, satFactor) => {
  // Ajuster la luminosité
  r = Math.min(255, Math.round(r + (255 - r) * lightnessFactor));
  g = Math.min(255, Math.round(g + (255 - g) * lightnessFactor));
  b = Math.min(255, Math.round(b + (255 - b) * lightnessFactor));
  
  // Convertir en hexa
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const saveThemePreferences = () => {
  // Enregistrer les préférences dans le localStorage
  const preferences = {
    theme: selectedTheme.value,
    primaryColor: customPrimaryColor.value,
    saturation: saturation.value
  };
  
  localStorage.setItem('themePreferences', JSON.stringify(preferences));
};

// Charger les préférences sauvegardées
const loadThemePreferences = () => {
  try {
    const saved = localStorage.getItem('themePreferences');
    if (saved) {
      const preferences = JSON.parse(saved);
      selectedTheme.value = preferences.theme || 'blue';
      customPrimaryColor.value = preferences.primaryColor || 'blue';
      saturation.value = preferences.saturation || 60;
      updateCustomTheme();
    }
  } catch (error) {
    console.error('Erreur lors du chargement des préférences de thème:', error);
  }
};

// Charger les préférences au montage
loadThemePreferences();
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