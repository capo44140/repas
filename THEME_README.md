# Système de Thème - RepasFork

## Vue d'ensemble

Le système de thème a été entièrement refactorisé pour offrir une expérience utilisateur fluide et cohérente. Il gère maintenant de manière centralisée :

- Le mode sombre/clair
- Les couleurs primaires personnalisables
- La saturation des couleurs
- La persistance des préférences
- La synchronisation avec les préférences système

## Architecture

### Composable `useDarkMode`

Le composable `useDarkMode` est le cœur du système. Il fournit :

```javascript
const {
  isDarkMode,           // Réactif : état du mode sombre
  currentTheme,         // Réactif : thème actuel
  customPrimaryColor,   // Réactif : couleur primaire personnalisée
  saturation,           // Réactif : niveau de saturation
  themes,               // Réactif : liste des thèmes disponibles
  primaryColors,        // Réactif : couleurs primaires disponibles
  applyTheme,           // Fonction : appliquer un thème
  resetToDefault,       // Fonction : réinitialiser aux valeurs par défaut
  toggleDarkMode        // Fonction : basculer le mode sombre
} = useDarkMode();
```

### Thèmes disponibles

- **Bleu** : Thème par défaut (#3B82F6)
- **Violet** : Thème violet (#8B5CF6)
- **Vert** : Thème vert (#10B981)
- **Rouge** : Thème rouge (#EF4444)
- **Ambre** : Thème ambre (#F59E0B)
- **Personnalisé** : Thème avec couleur choisie par l'utilisateur

### Couleurs primaires disponibles

10 couleurs prédéfinies : bleu, violet, vert, rouge, ambre, rose, indigo, teal, cyan, orange.

## Utilisation

### Dans un composant Vue

```vue
<template>
  <div :class="{ 'dark': isDarkMode }">
    <button @click="toggleDarkMode">
      {{ isDarkMode ? 'Mode clair' : 'Mode sombre' }}
    </button>
    
    <div class="bg-primary-500 text-white">
      Contenu avec couleur primaire
    </div>
  </div>
</template>

<script setup>
import { useDarkMode } from '../composables/useDarkMode';

const { isDarkMode, toggleDarkMode } = useDarkMode();
</script>
```

### Application d'un thème personnalisé

```javascript
import { useDarkMode } from '../composables/useDarkMode';

const { applyTheme } = useDarkMode();

// Appliquer un thème prédéfini
applyTheme('purple');

// Appliquer un thème personnalisé avec couleur et saturation
applyTheme('custom', 'pink', 80);
```

## Variables CSS

Le système met à jour automatiquement les variables CSS suivantes :

```css
:root {
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-200: #bfdbfe;
  --primary-300: #93c5fd;
  --primary-400: #60a5fa;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-800: #1e40af;
  --primary-900: #1e3a8a;
}
```

Ces variables sont utilisées par Tailwind CSS et peuvent être référencées dans vos styles personnalisés.

## Persistance

Les préférences sont automatiquement sauvegardées dans le `localStorage` :

```javascript
{
  "theme": "purple",
  "primaryColor": "pink",
  "saturation": 80,
  "darkMode": true
}
```

## Événements

Le système émet des événements personnalisés :

```javascript
// Écouter les changements de thème
window.addEventListener('theme-updated', (event) => {
  const { primary, saturation } = event.detail;
  console.log('Nouveau thème appliqué:', { primary, saturation });
});
```

## Intégration avec Tailwind

Le système est entièrement compatible avec Tailwind CSS. Utilisez les classes :

- `bg-primary-500` pour l'arrière-plan
- `text-primary-600` pour le texte
- `border-primary-300` pour les bordures
- `hover:bg-primary-600` pour les états de survol

## Composant ThemeSwitcher

Le composant `ThemeSwitcher` fournit une interface utilisateur complète pour :

- Sélectionner un thème prédéfini
- Choisir une couleur primaire personnalisée
- Ajuster la saturation
- Basculer entre mode sombre et clair

## Dépannage

### Le thème ne se met pas à jour

1. Vérifiez que le composable `useDarkMode` est bien importé
2. Assurez-vous que les variables CSS sont bien définies dans votre CSS
3. Vérifiez la console pour d'éventuelles erreurs

### Les couleurs ne s'appliquent pas

1. Vérifiez que Tailwind CSS est bien configuré
2. Assurez-vous que les classes `primary-*` sont bien définies dans `tailwind.config.js`
3. Vérifiez que les variables CSS sont bien mises à jour

### Mode sombre ne fonctionne pas

1. Vérifiez que l'attribut `data-theme` est bien défini sur `document.documentElement`
2. Assurez-vous que les styles CSS pour `[data-theme="dark"]` sont bien définis
3. Vérifiez que la classe `dark` est bien ajoutée/retirée

## Exemple complet

Voir le composant `ThemeDemo.vue` pour un exemple complet d'utilisation du système de thème.
