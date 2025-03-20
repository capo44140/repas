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
  const template = `saison,type,nom,description
hiver,midi,Soupe de légumes,Soupe chaude avec carottes et pommes de terre
hiver,soir,Gratin de pâtes,Pâtes avec sauce béchamel et fromage
printemps,midi,Salade composée,Salade avec légumes de printemps
ete,soir,Ratatouille,Plat provençal avec légumes d'été
automne,midi,Velouté de potiron,Soupe crémeuse à la citrouille`;
  
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