<template>
  <div class="flex h-screen bg-white transition-colors duration-300">
    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed md:static top-0 left-0 z-40 h-screen transition-transform',
        'bg-white border-r border-gray-200',
        'no-print',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        isSidebarOpen ? 'w-64' : 'w-16 md:w-64'
      ]"
    >
      <!-- Logo ou titre -->
      <div class="p-4 border-b border-gray-200">
        <router-link to="/" class="flex items-center">
          <Icon 
            icon="ph:fork-knife" 
            class="w-8 h-8 text-primary-500"
            alt="Logo" 
          />
          <span 
            v-if="isSidebarOpen" 
            class="ml-2 text-xl font-semibold text-gray-900">
            Repas
          </span>
        </router-link>
      </div>
      <div class="p-4">
        <nav class="space-y-1">
          <router-link 
            v-for="(item, index) in menuItems"
            :key="index"
            :to="item.to"
            class="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            :class="{ 
              'justify-center': !isSidebarOpen,
              'bg-gray-100': $route.path === item.to
            }"
            @click="closeSidebarOnMobile"
          >
            <Icon :icon="item.icon" class="w-6 h-6 flex-shrink-0" />
            <span class="ml-2" :class="{ 'md:hidden': !isSidebarOpen }">{{ item.text }}</span>
          </router-link>
        </nav>
      </div>
    </aside>

    <!-- Contenu principal avec header -->
    <div class="flex flex-col flex-1">
      <!-- Header -->
      <header class="h-16 bg-white border-b border-gray-200 shadow-sm no-print">
        <div class="flex items-center justify-between h-full px-4">
          <div class="flex items-center">
            <button 
              @click="toggleSidebar"
              class="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors md:hidden"
            >
              <Icon icon="ph:list" class="w-6 h-6" />
            </button>
            <h1 class="text-lg sm:text-xl font-semibold text-gray-900 ml-2 md:ml-4 truncate">
              <span class="hidden md:inline">Application de Gestion des</span> Repas
            </h1>
          </div>
        </div>
      </header>

      <!-- Contenu de la page -->
      <main class="flex-1 overflow-auto bg-gray-50 text-gray-900">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- Overlay pour mobile -->
    <div 
      v-if="isSidebarOpen && isMobile" 
      class="fixed inset-0 bg-black bg-opacity-50 z-30"
      @click="toggleSidebar">
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, provide, computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useRouter, useRoute } from 'vue-router';

const isSidebarOpen = ref(true);
const windowWidth = ref(0);
const isMobile = ref(false);
const route = useRoute();

// Menu items
const menuItems = [
  { to: '/', icon: 'ph:house', text: 'Tableau de bord' },
  { to: '/generated-meals', icon: 'ph:fork-knife', text: 'Repas générés' },
  { to: '/meal-suggestions', icon: 'ph:lightbulb', text: 'Propositions' },
  { to: '/statistics', icon: 'ph:chart-line', text: 'Statistiques' },
  { to: '/admin', icon: 'ph:gear', text: 'Administration' }
];

provide('isSidebarOpen', isSidebarOpen);

// Fonction pour vérifier si on est en mode desktop
const isDesktop = () => windowWidth.value >= 768;

const updateMobileState = () => {
  windowWidth.value = window.innerWidth;
  isMobile.value = !isDesktop();
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Fournir la fonction toggleSidebar aux composants enfants
provide('toggleSidebar', toggleSidebar);

const closeSidebarOnMobile = () => {
  if (!isDesktop()) {
    isSidebarOpen.value = false;
  }
};

onMounted(() => {
  // Initialiser la largeur de la fenêtre
  updateMobileState();
  
  // Initialisation de l'état de la sidebar en fonction de la taille de l'écran
  isSidebarOpen.value = isDesktop();
  
  // Gestion du redimensionnement
  window.addEventListener('resize', () => {
    updateMobileState();
    if (isDesktop()) {
      // Sur desktop, on garde la sidebar ouverte par défaut
      if (!isSidebarOpen.value) {
        isSidebarOpen.value = true;
      }
    } else {
      // Sur mobile, on ferme la sidebar
      isSidebarOpen.value = false;
    }
  });
});
</script>

<style>
:root {
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-200: #bfdbfe;
  --primary-300: #93c5fd;
  --primary-400: #60a5fa;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-800: #1e40af;
  --primary-900: #1e3a8a;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
