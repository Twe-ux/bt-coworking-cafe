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
    console.log(`📸 ${filename}`);
    console.log(`   Original: ${metadata.width}x${metadata.height}`);

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
    console.log(`   ✓ Optimisé: ${TARGET_WIDTH}x${TARGET_HEIGHT}`);
    console.log(`   💾 ${(outputStats.size / 1024).toFixed(1)}KB`);
    console.log('');

    return { success: true, filename };
  } catch (error) {
    console.error(`   ✗ Erreur: ${error.message}`);
    console.log('');
    return { success: false, filename, error: error.message };
  }
}

async function main() {
  console.log('🖼️  Création des images carrousel uniformes\n');
  console.log('═'.repeat(60));
  console.log('');

  // Créer le dossier de sortie
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Lister toutes les images WebP du carrousel
  const files = fs.readdirSync(SOURCE_DIR)
    .filter(f => f.endsWith('.webp'))
    .map(f => path.join(SOURCE_DIR, f));

  console.log(`📁 Trouvé ${files.length} image(s) à traiter\n`);

  const results = [];
  for (const inputPath of files) {
    const filename = path.basename(inputPath);
    const outputPath = path.join(OUTPUT_DIR, filename);
    const result = await processImage(inputPath, outputPath);
    results.push(result);
  }

  // Statistiques
  console.log('═'.repeat(60));
  console.log('\n📊 Résumé:\n');
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✓ ${successful.length} image(s) créée(s) (${TARGET_WIDTH}x${TARGET_HEIGHT})`);
  if (failed.length > 0) {
    console.log(`✗ ${failed.length} erreur(s)`);
  }
  console.log(`\n📂 Dossier: ${OUTPUT_DIR}`);
  console.log('');
}

main().catch(error => {
  console.error('❌ Erreur:', error);
  process.exit(1);
});
