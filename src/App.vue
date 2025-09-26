<template>
  <div class="flex h-screen"
    :class="{
      'bg-gray-50 text-gray-900': !isDarkMode,
      'bg-gray-900 text-gray-100': isDarkMode
    }"
  >
    <NetworkStatus position="top-0 left-0 right-0" />
    
    <div v-if="isLoginVisible" class="w-full">
      <!-- ... existing code for login ... -->
    </div>
    <div v-else class="flex w-full h-screen overflow-hidden">
      <!-- Sidebar -->
      <aside 
        class="flex flex-col border-r transition-all duration-300 ease-in-out h-screen overflow-hidden"
        :class="{
          'w-64': isSidebarOpen,
          'w-16': !isSidebarOpen,
          'bg-white border-gray-200': !isDarkMode,
          'bg-gray-800 border-gray-700': isDarkMode
        }"
      >
        <!-- Logo -->
        <div class="p-4 flex items-center h-16">
          <img src="/favicon.ico" alt="Logo RepasFork" class="h-8 w-8 flex-shrink-0" />
          <h1 
            class="ml-3 font-semibold text-lg transition-opacity duration-300"
            :class="{ 'opacity-0 w-0': !isSidebarOpen, 'opacity-100': isSidebarOpen }"
          >
            RepasFork
          </h1>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 pt-4 overflow-y-auto">
          <router-link 
            to="/" 
            class="flex items-center px-4 py-3 mb-1 transition-colors duration-200"
            :class="{
              'text-gray-600 hover:bg-gray-100 hover:text-gray-900': !isDarkMode,
              'text-gray-400 hover:bg-gray-700 hover:text-gray-200': isDarkMode,
              'justify-center': !isSidebarOpen,
              'justify-start': isSidebarOpen
            }"
          >
            <Icon icon="ph:house" class="w-6 h-6 flex-shrink-0" />
            <span 
              class="ml-3 transition-opacity duration-300 whitespace-nowrap overflow-hidden"
              :class="{ 'opacity-0 w-0': !isSidebarOpen, 'opacity-100': isSidebarOpen }"
            >
              Accueil
            </span>
          </router-link>

          <router-link 
            to="/generated-meals" 
            class="flex items-center px-4 py-3 mb-1 transition-colors duration-200"
            :class="{
              'text-gray-600 hover:bg-gray-100 hover:text-gray-900': !isDarkMode,
              'text-gray-400 hover:bg-gray-700 hover:text-gray-200': isDarkMode,
              'justify-center': !isSidebarOpen,
              'justify-start': isSidebarOpen
            }"
          >
            <Icon icon="ph:fork-knife" class="w-6 h-6 flex-shrink-0" />
            <span 
              class="ml-3 transition-opacity duration-300 whitespace-nowrap overflow-hidden"
              :class="{ 'opacity-0 w-0': !isSidebarOpen, 'opacity-100': isSidebarOpen }"
            >
              Recherche Repas
            </span>
          </router-link>

          <!-- Nouveau lien pour le partage -->
          <router-link 
            to="/share-recipes" 
            class="flex items-center px-4 py-3 mb-1 transition-colors duration-200"
            :class="{
              'text-gray-600 hover:bg-gray-100 hover:text-gray-900': !isDarkMode,
              'text-gray-400 hover:bg-gray-700 hover:text-gray-200': isDarkMode,
              'justify-center': !isSidebarOpen,
              'justify-start': isSidebarOpen
            }"
          >
            <Icon icon="ph:share-network" class="w-6 h-6 flex-shrink-0" />
            <span 
              class="ml-3 transition-opacity duration-300 whitespace-nowrap overflow-hidden"
              :class="{ 'opacity-0 w-0': !isSidebarOpen, 'opacity-100': isSidebarOpen }"
            >
              Partager
            </span>
          </router-link>

          <router-link 
            to="/generator" 
            class="flex items-center px-4 py-3 mb-1 transition-colors duration-200"
            :class="{
              'text-gray-600 hover:bg-gray-100 hover:text-gray-900': !isDarkMode,
              'text-gray-400 hover:bg-gray-700 hover:text-gray-200': isDarkMode,
              'justify-center': !isSidebarOpen,
              'justify-start': isSidebarOpen
            }"
          >
            <Icon icon="ph:magic-wand" class="w-6 h-6 flex-shrink-0" />
            <span 
              class="ml-3 transition-opacity duration-300 whitespace-nowrap overflow-hidden"
              :class="{ 'opacity-0 w-0': !isSidebarOpen, 'opacity-100': isSidebarOpen }"
            >
              Générateur Repas
            </span>
          </router-link>

          <router-link 
            to="/admin" 
            class="flex items-center px-4 py-3 mb-1 transition-colors duration-200"
            :class="{
              'text-gray-600 hover:bg-gray-100 hover:text-gray-900': !isDarkMode,
              'text-gray-400 hover:bg-gray-700 hover:text-gray-200': isDarkMode,
              'justify-center': !isSidebarOpen,
              'justify-start': isSidebarOpen
            }"
          >
            <Icon icon="ph:gear" class="w-6 h-6 flex-shrink-0" />
            <span 
              class="ml-3 transition-opacity duration-300 whitespace-nowrap overflow-hidden"
              :class="{ 'opacity-0 w-0': !isSidebarOpen, 'opacity-100': isSidebarOpen }"
            >
              Administration
            </span>
          </router-link>

          <!-- Lien vers les préférences utilisateur -->
          <router-link 
            to="/preferences" 
            class="flex items-center px-4 py-3 mb-1 transition-colors duration-200"
            :class="{
              'text-gray-600 hover:bg-gray-100 hover:text-gray-900': !isDarkMode,
              'text-gray-400 hover:bg-gray-700 hover:text-gray-200': isDarkMode,
              'justify-center': !isSidebarOpen,
              'justify-start': isSidebarOpen
            }"
          >
            <Icon icon="ph:user-circle" class="w-6 h-6 flex-shrink-0" />
            <span 
              class="ml-3 transition-opacity duration-300 whitespace-nowrap overflow-hidden"
              :class="{ 'opacity-0 w-0': !isSidebarOpen, 'opacity-100': isSidebarOpen }"
            >
              Préférences
            </span>
          </router-link>
          
          <!-- Lien vers la liste de courses -->
          <router-link 
            to="/shopping-list" 
            class="flex items-center px-4 py-3 mb-1 transition-colors duration-200"
            :class="{
              'text-gray-600 hover:bg-gray-100 hover:text-gray-900': !isDarkMode,
              'text-gray-400 hover:bg-gray-700 hover:text-gray-200': isDarkMode,
              'justify-center': !isSidebarOpen,
              'justify-start': isSidebarOpen
            }"
          >
            <Icon icon="ph:shopping-cart" class="w-6 h-6 flex-shrink-0" />
            <span 
              class="ml-3 transition-opacity duration-300 whitespace-nowrap overflow-hidden"
              :class="{ 'opacity-0 w-0': !isSidebarOpen, 'opacity-100': isSidebarOpen }"
            >
              Liste de courses
            </span>
          </router-link>
        </nav>

        <!-- Actions -->
        <div class="p-4 border-t"
          :class="{
            'border-gray-200': !isDarkMode,
            'border-gray-700': isDarkMode
          }"
        >
          <button 
            @click="toggleDarkMode"
            class="w-full flex items-center p-2 rounded-md transition-colors duration-200 mb-2"
            :class="{
              'hover:bg-gray-100 text-gray-600': !isDarkMode,
              'hover:bg-gray-700 text-gray-400': isDarkMode,
              'justify-center': !isSidebarOpen,
              'justify-start': isSidebarOpen
            }"
          >
            <Icon 
              :icon="isDarkMode ? 'ph:sun' : 'ph:moon'" 
              class="w-6 h-6 flex-shrink-0" 
            />
            <span 
              class="ml-3 transition-opacity duration-300 whitespace-nowrap overflow-hidden"
              :class="{ 'opacity-0 w-0': !isSidebarOpen, 'opacity-100': isSidebarOpen }"
            >
              {{ isDarkMode ? 'Mode clair' : 'Mode sombre' }}
            </span>
          </button>

        </div>
      </aside>

      <!-- Content Wrapper -->
      <div class="flex-1 flex flex-col h-screen overflow-hidden">
        <!-- Header -->
        <header 
          class="h-16 border-b flex items-center justify-between px-6 shadow-sm sticky top-0 z-10 bg-header"
          :class="{
            'border-gray-200': !isDarkMode,
            'border-gray-700': isDarkMode
          }"
        >
          <div class="flex items-center">
            <button 
              @click="toggleSidebar"
              class="rounded-md p-2 -ml-2 transition-colors duration-200 flex items-center justify-center"
              :class="{
                'hover:bg-gray-100 text-gray-600': !isDarkMode,
                'hover:bg-gray-700 text-gray-400': isDarkMode
              }"
              aria-label="Toggle sidebar"
            >
              <Icon 
                :icon="isSidebarOpen ? 'ph:caret-left' : 'ph:caret-right'" 
                class="w-5 h-5" 
              />
            </button>
          </div>
          <div class="flex items-center space-x-4">
            <ThemeSwitcher />
            <span 
              class="px-3 py-1 rounded-full text-xs font-medium"
              :class="{
                'bg-primary-100 text-primary-800': !isDarkMode,
                'bg-primary-900 text-primary-200': isDarkMode
              }"
            >
              v1.0.0
            </span>
          </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1 overflow-auto p-6">
          <RouterViewWrapper />
        </main>
        
        <!-- Composant de notification toast -->
        <ToastNotification 
          v-model:show="toast.show"
          :message="toast.message"
          :title="toast.title"
          :type="toast.type"
          :duration="toast.duration"
          :position="toast.position"
          :dismissible="toast.dismissible"
          :shake="toast.shake"
          @dismissed="onToastDismissed"
        />
        
        <!-- Tutoriel d'onboarding pour les nouvelles fonctionnalités -->
        <OnboardingTutorial 
          v-if="showTutorial"
          tutorial-id="new-features-2023"
          @tutorial-completed="onTutorialCompleted"
          @tutorial-skipped="onTutorialSkipped"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, provide, computed, onBeforeUnmount } from 'vue';
import { Icon } from '@iconify/vue';
import { useRouter, useRoute } from 'vue-router';
import ThemeSwitcher from './components/ThemeSwitcher.vue';
import NetworkStatus from './components/NetworkStatus.vue';
import OnboardingTutorial from './components/OnboardingTutorial.vue';
import NotificationService from './services/NotificationService';
import { useDarkMode } from './composables/useDarkMode';
import { useUIStore } from './stores/useUIStore';
import { useMealsStore } from './stores/useMealsStore';
import { usePreferencesStore } from './stores/usePreferencesStore';
import { useMenuStore } from './stores/useMenuStore';

// Utiliser les stores Pinia
const uiStore = useUIStore();
const mealsStore = useMealsStore();
const preferencesStore = usePreferencesStore();
const menuStore = useMenuStore();

// Utiliser le composable pour la gestion des thèmes (compatibilité)
const { isDarkMode, toggleDarkMode } = useDarkMode();

// Variables réactives pour la compatibilité
const isSidebarOpen = computed(() => uiStore.sidebarOpen);
const isMobile = computed(() => uiStore.isMobile);
const route = useRoute();

// Menu items
const menuItems = [
  { to: '/', icon: 'ph:house', text: 'Tableau de bord' },
  { to: '/generated-meals', icon: 'ph:fork-knife', text: 'Repas générés' },
  { to: '/meal-suggestions', icon: 'ph:lightbulb', text: 'Propositions' },
  { to: '/statistics', icon: 'ph:chart-line', text: 'Statistiques' },
  { to: '/admin', icon: 'ph:gear', text: 'Administration' },
  { to: '/shopping-list', icon: 'ph:shopping-cart', text: 'Liste de courses' }
];

// Fournir les stores aux composants enfants
provide('uiStore', uiStore);
provide('mealsStore', mealsStore);
provide('preferencesStore', preferencesStore);
provide('menuStore', menuStore);

// Fonctions de compatibilité
const toggleSidebar = () => {
  uiStore.toggleSidebar();
};

const closeSidebarOnMobile = () => {
  if (!uiStore.isDesktop) {
    uiStore.sidebarOpen = false;
  }
};

onMounted(() => {
  // Initialiser tous les stores
  uiStore.initializeUI();
  mealsStore.initializeStore();
  preferencesStore.initializePreferences();
  menuStore.initializeMenuStore();
});

// Utiliser le toast du store UI
const toast = computed(() => uiStore.toast);

// Méthode pour afficher un toast global
const showToast = (options) => {
  uiStore.showToast(options);
};

// Gestionnaire de la fermeture du toast
const onToastDismissed = () => {
  uiStore.hideToast();
};

// Fournir l'état et les fonctions à tous les composants enfants
provide('isDarkMode', isDarkMode);
provide('isSidebarOpen', isSidebarOpen);
provide('toggleSidebar', toggleSidebar);
provide('showToast', showToast);

// Utiliser le tutoriel du store UI
const showTutorial = computed(() => uiStore.showTutorial);

const onTutorialCompleted = () => {
  uiStore.completeTutorial();
};

const onTutorialSkipped = () => {
  uiStore.skipTutorial();
};

const requestNotificationPermission = async () => {
  const permission = await NotificationService.requestPermission();
  if (permission === 'granted') {
    // Planifier un rappel hebdomadaire pour la planification des repas (vendredi à 18h)
    NotificationService.scheduleWeeklyMenuReminder(5, 18, 0);
  }
};

const syncDataWhenOnline = () => {
  // Vérifier s'il y a des données à synchroniser
  const pendingChanges = localStorage.getItem('pendingChanges');
  
  if (pendingChanges) {
    try {
      const changes = JSON.parse(pendingChanges);
      
      // Ici, implémenter la logique de synchronisation
      // ...
      
      showToast('Données synchronisées avec succès', 'success');
      localStorage.removeItem('pendingChanges');
    } catch (error) {
      console.error('Erreur lors de la synchronisation des données:', error);
      showToast('Erreur lors de la synchronisation des données', 'error');
    }
  }
};

const handleOfflineMode = () => {
  // Activer le stockage local pour les modifications
  // ...
};

const handlePreferencesUpdated = (event) => {
  const preferences = event.detail;
  
  // Appliquer les préférences à l'application
  if (preferences.enableReminders && preferences.reminderTime) {
    // Configurer les rappels selon les préférences
    const [hours, minutes] = preferences.reminderTime.split(':').map(Number);
    
    // Planifier le rappel hebdomadaire avec l'heure choisie par l'utilisateur
    NotificationService.scheduleWeeklyMenuReminder(5, hours, minutes);
  }
  
  showToast('Préférences mises à jour', 'success');
};

onMounted(() => {
  // Demander la permission pour les notifications
  requestNotificationPermission();
  
  // Ajouter des écouteurs d'événements pour le mode hors ligne
  window.addEventListener('online', syncDataWhenOnline);
  window.addEventListener('offline', handleOfflineMode);
  
  // Ajouter des écouteurs pour les préférences utilisateur
  window.addEventListener('user-preferences-updated', handlePreferencesUpdated);
});

onBeforeUnmount(() => {
  // Nettoyer les stores
  uiStore.cleanup();
  
  // Supprimer les écouteurs d'événements
  window.removeEventListener('online', syncDataWhenOnline);
  window.removeEventListener('offline', handleOfflineMode);
  window.removeEventListener('user-preferences-updated', handlePreferencesUpdated);
});
</script>

<style>
:root {
  --primary-50: #f0f9ff;
  --primary-100: #e0f2fe;
  --primary-200: #bae6fd;
  --primary-300: #7dd3fc;
  --primary-400: #38bdf8;
  --primary-500: #0ea5e9;
  --primary-600: #0284c7;
  --primary-700: #0369a1;
  --primary-800: #075985;
  --primary-900: #0c4a6e;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

#app {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Transitions pour le sidebar */
.sidebar-enter-active,
.sidebar-leave-active {
  transition: width 0.3s ease;
}

.sidebar-enter-from,
.sidebar-leave-to {
  width: 4rem; /* 16px */
}

.sidebar-enter-to,
.sidebar-leave-from {
  width: 16rem; /* 64px */
}

/* Transitions pour le texte du sidebar */
.text-enter-active,
.text-leave-active {
  transition: opacity 0.2s ease, width 0.2s ease;
  transition-delay: 0.1s;
}

.text-enter-from,
.text-leave-to {
  opacity: 0;
  width: 0;
}
</style>
