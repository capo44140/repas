<template>
  <div class="color-palette-demo p-6 bg-white dark:bg-gray-800 rounded-lg shadow-theme">
    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
      Palette de couleurs améliorée
    </h3>
    
    <!-- Couleurs primaires -->
    <div class="mb-6">
      <h4 class="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Couleurs primaires</h4>
      <div class="grid grid-cols-5 gap-2">
        <div 
          v-for="shade in primaryShades" 
          :key="shade"
          class="h-16 rounded-lg flex items-center justify-center text-white font-medium text-sm"
          :class="`bg-primary-${shade}`"
        >
          {{ shade }}
        </div>
      </div>
    </div>

    <!-- Couleurs de succès -->
    <div class="mb-6">
      <h4 class="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Couleurs de succès</h4>
      <div class="grid grid-cols-5 gap-2">
        <div 
          v-for="shade in successShades" 
          :key="shade"
          class="h-16 rounded-lg flex items-center justify-center text-white font-medium text-sm"
          :class="`bg-success-${shade}`"
        >
          {{ shade }}
        </div>
      </div>
    </div>

    <!-- Couleurs d'accent -->
    <div class="mb-6">
      <h4 class="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Couleurs d'accent</h4>
      <div class="grid grid-cols-5 gap-2">
        <div 
          v-for="shade in accentShades" 
          :key="shade"
          class="h-16 rounded-lg flex items-center justify-center text-white font-medium text-sm"
          :class="`bg-accent-${shade}`"
        >
          {{ shade }}
        </div>
      </div>
    </div>

    <!-- Couleurs chaudes -->
    <div class="mb-6">
      <h4 class="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Couleurs chaudes</h4>
      <div class="grid grid-cols-5 gap-2">
        <div 
          v-for="shade in warmShades" 
          :key="shade"
          class="h-16 rounded-lg flex items-center justify-center text-white font-medium text-sm"
          :class="`bg-warm-${shade}`"
        >
          {{ shade }}
        </div>
      </div>
    </div>

    <!-- Exemples d'utilisation -->
    <div class="mb-6">
      <h4 class="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Exemples d'utilisation</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="card p-4">
          <h5 class="font-medium text-primary-600 mb-2">Carte avec couleur primaire</h5>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            Cette carte utilise les nouvelles couleurs primaires améliorées.
          </p>
        </div>
        <div class="card p-4 bg-success-50 dark:bg-success-900 border-success-200 dark:border-success-700">
          <h5 class="font-medium text-success-700 dark:text-success-300 mb-2">Carte de succès</h5>
          <p class="text-success-600 dark:text-success-400 text-sm">
            Les couleurs de succès sont maintenant plus vives et attrayantes.
          </p>
        </div>
      </div>
    </div>

    <!-- Boutons d'exemple -->
    <div class="mb-6">
      <h4 class="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Boutons améliorés</h4>
      <div class="flex flex-wrap gap-3">
        <button class="btn-primary px-4 py-2 rounded-md font-medium">
          Bouton primaire
        </button>
        <button class="px-4 py-2 rounded-md font-medium bg-success-500 hover:bg-success-600 text-white transition-colors">
          Bouton succès
        </button>
        <button class="px-4 py-2 rounded-md font-medium bg-accent-500 hover:bg-accent-600 text-white transition-colors">
          Bouton accent
        </button>
        <button class="px-4 py-2 rounded-md font-medium bg-warm-500 hover:bg-warm-600 text-white transition-colors">
          Bouton chaud
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const primaryShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
const successShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
const accentShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
const warmShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
</script>

<style scoped>
.card {
  transition: all 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
}
</style>
