<template>
  <div class="flex flex-col h-[calc(100vh-4rem)]">
    <!-- En-tête avec les contrôles -->
    <div class="flex-none bg-white border-b border-gray-200 no-print">
      <!-- Titre avec bouton pour replier/déplier -->
      <div 
        class="flex items-center justify-between px-6 py-4 cursor-pointer"
        @click="toggleFilters"
      >
        <h2 class="text-lg font-medium text-gray-900">Configuration du planning</h2>
        <div class="flex items-center text-gray-500">
          <span class="mr-2 text-sm">{{ showFilters ? 'Masquer les filtres' : 'Afficher les filtres' }}</span>
          <Icon 
            :icon="showFilters ? 'ph:caret-up' : 'ph:caret-down'" 
            class="w-5 h-5 transition-transform"
          />
        </div>
      </div>

      <!-- Contenu de l'accordéon -->
      <div 
        v-show="showFilters"
        class="w-full p-6 pt-0 transition-all duration-300"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Sélection des semaines -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nombre de semaines
            </label>
            <input 
              v-model="weeks" 
              type="number" 
              min="1" 
              max="4"
              class="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <!-- Sélection de la saison -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Saison
            </label>
            <select 
              v-model="season"
              class="w-full px-3 py-2 border rounded-md"
            >
              <option v-for="(s, key) in seasons" :key="key" :value="key">
                {{ s.label }}
              </option>
            </select>
          </div>

          <!-- Remarque sur le fichier modèle -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Source des repas
            </label>
            <div class="w-full px-4 py-2 bg-blue-50 text-blue-800 rounded-md">
              <div class="flex items-center">
                <Icon icon="ph:info" class="flex-shrink-0 w-5 h-5 mr-2" />
                <span>Utilisation du fichier modèle</span>
              </div>
              <p class="text-xs mt-1">
                Les repas sont gérés via l'interface d'administration
              </p>
            </div>
          </div>
        </div>

        <!-- Grille de sélection des repas -->
        <div class="mt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Sélection des repas
          </h3>
          <div class="space-y-4">
            <div v-for="(week, weekIndex) in selectedMeals" :key="weekIndex" class="space-y-2">
              <h4 class="font-medium text-gray-700">
                Semaine {{ weekIndex + 1 }}
              </h4>
              <div class="grid grid-cols-7 gap-2">
                <div v-for="(day, dayIndex) in week" :key="dayIndex" class="space-y-2">
                  <div class="text-sm text-gray-600">
                    {{ ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][dayIndex] }}
                  </div>
                  <label class="flex items-center space-x-2">
                    <input 
                      v-model="day.lunch"
                      type="checkbox"
                      class="rounded border-gray-300 focus:ring-primary-500"
                    />
                    <span class="text-sm text-gray-700">Midi</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input 
                      v-model="day.dinner"
                      type="checkbox"
                      class="rounded border-gray-300 focus:ring-primary-500"
                    />
                    <span class="text-sm text-gray-700">Soir</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bouton de génération -->
        <div class="mt-6">
          <button 
            @click="generateMeals"
            class="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Générer le planning
          </button>
        </div>
      </div>
    </div>

    <!-- Affichage des repas générés -->
    <div v-if="generatedMeals.length > 0" class="flex-1 overflow-auto">
      <div class="p-6">
        <div class="w-full space-y-6">
          <!-- Actions -->
          <div class="flex justify-end space-x-4 no-print">
            <button 
              @click="printMeals"
              class="px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 border border-gray-300 flex items-center shadow-sm"
            >
              <Icon icon="ph:printer" class="inline-block mr-2 w-5 h-5 text-primary-500" />
              Imprimer
            </button>
            <button 
              @click="exportToCsv"
              class="px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 border border-gray-300 flex items-center shadow-sm"
            >
              <Icon icon="ph:file-csv" class="inline-block mr-2 w-5 h-5 text-primary-500" />
              Exporter (CSV)
            </button>
            <button 
              @click="sendByEmail"
              class="px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 border border-gray-300 flex items-center shadow-sm"
            >
              <Icon icon="ph:envelope" class="inline-block mr-2 w-5 h-5 text-primary-500" />
              Envoyer par email
            </button>
          </div>

          <!-- Planning des repas -->
          <div v-for="(week, weekIndex) in generatedMeals" :key="weekIndex" class="bg-white rounded-lg shadow overflow-hidden">
            <div class="p-4 bg-gray-50">
              <h3 class="text-lg font-medium text-gray-800">Semaine {{ weekIndex + 1 }}</h3>
            </div>
            <div class="p-4">
              <table class="w-full">
                <thead>
                  <tr>
                    <th class="w-1/8 text-left py-2 text-sm font-medium text-gray-600">Type</th>
                    <th v-for="day in ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']" 
                        :key="day" 
                        class="w-1/8 text-left py-2 text-sm font-medium text-gray-600">
                      {{ day }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <!-- Repas du midi -->
                  <tr class="border-t border-gray-200">
                    <td class="py-4 text-sm font-medium text-gray-600">Midi</td>
                    <td v-for="(day, dayIndex) in week.lunch" :key="dayIndex" class="py-4">
                      <div class="bg-gray-50 rounded p-3">
                        <div class="text-sm font-medium text-gray-800">{{ day.name }}</div>
                        <div class="text-xs text-gray-600 mt-1">{{ day.description }}</div>
                      </div>
                    </td>
                  </tr>
                  <!-- Repas du soir -->
                  <tr class="border-t border-gray-200">
                    <td class="py-4 text-sm font-medium text-gray-600">Soir</td>
                    <td v-for="(day, dayIndex) in week.dinner" :key="dayIndex" class="py-4">
                      <div class="bg-gray-50 rounded p-3">
                        <div class="text-sm font-medium text-gray-800">{{ day.name }}</div>
                        <div class="text-xs text-gray-600 mt-1">{{ day.description }}</div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Liste des ingrédients -->
          <div class="bg-white rounded-lg shadow">
            <div class="p-4 bg-gray-50">
              <h3 class="text-lg font-medium">Liste des ingrédients</h3>
            </div>
            <div class="p-4">
              <div v-for="(ingredients, category) in totalIngredients" :key="category" class="mb-4">
                <h4 class="font-medium mb-2">{{ category }}</h4>
                <ul class="space-y-1">
                  <li v-for="(quantity, ingredient) in ingredients" :key="ingredient" class="text-sm">
                    {{ ingredient }}: {{ quantity }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification -->
    <div 
      v-if="notification.show"
      :class="[
        'fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-lg',
        {
          'bg-green-500': notification.type === 'success',
          'bg-red-500': notification.type === 'error',
          'bg-blue-500': notification.type === 'info'
        }
      ]"
    >
      <div class="text-white">{{ notification.message }}</div>
    </div>
  </div>
</template>


<script setup>
import { ref, watch, computed, inject, onMounted } from 'vue';
import { Icon } from '@iconify/vue';

// Injections
const isSidebarOpen = inject('isSidebarOpen');
const toggleSidebar = inject('toggleSidebar', () => {});  // Injection avec valeur par défaut

// Fonction pour déterminer la saison actuelle
const getCurrentSeason = () => {
  const now = new Date();
  const month = now.getMonth(); // 0-11: janvier = 0, décembre = 11
  
  // Printemps: mars (2), avril (3), mai (4)
  if (month >= 2 && month <= 4) {
    return 'printemps';
  }
  // Été: juin (5), juillet (6), août (7)
  else if (month >= 5 && month <= 7) {
    return 'ete';
  }
  // Automne: septembre (8), octobre (9), novembre (10)
  else if (month >= 8 && month <= 10) {
    return 'automne';
  }
  // Hiver: décembre (11), janvier (0), février (1)
  else {
    return 'hiver';
  }
};

// État local
const weeks = ref(1);
const season = ref(getCurrentSeason());
const mealTypes = ref(['lunch', 'dinner']);
const fileName = ref('modele_repas_finale.csv');
const notification = ref({ show: false, type: '', message: '' });
const generatedMeals = ref([]);
const meals = ref([]);
const loading = ref(false);
const selectedMeals = ref([]);
const showFilters = ref(true);

// Configuration des saisons
const seasons = {
  hiver: { icon: 'ph:snowflake', label: 'Hiver', months: [11, 0, 1] }, // déc, jan, fév
  printemps: { icon: 'ph:flower', label: 'Printemps', months: [2, 3, 4] }, // mar, avr, mai
  ete: { icon: 'ph:sun', label: 'Été', months: [5, 6, 7] }, // juin, juil, août
  automne: { icon: 'ph:leaf', label: 'Automne', months: [8, 9, 10] } // sep, oct, nov
};

// Watchers
watch(weeks, (newWeeks) => {
  selectedMeals.value = Array(newWeeks).fill().map(() => 
    Array(7).fill().map(() => ({
      lunch: true,
      dinner: true
    }))
  );
}, { immediate: true });

// Fonction pour basculer l'affichage des filtres
const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

// Charger le fichier de repas par défaut
const loadDefaultMeals = async () => {
  try {
    loading.value = true;
    const response = await fetch('/modele_repas_finale.csv');
    if (!response.ok) {
      throw new Error(`Erreur lors du chargement du fichier: ${response.status}`);
    }
    
    const content = await response.text();
    parseCSV(content);
    showNotification('success', 'Fichier modèle chargé avec succès');
  } catch (error) {
    console.error('Erreur lors du chargement du fichier modèle:', error);
    showNotification('error', `Impossible de charger le fichier modèle: ${error.message}`);
  } finally {
    loading.value = false;
  }
};

// Analyser le fichier CSV
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
  
  // Extraction des en-têtes
  if (lines.length > 0) {
    const headers = lines[0].split(delimiter).map(header => header.trim());
    
    // Traitement des données
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue;
      
      const values = lines[i].split(delimiter);
      const entry = {};
      
      headers.forEach((header, index) => {
        entry[header] = values[index] ? values[index].trim() : '';
      });
      
      data.push(entry);
    }
    
    meals.value = data;
  }
};

// Fonctions utilitaires
const showNotification = (type, message) => {
  const showToast = inject('showToast');
  if (showToast) {
    showToast({
      type,
      message,
      title: type === 'success' ? 'Succès' : type === 'error' ? 'Erreur' : 'Information'
    });
  } else {
    // Fallback au cas où le provider n'existe pas
    notification.value = { show: true, type, message };
    setTimeout(() => {
      notification.value.show = false;
    }, 3000);
  }
};

// Charger les repas au montage du composant
onMounted(() => {
  loadDefaultMeals();
});

// Génération des repas
const generateMeals = () => {
  if (meals.value.length === 0) {
    showNotification('error', 'Aucun repas disponible. Veuillez vérifier le fichier modèle.');
    return;
  }

  // Filtrer les repas selon la saison sélectionnée
  const seasonMeals = {
    lunch: meals.value.filter(meal => 
      meal.saison === season.value && 
      meal.type === 'midi' && 
      meal.dimanche_midi !== 'oui'
    ),
    dinner: meals.value.filter(meal => 
      meal.saison === season.value && 
      meal.type === 'soir'
    ),
    sundayLunch: meals.value.filter(meal => 
      meal.saison === season.value && 
      meal.type === 'midi' && 
      meal.dimanche_midi === 'oui'
    )
  };

  // Vérifier si nous avons des repas pour midi et soir
  if (seasonMeals.lunch.length === 0 || seasonMeals.dinner.length === 0) {
    showNotification('error', `Aucun repas trouvé pour la saison "${seasons[season.value].label}"`);
    return;
  }

  // Vérifier si nous avons des repas spéciaux pour le dimanche midi
  if (seasonMeals.sundayLunch.length === 0) {
    showNotification('warning', 'Aucun repas spécial trouvé pour le dimanche midi');
    return;
  }

  // Générer le planning de repas
  const result = [];

  for (let weekIndex = 0; weekIndex < weeks.value; weekIndex++) {
    const weekMeals = {
      lunch: Array(7).fill(null),
      dinner: Array(7).fill(null)
    };

    // Générer les repas pour chaque jour de la semaine
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const dayConfig = selectedMeals.value[weekIndex][dayIndex];
      const isSunday = dayIndex === 6;

      if (dayConfig.lunch) {
        let meal;
        if (isSunday) {
          // Pour le dimanche midi, sélectionner uniquement parmi les repas spéciaux dimanche
          if (seasonMeals.sundayLunch.length > 0) {
            const randomIndex = Math.floor(Math.random() * seasonMeals.sundayLunch.length);
            meal = seasonMeals.sundayLunch[randomIndex];
            // Éviter les doublons si possible
            if (seasonMeals.sundayLunch.length > weeks.value) {
              seasonMeals.sundayLunch.splice(randomIndex, 1);
            }
          } else {
            // Si pas de repas spécial dimanche, afficher un message d'erreur
            showNotification('error', 'Aucun repas spécial disponible pour le dimanche midi');
            return;
          }
        } else {
          // Pour les autres jours, sélectionner un repas normal
          const randomIndex = Math.floor(Math.random() * seasonMeals.lunch.length);
          meal = seasonMeals.lunch[randomIndex];
          // Retirer le repas pour éviter les doublons (à moins qu'il n'y ait pas assez de repas)
          if (seasonMeals.lunch.length > 7) {
            seasonMeals.lunch.splice(randomIndex, 1);
          }
        }
        weekMeals.lunch[dayIndex] = {
          name: meal.nom,
          description: meal.description
        };
      } else {
        weekMeals.lunch[dayIndex] = { name: '', description: '' };
      }

      if (dayConfig.dinner) {
        const randomIndex = Math.floor(Math.random() * seasonMeals.dinner.length);
        const meal = seasonMeals.dinner[randomIndex];
        weekMeals.dinner[dayIndex] = {
          name: meal.nom,
          description: meal.description
        };
        // Retirer le repas pour éviter les doublons (à moins qu'il n'y ait pas assez de repas)
        if (seasonMeals.dinner.length > 7) {
          seasonMeals.dinner.splice(randomIndex, 1);
        }
      } else {
        weekMeals.dinner[dayIndex] = { name: '', description: '' };
      }
    }

    result.push(weekMeals);
  }

  generatedMeals.value = result;
  computeTotalIngredients();
  showNotification('success', 'Planning généré avec succès');
  
  // Replier automatiquement les filtres après génération
  showFilters.value = false;
};

// Calculer les ingrédients totaux
const totalIngredients = ref({});

// Fonction pour calculer le total des ingrédients
const computeTotalIngredients = () => {
  // Dans une version complète, cette fonction pourrait extraire les ingrédients des recettes
  // Pour l'instant, nous utilisons une structure simplifiée
  
  totalIngredients.value = {
    'Légumes': {
      'Variés selon les saisons': `${generatedMeals.value.length * 7} repas`
    },
    'Protéines': {
      'Selon les recettes': 'Quantité à adapter'
    },
    'Accompagnements': {
      'Féculents et autres': 'Selon les besoins'
    }
  };
};

// Export et impression
const printMeals = () => {
  window.print();
};

const exportToCsv = () => {
  const csvContent = [
    ['Semaine', 'Jour', 'Type', 'Repas', 'Description', 'Saison'],
    ...generatedMeals.value.flatMap((week, weekIndex) => {
      const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
      return [
        ...week.lunch.map((meal, dayIndex) => [
          weekIndex + 1,
          days[dayIndex],
          'Midi',
          meal.name,
          meal.description,
          seasons[season.value]?.label || season.value
        ]),
        ...week.dinner.map((meal, dayIndex) => [
          weekIndex + 1,
          days[dayIndex],
          'Soir',
          meal.name,
          meal.description,
          seasons[season.value]?.label || season.value
        ])
      ];
    })
  ]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `planning_repas_${seasons[season.value].label}_${weeks.value}_semaines.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

// Fonction pour envoyer par email
const sendByEmail = () => {
  // Préparer le contenu
  const subject = `Planning repas - ${seasons[season.value].label} - ${weeks.value} semaine${weeks.value > 1 ? 's' : ''}`;
  
  // Construction du corps du message
  let body = `Planning repas - ${seasons[season.value].label}\n\n`;
  
  // Ajouter les repas
  generatedMeals.value.forEach((week, weekIndex) => {
    body += `SEMAINE ${weekIndex + 1}\n`;
    body += `-----------------\n\n`;
    
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    
    days.forEach((day, dayIndex) => {
      const lunch = week.lunch[dayIndex];
      const dinner = week.dinner[dayIndex];
      
      body += `${day}:\n`;
      body += `  Midi: ${lunch.name} - ${lunch.description}\n`;
      body += `  Soir: ${dinner.name} - ${dinner.description}\n\n`;
    });
    
    body += '\n';
  });
  
  // Ajouter la liste des ingrédients
  body += `LISTE DES INGRÉDIENTS\n`;
  body += `-------------------\n\n`;
  
  Object.entries(totalIngredients.value).forEach(([category, ingredients]) => {
    body += `${category}:\n`;
    Object.entries(ingredients).forEach(([ingredient, quantity]) => {
      body += `  ${ingredient}: ${quantity}\n`;
    });
    body += '\n';
  });
  
  // Encoder pour l'URL
  const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  // Ouvrir le client mail de l'utilisateur
  window.location.href = mailtoLink;
  
  showNotification('info', 'Ouverture de votre client de messagerie...');
};
</script>

<style>
@media print {
  .no-print {
    display: none !important;
  }
  
  @page {
    size: A4;
    margin: 1cm;
  }
  
  body {
    background: white;
  }

  /* Masquer complètement le header */
  .flex-none {
    display: none !important;
  }

  /* Ajuster la hauteur du conteneur principal pour l'impression */
  .flex-col {
    height: auto !important;
    margin-left: 0 !important;
    padding-left: 0 !important;
  }
  
  .flex-1 {
    overflow: visible !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  
  .bg-white {
    background-color: white !important;
    color: black !important;
  }
  
  .dark\:bg-gray-800,
  .dark\:bg-gray-700,
  .bg-gray-50 {
    background-color: white !important;
    color: black !important;
  }
  
  .dark\:text-gray-200,
  .dark\:text-gray-400,
  .text-gray-600,
  .text-gray-800 {
    color: black !important;
  }
  
  .shadow {
    box-shadow: none !important;
  }
  
  .rounded-lg {
    border: 1px solid #ddd;
  }

  /* Optimisation de la mise en page pour l'impression */
  table {
    page-break-inside: avoid;
    width: 100% !important;
  }

  tr {
    page-break-inside: avoid;
  }

  .p-6 {
    padding: 0.5cm !important;
  }

  /* Ajuster les marges du contenu principal */
  .flex-1 > div {
    padding-top: 0 !important;
  }
}
</style>