import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement depuis .env.local ou .env
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (!process.env.VITE_NEON_DATABASE_URL) {
  console.error('Erreur: La variable d\'environnement VITE_NEON_DATABASE_URL n\'est pas définie');
  process.exit(1);
}

const neonConfig = {
  connectionString: process.env.VITE_NEON_DATABASE_URL
};

async function setupDatabase() {
  try {
    console.log('Connexion à la base de données Neon...');
    const sql = neon(neonConfig.connectionString);

    // Lecture du fichier SQL
    const createTableSQL = fs.readFileSync(
      path.join(__dirname, 'create-tables.sql'),
      'utf8'
    );

    console.log('Création des tables...');
    
    // Supprimer la table existante
    await sql`DROP TABLE IF EXISTS repas`;
    console.log('Table existante supprimée...');

    // Créer la nouvelle table
    await sql`
      CREATE TABLE repas (
        id SERIAL PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        saison VARCHAR(50) NOT NULL,
        moment_journee VARCHAR(10) NOT NULL CHECK (moment_journee IN ('midi', 'soir')),
        temps_preparation INTEGER,
        temps_cuisson INTEGER,
        temps_repos INTEGER,
        temps_total INTEGER,
        difficulte VARCHAR(50),
        cout VARCHAR(10),
        calories INTEGER,
        ingredients TEXT[],
        instructions TEXT[],
        notes TEXT,
        image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Nouvelle table créée...');
    
    console.log('Base de données initialisée avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    process.exit(1);
  }
}

setupDatabase(); 