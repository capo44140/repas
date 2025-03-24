<template>
  <div class="share-buttons">
    <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Partager</h3>
    <div class="flex space-x-2">
      <button 
        @click="share('facebook')" 
        class="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        title="Partager sur Facebook"
      >
        <Icon icon="mdi:facebook" class="w-5 h-5" />
      </button>
      
      <button 
        @click="share('twitter')" 
        class="p-2 rounded-full bg-blue-400 text-white hover:bg-blue-500 transition-colors"
        title="Partager sur Twitter"
      >
        <Icon icon="mdi:twitter" class="w-5 h-5" />
      </button>
      
      <button 
        @click="share('whatsapp')" 
        class="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
        title="Partager sur WhatsApp"
      >
        <Icon icon="mdi:whatsapp" class="w-5 h-5" />
      </button>
      
      <button 
        @click="share('email')" 
        class="p-2 rounded-full bg-gray-500 text-white hover:bg-gray-600 transition-colors"
        title="Partager par email"
      >
        <Icon icon="mdi:email" class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { exportService } from '../services/exportService';

const props = defineProps({
  content: {
    type: Object,
    required: true
  },
  options: {
    type: Object,
    default: () => ({})
  }
});

const share = (platform) => {
  exportService.shareContent(props.content, platform, props.options);
};
</script>