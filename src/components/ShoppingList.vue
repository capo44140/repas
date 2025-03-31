<template>
  <div class="shopping-list">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Liste de courses</h2>
      <div class="flex space-x-2">
        <button
          @click="openBarcodeScanner"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Icon icon="ph:barcode" class="w-5 h-5 mr-2" />
          Scanner
        </button>
        <button
          @click="syncWithOnlineStore"
          class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center dark:bg-gray-700 dark:text-gray-200"
        >
          <Icon icon="ph:shopping-cart" class="w-5 h-5 mr-2" />
          Synchroniser
        </button>
      </div>
    </div>

    <!-- Groupes d'articles -->
    <div class="grid gap-4">
      <div
        v-for="(items, category) in groupedItems"
        :key="category"
        class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow"
      >
        <h3 class="font-semibold mb-3">{{ category }}</h3>
        <ul class="space-y-2">
          <li
            v-for="item in items"
            :key="item.id"
            class="flex items-center justify-between"
          >
            <div class="flex items-center">
              <input
                type="checkbox"
                v-model="item.checked"
                class="form-checkbox"
              />
              <span :class="{ 'line-through': item.checked }" class="ml-3">
                {{ item.name }} - {{ item.quantity }} {{ item.unit }}
              </span>
            </div>
            <button
              @click="removeItem(item)"
              class="text-red-500 hover:text-red-700"
            >
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
          />
          <input
            v-model.number="newItem.quantity"
            type="number"
            placeholder="Qté"
            class="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 w-20"
          />
          <select
            v-model="newItem.unit"
            class="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 w-24"
          >
            <option value="unité">unité</option>
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="l">l</option>
          </select>
          <button
            type="submit"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            Ajouter
          </button>
        </template>
      </form>
    </div>
  </div>

  <!-- Modal pour le scanner de code-barres -->
  <div
    v-if="isScannerOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div
      class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-lg w-full"
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Scanner un code-barres</h3>
        <button
          @click="closeBarcodeScanner"
          class="text-gray-500 hover:text-gray-700"
        >
          <Icon icon="ph:x" class="w-5 h-5" />
        </button>
      </div>

      <div
        id="scanner-container"
        class="relative h-64 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-4"
      ></div>

      <div class="flex justify-end">
        <button
          @click="closeBarcodeScanner"
          class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 mr-2"
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { Icon } from "@iconify/vue";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";

const items = ref([]);
const newItem = ref({
  name: "",
  quantity: 1,
  unit: "unité",
  category: "Divers",
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
      checked: false,
    });
    newItem.value.name = "";
    newItem.value.quantity = 1;
  }
};

const removeItem = (item) => {
  items.value = items.value.filter((i) => i.id !== item.id);
};

const isScannerOpen = ref(false);
let codeReader = null;
let controls = null;

const openBarcodeScanner = async () => {
  isScannerOpen.value = true;
  // Initialiser le scanner après que le DOM soit mis à jour
  setTimeout(initBarcodeScanner, 100);
};

const closeBarcodeScanner = async () => {
  isScannerOpen.value = false;
  if (controls) {
    await controls.stop();
  }
  // Supprimer l'élément vidéo s'il existe
  const container = document.querySelector("#scanner-container");
  if (container) {
    container.innerHTML = "";
  }
};

const initBarcodeScanner = async () => {
  try {
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.CODE_128,
    ]);

    codeReader = new BrowserMultiFormatReader(hints);

    const videoElement = document.createElement("video");
    videoElement.setAttribute(
      "style",
      "width: 100%; height: 100%; object-fit: cover;"
    );
    const container = document.querySelector("#scanner-container");
    container.appendChild(videoElement);

    controls = await codeReader.decodeFromVideoDevice(
      undefined, // Utiliser la caméra par défaut
      videoElement,
      (result, error) => {
        if (result) {
          handleBarcodeDetected(result.getText());
        }
        if (error && !(error instanceof Error)) {
          console.error(error);
        }
      }
    );
  } catch (error) {
    console.error("Erreur d'initialisation du scanner:", error);
  }
};

const handleBarcodeDetected = (code) => {
  console.log("Code-barres détecté:", code);

  // Rechercher le produit dans une base de données ou une API
  lookupProduct(code);

  // Fermer le scanner
  closeBarcodeScanner();
};

const lookupProduct = async (barcode) => {
  try {
    // Exemple d'appel à une API de produits (à remplacer par votre propre API)
    // const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    // const data = await response.json();

    // Pour l'exemple, on ajoute simplement un produit avec le code-barres
    const newProduct = {
      id: Date.now(),
      name: `Produit (${barcode})`,
      quantity: 1,
      unit: "unité",
      category: "Divers",
      checked: false,
    };

    items.value.push(newProduct);
  } catch (error) {
    console.error("Erreur lors de la recherche du produit:", error);
  }
};

// Nettoyer le scanner lors du démontage du composant
onUnmounted(async () => {
  if (controls) {
    await controls.stop();
  }
  // Supprimer l'élément vidéo s'il existe
  const container = document.querySelector("#scanner-container");
  if (container) {
    container.innerHTML = "";
  }
});
</script>

<style scoped>
/* Remplacer les directives @apply par des classes directement dans le template */
</style>
