import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GeneratedMealsView from '../views/GeneratedMealsView.vue'
import GeneratedMeals from '../views/GeneratedMeals.vue'
import AdminView from '../views/AdminView.vue'
import LoginForm from '../components/LoginForm.vue'
import ShareRecipesView from '../views/ShareRecipesView.vue'
import ShoppingListView from '../views/ShoppingListView.vue'

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
    path: '/login',
    name: 'login',
    component: LoginForm
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    meta: { requiresAuth: true }
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
  },
  {
    path: '/share-recipes',
    name: 'share-recipes',
    component: ShareRecipesView
  },
  {
    path: '/shopping-list',
    name: 'shopping-list',
    component: ShoppingListView,
    meta: {
      title: 'Liste de courses',
      requiresAuth: true
    }
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

// Navigation Guard
router.beforeEach((to, from, next) => {
  const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';

  if (to.meta.requiresAuth && !isAdminLoggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router