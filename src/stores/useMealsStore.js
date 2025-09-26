import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { neonService } from '../services/neon'
import repasService from '../services/repasService'

export const useMealsStore = defineStore('meals', () => {
  // État
  const meals = ref([])
  const loading = ref(false)
  const error = ref(null)
  const lastFetch = ref(null)
  const searchFilters = ref({
    text: '',
    saison: '',
    type: '',
    maxPrepTime: null,
    difficulte: '',
    maxCalories: null,
    includedIngredients: [],
    excludedIngredients: []
  })

  // Getters (computed)
  const totalMeals = computed(() => meals.value.length)
  
  const mealsBySeason = computed(() => {
    const grouped = {}
    meals.value.forEach(meal => {
      if (!grouped[meal.saison]) {
        grouped[meal.saison] = []
      }
      grouped[meal.saison].push(meal)
    })
    return grouped
  })

  const mealsByType = computed(() => {
    const grouped = {}
    meals.value.forEach(meal => {
      if (!grouped[meal.type]) {
        grouped[meal.type] = []
      }
      grouped[meal.type].push(meal)
    })
    return grouped
  })

  const filteredMeals = computed(() => {
    let filtered = [...meals.value]

    // Filtre par texte
    if (searchFilters.value.text) {
      const searchText = searchFilters.value.text.toLowerCase()
      filtered = filtered.filter(meal => 
        meal.nom.toLowerCase().includes(searchText) ||
        meal.ingredients?.some(ingredient => 
          ingredient.toLowerCase().includes(searchText)
        )
      )
    }

    // Filtre par saison
    if (searchFilters.value.saison) {
      filtered = filtered.filter(meal => meal.saison === searchFilters.value.saison)
    }

    // Filtre par type
    if (searchFilters.value.type) {
      filtered = filtered.filter(meal => meal.type === searchFilters.value.type)
    }

    // Filtre par temps de préparation
    if (searchFilters.value.maxPrepTime) {
      filtered = filtered.filter(meal => 
        meal.temps_preparation && meal.temps_preparation <= searchFilters.value.maxPrepTime
      )
    }

    // Filtre par difficulté
    if (searchFilters.value.difficulte) {
      filtered = filtered.filter(meal => meal.difficulte === searchFilters.value.difficulte)
    }

    // Filtre par calories
    if (searchFilters.value.maxCalories) {
      filtered = filtered.filter(meal => 
        meal.calories && meal.calories <= searchFilters.value.maxCalories
      )
    }

    // Filtre par ingrédients inclus
    if (searchFilters.value.includedIngredients.length > 0) {
      filtered = filtered.filter(meal => 
        searchFilters.value.includedIngredients.every(ingredient =>
          meal.ingredients?.some(mealIngredient => 
            mealIngredient.toLowerCase().includes(ingredient.toLowerCase())
          )
        )
      )
    }

    // Filtre par ingrédients exclus
    if (searchFilters.value.excludedIngredients.length > 0) {
      filtered = filtered.filter(meal => 
        !searchFilters.value.excludedIngredients.some(ingredient =>
          meal.ingredients?.some(mealIngredient => 
            mealIngredient.toLowerCase().includes(ingredient.toLowerCase())
          )
        )
      )
    }

    return filtered
  })

  const randomMeal = computed(() => {
    if (meals.value.length === 0) return null
    const randomIndex = Math.floor(Math.random() * meals.value.length)
    return meals.value[randomIndex]
  })

  // Actions
  const fetchMeals = async (forceRefresh = false) => {
    // Vérifier si on a déjà des données récentes (cache de 5 minutes)
    if (!forceRefresh && lastFetch.value && Date.now() - lastFetch.value < 5 * 60 * 1000) {
      return meals.value
    }

    loading.value = true
    error.value = null

    try {
      // Essayer d'abord avec Neon, puis fallback sur l'API
      let fetchedMeals = []
      
      try {
        fetchedMeals = await neonService.getAllRepas()
      } catch (neonError) {
        console.warn('Erreur Neon, fallback sur API:', neonError)
        fetchedMeals = await repasService.getAllRepas()
      }

      meals.value = fetchedMeals
      lastFetch.value = Date.now()
      
      // Sauvegarder en cache local
      localStorage.setItem('meals_cache', JSON.stringify({
        data: fetchedMeals,
        timestamp: lastFetch.value
      }))

      return fetchedMeals
    } catch (err) {
      error.value = err.message
      console.error('Erreur lors du chargement des repas:', err)
      
      // Essayer de charger depuis le cache local
      const cachedData = localStorage.getItem('meals_cache')
      if (cachedData) {
        try {
          const { data, timestamp } = JSON.parse(cachedData)
          // Utiliser le cache si il a moins de 24h
          if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
            meals.value = data
            lastFetch.value = timestamp
            return data
          }
        } catch (cacheError) {
          console.error('Erreur lors du chargement du cache:', cacheError)
        }
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }

  const getMealById = async (id) => {
    // Chercher d'abord dans le store
    const existingMeal = meals.value.find(meal => meal.id === id)
    if (existingMeal) {
      return existingMeal
    }

    // Sinon, charger depuis l'API
    try {
      return await neonService.getRepasById(id)
    } catch (error) {
      console.error('Erreur lors de la récupération du repas:', error)
      throw error
    }
  }

  const addMeal = async (mealData) => {
    loading.value = true
    error.value = null

    try {
      const newMeal = await neonService.addRepas(mealData)
      meals.value.push(newMeal)
      return newMeal
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateMeal = async (id, mealData) => {
    loading.value = true
    error.value = null

    try {
      const updatedMeal = await neonService.updateRepas(id, mealData)
      const index = meals.value.findIndex(meal => meal.id === id)
      if (index !== -1) {
        meals.value[index] = updatedMeal
      }
      return updatedMeal
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteMeal = async (id) => {
    loading.value = true
    error.value = null

    try {
      await neonService.deleteRepas(id)
      meals.value = meals.value.filter(meal => meal.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const setSearchFilters = (filters) => {
    searchFilters.value = { ...searchFilters.value, ...filters }
  }

  const clearSearchFilters = () => {
    searchFilters.value = {
      text: '',
      saison: '',
      type: '',
      maxPrepTime: null,
      difficulte: '',
      maxCalories: null,
      includedIngredients: [],
      excludedIngredients: []
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Initialisation
  const initializeStore = async () => {
    // Charger depuis le cache local d'abord
    const cachedData = localStorage.getItem('meals_cache')
    if (cachedData) {
      try {
        const { data, timestamp } = JSON.parse(cachedData)
        meals.value = data
        lastFetch.value = timestamp
      } catch (error) {
        console.error('Erreur lors du chargement du cache:', error)
      }
    }

    // Charger les données fraîches en arrière-plan
    fetchMeals()
  }

  return {
    // État
    meals,
    loading,
    error,
    lastFetch,
    searchFilters,
    
    // Getters
    totalMeals,
    mealsBySeason,
    mealsByType,
    filteredMeals,
    randomMeal,
    
    // Actions
    fetchMeals,
    getMealById,
    addMeal,
    updateMeal,
    deleteMeal,
    setSearchFilters,
    clearSearchFilters,
    clearError,
    initializeStore
  }
})
