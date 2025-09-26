<template>
  <router-view v-slot="{ Component: RouteComponent }">
    <transition name="fade" mode="out-in">
      <component 
        v-if="RouteComponent" 
        :is="RouteComponent" 
        :key="$route.fullPath"
      />
      <div v-else class="loading-container">
        <div class="loading-spinner">
          <Icon icon="ph:spinner" class="spinning" />
          <span>Chargement de la page...</span>
        </div>
      </div>
    </transition>
  </router-view>
</template>

<script setup>
import { Icon } from '@iconify/vue'
</script>

<style scoped>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 2rem;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #6b7280;
}

.spinning {
  animation: spin 1s linear infinite;
  font-size: 2rem;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
