<script setup>
import { ref, reactive, onMounted, inject } from 'vue';
import { Icon } from '@iconify/vue';
import { dataSourceService } from '../services/dataSource';
import { neonService } from '../services/neon';
import { useRouter } from 'vue-router';

// Injection du mode sombre
const isDarkMode = inject('isDarkMode', ref(false));

const notification = reactive({ show: false, message: '', type: 'success' });
const isEditing = ref(false);
const seasons = ['hiver', 'printemps', 'ete', 'automne'];
const mealTypes = ['midi', 'soir'];
const isLoading = ref(false);
const isUpdating = ref(false);

const repasList = ref([]);
const currentId = ref(null);

const form = ref({
  nom: '',
  type: '',
  saison: '',
  moment_journee: 'midi',
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

const router = useRouter();

// Charger la liste des repas
const loadRepas = async () => {
  try {
    repasList.value = await neonService.getAllRepas();
  } catch (error) {
    console.error('Erreur lors du chargement des repas:', error);
    showNotification('Erreur lors du chargement des repas', 'error');
  }
};

// Réinitialiser le formulaire
const resetForm = () => {
  form.value = {
    nom: '',
    type: '',
    saison: '',
    moment_journee: 'midi',
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
  
  isEditing.value = false;
  currentId.value = null;
};

// Gérer la soumission du formulaire
const handleSubmit = async () => {
  try {
    // Validation des champs obligatoires
    if (!form.value.nom || !form.value.type || !form.value.saison || !form.value.moment_journee) {
      showNotification('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

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

// Fonction de déconnexion
const logout = () => {
  localStorage.removeItem('isAdminLoggedIn');
  router.push('/login');
};

// Fonction pour mettre à jour une recette depuis Spoonacular
const updateFromSpoonacular = async (repas) => {
  try {
    if (!repas.id) {
      showNotification('Impossible de mettre à jour : ID manquant', 'error');
      return;
    }

    isUpdating.value = true;
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=e7407f7f279942d782551bdd5bd3fb88&query=${encodeURIComponent(repas.nom)}&number=1&addRecipeInformation=true`
    );
    const data = await response.json();
    
    if (data.results && data.results[0]) {
      const recipeData = data.results[0];
      
      // Convertir les ingrédients et instructions en tableaux
      const ingredientsArray = recipeData.extendedIngredients?.map(ing => 
        `${ing.amount} ${ing.unit} ${ing.name}`
      ) || [];

      const instructionsArray = recipeData.analyzedInstructions?.[0]?.steps?.map(step => 
        step.step
      ) || [];
      
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
        ingredients: ingredientsArray,
        instructions: instructionsArray,
        image_url: recipeData.image || repas.image_url,
        notes: `Source: Spoonacular\nTemps de préparation: ${recipeData.readyInMinutes} minutes\nPortions: ${recipeData.servings}`
      };

      console.log('ID du repas à mettre à jour:', repas.id);
      console.log('Données mises à jour:', updatedRepas);

      // Mettre à jour directement avec le service Neon
      const result = await neonService.updateRepas(repas.id, updatedRepas);
      console.log('Résultat de la mise à jour:', result);
      
      await loadRepas();
      showNotification('Recette mise à jour avec succès depuis Spoonacular', 'success');
    } else {
      showNotification('Aucune donnée trouvée pour cette recette', 'error');
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    showNotification('Erreur lors de la mise à jour de la recette', 'error');
  } finally {
    isUpdating.value = false;
  }
};

onMounted(() => {
  loadRepas();
});
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Administration des repas</h1>
      <div class="flex items-center space-x-4">
        <button 
          @click="logout"
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <Icon icon="ph:sign-out" class="w-5 h-5" />
          <span>Déconnexion</span>
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
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        {{ form.id ? 'Modifier un repas' : 'Ajouter un repas' }}
      </h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nom du repas <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="form.nom" 
              type="text" 
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Type <span class="text-red-500">*</span>
            </label>
            <select 
              v-model="form.type" 
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Sélectionner un type</option>
              <option value="Entrée">Entrée</option>
              <option value="Plat principal">Plat principal</option>
              <option value="Dessert">Dessert</option>
              <option value="Accompagnement">Accompagnement</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Saison <span class="text-red-500">*</span>
            </label>
            <select 
              v-model="form.saison" 
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Sélectionner une saison</option>
              <option value="hiver">Hiver</option>
              <option value="printemps">Printemps</option>
              <option value="ete">Été</option>
              <option value="automne">Automne</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Moment de la journée <span class="text-red-500">*</span>
            </label>
            <select 
              v-model="form.moment_journee" 
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="midi">Midi</option>
              <option value="soir">Soir</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Temps de préparation (min)</label>
            <input 
              v-model="form.temps_preparation" 
              type="number" 
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Temps de cuisson (min)</label>
            <input 
              v-model="form.temps_cuisson" 
              type="number" 
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Temps de repos (min)</label>
            <input 
              v-model="form.temps_repos" 
              type="number" 
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Temps total (min)</label>
            <input 
              v-model="form.temps_total" 
              type="number" 
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Difficulté</label>
            <select 
              v-model="form.difficulte" 
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Sélectionner une difficulté</option>
              <option value="Facile">Facile</option>
              <option value="Moyen">Moyen</option>
              <option value="Difficile">Difficile</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Coût</label>
            <select 
              v-model="form.cout" 
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Sélectionner un coût</option>
              <option value="Bas">Bas</option>
              <option value="Moyen">Moyen</option>
              <option value="Élevé">Élevé</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Calories</label>
            <input 
              v-model="form.calories" 
              type="number" 
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Ingrédients</label>
            <textarea 
              v-model="form.ingredients" 
              required
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            ></textarea>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Instructions</label>
            <textarea 
              v-model="form.instructions" 
              required
              rows="5"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            ></textarea>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
            <textarea 
              v-model="form.notes" 
              rows="2"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            ></textarea>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">URL de l'image</label>
            <input 
              v-model="form.image_url" 
              type="url"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
        <div class="flex justify-end">
          <button 
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {{ form.id ? 'Modifier' : 'Ajouter' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Liste des repas -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div class="p-6">
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Liste des repas</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Image</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nom</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Saison</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Moment</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="meal in repasList" :key="meal.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="w-16 h-16 rounded-md overflow-hidden">
                    <img 
                      v-if="meal.image_url"
                      :src="meal.image_url" 
                      :alt="meal.nom"
                      class="w-full h-full object-cover"
                      @error="handleImageError"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                      <svg class="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{{ meal.nom }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{{ meal.type }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{{ meal.saison }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{{ meal.moment_journee }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  <div class="flex space-x-2">
                    <button 
                      @click="editRepas(meal)"
                      class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Icon icon="ph:pencil" class="w-5 h-5" />
                    </button>
                    <button 
                      @click="deleteRepas(meal.id)"
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Icon icon="ph:trash" class="w-5 h-5" />
                    </button>
                    <button 
                      @click="() => {
                        console.log('Objet repas complet:', meal);
                        updateFromSpoonacular(meal);
                      }"
                      class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      :disabled="isUpdating"
                    >
                      <Icon icon="ph:cloud-arrow-up" class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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