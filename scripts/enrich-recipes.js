import { neonService } from '../src/services/neon.js';
import fetch from 'node-fetch';

// Remplacez par votre clé API Spoonacular
const SPOONACULAR_API_KEY = 'e7407f7f279942d782551bdd5bd3fb88';

async function searchRecipe(query) {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&query=${encodeURIComponent(query)}&number=1&addRecipeInformation=true`
    );
    const data = await response.json();
    return data.results[0];
  } catch (error) {
    console.error(`Erreur lors de la recherche pour ${query}:`, error);
    return null;
  }
}

async function enrichRecipes() {
  try {
    // Récupérer tous les repas de la base
    const repas = await neonService.getRepas();
    
    console.log(`Début de l'enrichissement pour ${repas.length} recettes...`);

    for (const repas of repas) {
      console.log(`Traitement de la recette: ${repas.nom}`);
      
      // Rechercher la recette sur Spoonacular
      const recipeData = await searchRecipe(repas.nom);
      
      if (recipeData) {
        // Mettre à jour les informations
        const updatedRepas = {
          ...repas,
          temps_preparation: recipeData.readyInMinutes || repas.temps_preparation,
          temps_cuisson: recipeData.cookingMinutes || repas.temps_cuisson,
          temps_total: recipeData.readyInMinutes || repas.temps_total,
          difficulte: recipeData.dishTypes?.includes('easy') ? 'Facile' : 
                     recipeData.dishTypes?.includes('medium') ? 'Moyen' : 'Difficile',
          cout: recipeData.pricePerServing < 100 ? 'Bas' : 
                recipeData.pricePerServing < 200 ? 'Moyen' : 'Élevé',
          calories: recipeData.calories || repas.calories,
          ingredients: recipeData.extendedIngredients?.map(ing => 
            `${ing.amount} ${ing.unit} ${ing.name}`
          ).join('\n') || repas.ingredients,
          instructions: recipeData.analyzedInstructions?.[0]?.steps?.map(step => 
            step.step
          ).join('\n') || repas.instructions,
          image_url: recipeData.image || repas.image_url,
          notes: `Source: Spoonacular\nTemps de préparation: ${recipeData.readyInMinutes} minutes\nPortions: ${recipeData.servings}`
        };

        // Mettre à jour dans la base de données
        await neonService.updateRepas(repas.id, updatedRepas);
        console.log(`Recette ${repas.nom} mise à jour avec succès`);
      } else {
        console.log(`Aucune donnée trouvée pour ${repas.nom}`);
      }

      // Attendre 1 seconde entre chaque requête pour respecter les limites de l'API
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('Enrichissement terminé !');
  } catch (error) {
    console.error('Erreur lors de l\'enrichissement:', error);
  }
}

// Exécuter le script
enrichRecipes(); 