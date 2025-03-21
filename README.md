# Application de Gestion des Repas

Une application web moderne pour la planification et la gestion des repas, développée avec Vue.js et TailwindCSS.

## Fonctionnalités

### 1. Tableau de Bord
- Vue d'ensemble des statistiques
- Graphiques des repas mensuels
- Suivi des objectifs et réalisations
- Statistiques par saison

### 2. Génération de Menus
- Planification sur 1 à 4 semaines
- Sélection par saison (Hiver, Printemps, Été, Automne)
- Personnalisation des repas (midi et/ou soir)
- Génération automatique basée sur une base de données de recettes
- Export au format CSV
- Impression du planning

### 3. Gestion des Repas
- Import de repas via fichier CSV
- Base de données de repas par saison
- Catégorisation (midi/soir)
- Liste d'ingrédients automatique

### 4. Interface Utilisateur
- Design responsive
- Mode sombre/clair
- Barre latérale rétractable
- Notifications en temps réel
- Interface intuitive et moderne
- Visualisation détaillée des recettes

### 5. Détails des Recettes
- Instructions pas à pas pour chaque recette
- Liste complète des ingrédients avec quantités
- Valeurs nutritionnelles (calories, protéines, glucides, lipides)
- Conseils de préparation personnalisés
- Indication du niveau de difficulté
- Étiquettes pour les régimes spécifiques (végétarien, etc.)
- Galerie de photos pour visualiser les étapes de préparation
- Visualiseur d'images en plein écran

## Installation

```bash
# Cloner le repository
git clone [url-du-repo]

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Prévisualiser la version de production
npm run preview
```

## Structure des Fichiers CSV

Pour importer des repas, utilisez un fichier CSV avec la structure suivante :

```csv
saison,type,nom,description
hiver,midi,Soupe de légumes,Soupe chaude avec carottes et pommes de terre
hiver,soir,Gratin de pâtes,Pâtes avec sauce béchamel et fromage
```

### Champs requis :
- `saison` : hiver, printemps, ete, automne
- `type` : midi, soir
- `nom` : nom du repas
- `description` : description du repas

## Stockage des données

L'application utilise le stockage local du navigateur (localStorage) pour sauvegarder :
- Les repas importés
- Les préférences utilisateur
- Les menus générés récemment

Aucune donnée n'est envoyée à un serveur externe.

## Technologies Utilisées

- Vue.js 3
- Vue Router
- TailwindCSS
- Chart.js
- Iconify
- Vite
- PWA (Progressive Web App)

## Configuration

Le fichier `.env` à la racine du projet peut être utilisé pour ajouter des variables d'environnement supplémentaires si nécessaire.

## Fonctionnalités à Venir

- [ ] Synchronisation avec un calendrier externe
- [ ] Suggestions de menus basées sur les préférences
- [ ] Liste de courses automatique
- [ ] Partage de menus entre utilisateurs

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## Licence

MIT License
