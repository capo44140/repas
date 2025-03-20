<script setup>
import { ref, reactive, onMounted } from 'vue';
import { Icon } from '@iconify/vue';

// État pour le fichier CSV et les données
const file = ref(null);
const fileInput = ref(null);
const fileName = ref('');
const csvData = ref([]);
const headers = ref([]);
const showPreview = ref(false);
const editingCell = reactive({ row: -1, col: -1, value: '' });
const notification = reactive({ show: false, message: '', type: 'success' });
const isEditing = ref(false);
const newRow = ref({});
const seasons = ['hiver', 'printemps', 'ete', 'automne'];
const mealTypes = ['midi', 'soir'];
const isLoading = ref(false);
const defaultFileName = 'modele_repas_finale.csv';
const newMeal = ref({
  nom: '',
  description: '',
  type: 'midi',
  saison: 'hiver',
  dimanche_midi: ''
});

// Options d'exportation
const exportOptions = reactive({
  includeHeaders: true,
  delimiter: ',',
});

// Fonction pour charger le fichier CSV par défaut
const loadDefaultCSV = async () => {
  try {
    isLoading.value = true;
    const response = await fetch(`/${defaultFileName}`);
    
    if (!response.ok) {
      throw new Error(`Erreur lors du chargement du fichier: ${response.status}`);
    }
    
    const content = await response.text();
    parseCSV(content);
    fileName.value = defaultFileName;
    showPreview.value = true;
    showNotification(`Fichier ${defaultFileName} chargé avec succès`, 'success');
  } catch (error) {
    console.error('Erreur lors du chargement du fichier par défaut:', error);
    showNotification(`Impossible de charger le fichier par défaut: ${error.message}`, 'error');
  } finally {
    isLoading.value = false;
  }
};

// Fonction pour gérer le fichier sélectionné
const handleFileSelect = (event) => {
  file.value = event.target.files[0];
  if (file.value) {
    fileName.value = file.value.name;
    readCSV();
  }
};

// Fonction pour gérer le glisser-déposer
const handleDrop = (event) => {
  event.preventDefault();
  file.value = event.dataTransfer.files[0];
  if (file.value) {
    fileName.value = file.value.name;
    readCSV();
  }
};

// Fonctions pour le glisser-déposer
const handleDragOver = (event) => {
  event.preventDefault();
};

// Lire le contenu du fichier CSV
const readCSV = () => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target.result;
    parseCSV(content);
    showPreview.value = true;
  };
  reader.readAsText(file.value);
};

// Fonction pour analyser le CSV
const parseCSV = (content) => {
  // Séparation des lignes
  const lines = content.split('\n');
  
  // Détection automatique du délimiteur
  const delimiterCounts = {
    ',': 0,
    ';': 0,
    '\t': 0,
  };
  
  const firstLine = lines[0];
  Object.keys(delimiterCounts).forEach(delimiter => {
    delimiterCounts[delimiter] = (firstLine.match(new RegExp(delimiter, 'g')) || []).length;
  });
  
  // Sélection du délimiteur le plus utilisé
  let delimiter = ',';
  let maxCount = 0;
  Object.entries(delimiterCounts).forEach(([key, count]) => {
    if (count > maxCount) {
      maxCount = count;
      delimiter = key;
    }
  });
  
  exportOptions.delimiter = delimiter;
  
  // Extraction des en-têtes
  if (lines.length > 0) {
    headers.value = lines[0].split(delimiter).map(header => header.trim());
    
    // Traitement des données
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue;
      
      const values = lines[i].split(delimiter);
      const entry = {};
      
      headers.value.forEach((header, index) => {
        entry[header] = values[index] ? values[index].trim() : '';
      });
      
      data.push(entry);
    }
    
    csvData.value = data;
    
    // Initialiser la nouvelle ligne avec les en-têtes
    resetNewRow();
  }
};

// Réinitialiser la nouvelle ligne
const resetNewRow = () => {
  newRow.value = {};
  headers.value.forEach(header => {
    newRow.value[header] = '';
  });
};

// Éditer une cellule
const editCell = (row, col) => {
  editingCell.row = row;
  editingCell.col = col;
  editingCell.value = csvData.value[row][headers.value[col]];
};

// Sauvegarder une modification
const saveEdit = () => {
  if (editingCell.row !== -1 && editingCell.col !== -1) {
    csvData.value[editingCell.row][headers.value[editingCell.col]] = editingCell.value;
    editingCell.row = -1;
    editingCell.col = -1;
  }
};

// Ajouter une nouvelle ligne
const addRow = () => {
  csvData.value.push({ ...newRow.value });
  resetNewRow();
  isEditing.value = false;
  showNotification('Ligne ajoutée avec succès', 'success');
};

// Supprimer une ligne
const deleteRow = (index) => {
  csvData.value.splice(index, 1);
  showNotification('Ligne supprimée', 'success');
};

// Exporter les données au format CSV
const exportCSV = () => {
  if (csvData.value.length === 0) {
    showNotification('Aucune donnée à exporter', 'error');
    return;
  }
  
  let content = exportOptions.includeHeaders 
    ? headers.value.join(exportOptions.delimiter) + '\n' 
    : '';
  
  csvData.value.forEach(row => {
    const values = headers.value.map(header => row[header] || '');
    content += values.join(exportOptions.delimiter) + '\n';
  });
  
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `export_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showNotification('Fichier exporté avec succès', 'success');
};

// Fonction pour sauvegarder vers le fichier par défaut
const saveToDefaultFile = () => {
  if (csvData.value.length === 0) {
    showNotification('Aucune donnée à sauvegarder', 'error');
    return;
  }
  
  let content = exportOptions.includeHeaders 
    ? headers.value.join(exportOptions.delimiter) + '\n' 
    : '';
  
  csvData.value.forEach(row => {
    const values = headers.value.map(header => row[header] || '');
    content += values.join(exportOptions.delimiter) + '\n';
  });
  
  // En production, cette fonction devrait envoyer les données à une API qui sauvegarderait le fichier côté serveur
  // Pour cette démo, nous allons simplement télécharger le fichier avec le nom modele_repas_finale.csv
  
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', defaultFileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showNotification('Fichier modèle enregistré avec succès', 'success');
  
  // Dans un environnement de production, vous pourriez faire quelque chose comme:
  /*
  fetch('/api/save-model', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  })
  .then(response => {
    if (!response.ok) throw new Error('Erreur lors de la sauvegarde');
    return response.json();
  })
  .then(data => {
    showNotification('Fichier modèle enregistré avec succès', 'success');
  })
  .catch(error => {
    showNotification(`Erreur lors de la sauvegarde: ${error.message}`, 'error');
  });
  */
};

// Afficher une notification
const showNotification = (message, type = 'success') => {
  notification.show = true;
  notification.message = message;
  notification.type = type;
  
  setTimeout(() => {
    notification.show = false;
  }, 3000);
};

// Vérifier si le fichier est valide
const isValidFile = (file) => {
  return file && file.type === 'text/csv';
};

// Réinitialiser tout
const resetAll = () => {
  file.value = null;
  fileName.value = '';
  csvData.value = [];
  headers.value = [];
  showPreview.value = false;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const resetForm = () => {
  newMeal.value = {
    nom: '',
    description: '',
    type: 'midi',
    saison: 'hiver',
    dimanche_midi: ''
  };
};

// Dans la fonction d'ajout de repas
const addMeal = () => {
  if (!newMeal.value.nom || !newMeal.value.description || !newMeal.value.type || !newMeal.value.saison) {
    showNotification('error', 'Veuillez remplir tous les champs obligatoires');
    return;
  }

  const meal = {
    ...newMeal.value,
    dimanche_midi: newMeal.value.type === 'midi' ? newMeal.value.dimanche_midi : ''
  };

  meals.value.push(meal);
  saveMeals();
  resetForm();
  showNotification('success', 'Repas ajouté avec succès');
};

// Dans la fonction d'édition
const editMeal = (index) => {
  const meal = meals.value[index];
  editingMeal.value = {
    ...meal,
    index,
    dimanche_midi: meal.type === 'midi' ? (meal.dimanche_midi || '') : ''
  };
  showEditModal.value = true;
};

// Dans le tableau d'affichage des repas
const columns = [
  { key: 'nom', label: 'Nom' },
  { key: 'description', label: 'Description' },
  { key: 'type', label: 'Type' },
  { key: 'saison', label: 'Saison' },
  { key: 'dimanche_midi', label: 'Dimanche Midi' }
];

onMounted(() => {
  // Charger automatiquement le fichier CSV par défaut
  loadDefaultCSV();
});
</script>

<template>
  <div class="p-6 bg-app">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-primary mb-4">Administration des Repas</h1>
      <p class="text-secondary mb-4">
        Importez et modifiez votre fichier CSV de repas. Le fichier doit contenir au minimum les colonnes : saison, type, nom, description.
      </p>
    </div>
    
    <!-- Notification -->
    <div 
      v-if="notification.show" 
      class="fixed top-20 right-4 p-4 rounded-lg shadow-md z-50 transition-all duration-300"
      :class="{
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100': notification.type === 'success',
        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100': notification.type === 'error'
      }"
    >
      <div class="flex items-center">
        <Icon 
          :icon="notification.type === 'success' ? 'ph:check-circle' : 'ph:x-circle'" 
          class="w-5 h-5 mr-2" 
        />
        <span>{{ notification.message }}</span>
      </div>
    </div>
    
    <div class="bg-card rounded-lg shadow-sm p-6 mb-6 border border-theme">
      <h2 class="text-xl font-semibold text-primary mb-4">Importer un fichier CSV</h2>
      
      <!-- Zone de glisser-déposer -->
      <div 
        class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 mb-4 text-center"
        @dragover="handleDragOver"
        @drop="handleDrop"
      >
        <div v-if="!file">
          <Icon icon="ph:upload" class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-2" />
          <p class="text-secondary mb-2">Glissez et déposez votre fichier CSV ici</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">ou</p>
          <input 
            type="file" 
            ref="fileInput"
            accept=".csv" 
            class="hidden" 
            @change="handleFileSelect"
          >
          <div class="flex flex-col sm:flex-row justify-center gap-3">
            <button 
              @click="fileInput.click()"
              class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Sélectionner un fichier
            </button>
            <button 
              @click="loadDefaultCSV"
              class="px-4 py-2 bg-success-500 text-white rounded-lg hover:bg-success-600 transition-colors"
              :disabled="isLoading"
            >
              <div class="flex items-center justify-center">
                <Icon v-if="isLoading" icon="ph:spinner" class="w-4 h-4 mr-2 animate-spin" />
                <span>Charger le fichier modèle</span>
              </div>
            </button>
          </div>
        </div>
        <div v-else class="flex flex-col items-center">
          <Icon icon="ph:file-csv" class="w-12 h-12 text-primary-500 mb-2" />
          <p class="text-secondary mb-2">{{ fileName }}</p>
          <div class="flex space-x-3 mt-2">
            <button 
              @click="resetAll"
              class="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Prévisualisation et édition -->
    <div v-if="showPreview" class="bg-card rounded-lg shadow-sm p-6 border border-theme">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-primary">Données du fichier</h2>
        <div class="flex space-x-2">
          <button 
            @click="isEditing = !isEditing"
            class="px-3 py-1.5 flex items-center text-sm rounded-lg transition-colors"
            :class="isEditing ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100'"
          >
            <Icon :icon="isEditing ? 'ph:check' : 'ph:plus'" class="w-4 h-4 mr-1" />
            {{ isEditing ? 'Terminer' : 'Ajouter une ligne' }}
          </button>
          <button 
            @click="exportCSV"
            class="px-3 py-1.5 flex items-center text-sm bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-100 rounded-lg hover:bg-success-200 dark:hover:bg-success-800 transition-colors"
          >
            <Icon icon="ph:download" class="w-4 h-4 mr-1" />
            Exporter CSV
          </button>
          <button 
            @click="saveToDefaultFile"
            class="px-3 py-1.5 flex items-center text-sm bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
          >
            <Icon icon="ph:floppy-disk" class="w-4 h-4 mr-1" />
            Enregistrer comme modèle
          </button>
        </div>
      </div>
      
      <!-- Tableau des données -->
      <div class="overflow-x-auto">
        <table class="w-full min-w-full border-collapse">
          <thead>
            <tr>
              <th class="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">#</th>
              <th 
                v-for="(header, index) in headers" 
                :key="index"
                class="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ header }}
              </th>
              <th class="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Formulaire d'ajout de ligne -->
            <tr v-if="isEditing" class="border-b border-gray-200 dark:border-gray-700">
              <td class="px-4 py-2 text-sm">+</td>
              <td 
                v-for="(header, index) in headers" 
                :key="index"
                class="px-4 py-2"
              >
                <div class="max-w-xs">
                  <select 
                    v-if="header === 'saison'"
                    v-model="newRow[header]"
                    class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-primary"
                  >
                    <option value="" disabled>Sélectionner...</option>
                    <option v-for="season in seasons" :key="season" :value="season">
                      {{ season === 'ete' ? 'été' : season }}
                    </option>
                  </select>
                  <select 
                    v-else-if="header === 'type'"
                    v-model="newRow[header]"
                    class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-primary"
                  >
                    <option value="" disabled>Sélectionner...</option>
                    <option v-for="type in mealTypes" :key="type" :value="type">
                      {{ type }}
                    </option>
                  </select>
                  <template v-else-if="header === 'dimanche_midi'">
                    <input 
                      type="checkbox"
                      v-model="newRow[header]"
                      class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-primary-500 focus:ring-primary-500"
                      :true-value="'oui'"
                      :false-value="''"
                    />
                  </template>
                  <input 
                    v-else
                    type="text" 
                    v-model="newRow[header]"
                    class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-primary"
                  />
                </div>
              </td>
              <td class="px-4 py-2">
                <button 
                  @click="addRow"
                  class="p-1.5 text-sm bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-100 rounded hover:bg-success-200 dark:hover:bg-success-800 transition-colors"
                >
                  <Icon icon="ph:check" class="w-4 h-4" />
                </button>
              </td>
            </tr>
            
            <!-- Lignes de données -->
            <tr 
              v-for="(row, rowIndex) in csvData" 
              :key="rowIndex"
              class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td class="px-4 py-2 text-sm text-secondary">{{ rowIndex + 1 }}</td>
              <td 
                v-for="(header, colIndex) in headers" 
                :key="colIndex"
                class="px-4 py-2"
                @dblclick="editCell(rowIndex, colIndex)"
              >
                <div v-if="editingCell.row === rowIndex && editingCell.col === colIndex" class="max-w-xs">
                  <div class="flex items-center">
                    <template v-if="header === 'dimanche_midi'">
                      <input 
                        type="checkbox"
                        v-model="editingCell.value"
                        class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-primary-500 focus:ring-primary-500"
                        :true-value="'oui'"
                        :false-value="''"
                        @change="saveEdit"
                      />
                    </template>
                    <input 
                      v-else
                      type="text" 
                      v-model="editingCell.value" 
                      class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-primary"
                      @keyup.enter="saveEdit"
                      @blur="saveEdit"
                      ref="editInput"
                      autofocus
                    />
                  </div>
                </div>
                <div v-else class="truncate max-w-xs">
                  <template v-if="header === 'dimanche_midi'">
                    <input 
                      type="checkbox"
                      :checked="row[header] === 'oui'"
                      class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-primary-500 focus:ring-primary-500"
                      disabled
                    />
                  </template>
                  <template v-else>
                    {{ row[header] }}
                  </template>
                </div>
              </td>
              <td class="px-4 py-2">
                <button 
                  @click="deleteRow(rowIndex)"
                  class="p-1.5 text-sm bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                >
                  <Icon icon="ph:trash" class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Message si aucune donnée -->
      <div v-if="csvData.length === 0" class="p-8 text-center text-secondary">
        <p>Aucune donnée trouvée dans le fichier.</p>
      </div>
      
      <!-- Statistiques -->
      <div v-else class="mt-4 text-sm text-secondary">
        <p>{{ csvData.length }} repas chargés</p>
      </div>
    </div>
    
    <!-- Aide et instructions -->
    <div class="bg-card rounded-lg shadow-sm p-6 mt-6 border border-theme">
      <h2 class="text-xl font-semibold text-primary mb-4">Aide et Instructions</h2>
      
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-medium text-primary mb-2">Format CSV requis</h3>
          <p class="text-secondary mb-2">Votre fichier CSV doit contenir les colonnes suivantes :</p>
          <ul class="list-disc pl-5 text-secondary">
            <li><strong>saison</strong> : hiver, printemps, ete, automne</li>
            <li><strong>type</strong> : midi, soir</li>
            <li><strong>nom</strong> : nom du repas</li>
            <li><strong>description</strong> : description du repas (optionnelle)</li>
          </ul>
        </div>
        
        <div>
          <h3 class="text-lg font-medium text-primary mb-2">Exemple de contenu</h3>
          <div class="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
            <pre class="text-sm text-secondary">saison,type,nom,description
hiver,midi,Soupe de légumes,Soupe chaude avec carottes et pommes de terre
hiver,soir,Gratin de pâtes,Pâtes avec sauce béchamel et fromage
printemps,midi,Salade composée,Salade fraîche avec tomates et concombres
ete,soir,Barbecue,Viandes grillées et légumes d'été
automne,midi,Velouté de potiron,Soupe onctueuse à base de potiron et crème</pre>
          </div>
        </div>
        
        <div>
          <h3 class="text-lg font-medium text-primary mb-2">Fonctionnalités</h3>
          <ul class="list-disc pl-5 text-secondary">
            <li>Double-cliquez sur une cellule pour la modifier</li>
            <li>Utilisez le bouton "Ajouter une ligne" pour ajouter un nouveau repas</li>
            <li>Exportez vos modifications avec le bouton "Exporter CSV"</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 