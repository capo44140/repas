<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      Importer des repas depuis un CSV
    </label>
    <div class="space-y-4">
      <!-- Zone d'information -->
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <p>Structure : saison,type,nom,description</p>
          <p>Saisons valides : hiver, printemps, été, automne</p>
          <p>Types valides : midi, soir</p>
        </div>
      </div>

      <!-- Zone de sélection du fichier et bouton exemple -->
      <div class="flex items-center gap-4">
        <div class="flex-1">
          <input
            type="file"
            accept=".csv"
            @change="handleFileUpload"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-gray-700 dark:file:text-gray-200"
          />
        </div>
        <button 
          @click="downloadTemplate" 
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600"
        >
          <Icon icon="ph:file-csv" class="w-4 h-4 mr-2" />
          Voir un exemple
        </button>
      </div>
    </div>
    
    <!-- Message de statut -->
    <div v-if="importStatus" :class="['mt-3 p-2 rounded text-sm', 
      importStatus.success ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-200' : 
      'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-200']">
      {{ importStatus.message }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

const emit = defineEmits(['meals-imported']);
const importStatus = ref(null);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const csvData = e.target.result;
      const meals = parseCsv(csvData);
      
      if (meals.length === 0) {
        importStatus.value = {
          success: false,
          message: "Aucun repas trouvé dans le fichier CSV."
        };
        return;
      }
      
      // Sauvegarder les repas dans le localStorage avec la bonne structure
      const existingMeals = JSON.parse(localStorage.getItem('customMeals') || '{}');
      
      meals.forEach(meal => {
        const seasonKey = meal.season;
        const typeKey = meal.type;
        
        if (!existingMeals[seasonKey]) {
          existingMeals[seasonKey] = {
            lunch: [],
            dinner: []
          };
        }
        
        // Ajouter le repas s'il n'existe pas déjà
        const mealList = existingMeals[seasonKey][typeKey];
        const exists = mealList.some(m => m.name === meal.name);
        
        if (!exists) {
          mealList.push({
            name: meal.name,
            description: meal.description,
            ingredients: {} // On peut ajouter une structure d'ingrédients par défaut si nécessaire
          });
        }
      });
      
      localStorage.setItem('customMeals', JSON.stringify(existingMeals));
      
      importStatus.value = {
        success: true,
        message: `${meals.length} repas importés avec succès.`
      };
      
      emit('meals-imported', existingMeals);
      
    } catch (error) {
      importStatus.value = {
        success: false,
        message: `Erreur lors de l'import: ${error.message}`
      };
    }
  };
  
  reader.readAsText(file);
};

const parseCsv = (csvData) => {
  const lines = csvData.split('\n');
  const meals = [];
  
  // Mapping des types de repas
  const mealTypes = {
    'midi': 'lunch',
    'soir': 'dinner'
  };
  
  // Mapping des saisons valides
  const validSeasons = ['hiver', 'printemps', 'ete', 'été', 'automne'];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Ignorer la ligne d'en-tête si elle existe
    if (i === 0 && line.toLowerCase().includes('saison')) continue;
    
    const columns = line.split(',');
    
    if (columns.length >= 4) {
      const season = columns[0].trim().toLowerCase();
      const type = columns[1].trim().toLowerCase();
      const name = columns[2].trim();
      const description = columns[3].trim();
      
      // Vérifier que les valeurs sont valides
      if (
        validSeasons.includes(season) &&
        Object.keys(mealTypes).includes(type) &&
        name
      ) {
        // Normaliser 'été' en 'ete' pour la cohérence
        const normalizedSeason = season === 'été' ? 'ete' : season;
        
        meals.push({
          season: normalizedSeason,
          type: mealTypes[type],
          name,
          description
        });
      }
    }
  }
  
  return meals;
};

const downloadTemplate = () => {
  const template = `nom,type,saison,moment_journee,temps_preparation,temps_cuisson,temps_repos,temps_total,difficulte,cout,calories,ingredients,instructions,notes,image_url
Blanquette de veau,Plat principal,hiver,midi,30,90,0,120,Moyen,Moyen,450,"500g de veau, 4 carottes, 2 oignons, 200g de champignons, 20cl de crème fraîche","1. Découper le veau en cubes
2. Éplucher et couper les légumes
3. Faire revenir la viande
4. Ajouter les légumes et le bouillon
5. Laisser mijoter
6. Ajouter la crème fraîche","Parfait pour un repas familial réconfortant","https://example.com/blanquette.jpg"
Salade niçoise,Entrée,ete,midi,20,0,0,20,Facile,Bas,300,"Tomates, olives noires, thon, œufs, anchois","1. Couper les tomates
2. Faire cuire les œufs
3. Assembler la salade
4. Ajouter la vinaigrette","Idéal pour un repas léger","https://example.com/salade-nicoise.jpg"
Soupe à l'oignon,Entrée,automne,soir,30,60,0,90,Moyen,Bas,250,"4 oignons, bouillon de bœuf, pain, fromage","1. Émincer les oignons
2. Les faire caraméliser
3. Ajouter le bouillon
4. Laisser mijoter
5. Ajouter le pain et le fromage","Parfait pour un dîner réconfortant","https://example.com/soupe-oignon.jpg"
Risotto aux asperges,Plat principal,printemps,midi,20,25,0,45,Moyen,Moyen,400,"Riz arborio, asperges, parmesan, bouillon","1. Préparer le bouillon
2. Faire revenir le riz
3. Ajouter le bouillon progressivement
4. Ajouter les asperges
5. Finir avec le parmesan","Un plat printanier délicat","https://example.com/risotto-asperges.jpg"
Ratatouille,Plat principal,ete,soir,30,45,0,75,Facile,Bas,200,"Tomates, aubergines, courgettes, poivrons, oignons","1. Couper tous les légumes
2. Faire revenir les légumes
3. Laisser mijoter
4. Assaisonner","Un classique de l'été","https://example.com/ratatouille.jpg"
Gratin dauphinois,Plat principal,hiver,soir,20,60,0,80,Facile,Moyen,350,"Pommes de terre, crème, lait, noix de muscade","1. Éplucher et couper les pommes de terre
2. Faire chauffer la crème et le lait
3. Assembler le gratin
4. Cuire au four","Un plat réconfortant parfait pour l'hiver","https://example.com/gratin-dauphinois.jpg"`;
  
  const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'modele_repas.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const defaultMeals = {
  lunch: [{ /* repas par défaut du midi */ }],
  dinner: [{ /* repas par défaut du soir */ }]
};

const availableMeals = {
  lunch: [...(currentSeasonMeals.lunch || []), ...defaultMeals.lunch],
  dinner: [...(currentSeasonMeals.dinner || []), ...defaultMeals.dinner]
};

const randomMeal = availableMeals.lunch[Math.floor(Math.random() * availableMeals.lunch.length)];
</script>