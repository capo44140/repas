<template>
  <div class="meal-note">
    <button 
      @click="toggleNote" 
      class="note-icon text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-500 rounded transition-colors"
      :class="{ 'text-primary-500 dark:text-primary-400': hasNote }"
      :aria-label="hasNote ? 'Voir la note' : 'Ajouter une note'"
    >
      <svg v-if="hasNote" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    </button>
    
    <div v-if="isNoteOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative"
        @click.stop
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Note pour {{ mealName }}
        </h3>
        
        <textarea 
          v-model="currentNote" 
          class="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none dark:bg-gray-700"
          placeholder="Ajouter une note pour ce repas..."
        ></textarea>
        
        <div class="flex justify-between items-center mt-4">
          <div>
            <label class="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <input 
                type="checkbox" 
                v-model="isImportant" 
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <span class="ml-2">Marquer comme important</span>
            </label>
          </div>
          
          <div class="flex space-x-3">
            <button 
              @click="closeNote" 
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Annuler
            </button>
            <button 
              @click="saveNote" 
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Enregistrer
            </button>
          </div>
        </div>
        
        <button 
          @click="closeNote" 
          class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" 
          aria-label="Fermer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
    
    <div 
      v-if="showPreview && note && !isNoteOpen" 
      class="absolute z-10 mt-2 p-3 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 w-64"
      :class="{ 'border-yellow-400 dark:border-yellow-600': isImportant }"
    >
      <div v-if="isImportant" class="flex items-center mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <span class="ml-1 text-xs font-medium text-yellow-600 dark:text-yellow-500">Important</span>
      </div>
      <p class="text-sm text-gray-600 dark:text-gray-300 truncate">{{ note }}</p>
      <button 
        @click="toggleNote" 
        class="mt-2 text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
      >
        Modifier
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  mealId: {
    type: [String, Number],
    required: true
  },
  mealName: {
    type: String,
    default: 'ce repas'
  },
  initialNote: {
    type: String,
    default: ''
  },
  initialImportant: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:note', 'update:important']);

const note = ref(props.initialNote);
const currentNote = ref(props.initialNote);
const isImportant = ref(props.initialImportant);
const isNoteOpen = ref(false);
const showPreview = ref(false);

const hasNote = computed(() => note.value && note.value.trim() !== '');

watch(() => props.initialNote, (newValue) => {
  note.value = newValue;
  currentNote.value = newValue;
});

watch(() => props.initialImportant, (newValue) => {
  isImportant.value = newValue;
});

function toggleNote() {
  isNoteOpen.value = !isNoteOpen.value;
  
  if (isNoteOpen.value) {
    // Précharger les valeurs actuelles dans le modal
    currentNote.value = note.value;
  }
}

function closeNote() {
  isNoteOpen.value = false;
}

function saveNote() {
  note.value = currentNote.value;
  
  // Émettre les événements pour mettre à jour les propriétés parent
  emit('update:note', currentNote.value);
  emit('update:important', isImportant.value);
  
  // Sauvegarder dans le localStorage
  saveToLocalStorage();
  
  closeNote();
}

function saveToLocalStorage() {
  try {
    // Récupérer les notes existantes
    const savedNotes = JSON.parse(localStorage.getItem('mealNotes') || '{}');
    
    // Mettre à jour la note pour ce repas
    savedNotes[props.mealId] = {
      text: note.value,
      important: isImportant.value,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('mealNotes', JSON.stringify(savedNotes));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la note:', error);
  }
}
</script>

<style scoped>
.meal-note {
  position: relative;
  display: inline-block;
}

.note-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
}
</style> 