#!/usr/bin/env node

/**
 * Script de migration des classes dark: vers le nouveau système de thème
 * Usage: node scripts/migrate-dark-classes.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mappings des classes dark: vers les nouvelles classes
const darkClassMappings = {
  // Arrière-plans
  'dark:bg-gray-900': 'bgClasses.primary',
  'dark:bg-gray-800': 'bgClasses.card',
  'dark:bg-gray-700': 'bgClasses.tertiary',
  'dark:bg-gray-50': 'bgClasses.secondary',
  
  // Texte
  'dark:text-gray-100': 'textClasses.primary',
  'dark:text-gray-200': 'textClasses.primary',
  'dark:text-gray-300': 'textClasses.secondary',
  'dark:text-gray-400': 'textClasses.tertiary',
  'dark:text-gray-500': 'textClasses.muted',
  'dark:text-white': 'textClasses.primary',
  
  // Bordures
  'dark:border-gray-700': 'borderClasses.primary',
  'dark:border-gray-600': 'borderClasses.secondary',
  'dark:divide-gray-700': 'borderClasses.divider',
  
  // Icônes
  'dark:text-primary-400': 'iconClasses.primary',
  
  // Hover states
  'dark:hover:bg-gray-600': 'hover:bg-gray-600',
  'dark:hover:bg-gray-700': 'hover:bg-gray-700',
  'dark:hover:text-gray-200': 'hover:text-gray-200',
  'dark:hover:text-gray-300': 'hover:text-gray-300',
  'dark:hover:text-blue-300': 'hover:text-blue-300',
  'dark:hover:text-red-300': 'hover:text-red-300',
  'dark:hover:text-green-300': 'hover:text-green-300',
  'dark:hover:text-orange-300': 'hover:text-orange-300'
};

// Fonction pour remplacer les classes dark: dans un fichier
function replaceDarkClasses(content) {
  let updatedContent = content;
  
  // Remplacer les classes dark: par les nouvelles classes
  Object.entries(darkClassMappings).forEach(([oldClass, newClass]) => {
    const regex = new RegExp(`\\b${oldClass.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
    updatedContent = updatedContent.replace(regex, `:class="${newClass}"`);
  });
  
  // Nettoyer les classes dark: restantes
  updatedContent = updatedContent.replace(/\bdark:[^\s]+/g, '');
  
  return updatedContent;
}

// Fonction pour traiter un fichier Vue
function processVueFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const updatedContent = replaceDarkClasses(content);
    
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✅ Mis à jour: ${filePath}`);
      return true;
    } else {
      console.log(`⏭️  Aucun changement: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Erreur lors du traitement de ${filePath}:`, error.message);
    return false;
  }
}

// Fonction pour scanner récursivement un répertoire
function scanDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  let updatedCount = 0;
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      updatedCount += scanDirectory(filePath);
    } else if (file.endsWith('.vue')) {
      if (processVueFile(filePath)) {
        updatedCount++;
      }
    }
  });
  
  return updatedCount;
}

// Fonction principale
function main() {
  console.log('🚀 Début de la migration des classes dark:...\n');
  
  const srcDir = path.join(__dirname, '..', 'src');
  
  if (!fs.existsSync(srcDir)) {
    console.error('❌ Répertoire src non trouvé');
    process.exit(1);
  }
  
  const updatedCount = scanDirectory(srcDir);
  
  console.log(`\n✨ Migration terminée ! ${updatedCount} fichiers mis à jour.`);
  console.log('\n📝 N\'oubliez pas de :');
  console.log('1. Importer useThemeClasses dans vos composants');
  console.log('2. Vérifier que les nouvelles classes fonctionnent correctement');
  console.log('3. Tester le mode sombre/clair');
}

// Exécuter le script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

