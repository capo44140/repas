import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // État
  const sidebarOpen = ref(localStorage.getItem('sidebarOpen') !== 'false')
  const isDarkMode = ref(localStorage.getItem('darkMode') === 'true')
  const windowWidth = ref(window.innerWidth)
  const isMobile = ref(window.innerWidth < 768)
  const toast = ref({
    show: false,
    message: '',
    title: '',
    type: 'info',
    duration: 3000,
    position: 'bottom-right',
    dismissible: true,
    shake: false
  })
  const showTutorial = ref(false)
  const lastVersionSeen = ref(localStorage.getItem('lastVersionSeen') || '1.0.0')

  // Getters
  const isDesktop = computed(() => windowWidth.value >= 768)
  const shouldShowSidebar = computed(() => isDesktop.value || sidebarOpen.value)

  // Actions
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
    localStorage.setItem('sidebarOpen', sidebarOpen.value.toString())
    
    // Gérer le scroll sur mobile
    if (isMobile.value && sidebarOpen.value) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('darkMode', isDarkMode.value.toString())
    
    // Appliquer la classe au document
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const updateWindowSize = () => {
    windowWidth.value = window.innerWidth
    isMobile.value = windowWidth.value < 768
    
    // Fermer la sidebar sur mobile si elle est ouverte
    if (isMobile.value && sidebarOpen.value) {
      sidebarOpen.value = false
      localStorage.setItem('sidebarOpen', 'false')
      document.body.classList.remove('overflow-hidden')
    }
  }

  const showToast = (options) => {
    const defaultOptions = {
      message: '',
      title: '',
      type: 'info',
      duration: 3000,
      position: 'bottom-right',
      dismissible: true,
      shake: false
    }
    
    toast.value = {
      show: true,
      ...defaultOptions,
      ...options
    }
  }

  const hideToast = () => {
    toast.value.show = false
  }

  const checkForNewFeatures = () => {
    const currentVersion = '2.0.0'
    
    if (lastVersionSeen.value !== currentVersion) {
      showTutorial.value = true
      lastVersionSeen.value = currentVersion
      localStorage.setItem('lastVersionSeen', currentVersion)
    }
  }

  const completeTutorial = () => {
    showTutorial.value = false
    showToast({
      message: 'Tutoriel terminé. Profitez des nouvelles fonctionnalités !',
      type: 'success'
    })
  }

  const skipTutorial = () => {
    showTutorial.value = false
  }

  // Initialisation
  const initializeUI = () => {
    // Appliquer le mode sombre si activé
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    }

    // Gérer le redimensionnement de la fenêtre
    window.addEventListener('resize', updateWindowSize)
    
    // Vérifier les nouvelles fonctionnalités
    checkForNewFeatures()
  }

  const cleanup = () => {
    window.removeEventListener('resize', updateWindowSize)
  }

  return {
    // État
    sidebarOpen,
    isDarkMode,
    windowWidth,
    isMobile,
    toast,
    showTutorial,
    lastVersionSeen,
    
    // Getters
    isDesktop,
    shouldShowSidebar,
    
    // Actions
    toggleSidebar,
    toggleDarkMode,
    updateWindowSize,
    showToast,
    hideToast,
    checkForNewFeatures,
    completeTutorial,
    skipTutorial,
    initializeUI,
    cleanup
  }
})
