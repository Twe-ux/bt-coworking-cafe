# Guide de test de la PWA - Coworking Café

## ✅ Configuration PWA terminée

Votre application est maintenant une **Progressive Web App (PWA)** complète !

## 📱 Comment tester l'installation

### Sur Android (Chrome)

1. **Déployez l'app** sur un serveur HTTPS (Vercel/Netlify)
   - Les PWA nécessitent HTTPS (localhost fonctionne aussi)

2. **Ouvrez le site** sur votre téléphone Android
   - Allez sur `https://votre-domaine.com/booking`

3. **Installation automatique**
   - Après 3 secondes, une bannière orange apparaît en bas :
     > 📱 **Installez l'application**
     > Accédez rapidement à vos réservations
     > [Installer]

4. **Installer l'app**
   - Cliquez sur "Installer"
   - Ou : Menu ⋮ → "Installer l'application"
   - L'icône apparaît sur votre écran d'accueil

### Sur iOS (Safari)

1. **Ouvrez Safari** sur iPhone/iPad
   - Allez sur `https://votre-domaine.com/booking`

2. **Installation manuelle**
   - Cliquez sur le bouton Partage (carré avec flèche ↑)
   - Faites défiler et choisissez **"Sur l'écran d'accueil"**
   - Confirmez le nom "Coworking Café"
   - L'icône apparaît sur votre écran d'accueil

3. **Note iOS**
   - iOS ne supporte pas la bannière automatique
   - L'installation se fait manuellement via Safari

## 🎯 Pages avec PWA prompt

La bannière d'installation apparaît sur :
- `/booking` - Réservation d'espaces
- `/booking/*` - Toutes les sous-pages de booking
- `/dashboards/analytics` - Dashboard client
- Tout le site en fait !

## ✨ Fonctionnalités PWA

### 1. **Installation native**
- Icône sur l'écran d'accueil
- Lancement comme une vraie app
- Pas de barre d'URL (plein écran)

### 2. **Offline first**
- Service Worker cache les pages essentielles
- Fonctionne sans connexion
- Cache : `/booking`, `/dashboards/analytics`

### 3. **Raccourcis d'app**
Sur Android (appui long sur l'icône) :
- 🎯 Réserver un espace
- 📋 Mes réservations
- 📊 Dashboard

### 4. **Thème personnalisé**
- Couleur de thème : Orange (#F59E0B)
- Splash screen avec logo
- Design responsive

## 🔧 Configuration technique

### Fichiers créés/modifiés :

1. **`public/manifest.json`**
   - Configuration PWA
   - Icônes et raccourcis
   - start_url: `/booking`

2. **`public/sw.js`**
   - Service Worker
   - Cache offline (network-first strategy)

3. **`src/components/common/PWAInstallPrompt.tsx`**
   - Bannière d'installation personnalisée
   - Détection automatique
   - Gestion du Service Worker

4. **Layouts modifiés**
   - `src/app/layout.tsx` - Métadonnées PWA
   - `src/app/(site)/layout.tsx` - Prompt pour /booking
   - `src/app/dashboard/layout.tsx` - Prompt pour dashboard

## 📦 Déploiement

### Pré-requis :
- ✅ HTTPS obligatoire (Vercel/Netlify le font automatiquement)
- ✅ Manifest.json accessible
- ✅ Service Worker enregistré

### Commandes :
```bash
npm run build
npm start  # ou déployez sur Vercel
```

## 🧪 Test en local

1. **Build production**
   ```bash
   npm run build
   npm start
   ```

2. **Ouvrez sur mobile**
   - Trouvez votre IP : `ipconfig getifaddr en0` (Mac)
   - Sur téléphone : `http://[votre-ip]:3000/booking`

3. **Lighthouse PWA Audit**
   - Chrome DevTools → Lighthouse
   - Sélectionnez "Progressive Web App"
   - Score cible : > 90/100

## ⚙️ Personnalisation future

Si vous voulez modifier :

### Changer la couleur du thème
```json
// public/manifest.json
"theme_color": "#VotreCouleur"
```

### Ajouter des pages au cache offline
```javascript
// public/sw.js
const urlsToCache = [
  '/',
  '/booking',
  '/votre-page',  // Ajoutez ici
];
```

### Modifier le texte de la bannière
```tsx
// src/components/common/PWAInstallPrompt.tsx
<strong>Votre texte personnalisé</strong>
```

## 📊 Analytics

Pour tracker les installations PWA, ajoutez dans `PWAInstallPrompt.tsx` :

```typescript
if (outcome === 'accepted') {
  // Analytics : PWA installée
  gtag('event', 'pwa_install', { method: 'prompt' });
}
```

## 🎉 C'est prêt !

Votre site est maintenant une PWA complète. Les utilisateurs de `/booking` et du dashboard pourront l'installer comme une vraie app mobile !

**Avantages :**
- ✅ Pas de code dupliqué (même codebase)
- ✅ Mises à jour automatiques
- ✅ Expérience native
- ✅ Fonctionne offline
- ✅ 0 frais App Store/Play Store
