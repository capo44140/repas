import { promises as fs } from 'fs';
import { parse } from 'csv-parse';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration de la connexion à Neon PostgreSQL
const connectionString = 'postgresql://neondb_owner:npg_Q7uPhlze2xVt@ep-white-flower-abz44z8q-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require';

// Chemin vers le fichier CSV
const csvFilePath = path.join(__dirname, '..', 'public', 'modele_repas_finale.csv');

async function importCsvToNeon() {
  try {
    console.log('Début de l\'importation des données...');
    
    // Connexion à la base de données
    const client = new pg.Client({ 
      connectionString: process.env.DATABASE_URL || connectionString 
    });
    await client.connect();
    console.log('Connecté à la base de données Neon');
    
    // Option pour nettoyer la table avant l'importation
    const shouldCleanTable = process.argv.includes('--clean');
    if (shouldCleanTable) {
      console.log('Nettoyage de la table "repas"...');
      await client.query('DROP TABLE IF EXISTS repas');
      console.log('Table "repas" supprimée');
    }
    
    // Création de la table si elle n'existe pas
    await client.query(`
      CREATE TABLE IF NOT EXISTS repas (
        id SERIAL PRIMARY KEY,
        saison VARCHAR(50) NOT NULL,
        type VARCHAR(50) NOT NULL,
        nom VARCHAR(200) NOT NULL,
        description TEXT,
        dimanche_midi BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table "repas" créée ou déjà existante');
    
    // Lecture du fichier CSV
    const fileContent = await fs.readFile(csvFilePath, 'utf-8');
    
    // Parsing du CSV
    const records = await new Promise((resolve, reject) => {
      parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      }, (err, records) => {
        if (err) reject(err);
        else resolve(records);
      });
    });
    
    console.log(`${records.length} enregistrements trouvés dans le CSV`);
    
    // Préparation des données et insertion
    let insertedCount = 0;
    
    for (const record of records) {
      // Normalisation des données
      const saison = record.saison?.toLowerCase().trim() || '';
      const type = record.type?.toLowerCase().trim() || '';
      const nom = record.nom?.trim() || '';
      const description = record.description?.trim() || '';
      const dimancheMidi = record.dimanche_midi === 'oui' ? true : false;
      
      // Vérification des données et correction des lignes mal formatées
      // Certaines lignes peuvent avoir les colonnes inversées
      if (!saison || !type || !nom) {
        console.log(`Tentative de correction pour l'enregistrement: ${JSON.stringify(record)}`);
        
        // Vérifier si les données sont dans le mauvais ordre (comme dans certaines lignes de votre CSV)
        if (record.nom && record.description && record.midi && record.hiver) {
          // Format inversé détecté
          const correctedSaison = record.hiver?.toLowerCase().trim() || '';
          const correctedType = record.midi?.toLowerCase().trim() || '';
          const correctedNom = record.nom?.trim() || '';
          const correctedDescription = record.description?.trim() || '';
          const correctedDimancheMidi = record.oui === 'oui' ? true : false;
          
          // Insertion avec les données corrigées
          await client.query(
            'INSERT INTO repas (saison, type, nom, description, dimanche_midi) VALUES ($1, $2, $3, $4, $5)',
            [correctedSaison, correctedType, correctedNom, correctedDescription, correctedDimancheMidi]
          );
          
          insertedCount++;
          console.log(`Enregistrement corrigé et inséré: ${correctedNom}`);
          continue;
        } else {
          console.warn(`Enregistrement ignoré car incomplet et non corrigeable: ${JSON.stringify(record)}`);
          continue;
        }
      }
      
      // Insertion dans la base de données
      await client.query(
        'INSERT INTO repas (saison, type, nom, description, dimanche_midi) VALUES ($1, $2, $3, $4, $5)',
        [saison, type, nom, description, dimancheMidi]
      );
      
      insertedCount++;
    }
    
    console.log(`${insertedCount} repas insérés avec succès dans la base de données`);
    
    // Fermeture de la connexion
    await client.end();
    console.log('Importation terminée avec succès');
    
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
    process.exit(1);
  }
}

importCsvToNeon();