class RecipeCache {
  constructor(maxAge = 3600000) { // 1 heure par défaut
    this.cache = new Map()
    this.maxAge = maxAge
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    })
  }

  get(key) {
    const item = this.cache.get(key)
    if (!item) return null
    if (Date.now() - item.timestamp > this.maxAge) {
      this.cache.delete(key)
      return null
    }
    return item.value
  }
}

const recipeCache = new RecipeCache()