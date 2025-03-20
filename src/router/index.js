import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GeneratedMeals from '../views/GeneratedMeals.vue'
import MealSuggestions from '../views/MealSuggestions.vue'
import AdminView from '../views/AdminView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/generated-meals',
    name: 'generated-meals',
    component: GeneratedMeals
  },
  {
    path: '/meal-suggestions',
    name: 'meal-suggestions',
    component: MealSuggestions
  },
  {
    path: '/statistics',
    name: 'statistics',
    component: HomeView
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router