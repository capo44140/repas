import { ref } from 'vue';
import { neonService } from './neon';
import * as Papa from 'papaparse';

const dataSource = ref('csv'); // 'csv' ou 'neon'

const dataSourceService = {
  // Obtenir la source de données actuelle
  getCurrentSource() {
    return dataSource.value;
  },

  // Changer la source de données
  setDataSource(source) {
    if (source !== 'csv' && source !== 'neon') {
      throw new Error('Source de données invalide. Utilisez "csv" ou "neon".');
    }
    dataSource.value = source;
  },

  // Charger les repas depuis la source appropriée
  async loadRepas() {
    try {
      const result = await neonService.getAllRepas();
      return result;
    } catch (error) {
      console.error('Erreur lors du chargement des repas:', error);
      throw new Error('Impossible de charger les repas: ' + error.message);
    }
  },

  // Ajouter un repas
  async addRepas(repas) {
    if (dataSource.value !== 'neon') {
      throw new Error('L\'ajout de repas n\'est disponible qu\'en mode Neon');
    }
    return await neonService.addRepas(repas);
  },

  // Mettre à jour un repas
  async updateRepas(id, repas) {
    if (dataSource.value !== 'neon') {
      throw new Error('La modification de repas n\'est disponible qu\'en mode Neon');
    }
    return await neonService.updateRepas(id, repas);
  },

  // Supprimer un repas
  async deleteRepas(id) {
    if (dataSource.value !== 'neon') {
      throw new Error('La suppression de repas n\'est disponible qu\'en mode Neon');
    }
    return await neonService.deleteRepas(id);
  }
};

export { dataSourceService }; 