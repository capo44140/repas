import { neon } from '@neondatabase/serverless';

const neonConfig = {
  connectionString: import.meta.env.VITE_NEON_DATABASE_URL
};

console.log('Configuration Neon:', {
  hasConnectionString: !!neonConfig.connectionString,
  connectionStringLength: neonConfig.connectionString?.length
});

const neonClient = neon(neonConfig.connectionString);

// Fonction utilitaire pour convertir un tableau en format PostgreSQL
const toPostgresArray = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return '{}';
  return `{${arr.map(item => `"${item.replace(/"/g, '\\"')}"`).join(',')}}`;
};

// Fonction utilitaire pour parser les tableaux PostgreSQL
const parsePostgresArray = (value) => {
  if (!value || value === '{}') return [];
  // Enlever les accolades et diviser par les virgules
  const content = value.substring(1, value.length - 1);
  return content.split(',').map(item => {
    // Nettoyer les guillemets et les caractères d'échappement
    return item.replace(/^"(.*)"$/, '$1').replace(/\\"/g, '"');
  });
};

export const neonService = {
  async getAllRepas() {
    try {
      console.log('Début de la récupération des repas depuis Neon...');
      
      // Vérifier d'abord si la table existe
      const checkTable = await neonClient`
        SELECT EXISTS (
          SELECT FROM pg_tables 
          WHERE tablename = 'repas'
        ) as table_exists;
      `;
      
      console.log('Résultat de la vérification de la table:', checkTable);
      
      if (!checkTable || !checkTable[0] || !checkTable[0].table_exists) {
        console.error('La table repas n\'existe pas dans la base de données');
        return [];
      }

      // Compter le nombre de repas
      const countResult = await neonClient`SELECT COUNT(*) as count FROM repas`;
      console.log('Résultat du comptage:', countResult);
      
      if (!countResult || !countResult[0]) {
        console.error('Impossible de compter les repas');
        return [];
      }

      console.log('Nombre total de repas dans la table:', countResult[0].count);

      // Récupérer les repas
      const result = await neonClient`
        SELECT 
          id,
          nom,
          type,
          saison,
          temps_preparation,
          temps_cuisson,
          temps_repos,
          temps_total,
          difficulte,
          cout,
          calories,
          ingredients,
          instructions,
          notes,
          image_url,
          created_at,
          updated_at
        FROM repas 
        ORDER BY nom
      `;

      console.log('Résultat brut de la requête:', result);

      if (!result || !Array.isArray(result)) {
        console.error('Aucun résultat retourné par la requête');
        return [];
      }

      // Transformer les données pour le format attendu
      const formattedResults = result.map(row => ({
        ...row,
        ingredients: Array.isArray(row.ingredients) ? row.ingredients : parsePostgresArray(row.ingredients),
        instructions: Array.isArray(row.instructions) ? row.instructions : parsePostgresArray(row.instructions)
      }));

      console.log(`${formattedResults.length} repas récupérés et formatés`);
      return formattedResults;
    } catch (error) {
      console.error('Erreur détaillée lors de la récupération des repas:', error);
      throw new Error('Impossible de récupérer les repas: ' + error.message);
    }
  },

  async getRepasById(id) {
    try {
      const result = await neonClient`SELECT * FROM repas WHERE id = ${id}`;
      return result?.[0];
    } catch (error) {
      console.error('Erreur lors de la récupération du repas:', error);
      throw new Error('Impossible de récupérer le repas');
    }
  },

  async addRepas(repas) {
    try {
      // Préparer les tableaux pour PostgreSQL
      const ingredientsArray = toPostgresArray(repas.ingredients || []);
      const instructionsArray = toPostgresArray(repas.instructions || []);

      const result = await neonClient`
        INSERT INTO repas (
          nom, type, saison, temps_preparation, temps_cuisson, 
          temps_repos, temps_total, difficulte, cout, calories, 
          ingredients, instructions, notes, image_url
        ) VALUES (
          ${repas.nom},
          ${repas.type},
          ${repas.saison},
          ${repas.temps_preparation || null},
          ${repas.temps_cuisson || null},
          ${repas.temps_repos || null},
          ${repas.temps_total || null},
          ${repas.difficulte},
          ${repas.cout},
          ${repas.calories || null},
          ${ingredientsArray}::text[],
          ${instructionsArray}::text[],
          ${repas.notes},
          ${repas.image_url}
        ) 
        RETURNING *
      `;
      return result?.[0] || null;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du repas:', error);
      throw new Error('Impossible d\'ajouter le repas: ' + error.message);
    }
  },

  async updateRepas(id, repas) {
    try {
      // Préparer les tableaux pour PostgreSQL
      const ingredientsArray = toPostgresArray(repas.ingredients || []);
      const instructionsArray = toPostgresArray(repas.instructions || []);

      const result = await neonClient`
        UPDATE repas SET 
          nom = ${repas.nom},
          type = ${repas.type},
          saison = ${repas.saison},
          temps_preparation = ${repas.temps_preparation || null},
          temps_cuisson = ${repas.temps_cuisson || null},
          temps_repos = ${repas.temps_repos || null},
          temps_total = ${repas.temps_total || null},
          difficulte = ${repas.difficulte},
          cout = ${repas.cout},
          calories = ${repas.calories || null},
          ingredients = ${ingredientsArray}::text[],
          instructions = ${instructionsArray}::text[],
          notes = ${repas.notes},
          image_url = ${repas.image_url},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `;
      return result?.[0] || null;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du repas:', error);
      throw new Error('Impossible de mettre à jour le repas: ' + error.message);
    }
  },

  async deleteRepas(id) {
    try {
      const result = await neonClient`DELETE FROM repas WHERE id = ${id} RETURNING id`;
      return result?.[0]?.id || null;
    } catch (error) {
      console.error('Erreur lors de la suppression du repas:', error);
      throw new Error('Impossible de supprimer le repas: ' + error.message);
    }
  }
}; 