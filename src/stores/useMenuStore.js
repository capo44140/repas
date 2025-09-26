import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useMealsStore } from './useMealsStore'

export const useMenuStore = defineStore('menu', () => {
  // État
  const generatedMenus = ref([])
  const currentMenu = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const menuSettings = ref({
    duration: 1, // semaines
    season: 'automne',
    includeLunch: true,
    includeDinner: true,
    includeSundayLunch: false,
    avoidRepetition: true,
    maxPrepTime: null,
    difficulty: null,
    dietaryRestrictions: []
  })

  // Getters
  const totalGeneratedMenus = computed(() => generatedMenus.value.length)
  
  const currentMenuMeals = computed(() => {
    if (!currentMenu.value) return []
    return currentMenu.value.meals || []
  })

  const currentMenuShoppingList = computed(() => {
    if (!currentMenu.value) return []
    return currentMenu.value.shoppingList || []
  })

  const menuStats = computed(() => {
    const stats = {
      totalMeals: 0,
      totalPrepTime: 0,
      totalCalories: 0,
      seasons: {},
      types: {},
      difficulties: {}
    }

    currentMenuMeals.value.forEach(meal => {
      stats.totalMeals++
      stats.totalPrepTime += meal.temps_preparation || 0
      stats.totalCalories += meal.calories || 0
      
      // Compter par saison
      stats.seasons[meal.saison] = (stats.seasons[meal.saison] || 0) + 1
      
      // Compter par type
      stats.types[meal.type] = (stats.types[meal.type] || 0) + 1
      
      // Compter par difficulté
      if (meal.difficulte) {
        stats.difficulties[meal.difficulte] = (stats.difficulties[meal.difficulte] || 0) + 1
      }
    })

    return stats
  })

  // Actions
  const generateMenu = async (settings = null) => {
    loading.value = true
    error.value = null

    try {
      const mealsStore = useMealsStore()
      
      // Charger les repas si nécessaire
      if (mealsStore.meals.length === 0) {
        await mealsStore.fetchMeals()
      }

      const finalSettings = settings || menuSettings.value
      const menu = await createMenu(mealsStore.meals, finalSettings)
      
      currentMenu.value = menu
      generatedMenus.value.unshift(menu)
      
      // Limiter à 10 menus en mémoire
      if (generatedMenus.value.length > 10) {
        generatedMenus.value = generatedMenus.value.slice(0, 10)
      }

      // Sauvegarder en localStorage
      saveMenusToStorage()

      return menu
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const createMenu = async (meals, settings) => {
    const menu = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      settings: { ...settings },
      meals: [],
      shoppingList: [],
      stats: {}
    }

    const days = settings.duration * 7
    const usedMealIds = new Set()

    for (let day = 0; day < days; day++) {
      const dayMeals = []

      // Midi
      if (settings.includeLunch) {
        const lunchMeal = selectRandomMeal(meals, {
          ...settings,
          type: 'midi',
          usedIds: usedMealIds
        })
        if (lunchMeal) {
          dayMeals.push({ ...lunchMeal, day, mealTime: 'midi' })
          usedMealIds.add(lunchMeal.id)
        }
      }

      // Soir
      if (settings.includeDinner) {
        const dinnerMeal = selectRandomMeal(meals, {
          ...settings,
          type: 'soir',
          usedIds: usedMealIds
        })
        if (dinnerMeal) {
          dayMeals.push({ ...dinnerMeal, day, mealTime: 'soir' })
          usedMealIds.add(dinnerMeal.id)
        }
      }

      // Dimanche midi spécial
      if (settings.includeSundayLunch && day % 7 === 6) {
        const sundayLunch = selectRandomMeal(meals, {
          ...settings,
          type: 'dimanche_midi',
          usedIds: usedMealIds
        })
        if (sundayLunch) {
          dayMeals.push({ ...sundayLunch, day, mealTime: 'dimanche_midi' })
          usedMealIds.add(sundayLunch.id)
        }
      }

      menu.meals.push(...dayMeals)
    }

    // Générer la liste de courses
    menu.shoppingList = generateShoppingList(menu.meals)
    
    // Calculer les statistiques
    menu.stats = calculateMenuStats(menu.meals)

    return menu
  }

  const selectRandomMeal = (meals, filters) => {
    let filteredMeals = meals.filter(meal => {
      // Filtres de base
      if (filters.season && meal.saison !== filters.season) return false
      if (filters.type && meal.type !== filters.type) return false
      if (filters.maxPrepTime && meal.temps_preparation > filters.maxPrepTime) return false
      if (filters.difficulty && meal.difficulte !== filters.difficulty) return false
      if (filters.usedIds && filters.usedIds.has(meal.id)) return false

      // Filtres diététiques
      if (filters.dietaryRestrictions && filters.dietaryRestrictions.length > 0) {
        // Logique de filtrage selon les restrictions alimentaires
        // À implémenter selon vos besoins spécifiques
      }

      return true
    })

    if (filteredMeals.length === 0) return null

    const randomIndex = Math.floor(Math.random() * filteredMeals.length)
    return filteredMeals[randomIndex]
  }

  const generateShoppingList = (meals) => {
    const ingredients = new Map()

    meals.forEach(meal => {
      if (meal.ingredients && Array.isArray(meal.ingredients)) {
        meal.ingredients.forEach(ingredient => {
          const normalized = ingredient.toLowerCase().trim()
          if (ingredients.has(normalized)) {
            ingredients.set(normalized, ingredients.get(normalized) + 1)
          } else {
            ingredients.set(normalized, 1)
          }
        })
      }
    })

    return Array.from(ingredients.entries()).map(([ingredient, quantity]) => ({
      ingredient,
      quantity,
      checked: false
    }))
  }

  const calculateMenuStats = (meals) => {
    const stats = {
      totalMeals: meals.length,
      totalPrepTime: 0,
      totalCalories: 0,
      averagePrepTime: 0,
      averageCalories: 0,
      seasons: {},
      types: {},
      difficulties: {}
    }

    meals.forEach(meal => {
      stats.totalPrepTime += meal.temps_preparation || 0
      stats.totalCalories += meal.calories || 0

      // Compter par saison
      stats.seasons[meal.saison] = (stats.seasons[meal.saison] || 0) + 1
      
      // Compter par type
      stats.types[meal.type] = (stats.types[meal.type] || 0) + 1
      
      // Compter par difficulté
      if (meal.difficulte) {
        stats.difficulties[meal.difficulte] = (stats.difficulties[meal.difficulte] || 0) + 1
      }
    })

    stats.averagePrepTime = stats.totalMeals > 0 ? Math.round(stats.totalPrepTime / stats.totalMeals) : 0
    stats.averageCalories = stats.totalMeals > 0 ? Math.round(stats.totalCalories / stats.totalMeals) : 0

    return stats
  }

  const setMenuSettings = (settings) => {
    menuSettings.value = { ...menuSettings.value, ...settings }
  }

  const loadMenu = (menuId) => {
    const menu = generatedMenus.value.find(m => m.id === menuId)
    if (menu) {
      currentMenu.value = menu
    }
  }

  const deleteMenu = (menuId) => {
    generatedMenus.value = generatedMenus.value.filter(m => m.id !== menuId)
    if (currentMenu.value && currentMenu.value.id === menuId) {
      currentMenu.value = null
    }
    saveMenusToStorage()
  }

  const clearCurrentMenu = () => {
    currentMenu.value = null
  }

  const exportMenu = (menuId = null) => {
    const menu = menuId ? 
      generatedMenus.value.find(m => m.id === menuId) : 
      currentMenu.value

    if (!menu) return

    const dataStr = JSON.stringify(menu, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `menu-${menu.id}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const saveMenusToStorage = () => {
    try {
      localStorage.setItem('generatedMenus', JSON.stringify(generatedMenus.value))
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des menus:', error)
    }
  }

  const loadMenusFromStorage = () => {
    try {
      const saved = localStorage.getItem('generatedMenus')
      if (saved) {
        generatedMenus.value = JSON.parse(saved)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des menus:', error)
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Initialisation
  const initializeMenuStore = () => {
    loadMenusFromStorage()
  }

  return {
    // État
    generatedMenus,
    currentMenu,
    loading,
    error,
    menuSettings,
    
    // Getters
    totalGeneratedMenus,
    currentMenuMeals,
    currentMenuShoppingList,
    menuStats,
    
    // Actions
    generateMenu,
    setMenuSettings,
    loadMenu,
    deleteMenu,
    clearCurrentMenu,
    exportMenu,
    clearError,
    initializeMenuStore
  }
})
