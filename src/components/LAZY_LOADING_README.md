# Lazy Loading - Documentation

## Vue d'ensemble

Le lazy loading (chargement différé) est une technique d'optimisation qui charge les ressources (images, composants, données) uniquement quand elles sont nécessaires, améliorant ainsi les performances de l'application.

## Composants Disponibles

### 1. LazyImage
Composant pour le lazy loading des images avec placeholder et gestion d'erreur.

**Props :**
- `src` : URL de l'image (requis)
- `alt` : Texte alternatif
- `width` : Largeur de l'image
- `height` : Hauteur de l'image
- `placeholder` : Image de remplacement
- `errorText` : Texte d'erreur
- `retryable` : Permet de réessayer le chargement
- `threshold` : Seuil de visibilité (0.1 = 10%)
- `rootMargin` : Marge de déclenchement

**Événements :**
- `@load` : Image chargée avec succès
- `@error` : Erreur de chargement
- `@retry` : Tentative de rechargement

**Exemple :**
```vue
<LazyImage 
  :src="imageUrl" 
  :alt="imageAlt"
  width="100%"
  height="200px"
  :placeholder="'/placeholder.jpg'"
  :error-text="'Image non disponible'"
  @load="onImageLoad"
  @error="onImageError"
/>
```

### 2. LazyComponent
Composant pour le lazy loading des composants Vue.

**Props :**
- `component` : Nom ou référence du composant (requis)
- `componentProps` : Props à passer au composant
- `componentEvents` : Événements à écouter
- `loadingText` : Texte de chargement
- `errorText` : Texte d'erreur
- `delay` : Délai avant chargement (ms)
- `timeout` : Timeout de chargement (ms)

**Exemple :**
```vue
<LazyComponent
  component="AdvancedSearch"
  :component-props="{ filters: searchFilters }"
  :loading-text="'Chargement de la recherche...'"
  :delay="500"
  @load="onComponentLoad"
/>
```

### 3. VirtualList
Composant pour l'affichage de longues listes avec virtualisation.

**Props :**
- `items` : Tableau d'éléments (requis)
- `itemHeight` : Hauteur d'un élément (requis)
- `containerHeight` : Hauteur du conteneur
- `overscan` : Nombre d'éléments à pré-charger
- `loading` : État de chargement
- `getItemKey` : Fonction pour générer les clés

**Événements :**
- `@scroll` : Événement de défilement
- `@loadMore` : Charger plus d'éléments

**Exemple :**
```vue
<VirtualList
  :items="meals"
  :item-height="80"
  :container-height="400"
  :loading="loadingMore"
  @load-more="loadMoreMeals"
>
  <template #default="{ item, index }">
    <MealCard :meal="item" :index="index" />
  </template>
</VirtualList>
```

## Composables

### 1. useLazyLoading
Composable de base pour le lazy loading avec Intersection Observer.

**Options :**
- `threshold` : Seuil de visibilité (défaut: 0.1)
- `rootMargin` : Marge de déclenchement (défaut: '50px')
- `triggerOnce` : Déclencher une seule fois (défaut: true)
- `delay` : Délai avant déclenchement (défaut: 0)

**Retour :**
- `isVisible` : Élément visible
- `isLoading` : En cours de chargement
- `hasError` : Erreur de chargement
- `containerRef` : Référence du conteneur
- `markAsLoaded()` : Marquer comme chargé
- `markAsError()` : Marquer comme erreur
- `reset()` : Réinitialiser

### 2. useLazyImage
Composable spécialisé pour les images.

**Exemple :**
```javascript
const { isVisible, imageSrc, loadImage, retry } = useLazyImage(
  'https://example.com/image.jpg',
  { threshold: 0.1, placeholder: '/placeholder.jpg' }
)
```

### 3. useLazyComponent
Composable pour le chargement de composants.

**Exemple :**
```javascript
const { component, isLoading, loadComponent } = useLazyComponent(
  () => import('./HeavyComponent.vue'),
  { delay: 500, timeout: 10000 }
)
```

### 4. useLazyData
Composable pour le chargement de données.

**Exemple :**
```javascript
const { data, isLoading, error, loadData } = useLazyData(
  () => fetch('/api/data').then(r => r.json()),
  { immediate: false }
)
```

## Configuration Vite

Le lazy loading est optimisé avec la configuration Vite qui divise le code en chunks :

- **vue-vendor** : Vue.js, Vue Router, Pinia
- **ui-vendor** : Iconify, composants UI
- **chart-vendor** : Chart.js
- **components-*** : Composants par catégorie
- **views-*** : Vues par fonctionnalité
- **stores** : Stores Pinia
- **services** : Services métier

## Avantages

1. **Performance** : Chargement plus rapide de la page initiale
2. **Bande passante** : Économie de données
3. **Mémoire** : Utilisation optimisée de la RAM
4. **UX** : Interface plus réactive
5. **SEO** : Meilleur score de performance

## Bonnes Pratiques

1. **Images** : Utiliser des placeholders appropriés
2. **Composants** : Prévoir des états de chargement
3. **Données** : Implémenter la pagination
4. **Erreurs** : Gérer les cas d'échec
5. **Tests** : Tester les différents états

## Exemples d'Utilisation

Voir le composant `LazyLoadingExample.vue` pour des exemples complets d'utilisation de tous les composants et composables de lazy loading.

## Compatibilité

- **Navigateurs** : Tous les navigateurs modernes
- **Vue** : Vue 3.0+
- **Vite** : Vite 4.0+
- **Mobile** : Support complet des appareils mobiles
