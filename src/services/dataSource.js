import { ref } from 'vue';
import { neonService } from './neon';
import Papa from 'papaparse';

const dataSource = ref('csv'); // 'csv' ou 'neon'

export const dataSourceService = {
  // Obtenir la source de données actuelle
  getCurrentSource() {
    return dataSource.value;
  },

  // Changer la source de données
  setDataSource(source) {
    if (source !== 'csv' && source !== 'neon') {
      throw new Error('Source de données invalide');
    }
    dataSource.value = source;
  },

  // Charger les repas depuis la source appropriée
  async loadRepas() {
    try {
      if (dataSource.value === 'neon') {
        return await neonService.getAllRepas();
      } else {
        // Charger depuis le fichier CSV
        const response = await fetch('/modele_repas_finalev2.csv');
        const csvText = await response.text();
        
        return new Promise((resolve, reject) => {
          Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              const formattedData = results.data.map(record => ({
                id: record.id || undefined,
                nom: record.nom || '',
                type: record.type || '',
                saison: record.saison || '',
                temps_preparation: parseInt(record.temps_preparation) || null,
                temps_cuisson: parseInt(record.temps_cuisson) || null,
                temps_repos: parseInt(record.temps_repos) || null,
                temps_total: parseInt(record.temps_total) || null,
                difficulte: record.difficulte || '',
                cout: record.cout || '',
                calories: parseInt(record.calories) || null,
                ingredients: record.ingredients ? record.ingredients.split(';') : [],
                instructions: record.instructions ? record.instructions.split(';') : [],
                notes: record.notes || '',
                image_url: record.image_url || ''
              }));
              resolve(formattedData);
            },
            error: (error) => {
              console.error('Erreur lors du parsing CSV:', error);
              reject(new Error('Impossible de parser le fichier CSV'));
            }
          });
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des repas:', error);
      throw new Error('Impossible de charger les repas');
    }
  },

  // Ajouter un repas
  async addRepas(repas) {
    if (dataSource.value !== 'neon') {
      throw new Error('L\'ajout n\'est possible qu\'avec la base de données Neon');
    }
    return await neonService.addRepas(repas);
  },

  // Mettre à jour un repas
  async updateRepas(id, repas) {
    if (dataSource.value !== 'neon') {
      throw new Error('La modification n\'est possible qu\'avec la base de données Neon');
    }
    return await neonService.updateRepas(id, repas);
  },

  // Supprimer un repas
  async deleteRepas(id) {
    if (dataSource.value !== 'neon') {
      throw new Error('La suppression n\'est possible qu\'avec la base de données Neon');
    }
    return await neonService.deleteRepas(id);
  }
}; 