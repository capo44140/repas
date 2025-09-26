# Stores Pinia - Documentation

## Vue d'ensemble

Cette application utilise Pinia pour la gestion d'état centralisée. Les stores sont organisés par domaine fonctionnel pour une meilleure séparation des responsabilités.

## Stores Disponibles

### 1. useMealsStore
Gère les données des repas et recettes.

**État :**
- `meals` : Liste des repas
- `loading` : État de chargement
- `error` : Erreurs
- `searchFilters` : Filtres de recherche

**Getters :**
- `totalMeals` : Nombre total de repas
- `mealsBySeason` : Repas groupés par saison
- `filteredMeals` : Repas filtrés selon les critères
- `randomMeal` : Repas aléatoire

**Actions :**
- `fetchMeals()` : Charger les repas
- `addMeal(mealData)` : Ajouter un repas
- `updateMeal(id, mealData)` : Modifier un repas
- `deleteMeal(id)` : Supprimer un repas
- `setSearchFilters(filters)` : Définir les filtres de recherche

### 2. useUIStore
Gère l'interface utilisateur et les préférences d'affichage.

**État :**
- `sidebarOpen` : État de la sidebar
- `isDarkMode` : Mode sombre/clair
- `toast` : Configuration des notifications toast
- `showTutorial` : Affichage du tutoriel

**Actions :**
- `toggleSidebar()` : Basculer la sidebar
- `toggleDarkMode()` : Basculer le mode sombre
- `showToast(options)` : Afficher une notification
- `hideToast()` : Masquer la notification

### 3. usePreferencesStore
Gère les préférences utilisateur.

**État :**
- `preferences` : Configuration utilisateur
- `loading` : État de chargement
- `error` : Erreurs

**Actions :**
- `savePreferences(preferences)` : Sauvegarder les préférences
- `updatePreference(key, value)` : Mettre à jour une préférence
- `exportPreferences()` : Exporter les préférences
- `importPreferences(file)` : Importer les préférences

### 4. useMenuStore
Gère les menus générés et la planification.

**État :**
- `generatedMenus` : Liste des menus générés
- `currentMenu` : Menu actuellement sélectionné
- `menuSettings` : Paramètres de génération

**Actions :**
- `generateMenu(settings)` : Générer un nouveau menu
- `loadMenu(menuId)` : Charger un menu
- `deleteMenu(menuId)` : Supprimer un menu
- `exportMenu(menuId)` : Exporter un menu

## Utilisation dans les Composants

### Injection des Stores
```javascript
import { inject } from 'vue'

// Dans un composant enfant
const mealsStore = inject('mealsStore')
const uiStore = inject('uiStore')
```

### Utilisation Directe
```javascript
import { useMealsStore } from '@/stores/useMealsStore'

// Dans un composant
const mealsStore = useMealsStore()
```

### Exemple d'Utilisation
```javascript
// Charger les repas
await mealsStore.fetchMeals()

// Afficher un toast
uiStore.showToast({
  message: 'Repas chargé avec succès',
  type: 'success'
})

// Générer un menu
const menu = await menuStore.generateMenu({
  duration: 1,
  season: 'automne',
  includeLunch: true,
  includeDinner: true
})
```

## Avantages de Pinia

1. **Type Safety** : Support TypeScript natif
2. **DevTools** : Intégration avec Vue DevTools
3. **Modularité** : Stores séparés par domaine
4. **Réactivité** : Réactivité automatique
5. **Performance** : Optimisations automatiques
6. **Simplicité** : API simple et intuitive

## Migration depuis l'Ancien Système

Les stores Pinia remplacent progressivement :
- Les composables `useDarkMode`
- Les `provide/inject` globaux
- Le `localStorage` direct
- Les états locaux dans les composants

## Bonnes Pratiques

1. **Un store par domaine** : Éviter les stores trop volumineux
2. **Actions asynchrones** : Utiliser `async/await` dans les actions
3. **Getters calculés** : Utiliser les getters pour les données dérivées
4. **Nettoyage** : Implémenter les méthodes de cleanup
5. **Tests** : Tester les stores indépendamment
