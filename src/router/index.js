import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GeneratedMealsView from '../views/GeneratedMealsView.vue'
import GeneratedMeals from '../views/GeneratedMeals.vue'
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
    component: GeneratedMealsView
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
  },
  {
    path: '/preferences',
    name: 'preferences',
    component: () => import('../views/UserPreferencesView.vue')
  },
  {
    path: '/generator',
    name: 'generator',
    component: GeneratedMeals
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
})

export default router