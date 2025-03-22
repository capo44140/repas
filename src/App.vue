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
              Repas générés
            </span>
          </router-link>

          <router-link 
            to="/statistics" 
            class="flex items-center px-4 py-3 mb-1 transition-colors duration-200"
            :class="{
              'text-gray-600 hover:bg-gray-100 hover:text-gray-900': !isDarkMode,
              'text-gray-400 hover:bg-gray-700 hover:text-gray-200': isDarkMode,
              'justify-center': !isSidebarOpen,
              'justify-start': isSidebarOpen
            }"
          >
            <Icon icon="ph:chart-line" class="w-6 h-6 flex-shrink-0" />
            <span 
              class="ml-3 transition-opacity duration-300 whitespace-nowrap overflow-hidden"
              :class="{ 'opacity-0 w-0': !isSidebarOpen, 'opacity-100': isSidebarOpen }"
            >
              Statistiques
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
            <Icon icon="ph:gear" class="w-6 h-6 flex-shrink-0" />
            <span 
              class="ml-3 transition-opacity duration-300 whitespace-nowrap overflow-hidden"
              :class="{ 'opacity-0 w-0': !isSidebarOpen, 'opacity-100': isSidebarOpen }"
            >
            Préférences
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

          <button 
            @click="logout"
            class="w-full flex items-center p-2 rounded-md transition-colors duration-200"
            :class="{
              'hover:bg-gray-100 text-gray-600': !isDarkMode,
              'hover:bg-gray-700 text-gray-400': isDarkMode,
              'justify-center': !isSidebarOpen,
              'justify-start': isSidebarOpen
            }"
          >
            <Icon icon="ph:sign-out" class="w-6 h-6 flex-shrink-0" />
            <span 
              class="ml-3 transition-opacity duration-300 whitespace-nowrap overflow-hidden"
              :class="{ 'opacity-0 w-0': !isSidebarOpen, 'opacity-100': isSidebarOpen }"
            >
              Déconnexion
            </span>
          </button>
        </div>
      </aside>

      <!-- Content Wrapper -->
      <div class="flex-1 flex flex-col h-screen overflow-hidden">
        <!-- Header -->
        <header 
          class="h-16 border-b flex items-center justify-between px-6 shadow-sm"
          :class="{
            'bg-white border-gray-200': !isDarkMode,
            'bg-gray-800 border-gray-700': isDarkMode
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
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </main>
        
        <!-- Composant de notification toast -->
        <ToastNotification ref="toast" />
        
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

const isSidebarOpen = ref(localStorage.getItem('sidebarOpen') !== 'false');
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

// État du mode sombre
const isDarkMode = ref(localStorage.getItem('darkMode') === 'true');
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('darkMode', isDarkMode.value);
  document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light');
};

// Définir le thème au chargement
onMounted(() => {
  if (isDarkMode.value) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
});

// Fonction pour vérifier si on est en mode desktop
const isDesktop = () => windowWidth.value >= 768;

const updateMobileState = () => {
  windowWidth.value = window.innerWidth;
  isMobile.value = !isDesktop();
};

// Chargement initial de l'état de la sidebar depuis localStorage
// S'il n'y a pas de valeur enregistrée, la sidebar est ouverte par défaut sur desktop et fermée sur mobile
const initSidebarState = () => {
  const savedState = localStorage.getItem('sidebarOpen');
  if (savedState === null) {
    // Valeur par défaut basée sur la taille de l'écran
    isSidebarOpen.value = window.innerWidth >= 768;
  } else {
    isSidebarOpen.value = savedState === 'true';
  }
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem('sidebarOpen', isSidebarOpen.value.toString());
  
  // Si on est sur mobile et que la sidebar est ouverte, ajouter une classe pour
  // empêcher le défilement du contenu en arrière-plan
  if (isMobile.value && isSidebarOpen.value) {
    document.body.classList.add('overflow-hidden');
  } else {
    document.body.classList.remove('overflow-hidden');
  }
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
  
  // Initialisation de l'état de la sidebar
  initSidebarState();
  
  // Gestion du redimensionnement
  window.addEventListener('resize', () => {
    updateMobileState();
    
    // Sur mobile, fermer automatiquement la sidebar si elle est ouverte
    if (isMobile.value && isSidebarOpen.value) {
      isSidebarOpen.value = false;
      localStorage.setItem('sidebarOpen', 'false');
    }
  });
});

// État du toast global
const toast = ref({
  show: false,
  message: '',
  title: '',
  type: 'info',
  duration: 3000,
  position: 'bottom-right',
  dismissible: true,
  shake: false
});

// Méthode pour afficher un toast global
const showToast = ({ message, title = '', type = 'info', duration = 3000, position = 'bottom-right', dismissible = true, shake = false }) => {
  toast.value = {
    show: true,
    message,
    title,
    type,
    duration,
    position,
    dismissible,
    shake
  };
};

// Gestionnaire de la fermeture du toast
const onToastDismissed = () => {
  // Vous pouvez ajouter une logique supplémentaire ici si nécessaire
};

// Méthode de déconnexion simulée
const logout = () => {
  showToast({
    message: 'Vous êtes déconnecté',
    type: 'info',
    title: 'Déconnexion'
  });
  // Dans une application réelle, vous mettriez ici la logique de déconnexion
};

// Fournir l'état et les fonctions à tous les composants enfants
provide('isDarkMode', isDarkMode);
provide('isSidebarOpen', isSidebarOpen);
provide('toggleSidebar', toggleSidebar);
provide('showToast', showToast);

const showTutorial = ref(false);
const lastVisitDate = ref(null);

const checkForNewFeatures = () => {
  const lastVersionSeen = localStorage.getItem('lastVersionSeen');
  const currentVersion = '2.0.0'; // Mettre à jour à chaque nouvelle version avec fonctionnalités
  
  if (lastVersionSeen !== currentVersion) {
    // Nouvelle version, afficher le tutoriel
    showTutorial.value = true;
    
    // Enregistrer la version actuelle
    localStorage.setItem('lastVersionSeen', currentVersion);
  }
};

const onTutorialCompleted = () => {
  showTutorial.value = false;
  showToast('Tutoriel terminé. Profitez des nouvelles fonctionnalités !', 'success');
};

const onTutorialSkipped = () => {
  showTutorial.value = false;
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
  // Vérifier si c'est la première visite depuis la mise à jour
  checkForNewFeatures();
  
  // Demander la permission pour les notifications
  requestNotificationPermission();
  
  // Ajouter des écouteurs d'événements pour le mode hors ligne
  window.addEventListener('online', syncDataWhenOnline);
  window.addEventListener('offline', handleOfflineMode);
  
  // Ajouter des écouteurs pour les préférences utilisateur
  window.addEventListener('user-preferences-updated', handlePreferencesUpdated);
});

onBeforeUnmount(() => {
  // Supprimer les écouteurs d'événements
  window.removeEventListener('online', syncDataWhenOnline);
  window.removeEventListener('offline', handleOfflineMode);
  window.removeEventListener('user-preferences-updated', handlePreferencesUpdated);
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
