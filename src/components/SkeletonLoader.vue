<!-- Composant réutilisable de chargement squelette -->
<template>
  <div 
    class="skeleton rounded-md"
    :style="{ width: width, height: height }"
    :class="{ 'animate-pulse': pulse }"
  ></div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '1.5rem'
  },
  pulse: {
    type: Boolean,
    default: true
  }
});
</script> 