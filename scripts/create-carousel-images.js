#!/usr/bin/env node

/**
 * Script pour créer des images carrousel uniformes
 * Toutes les images seront recadrées à 1200x800px (ratio 3:2)
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(process.cwd(), 'public/images/takeAway/Carrousel');
const OUTPUT_DIR = path.join(process.cwd(), 'public/images/takeAway/Carrousel-optimized');

// Dimensions cibles pour le carrousel
const TARGET_WIDTH = 1200;
const TARGET_HEIGHT = 800;

async function processImage(inputPath, outputPath) {
  const filename = path.basename(inputPath);

  try {
    const metadata = await sharp(inputPath).metadata();
    // Recadrer au centre avec le ratio 3:2
    await sharp(inputPath)
      .resize(TARGET_WIDTH, TARGET_HEIGHT, {
        fit: 'cover',
        position: 'center'
      })
      .webp({
        quality: 90,
        effort: 4
      })
      .toFile(outputPath);

    const outputStats = fs.statSync(outputPath);
    return { success: true, filename };
  } catch (error) {    return { success: false, filename, error: error.message };
  }
}

async function main() {
  // Créer le dossier de sortie
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Lister toutes les images WebP du carrousel
  const files = fs.readdirSync(SOURCE_DIR)
    .filter(f => f.endsWith('.webp'))
    .map(f => path.join(SOURCE_DIR, f));
  const results = [];
  for (const inputPath of files) {
    const filename = path.basename(inputPath);
    const outputPath = path.join(OUTPUT_DIR, filename);
    const result = await processImage(inputPath, outputPath);
    results.push(result);
  }

  // Statistiques  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);  }

main().catch(error => {  process.exit(1);
});
