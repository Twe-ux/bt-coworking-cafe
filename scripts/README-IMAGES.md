# 🖼️ Optimisation d'Images

Ce système optimise automatiquement vos images PNG/JPG en WebP et les redimensionne selon leur utilisation.

## ✨ Optimisation Automatique via Dashboard

**L'optimisation est maintenant AUTOMATIQUE !** Lorsque vous uploadez une image via le dashboard (articles de blog, menu, boissons, espaces), elle est automatiquement :

- ✅ Convertie en WebP
- ✅ Redimensionnée selon sa catégorie
- ✅ Compressée avec la qualité optimale
- ✅ Envoyée à Cloudinary déjà optimisée

**Aucune commande à lancer** - tout se fait en arrière-plan lors de l'upload !

## 📐 Dimensions par Catégorie

Le script détecte automatiquement le type d'image selon son emplacement :

| Dossier | Dimensions | Qualité | Utilisation |
|---------|-----------|---------|-------------|
| `blogs/` | 800×600px | 85% | Articles du mag' |
| `projects/` | 600×400px | 85% | Cartes menu/projets |
| `banner/` | 1920×1080px | 90% | Images pleine largeur |
| `spaces/` | 1200×800px | 85% | Galerie d'espaces |
| `services/` | 600×400px | 85% | Services |
| `testimonial/` | 300×300px | 80% | Témoignages |
| `about/` | 800×600px | 85% | À propos |
| `takeAway/` | 1200×800px | 85% | Page take-away |
| Autres | 800×600px | 85% | Par défaut |

## 🎯 Cas d'Usage

### Upload via Dashboard (Automatique)

Lorsque vous :
- Créez un article de blog avec une image
- Ajoutez une boisson/food avec photo
- Uploadez une image d'espace

➡️ **L'image est automatiquement optimisée** avant d'être envoyée à Cloudinary

Vous verrez dans les logs :
```
✅ Image optimisée avant upload Cloudinary: {
  savings: '87%',
  size: '12.3KB',
  format: 'webp'
}
```

### Désactiver l'optimisation automatique

Si vous voulez uploader une image sans optimisation (rare) :

```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('folder', 'blog');
formData.append('skipOptimization', 'true'); // ← Désactive l'optimisation
```

## 🚀 Optimisation Manuelle

### Optimiser toutes les images

```bash
npm run optimize:images
```

Cette commande va :
- Scanner tous les PNG/JPG dans `public/images/`
- Les convertir en WebP
- Les redimensionner selon leur catégorie
- Sauvegarder les originaux dans `_originals/`
- Afficher un rapport détaillé

### Optimiser un fichier spécifique

```bash
npm run optimize:image public/images/blogs/mon-article.png
```

### Optimiser un dossier spécifique

```bash
npm run optimize:image public/images/blogs
```

## 📊 Exemple de Sortie

```
🖼️  Optimiseur d'images WebP

════════════════════════════════════════════════════════════

📁 Trouvé 24 image(s) dans public/images

📸 public/images/blogs/blog-1.png
   Catégorie: blogs
   Original: 1200x900
   Cible: 800x600
   ✓ blog-1.webp
   💾 245.2KB → 87.3KB (64.4% économisé)

📸 public/images/banner/hero.jpg
   Catégorie: banner
   Original: 2560x1440
   Cible: 1920x1080
   ✓ hero.webp
   💾 512.8KB → 156.2KB (69.5% économisé)

════════════════════════════════════════════════════════════

📊 Résumé:

✓ 24 image(s) optimisée(s)
💾 Économie moyenne: 65.8%
```

## 💡 Conseils

### Pour les nouvelles images de blog

1. Uploadez votre image PNG/JPG via le dashboard
2. Lancez `npm run optimize:images`
3. Le script créera automatiquement la version WebP optimisée
4. Utilisez le fichier `.webp` dans votre code

### Pour le menu/boissons/food

Même processus - placez vos images dans `public/images/projects/` et lancez l'optimisation.

### Backup des originaux

Les fichiers originaux sont automatiquement sauvegardés dans un dossier `_originals/` au même emplacement. Vous pouvez les supprimer une fois satisfait du résultat.

## 🔧 Configuration Avancée

### 📐 Modifier les Dimensions

**IMPORTANT**: Les dimensions sont centralisées dans **UN SEUL fichier** :

```
scripts/image-config.js
```

Modifie ce fichier pour changer les dimensions de **toutes les images** (optimisation manuelle + uploads dashboard) :

```javascript
const IMAGE_CONFIGS = {
  blogs: {
    width: 800,      // Largeur cible
    height: 600,     // Hauteur cible
    quality: 85,     // Qualité WebP (0-100)
    fit: 'cover'     // 'cover' ou 'inside'
  },
  takeaway: {
    width: 1200,     // ← Change ici pour /take-away
    height: 800,
    quality: 85,
    fit: 'cover'
  },
  // ...
};
```

⚠️ **Ne modifie PAS** `scripts/optimize-images.js` ou `src/lib/image-optimizer.ts` directement - ils importent automatiquement depuis `image-config.js`

## ⚠️ Notes Importantes

- ✅ Les images WebP existantes sont maintenant redimensionnées selon la configuration
- Le script préserve le ratio d'aspect si `fit: 'inside'`
- La compression WebP offre généralement 60-70% d'économie par rapport à PNG/JPG
- Compatible avec tous les navigateurs modernes (95%+ support)
- PNG/JPG sont convertis en WebP, les WebP existants sont juste redimensionnés

## 🎯 Workflow Recommandé

1. **Upload** → Ajoutez vos images PNG/JPG dans le bon dossier
2. **Optimisation** → `npm run optimize:images`
3. **Vérification** → Testez les images .webp dans votre site
4. **Nettoyage** → Supprimez les .png/.jpg originaux si satisfait
5. **Commit** → Versionnez uniquement les .webp optimisés

---

**Besoin d'aide ?** Consultez la documentation de [Sharp](https://sharp.pixelplumbing.com/) pour plus d'options avancées.
