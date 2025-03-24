import { neonService } from './neon';

export const shoppingListService = {
  /**
   * Génère une liste de courses à partir d'un menu hebdomadaire
   * @param {Array} menuItems - Liste des repas du menu
   * @returns {Object} Liste de courses organisée par catégories
   */
  async generateShoppingList(menuItems) {
    try {
      // Récupérer les détails complets de chaque repas
      const mealIds = menuItems.map(item => item.id);
      const meals = await Promise.all(
        mealIds.map(id => neonService.getRepasById(id))
      );
      
      // Extraire et organiser les ingrédients
      const ingredientsList = {};
      
      meals.forEach(meal => {
        if (Array.isArray(meal.ingredients)) {
          meal.ingredients.forEach(ingredient => {
            // Analyse de l'ingrédient pour extraire quantité et unité
            const parsedIngredient = this.parseIngredient(ingredient);
            
            // Regrouper par catégorie (à implémenter avec une classification)
            const category = this.categorizeIngredient(parsedIngredient.name);
            
            if (!ingredientsList[category]) {
              ingredientsList[category] = [];
            }
            
            // Vérifier si l'ingrédient existe déjà pour le combiner
            const existingIndex = ingredientsList[category].findIndex(
              item => item.name.toLowerCase() === parsedIngredient.name.toLowerCase()
            );
            
            if (existingIndex >= 0) {
              // Combiner les quantités si les unités sont identiques
              if (ingredientsList[category][existingIndex].unit === parsedIngredient.unit) {
                ingredientsList[category][existingIndex].quantity += parsedIngredient.quantity;
              } else {
                // Sinon ajouter comme nouvel élément
                ingredientsList[category].push(parsedIngredient);
              }
            } else {
              ingredientsList[category].push(parsedIngredient);
            }
          });
        }
      });
      
      return ingredientsList;
    } catch (error) {
      console.error('Erreur lors de la génération de la liste de courses:', error);
      throw error;
    }
  },
  
  /**
   * Analyse un ingrédient pour extraire quantité, unité et nom
   */
  parseIngredient(ingredientString) {
    // Regex pour extraire quantité, unité et nom
    const regex = /^([\d.,]+)?\s*([a-zA-Z]+)?\s*(.+)$/;
    const match = ingredientString.trim().match(regex);
    
    if (match) {
      return {
        quantity: parseFloat(match[1]) || 1,
        unit: match[2] || '',
        name: match[3].trim()
      };
    }
    
    return {
      quantity: 1,
      unit: '',
      name: ingredientString.trim()
    };
  },
  
  /**
   * Catégorise un ingrédient (fruits, légumes, viandes, etc.)
   */
  categorizeIngredient(name) {
    const categories = {
      fruits: ['pomme', 'banane', 'orange', 'fraise', 'citron'],
      légumes: ['carotte', 'oignon', 'tomate', 'poivron', 'courgette'],
      viandes: ['poulet', 'boeuf', 'porc', 'dinde', 'agneau'],
      produits_laitiers: ['lait', 'fromage', 'yaourt', 'beurre', 'crème'],
      épicerie: ['farine', 'sucre', 'sel', 'huile', 'vinaigre']
    };
    
    const nameLower = name.toLowerCase();
    
    for (const [category, items] of Object.entries(categories)) {
      if (items.some(item => nameLower.includes(item))) {
        return category;
      }
    }
    
    return 'autres';
  }
};