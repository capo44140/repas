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

## Installation

```bash
# Cloner le repository
git clone [url-du-repo]

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
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

## Technologies Utilisées

- Vue.js 3
- TailwindCSS
- Firebase Authentication
- Chart.js
- Iconify

## Configuration

### Firebase

Créez un fichier `.env` à la racine du projet :

```env
VITE_FIREBASE_API_KEY=votre-api-key
VITE_FIREBASE_AUTH_DOMAIN=votre-auth-domain
VITE_FIREBASE_PROJECT_ID=votre-project-id
VITE_FIREBASE_STORAGE_BUCKET=votre-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=votre-messaging-sender-id
VITE_FIREBASE_APP_ID=votre-app-id
```

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
