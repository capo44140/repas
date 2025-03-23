import { ref, watch } from 'vue';

const isDarkMode = ref(false);

// Vérifier la préférence initiale
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
isDarkMode.value = prefersDark;

// Écouter les changements de préférence système
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  isDarkMode.value = e.matches;
});

// Surveiller les changements de mode sombre
watch(isDarkMode, (newValue) => {
  if (newValue) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, { immediate: true });

export function useDarkMode() {
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
  };

  return {
    isDarkMode,
    toggleDarkMode
  };
} 