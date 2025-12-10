#!/usr/bin/env node

/**
 * Image Optimization Script
 * Converts PNG/JPG to WebP and resizes according to usage context
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration des dimensions par catégorie
const IMAGE_CONFIGS = {
  blogs: {
    width: 800,
    height: 600,
    quality: 85,
    fit: 'cover'
  },
  projects: {
    width: 600,
    height: 400,
    quality: 85,
    fit: 'cover'
  },
  banner: {
    width: 1920,
    height: 1080,
    quality: 90,
    fit: 'cover'
  },
  spaces: {
    width: 1200,
    height: 800,
    quality: 85,
    fit: 'cover'
  },
  thumbnails: {
    width: 400,
    height: 300,
    quality: 80,
    fit: 'cover'
  },
  menu: {
    width: 600,
    height: 400,
    quality: 85,
    fit: 'cover'
  },
  services: {
    width: 600,
    height: 400,
    quality: 85,
    fit: 'cover'
  },
  testimonial: {
    width: 300,
    height: 300,
    quality: 80,
    fit: 'cover'
  },
  about: {
    width: 800,
    height: 600,
    quality: 85,
    fit: 'cover'
  },
  default: {
    width: 800,
    height: 600,
    quality: 85,
    fit: 'inside' // Preserve aspect ratio
  }
};

/**
 * Détermine la catégorie d'image selon son chemin
 */
function getImageCategory(filePath) {
  const pathParts = filePath.split(path.sep);

  // Cherche le dossier parent dans public/images/
  const imagesIndex = pathParts.indexOf('images');
  if (imagesIndex !== -1 && pathParts.length > imagesIndex + 1) {
    const category = pathParts[imagesIndex + 1].toLowerCase();
    if (IMAGE_CONFIGS[category]) {
      return category;
    }
  }

  return 'default';
}

/**
 * Optimise une image
 */
async function optimizeImage(inputPath, options = {}) {
  const category = getImageCategory(inputPath);
  const config = IMAGE_CONFIGS[category];

  const ext = path.extname(inputPath).toLowerCase();
  const dirname = path.dirname(inputPath);
  const basename = path.basename(inputPath, ext);

  // Backup de l'original si ce n'est pas déjà un .webp
  if (ext !== '.webp' && options.backup) {
    const backupDir = path.join(dirname, '_originals');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    const backupPath = path.join(backupDir, path.basename(inputPath));
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(inputPath, backupPath);
    }
  }

  // Chemin de sortie .webp
  const outputPath = path.join(dirname, `${basename}.webp`);

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    console.log(`📸 ${path.relative(process.cwd(), inputPath)}`);
    console.log(`   Catégorie: ${category}`);
    console.log(`   Original: ${metadata.width}x${metadata.height}`);
    console.log(`   Cible: ${config.width}x${config.height}`);

    await image
      .resize(config.width, config.height, {
        fit: config.fit,
        position: 'center',
        withoutEnlargement: true
      })
      .webp({
        quality: config.quality,
        effort: 4 // 0-6, plus élevé = meilleure compression mais plus lent
      })
      .toFile(outputPath);

    const originalSize = fs.statSync(inputPath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

    console.log(`   ✓ ${path.basename(outputPath)}`);
    console.log(`   💾 ${(originalSize / 1024).toFixed(1)}KB → ${(optimizedSize / 1024).toFixed(1)}KB (${savings}% économisé)`);
    console.log('');

    return { success: true, inputPath, outputPath, savings };
  } catch (error) {
    console.error(`   ✗ Erreur: ${error.message}`);
    console.log('');
    return { success: false, inputPath, error: error.message };
  }
}

/**
 * Trouve toutes les images à optimiser
 */
function findImages(dir, extensions = ['.png', '.jpg', '.jpeg']) {
  const images = [];

  function scan(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      // Ignorer les dossiers _originals
      if (entry.isDirectory() && entry.name !== '_originals') {
        scan(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (extensions.includes(ext)) {
          images.push(fullPath);
        }
      }
    }
  }

  scan(dir);
  return images;
}

/**
 * Fonction principale
 */
async function main() {
  const args = process.argv.slice(2);
  const imagesDir = path.join(process.cwd(), 'public', 'images');

  console.log('🖼️  Optimiseur d\'images WebP\n');
  console.log('═'.repeat(60));
  console.log('');

  // Mode: fichier spécifique ou dossier entier
  if (args.length > 0 && args[0] !== '--all') {
    const targetPath = path.resolve(args[0]);

    if (fs.existsSync(targetPath)) {
      const stats = fs.statSync(targetPath);

      if (stats.isFile()) {
        // Optimiser un seul fichier
        await optimizeImage(targetPath, { backup: true });
      } else if (stats.isDirectory()) {
        // Optimiser tous les fichiers d'un dossier
        const images = findImages(targetPath);
        console.log(`📁 Trouvé ${images.length} image(s) dans ${path.relative(process.cwd(), targetPath)}\n`);

        for (const image of images) {
          await optimizeImage(image, { backup: true });
        }
      }
    } else {
      console.error(`❌ Chemin introuvable: ${targetPath}`);
      process.exit(1);
    }
  } else {
    // Optimiser toutes les images
    const images = findImages(imagesDir);
    console.log(`📁 Trouvé ${images.length} image(s) dans public/images\n`);

    const results = [];
    for (const image of images) {
      const result = await optimizeImage(image, { backup: true });
      results.push(result);
    }

    // Statistiques finales
    console.log('═'.repeat(60));
    console.log('\n📊 Résumé:\n');
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(`✓ ${successful.length} image(s) optimisée(s)`);
    if (failed.length > 0) {
      console.log(`✗ ${failed.length} erreur(s)`);
    }

    if (successful.length > 0) {
      const avgSavings = successful.reduce((sum, r) => sum + parseFloat(r.savings), 0) / successful.length;
      console.log(`💾 Économie moyenne: ${avgSavings.toFixed(1)}%`);
    }
    console.log('');
  }
}

// Point d'entrée
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Erreur:', error);
    process.exit(1);
  });
}

module.exports = { optimizeImage, findImages };
