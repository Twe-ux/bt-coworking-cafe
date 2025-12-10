/**
 * Configuration centralisée des dimensions d'images
 * ⚠️ FICHIER UNIQUE - Modifier ici pour mettre à jour partout
 *
 * Utilisé par:
 * - scripts/optimize-images.js (optimisation manuelle)
 * - src/lib/image-optimizer.ts (optimisation automatique via dashboard)
 */

const IMAGE_CONFIGS = {
  blog: {
    width: 800,
    height: 600,
    quality: 85,
    fit: 'cover'
  },
  blogs: {
    width: 800,
    height: 600,
    quality: 85,
    fit: 'cover'
  },
  menu: {
    width: 600,
    height: 400,
    quality: 85,
    fit: 'cover'
  },
  food: {
    width: 600,
    height: 400,
    quality: 85,
    fit: 'cover'
  },
  drinks: {
    width: 600,
    height: 400,
    quality: 85,
    fit: 'cover'
  },
  beverage: {
    width: 600,
    height: 400,
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
  hero: {
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
  takeaway: {
    width: 1200,
    height: 800,
    quality: 85,
    fit: 'cover'
  },
  'take-away': {
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
  default: {
    width: 800,
    height: 600,
    quality: 85,
    fit: 'inside' // Preserve aspect ratio
  }
};

module.exports = { IMAGE_CONFIGS };
