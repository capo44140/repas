<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      Saison
    </label>
    <select 
      v-model="meal.saison"
      class="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    >
      <option v-for="(s, key) in seasons" :key="key" :value="key">
        {{ s.label }}
      </option>
    </select>
  </div>

  <!-- Option Dimanche Midi -->
  <div v-if="meal.type === 'midi'" class="flex items-center space-x-2">
    <input 
      v-model="meal.dimanche_midi"
      type="checkbox"
      class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-primary-500 focus:ring-primary-500"
      :true-value="'oui'"
      :false-value="''"
    />
    <label class="text-sm text-gray-700 dark:text-gray-300">
      Réserver pour le dimanche midi uniquement
    </label>
  </div>
</template>

<script>
export default {
  name: 'EditMealModal',
  props: {
    meal: {
      type: Object,
      required: true
    },
    seasons: {
      type: Object,
      required: true
    }
  }
}
</script> 