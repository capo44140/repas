import axios from 'axios';

export const onlineStoreService = {
  // Configuration des magasins supportés
  stores: {
    carrefour: {
      baseUrl: 'https://api.carrefour.com/v1',
      name: 'Carrefour'
    },
    auchan: {
      baseUrl: 'https://api.auchan.fr/v1',
      name: 'Auchan'
    }
  },

  async searchProduct(query, store = 'carrefour') {
    try {
      const response = await axios.get(`${this.stores[store].baseUrl}/products/search`, {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche de produits:', error);
      throw error;
    }
  },

  async addToCart(items, store = 'carrefour') {
    try {
      const response = await axios.post(`${this.stores[store].baseUrl}/cart/add`, {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      throw error;
    }
  }
};