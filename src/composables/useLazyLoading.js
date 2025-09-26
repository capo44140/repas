import { ref, onMounted, onUnmounted, watch } from 'vue'

/**
 * Composable pour le lazy loading avec Intersection Observer
 * @param {Object} options - Options de configuration
 * @returns {Object} - État et méthodes du lazy loading
 */
export function useLazyLoading(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true,
    delay = 0
  } = options

  const isVisible = ref(false)
  const isLoading = ref(false)
  const hasError = ref(false)
  const observer = ref(null)
  const containerRef = ref(null)
  const timeoutRef = ref(null)

  /**
   * Callback appelé quand l'élément devient visible
   */
  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (delay > 0) {
          timeoutRef.value = setTimeout(() => {
            isVisible.value = true
            isLoading.value = true
          }, delay)
        } else {
          isVisible.value = true
          isLoading.value = true
        }

        if (triggerOnce) {
          observer.value?.disconnect()
        }
      }
    })
  }

  /**
   * Initialise l'Intersection Observer
   */
  const setupObserver = () => {
    if (!containerRef.value) return

    observer.value = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin
    })

    observer.value.observe(containerRef.value)
  }

  /**
   * Marque le chargement comme terminé
   */
  const markAsLoaded = () => {
    isLoading.value = false
    hasError.value = false
  }

  /**
   * Marque le chargement comme échoué
   */
  const markAsError = () => {
    isLoading.value = false
    hasError.value = true
  }

  /**
   * Réinitialise l'état
   */
  const reset = () => {
    isVisible.value = false
    isLoading.value = false
    hasError.value = false
  }

  /**
   * Nettoie les ressources
   */
  const cleanup = () => {
    if (observer.value) {
      observer.value.disconnect()
      observer.value = null
    }
    if (timeoutRef.value) {
      clearTimeout(timeoutRef.value)
      timeoutRef.value = null
    }
  }

  onMounted(() => {
    setupObserver()
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    // État
    isVisible,
    isLoading,
    hasError,
    containerRef,
    
    // Méthodes
    markAsLoaded,
    markAsError,
    reset,
    cleanup
  }
}

/**
 * Composable pour le lazy loading d'images
 * @param {string} src - URL de l'image
 * @param {Object} options - Options de configuration
 * @returns {Object} - État et méthodes du lazy loading d'image
 */
export function useLazyImage(src, options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    placeholder = null,
    errorImage = null
  } = options

  const {
    isVisible,
    isLoading,
    hasError,
    containerRef,
    markAsLoaded,
    markAsError,
    reset
  } = useLazyLoading({ threshold, rootMargin })

  const imageSrc = ref(placeholder)
  const imageRef = ref(null)

  /**
   * Charge l'image
   */
  const loadImage = () => {
    if (!src || !isVisible.value) return

    const img = new Image()
    
    img.onload = () => {
      imageSrc.value = src
      markAsLoaded()
    }
    
    img.onerror = () => {
      imageSrc.value = errorImage || placeholder
      markAsError()
    }
    
    img.src = src
  }

  /**
   * Réessaie le chargement
   */
  const retry = () => {
    reset()
    loadImage()
  }

  // Charger l'image quand elle devient visible
  watch(isVisible, (visible) => {
    if (visible) {
      loadImage()
    }
  })

  return {
    // État
    isVisible,
    isLoading,
    hasError,
    imageSrc,
    containerRef,
    imageRef,
    
    // Méthodes
    loadImage,
    retry,
    reset
  }
}

/**
 * Composable pour le lazy loading de composants
 * @param {Function} loader - Fonction qui charge le composant
 * @param {Object} options - Options de configuration
 * @returns {Object} - État et méthodes du lazy loading de composant
 */
export function useLazyComponent(loader, options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    delay = 0,
    timeout = 10000
  } = options

  const {
    isVisible,
    isLoading,
    hasError,
    containerRef,
    markAsLoaded,
    markAsError,
    reset
  } = useLazyLoading({ threshold, rootMargin, delay })

  const component = ref(null)
  const loadTimeout = ref(null)

  /**
   * Charge le composant
   */
  const loadComponent = async () => {
    if (!isVisible.value || component.value) return

    try {
      isLoading.value = true
      
      // Timeout de sécurité
      loadTimeout.value = setTimeout(() => {
        markAsError()
      }, timeout)

      const loadedComponent = await loader()
      component.value = loadedComponent
      markAsLoaded()
      
      if (loadTimeout.value) {
        clearTimeout(loadTimeout.value)
        loadTimeout.value = null
      }
    } catch (error) {
      console.error('Erreur lors du chargement du composant:', error)
      markAsError()
      
      if (loadTimeout.value) {
        clearTimeout(loadTimeout.value)
        loadTimeout.value = null
      }
    }
  }

  /**
   * Réessaie le chargement
   */
  const retry = () => {
    reset()
    component.value = null
    loadComponent()
  }

  // Charger le composant quand il devient visible
  watch(isVisible, (visible) => {
    if (visible) {
      loadComponent()
    }
  })

  return {
    // État
    isVisible,
    isLoading,
    hasError,
    component,
    containerRef,
    
    // Méthodes
    loadComponent,
    retry,
    reset
  }
}

/**
 * Composable pour le lazy loading de données
 * @param {Function} fetcher - Fonction qui récupère les données
 * @param {Object} options - Options de configuration
 * @returns {Object} - État et méthodes du lazy loading de données
 */
export function useLazyData(fetcher, options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    delay = 0,
    immediate = false
  } = options

  const {
    isVisible,
    isLoading,
    hasError,
    containerRef,
    markAsLoaded,
    markAsError,
    reset
  } = useLazyLoading({ threshold, rootMargin, delay })

  const data = ref(null)
  const error = ref(null)

  /**
   * Charge les données
   */
  const loadData = async () => {
    if (!isVisible.value && !immediate) return

    try {
      isLoading.value = true
      error.value = null
      
      const result = await fetcher()
      data.value = result
      markAsLoaded()
    } catch (err) {
      error.value = err
      markAsError()
    }
  }

  /**
   * Réessaie le chargement
   */
  const retry = () => {
    reset()
    data.value = null
    error.value = null
    loadData()
  }

  // Charger les données quand l'élément devient visible
  watch(isVisible, (visible) => {
    if (visible) {
      loadData()
    }
  })

  // Charger immédiatement si demandé
  if (immediate) {
    loadData()
  }

  return {
    // État
    isVisible,
    isLoading,
    hasError,
    data,
    error,
    containerRef,
    
    // Méthodes
    loadData,
    retry,
    reset
  }
}
