const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 heures en millisecondes

export const cacheService = {
  /**
   * Récupère une valeur du cache
   * @param {string} key - Clé de cache
   * @returns {any|null} Valeur ou null si non trouvée/expirée
   */
  get(key) {
    try {
      const cachedData = localStorage.getItem(`cache_${key}`);
      
      if (!cachedData) return null;
      
      const { value, timestamp } = JSON.parse(cachedData);
      const now = Date.now();
      
      // Vérifier si le cache est expiré
      if (now - timestamp > CACHE_DURATION) {
        this.remove(key);
        return null;
      }
      
      return value;
    } catch (error) {
      console.error('Erreur lors de la récupération du cache:', error);
      return null;
    }
  },
  
  /**
   * Stocke une valeur dans le cache
   * @param {string} key - Clé de cache
   * @param {any} value - Valeur à stocker
   */
  set(key, value) {
    try {
      const cacheData = {
        value,
        timestamp: Date.now()
      };
      
      localStorage.setItem(`cache_${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Erreur lors du stockage dans le cache:', error);
    }
  },
  
  /**
   * Supprime une valeur du cache
   * @param {string} key - Clé de cache
   */
  remove(key) {
    localStorage.removeItem(`cache_${key}`);
  },
  
  /**
   * Vide tout le cache
   */
  clear() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    });
  }
};