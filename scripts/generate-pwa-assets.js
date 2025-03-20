import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [192, 512];
const source = join(__dirname, '../src/assets/icon.svg');
const destination = join(__dirname, '../public');

async function generateIcons() {
  try {
    // Créer le répertoire public s'il n'existe pas
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }

    // Générer les icônes PWA
    for (const size of sizes) {
      await sharp(source)
        .resize(size, size)
        .png()
        .toFile(join(destination, `pwa-${size}x${size}.png`));
    }

    // Générer l'icône Apple
    await sharp(source)
      .resize(180, 180)
      .png()
      .toFile(join(destination, 'apple-touch-icon.png'));

    // Générer le favicon
    await sharp(source)
      .resize(32, 32)
      .png()
      .toFile(join(destination, 'favicon.ico'));

    // Copier l'icône SVG comme masked-icon
    fs.copyFileSync(source, join(destination, 'masked-icon.svg'));

    console.log('Icônes PWA générées avec succès !');
  } catch (error) {
    console.error('Erreur lors de la génération des icônes:', error);
  }
}

generateIcons(); 