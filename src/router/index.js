import { createRouter, createWebHistory } from 'vue-router'

// Lazy loading des composants avec des noms de chunks optimisés
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/HomeView.vue')
  },
  {
    path: '/generated-meals',
    name: 'generated-meals',
    component: () => import(/* webpackChunkName: "meals" */ '../views/GeneratedMealsView.vue')
  },
  {
    path: '/statistics',
    name: 'statistics',
    component: () => import(/* webpackChunkName: "statistics" */ '../views/StatisticsView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "auth" */ '../components/LoginForm.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import(/* webpackChunkName: "admin" */ '../views/AdminView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/preferences',
    name: 'preferences',
    component: () => import(/* webpackChunkName: "preferences" */ '../views/UserPreferencesView.vue')
  },
  {
    path: '/generator',
    name: 'generator',
    component: () => import(/* webpackChunkName: "generator" */ '../views/GeneratedMeals.vue')
  },
  {
    path: '/share-recipes',
    name: 'share-recipes',
    component: () => import(/* webpackChunkName: "share" */ '../views/ShareRecipesView.vue')
  },
  {
    path: '/shopping-list',
    name: 'shopping-list',
    component: () => import(/* webpackChunkName: "shopping" */ '../views/ShoppingListView.vue'),
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