/**
 * Service pour interagir avec la base de données Neon PostgreSQL
 * Ce service utilise une API intermédiaire pour communiquer avec la base de données
 */

const API_URL = import.meta.env.VITE_API_URL || 'https://repas.vercel.app/api';

export default {
  /**
   * Récupère tous les repas
   * @returns {Promise<Array>} Liste des repas
   */
  async getAllRepas() {
    try {
      const response = await fetch(`${API_URL}/repas`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des repas');
      return await response.json();
    } catch (error) {
      console.error('Erreur dans getAllRepas:', error);
      throw error;
    }
  },

  /**
   * Récupère les repas filtrés par saison et/ou type
   * @param {Object} filters - Filtres à appliquer
   * @returns {Promise<Array>} Liste des repas filtrés
   */
  async getRepasByFilters(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.saison) queryParams.append('saison', filters.saison);
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.dimancheMidi !== undefined) queryParams.append('dimanche_midi', filters.dimancheMidi);
      
      const url = `${API_URL}/repas?${queryParams.toString()}`;
      const response = await fetch(url);
      
      if (!response.ok) throw new Error('Erreur lors de la récupération des repas filtrés');
      return await response.json();
    } catch (error) {
      console.error('Erreur dans getRepasByFilters:', error);
      throw error;
    }
  },

  /**
   * Ajoute un nouveau repas
   * @param {Object} repas - Données du repas à ajouter
   * @returns {Promise<Object>} Repas ajouté
   */
  async addRepas(repas) {
    try {
      const response = await fetch(`${API_URL}/repas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(repas)
      });
      
      if (!response.ok) throw new Error('Erreur lors de l\'ajout du repas');
      return await response.json();
    } catch (error) {
      console.error('Erreur dans addRepas:', error);
      throw error;
    }
  },

  /**
   * Met à jour un repas existant
   * @param {number} id - ID du repas à mettre à jour
   * @param {Object} repas - Nouvelles données du repas
   * @returns {Promise<Object>} Repas mis à jour
   */
  async updateRepas(id, repas) {
    try {
      const response = await fetch(`${API_URL}/repas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(repas)
      });
      
      if (!response.ok) throw new Error('Erreur lors de la mise à jour du repas');
      return await response.json();
    } catch (error) {
      console.error('Erreur dans updateRepas:', error);
      throw error;
    }
  },

  /**
   * Supprime un repas
   * @param {number} id - ID du repas à supprimer
   * @returns {Promise<void>}
   */
  async deleteRepas(id) {
    try {
      const response = await fetch(`${API_URL}/repas/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Erreur lors de la suppression du repas');
    } catch (error) {
      console.error('Erreur dans deleteRepas:', error);
      throw error;
    }
  }
};