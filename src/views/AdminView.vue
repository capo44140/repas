<script setup>
import { ref, reactive, onMounted, inject } from 'vue';
import { Icon } from '@iconify/vue';
import { dataSourceService } from '../services/dataSource';
import { neonService } from '../services/neon';

// Injection du mode sombre
const isDarkMode = inject('isDarkMode', ref(false));

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

const repasList = ref([]);
const currentId = ref(null);
const dataSource = ref('csv');

const form = ref({
  nom: '',
  type: '',
  saison: '',
  temps_preparation: null,
  temps_cuisson: null,
  temps_repos: null,
  temps_total: null,
  difficulte: '',
  cout: '',
  calories: null,
  ingredients: '',
  instructions: '',
  notes: '',
  image_url: ''
});

// Charger la liste des repas
const loadRepas = async () => {
  try {
    repasList.value = await dataSourceService.loadRepas();
  } catch (error) {
    console.error('Erreur lors du chargement des repas:', error);
    showNotification('Erreur lors du chargement des repas', 'error');
  }
};

// Changer la source de données
const changeDataSource = async () => {
  try {
    dataSourceService.setDataSource(dataSource.value);
    await loadRepas();
  } catch (error) {
    console.error('Erreur lors du changement de source:', error);
    showNotification('Erreur lors du changement de source de données', 'error');
  }
};

// Réinitialiser le formulaire
const resetForm = () => {
  form.value = {
    nom: '',
    type: '',
    saison: '',
    temps_preparation: null,
    temps_cuisson: null,
    temps_repos: null,
    temps_total: null,
    difficulte: '',
    cout: '',
    calories: null,
    ingredients: '',
    instructions: '',
    notes: '',
    image_url: ''
  };
  
  // Réinitialisation des champs supplémentaires
  newMeal.value = {
    nom: '',
    description: '',
    type: 'midi',
    saison: 'hiver',
    dimanche_midi: ''
  };
  
  isEditing.value = false;
  currentId.value = null;
};

// Gérer la soumission du formulaire
const handleSubmit = async () => {
  try {
    const repasData = {
      ...form.value,
      ingredients: form.value.ingredients.split('\n').filter(i => i.trim()),
      instructions: form.value.instructions.split('\n').filter(i => i.trim())
    };

    if (isEditing.value) {
      await dataSourceService.updateRepas(currentId.value, repasData);
      showNotification('Repas mis à jour avec succès', 'success');
    } else {
      await dataSourceService.addRepas(repasData);
      showNotification('Repas ajouté avec succès', 'success');
    }

    await loadRepas();
    resetForm();
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du repas:', error);
    showNotification(error.message, 'error');
  }
};

// Éditer un repas
const editRepas = (repas) => {
  if (dataSource.value === 'csv') {
    showNotification('La modification n\'est pas disponible en mode CSV', 'error');
    return;
  }
  
  form.value = {
    ...repas,
    ingredients: Array.isArray(repas.ingredients) ? repas.ingredients.join('\n') : '',
    instructions: Array.isArray(repas.instructions) ? repas.instructions.join('\n') : ''
  };
  isEditing.value = true;
  currentId.value = repas.id;
};

// Supprimer un repas
const deleteRepas = async (id) => {
  if (dataSource.value === 'csv') {
    showNotification('La suppression n\'est pas disponible en mode CSV', 'error');
    return;
  }

  if (confirm('Êtes-vous sûr de vouloir supprimer ce repas ?')) {
    try {
      await dataSourceService.deleteRepas(id);
      await loadRepas();
      showNotification('Repas supprimé avec succès', 'success');
    } catch (error) {
      console.error('Erreur lors de la suppression du repas:', error);
      showNotification(error.message, 'error');
    }
  }
};

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
  const showToast = inject('showToast');
  if (showToast) {
    showToast({
      type,
      message,
      title: type === 'success' ? 'Succès' : type === 'error' ? 'Erreur' : 'Information'
    });
  } else {
    notification.show = true;
    notification.message = message;
    notification.type = type;
    
    setTimeout(() => {
      notification.show = false;
    }, 3000);
  }
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

// Fonction pour importer les repas vers Neon
const importToNeon = async () => {
  try {
    // Charger les repas depuis le CSV
    const csvRepas = await dataSourceService.loadRepas();
    
    // Importer chaque repas vers Neon
    for (const repas of csvRepas) {
      await neonService.addRepas(repas);
    }

    // Afficher un message de succès
    alert('Importation réussie ! Les repas ont été importés vers la base Neon.');
    
    // Recharger la liste des repas
    await loadRepas();
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
    alert('Erreur lors de l\'importation des repas vers Neon.');
  }
};

// Fonction pour gérer les erreurs de chargement d'image
const handleImageError = (event) => {
  event.target.src = ''; // Effacer l'URL de l'image en cas d'erreur
  event.target.parentElement.innerHTML = `
    <div class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md">
      <svg class="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  `;
};

onMounted(() => {
  // Charger automatiquement le fichier CSV par défaut
  loadDefaultCSV();
  loadRepas();
});
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold" :class="{ 'text-gray-900': !isDarkMode, 'text-white': isDarkMode }">
        Administration des repas
      </h1>
      <div class="flex items-center space-x-4">
        <label class="text-sm font-medium" :class="{ 'text-gray-700': !isDarkMode, 'text-gray-300': isDarkMode }">
          Source de données:
        </label>
        <select 
          v-model="dataSource" 
          @change="changeDataSource"
          class="px-3 py-2 border rounded-md"
          :class="{
            'bg-white border-gray-300 text-gray-900': !isDarkMode,
            'bg-gray-700 border-gray-600 text-white': isDarkMode
          }"
        >
          <option value="csv">Fichier CSV</option>
          <option value="neon">Base de données Neon</option>
        </select>

        <!-- Bouton d'importation vers Neon -->
        <button 
          v-if="dataSource === 'csv'"
          @click="importToNeon"
          class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <Icon icon="ph:arrow-right" class="w-5 h-5" />
          <span>Importer vers Neon</span>
        </button>
      </div>
    </div>

    <!-- Notification -->
    <div v-if="notification.show"
      class="fixed top-4 right-4 p-4 rounded-lg shadow-lg transition-all duration-300"
      :class="{
        'bg-green-100 text-green-800': notification.type === 'success',
        'bg-red-100 text-red-800': notification.type === 'error'
      }">
      {{ notification.message }}
    </div>

    <!-- Formulaire d'ajout/modification -->
    <div v-if="dataSource === 'neon'" 
      class="rounded-lg shadow p-6 mb-6"
      :class="{
        'bg-white': !isDarkMode,
        'bg-gray-800': isDarkMode
      }"
    >
      <h2 class="text-xl font-semibold mb-4" :class="{ 'text-gray-900': !isDarkMode, 'text-white': isDarkMode }">
        {{ isEditing ? 'Modifier le repas' : 'Ajouter un repas' }}
      </h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom</label>
            <input v-model="form.nom" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
            <select v-model="form.type" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
              <option value="entrée">Entrée</option>
              <option value="plat">Plat</option>
              <option value="dessert">Dessert</option>
              <option value="boisson">Boisson</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Saison</label>
            <select v-model="form.saison" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
              <option value="printemps">Printemps</option>
              <option value="été">Été</option>
              <option value="automne">Automne</option>
              <option value="hiver">Hiver</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Difficulté</label>
            <select v-model="form.difficulte"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
              <option value="facile">Facile</option>
              <option value="moyen">Moyen</option>
              <option value="difficile">Difficile</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Coût</label>
            <select v-model="form.cout"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
              <option value="€">€</option>
              <option value="€€">€€</option>
              <option value="€€€">€€€</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Calories</label>
            <input v-model="form.calories" type="number"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Temps de préparation (min)</label>
            <input v-model="form.temps_preparation" type="number"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Temps de cuisson (min)</label>
            <input v-model="form.temps_cuisson" type="number"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Temps de repos (min)</label>
            <input v-model="form.temps_repos" type="number"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Temps total (min)</label>
            <input v-model="form.temps_total" type="number"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Ingrédients</label>
            <textarea v-model="form.ingredients" rows="4"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="Un ingrédient par ligne"></textarea>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Instructions</label>
            <textarea v-model="form.instructions" rows="4"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="Une instruction par ligne"></textarea>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
            <textarea v-model="form.notes" rows="2"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"></textarea>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">URL de l'image</label>
            <input v-model="form.image_url" type="url"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
          </div>
        </div>
        <div class="flex justify-end space-x-4">
          <button type="button" @click="resetForm"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
            Réinitialiser
          </button>
          <button type="submit"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            {{ isEditing ? 'Mettre à jour' : 'Ajouter' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Liste des repas -->
    <div class="rounded-lg shadow overflow-hidden"
      :class="{
        'bg-white': !isDarkMode,
        'bg-gray-800': isDarkMode
      }"
    >
      <div class="px-6 py-4 border-b"
        :class="{
          'border-gray-200': !isDarkMode,
          'border-gray-700': isDarkMode
        }"
      >
        <h2 class="text-xl font-semibold" :class="{ 'text-gray-900': !isDarkMode, 'text-white': isDarkMode }">
          Liste des repas
        </h2>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Image</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nom</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Saison</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="repas in repasList" :key="repas.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="repas.image_url" class="w-16 h-16 relative">
                  <img 
                    :src="repas.image_url" 
                    :alt="repas.nom"
                    class="w-full h-full object-cover rounded-md"
                    @error="handleImageError"
                  />
                </div>
                <div v-else class="w-16 h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md">
                  <Icon icon="ph:image" class="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{{ repas.nom }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ repas.type }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ repas.saison }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                <button @click="editRepas(repas)"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                  Modifier
                </button>
                <button @click="deleteRepas(repas.id)"
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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