<template>
  <div class="relative inline-block" @mouseenter="show = true" @mouseleave="show = false" @focus="show = true" @blur="show = false">
    <slot name="trigger">
      <button 
        type="button" 
        class="inline-flex items-center justify-center w-5 h-5 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-full dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 hover:bg-gray-100 hover:text-primary-500 dark:hover:bg-gray-700 dark:hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
        aria-label="Aide"
        tabindex="0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </slot>
    
    <transition 
      enter-active-class="transition duration-200 ease-out" 
      enter-from-class="transform scale-95 opacity-0" 
      enter-to-class="transform scale-100 opacity-100" 
      leave-active-class="transition duration-100 ease-in" 
      leave-from-class="transform scale-100 opacity-100" 
      leave-to-class="transform scale-95 opacity-0"
    >
      <div 
        v-show="show" 
        class="absolute z-10 w-64 p-4 mt-2 text-sm bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
        :class="positionClass"
        role="tooltip"
      >
        <div v-if="title" class="font-semibold mb-1">{{ title }}</div>
        <div class="text-gray-600 dark:text-gray-300">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  position: {
    type: String,
    default: 'bottom'
  }
});

const show = ref(false);

const positionClass = computed(() => {
  switch(props.position) {
    case 'top': return 'bottom-full mb-2';
    case 'right': return 'left-full ml-2';
    case 'left': return 'right-full mr-2';
    case 'bottom':
    default: return 'top-full';
  }
});

function computed(fn) {
  return fn();
}
</script> 