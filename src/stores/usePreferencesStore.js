import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePreferencesStore = defineStore('preferences', () => {
  // État
  const preferences = ref({
    enableReminders: false,
    reminderTime: '18:00',
    reminderDays: [5], // Vendredi par défaut
    enableNotifications: false,
    defaultSeason: 'automne',
    defaultMealType: 'midi',
    language: 'fr',
    theme: 'system', // system, light, dark
    showNutritionInfo: true,
    showPrepTime: true,
    showDifficulty: true,
    showCost: true,
    autoGenerateShoppingList: true,
    emailNotifications: false,
    weeklyMenuReminder: true,
    seasonalRecommendations: true,
    dietaryRestrictions: [],
    allergies: [],
    favoriteIngredients: [],
    dislikedIngredients: []
  })

  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isReminderEnabled = computed(() => preferences.value.enableReminders)
  const reminderTimeFormatted = computed(() => {
    const [hours, minutes] = preferences.value.reminderTime.split(':')
    return `${hours}h${minutes}`
  })

  const hasDietaryRestrictions = computed(() => 
    preferences.value.dietaryRestrictions.length > 0
  )

  const hasAllergies = computed(() => 
    preferences.value.allergies.length > 0
  )

  const dietaryPreferences = computed(() => ({
    restrictions: preferences.value.dietaryRestrictions,
    allergies: preferences.value.allergies,
    favoriteIngredients: preferences.value.favoriteIngredients,
    dislikedIngredients: preferences.value.dislikedIngredients
  }))

  // Actions
  const loadPreferences = () => {
    try {
      const saved = localStorage.getItem('userPreferences')
      if (saved) {
        const parsed = JSON.parse(saved)
        preferences.value = { ...preferences.value, ...parsed }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des préférences:', error)
      error.value = 'Impossible de charger les préférences'
    }
  }

  const savePreferences = async (newPreferences = null) => {
    loading.value = true
    error.value = null

    try {
      if (newPreferences) {
        preferences.value = { ...preferences.value, ...newPreferences }
      }

      localStorage.setItem('userPreferences', JSON.stringify(preferences.value))
      
      // Émettre un événement personnalisé pour notifier les autres composants
      window.dispatchEvent(new CustomEvent('user-preferences-updated', {
        detail: preferences.value
      }))

      return preferences.value
    } catch (err) {
      error.value = 'Impossible de sauvegarder les préférences'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updatePreference = (key, value) => {
    preferences.value[key] = value
    savePreferences()
  }

  const addDietaryRestriction = (restriction) => {
    if (!preferences.value.dietaryRestrictions.includes(restriction)) {
      preferences.value.dietaryRestrictions.push(restriction)
      savePreferences()
    }
  }

  const removeDietaryRestriction = (restriction) => {
    const index = preferences.value.dietaryRestrictions.indexOf(restriction)
    if (index > -1) {
      preferences.value.dietaryRestrictions.splice(index, 1)
      savePreferences()
    }
  }

  const addAllergy = (allergy) => {
    if (!preferences.value.allergies.includes(allergy)) {
      preferences.value.allergies.push(allergy)
      savePreferences()
    }
  }

  const removeAllergy = (allergy) => {
    const index = preferences.value.allergies.indexOf(allergy)
    if (index > -1) {
      preferences.value.allergies.splice(index, 1)
      savePreferences()
    }
  }

  const addFavoriteIngredient = (ingredient) => {
    if (!preferences.value.favoriteIngredients.includes(ingredient)) {
      preferences.value.favoriteIngredients.push(ingredient)
      savePreferences()
    }
  }

  const removeFavoriteIngredient = (ingredient) => {
    const index = preferences.value.favoriteIngredients.indexOf(ingredient)
    if (index > -1) {
      preferences.value.favoriteIngredients.splice(index, 1)
      savePreferences()
    }
  }

  const addDislikedIngredient = (ingredient) => {
    if (!preferences.value.dislikedIngredients.includes(ingredient)) {
      preferences.value.dislikedIngredients.push(ingredient)
      savePreferences()
    }
  }

  const removeDislikedIngredient = (ingredient) => {
    const index = preferences.value.dislikedIngredients.indexOf(ingredient)
    if (index > -1) {
      preferences.value.dislikedIngredients.splice(index, 1)
      savePreferences()
    }
  }

  const resetPreferences = () => {
    preferences.value = {
      enableReminders: false,
      reminderTime: '18:00',
      reminderDays: [5],
      enableNotifications: false,
      defaultSeason: 'automne',
      defaultMealType: 'midi',
      language: 'fr',
      theme: 'system',
      showNutritionInfo: true,
      showPrepTime: true,
      showDifficulty: true,
      showCost: true,
      autoGenerateShoppingList: true,
      emailNotifications: false,
      weeklyMenuReminder: true,
      seasonalRecommendations: true,
      dietaryRestrictions: [],
      allergies: [],
      favoriteIngredients: [],
      dislikedIngredients: []
    }
    savePreferences()
  }

  const exportPreferences = () => {
    const dataStr = JSON.stringify(preferences.value, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = 'preferences-repas.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const importPreferences = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result)
          preferences.value = { ...preferences.value, ...imported }
          savePreferences()
          resolve(preferences.value)
        } catch (error) {
          reject(new Error('Fichier de préférences invalide'))
        }
      }
      reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'))
      reader.readAsText(file)
    })
  }

  const clearError = () => {
    error.value = null
  }

  // Initialisation
  const initializePreferences = () => {
    loadPreferences()
  }

  return {
    // État
    preferences,
    loading,
    error,
    
    // Getters
    isReminderEnabled,
    reminderTimeFormatted,
    hasDietaryRestrictions,
    hasAllergies,
    dietaryPreferences,
    
    // Actions
    loadPreferences,
    savePreferences,
    updatePreference,
    addDietaryRestriction,
    removeDietaryRestriction,
    addAllergy,
    removeAllergy,
    addFavoriteIngredient,
    removeFavoriteIngredient,
    addDislikedIngredient,
    removeDislikedIngredient,
    resetPreferences,
    exportPreferences,
    importPreferences,
    clearError,
    initializePreferences
  }
})
