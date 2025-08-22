<template>
  <div class="theme-demo p-6 rounded-lg shadow-theme" :class="demoClasses">
    <h2 class="text-2xl font-bold mb-4 text-primary-600">
      Démonstration du Thème
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Couleurs primaires -->
      <div class="space-y-3">
        <h3 class="text-lg font-semibold">Couleurs primaires</h3>
        <div class="grid grid-cols-5 gap-2">
          <div
            v-for="i in 10"
            :key="i"
            class="w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold"
            :class="`bg-primary-${(i - 1) * 100}`"
            :style="{ color: i > 5 ? 'white' : 'black' }"
          >
            {{ (i - 1) * 100 }}
          </div>
        </div>
      </div>

      <!-- Éléments d'interface -->
      <div class="space-y-3">
        <h3 class="text-lg font-semibold">Éléments d'interface</h3>
        <div class="space-y-2">
          <button
            class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors"
          >
            Bouton primaire
          </button>
          <button
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
          >
            Bouton secondaire
          </button>
          <input
            type="text"
            placeholder="Champ de saisie"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Informations sur le thème actuel -->
      <div class="md:col-span-2 p-4 rounded-lg" :class="infoClasses">
        <h3 class="text-lg font-semibold mb-3">Informations sur le thème</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span class="font-medium">Thème actuel:</span>
            <span class="ml-2 text-primary-600">{{ currentTheme }}</span>
          </div>
          <div>
            <span class="font-medium">Couleur primaire:</span>
            <span class="ml-2 text-primary-600">{{ customPrimaryColor }}</span>
          </div>
          <div>
            <span class="font-medium">Saturation:</span>
            <span class="ml-2 text-primary-600">{{ saturation }}%</span>
          </div>
          <div>
            <span class="font-medium">Mode:</span>
            <span class="ml-2 text-primary-600">{{
              isDarkMode ? "Sombre" : "Clair"
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Sélecteur de thème rapide -->
    <div class="mt-6 p-4 rounded-lg" :class="selectorClasses">
      <h3 class="text-lg font-semibold mb-3">Changement rapide de thème</h3>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="theme in themes"
          :key="theme.id"
          @click="quickThemeChange(theme.id)"
          class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
          :class="
            currentTheme === theme.id
              ? 'bg-primary-500 text-white'
              : themeButtonClasses
          "
        >
          {{ theme.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useDarkMode } from "../composables/useDarkMode";

const {
  isDarkMode,
  currentTheme,
  customPrimaryColor,
  saturation,
  themes,
  applyTheme,
} = useDarkMode();

const demoClasses = computed(() => ({
  "bg-white border border-gray-200": !isDarkMode.value,
  "bg-gray-900 border border-gray-700": isDarkMode.value,
}));

const infoClasses = computed(() => ({
  "bg-gray-50": !isDarkMode.value,
  "bg-gray-800": isDarkMode.value,
}));

const selectorClasses = computed(() => ({
  "bg-gray-50": !isDarkMode.value,
  "bg-gray-800": isDarkMode.value,
}));

const themeButtonClasses = computed(() => ({
  "bg-gray-200 hover:bg-gray-300 text-gray-800": !isDarkMode.value,
  "bg-gray-700 hover:bg-gray-600 text-gray-200": isDarkMode.value,
}));

const quickThemeChange = (themeId) => {
  applyTheme(themeId);
};
</script>

<style scoped>
.theme-demo {
  transition: all 0.3s ease;
}
</style>
