<template>
  <div class="shopping-list">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Liste de courses</h2>
      <div class="flex space-x-2">
        <button @click="scanBarcode" 
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
          <Icon icon="ph:barcode" class="w-5 h-5 mr-2" />
          Scanner
        </button>
        <button @click="syncWithOnlineStore" 
          class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center dark:bg-gray-700 dark:text-gray-200">
          <Icon icon="ph:shopping-cart" class="w-5 h-5 mr-2" />
          Synchroniser
        </button>
      </div>
    </div>

    <!-- Groupes d'articles -->
    <div class="grid gap-4">
      <div v-for="(items, category) in groupedItems" :key="category" class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <h3 class="font-semibold mb-3">{{ category }}</h3>
        <ul class="space-y-2">
          <li v-for="item in items" :key="item.id" class="flex items-center justify-between">
            <div class="flex items-center">
              <input 
                type="checkbox" 
                v-model="item.checked"
                class="form-checkbox"
              >
              <span :class="{ 'line-through': item.checked }" class="ml-3">
                {{ item.name }} - {{ item.quantity }} {{ item.unit }}
              </span>
            </div>
            <button @click="removeItem(item)" class="text-red-500 hover:text-red-700">
              <Icon icon="ph:trash" class="w-5 h-5" />
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Ajout manuel d'article -->
    <div class="mt-6">
      <form @submit.prevent="addItem" class="flex space-x-2">
        <template>
          <input 
            v-model="newItem.name" 
            type="text" 
            placeholder="Article"
            class="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 flex-1"
          >
          <input 
            v-model.number="newItem.quantity" 
            type="number" 
            placeholder="Qté"
            class="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 w-20"
          >
          <select 
            v-model="newItem.unit"
            class="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 w-24"
          >
            <option value="unité">unité</option>
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="l">l</option>
          </select>
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">Ajouter</button>
        </template>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';

const items = ref([]);
const newItem = ref({
  name: '',
  quantity: 1,
  unit: 'unité',
  category: 'Divers'
});

const groupedItems = computed(() => {
  return items.value.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});
});

const addItem = () => {
  if (newItem.value.name.trim()) {
    items.value.push({
      id: Date.now(),
      ...newItem.value,
      checked: false
    });
    newItem.value.name = '';
    newItem.value.quantity = 1;
  }
};

const removeItem = (item) => {
  items.value = items.value.filter(i => i.id !== item.id);
};

const scanBarcode = async () => {
  // À implémenter avec l'API de scan
  console.log('Scan de code-barres...');
};

const syncWithOnlineStore = async () => {
  // À implémenter avec l'API de synchronisation
  console.log('Synchronisation avec le magasin en ligne...');
};
</script>

<style scoped>
/* Remplacer les directives @apply par des classes directement dans le template */
</style>