# 📋 Checklist de Review - BT Coworking Café

Cette checklist doit être utilisée par **Opus** pour reviewer le code de **Sonnet** avant chaque commit majeur.

---

## 🏗️ Architecture & Structure

### Cohérence avec l'architecture existante
- [ ] Respect du pattern dual layout (site public vs dashboard admin)
- [ ] Routes dans les bons groupes : `(site)` vs `dashboard/(admin)` vs `dashboard/(other)`
- [ ] Pas de mixage de logique publique/admin dans un même composant
- [ ] Utilisation correcte du middleware pour la protection des routes

### Nommage et organisation
- [ ] **Dossiers en camelCase** : `articleRevision`, `contactMail`, etc.
- [ ] **Fichiers en kebab-case** : `auth-options.ts`, `article-helpers.ts`
- [ ] **Composants en PascalCase** : `ProfileCard.tsx`, `LoginForm.tsx`
- [ ] Pas de dossiers dupliqués ou obsolètes
- [ ] Structure de fichiers cohérente avec le reste du projet

### Modèles MongoDB
- [ ] Suit le pattern établi : `document.ts`, `methods.ts`, `hooks.ts`, `virtuals.ts`, `index.ts`
- [ ] **OU** modèle simplifié dans un seul fichier (mais cohérent dans tout le modèle)
- [ ] Export par défaut nommé correctement (ex: `export { UserModel as User }`)
- [ ] Indexes définis pour les requêtes fréquentes
- [ ] Validation Mongoose appropriée

### Routes API
- [ ] Routes admin dans `/api/admin/*` avec vérification de rôle
- [ ] Routes publiques dans `/api/*`
- [ ] Structure RESTful cohérente (GET, POST, PUT/PATCH, DELETE)
- [ ] Paramètres dynamiques bien typés (`params: Promise<{ id: string }>`)

---

## 📝 Code Quality

### TypeScript
- [ ] **Aucun `any`** (utiliser `unknown` si nécessaire)
- [ ] Tous les types/interfaces sont définis
- [ ] Pas de `@ts-ignore` ou `@ts-expect-error` sans justification
- [ ] Props des composants bien typées
- [ ] Types d'API responses définis

### Gestion d'erreurs
- [ ] Tous les appels API/DB dans des `try/catch`
- [ ] Messages d'erreur utilisateur-friendly (pas de stack traces exposées)
- [ ] Logs appropriés pour les erreurs serveur
- [ ] Status codes HTTP corrects (400, 401, 403, 404, 500, etc.)
- [ ] Gestion des cas limites (null, undefined, empty arrays)

### Logging
- [ ] **Pas de `console.log` en production** (seulement `console.error` pour erreurs critiques)
- [ ] Utilisation du logger centralisé (`src/lib/logger.ts`) si besoin
- [ ] Pas d'emojis ou de messages debug stylisés
- [ ] Logs structurés et utiles pour le debugging

### Validation des données
- [ ] Validation côté serveur pour toutes les API routes
- [ ] Utilisation de Zod/Yup ou validation Mongoose
- [ ] Sanitization des inputs (XSS, injection)
- [ ] Vérification des permissions utilisateur

### Code commenté
- [ ] Commentaires uniquement pour la logique complexe
- [ ] Pas de code commenté "mort" (à supprimer)
- [ ] JSDoc pour les fonctions utilitaires réutilisables
- [ ] TODO/FIXME avec contexte si nécessaire

---

## 🔒 Sécurité

### Authentification & Autorisation
- [ ] Routes protégées vérifient la session (`getServerSession`)
- [ ] Vérification des rôles pour les opérations admin (`role === 'admin' || role === 'dev'`)
- [ ] Pas d'accès direct aux ressources d'autres utilisateurs (vérifier `userId`)
- [ ] Tokens/sessions gérés correctement

### Données sensibles
- [ ] **Pas de secrets dans le code** (clés API, passwords, etc.)
- [ ] Variables d'environnement utilisées correctement (`.env.local`)
- [ ] Pas de données utilisateur loggées (emails, passwords, tokens)
- [ ] Upload de fichiers validé (type, taille)

### XSS & Injection
- [ ] Inputs sanitizés côté serveur
- [ ] Requêtes MongoDB utilisent les méthodes Mongoose (pas de raw queries)
- [ ] HTML affiché via `dangerouslySetInnerHTML` est sanitizé
- [ ] Protection CSRF si nécessaire (formulaires)

---

## ⚡ Performance

### Images
- [ ] Utilisation de `next/image` avec optimisation
- [ ] Alt text présent pour toutes les images
- [ ] Images uploadées sur Cloudinary (pas en base64)
- [ ] Lazy loading approprié
- [ ] Blur placeholder pour les grandes images

### Requêtes Database
- [ ] Pas de N+1 queries (utiliser `.populate()` judicieusement)
- [ ] Indexes MongoDB pour les champs fréquemment requêtés
- [ ] Pagination pour les listes longues
- [ ] Utilisation de `.lean()` pour les reads simples (pas besoin de Document Mongoose)
- [ ] Pas de `find()` sans limite sur de grandes collections

### Bundle & Loading
- [ ] Composants lourds avec `dynamic()` et `loading` si nécessaire
- [ ] Loading states pour les actions asynchrones
- [ ] Skeleton screens pour les contenus longs à charger
- [ ] Pas d'imports inutiles de librairies lourdes

---

## 🧪 Tests & Qualité

### Tests manuels
- [ ] Fonctionnalité testée manuellement (happy path)
- [ ] Cas limites testés (empty state, errors, edge cases)
- [ ] Testé sur mobile (responsive)
- [ ] Pas de régression sur les features existantes

### Tests automatisés (quand applicable)
- [ ] Tests unitaires pour les fonctions critiques
- [ ] Tests d'intégration pour les API routes
- [ ] Mocks appropriés pour les services externes

---

## 🎨 UI/UX (si applicable)

### Design & Cohérence
- [ ] Suit le design system du projet (couleurs, fonts, spacing)
- [ ] Composants Bootstrap utilisés correctement
- [ ] Pas de styles inline (utiliser SCSS modules ou classes)
- [ ] Responsive sur mobile/tablet/desktop
- [ ] Accessibilité de base (labels, aria-*, semantic HTML)

### Expérience utilisateur
- [ ] Messages de feedback pour les actions (success, error)
- [ ] Loading states pendant les opérations longues
- [ ] Confirmation pour les actions destructives (delete, cancel)
- [ ] Navigation claire et intuitive
- [ ] Pas de dead-ends (toujours un moyen de revenir en arrière)

---

## 📦 Bonnes Pratiques Spécifiques au Projet

### Next.js 14 App Router
- [ ] Utilisation correcte de Server Components vs Client Components
- [ ] `'use client'` uniquement quand nécessaire (hooks, events)
- [ ] `export const dynamic = 'force-dynamic'` pour les pages authentifiées
- [ ] Metadata définie pour les pages publiques (SEO)
- [ ] Error boundaries appropriés

### Redux Toolkit Query (si utilisé)
- [ ] API slices bien structurés
- [ ] Tags pour l'invalidation du cache
- [ ] Optimistic updates pour UX fluide
- [ ] Gestion des erreurs dans les mutations

### MongoDB & Mongoose
- [ ] Connexion DB via `connectDB()` dans chaque route API
- [ ] Modèles importés correctement (singleton pattern)
- [ ] Timestamps activés (`timestamps: true`)
- [ ] Virtuals définis dans le schema si nécessaire

---

## 🚀 Déploiement & Production

### Compatibilité Vercel
- [ ] Pas de dépendances système non supportées
- [ ] Taille de bundle acceptable (< 250KB par page si possible)
- [ ] Variables d'environnement documentées
- [ ] Pas de custom server (incompatible avec Vercel)

### Variables d'environnement
- [ ] Toutes les vars utilisées sont dans `.env.example`
- [ ] Pas de valeurs par défaut hardcodées dangereuses
- [ ] Types des vars d'env validés si possible

---

## ✅ Checklist de Pre-Commit

**Avant de merge un PR, vérifier :**

1. [ ] Code buildé sans erreurs TypeScript (`npm run build`)
2. [ ] Linter passé sans warnings critiques (`npm run lint`)
3. [ ] Tests manuels effectués
4. [ ] Pas de console.log debug
5. [ ] Pas de fichiers temporaires ou de test
6. [ ] CLAUDE.md mis à jour si changements d'architecture
7. [ ] task.md mis à jour si tâche complétée

---

## 📊 Scoring de Review

Pour chaque PR, donner une note sur 5 dans ces catégories :

- **Architecture** : /5 (cohérence, structure, patterns)
- **Code Quality** : /5 (TypeScript, erreurs, validation)
- **Sécurité** : /5 (auth, sanitization, secrets)
- **Performance** : /5 (DB queries, images, bundle)
- **UX** : /5 (feedback, responsive, accessibilité)

**Score total** : /25

- ✅ **20-25** : Excellent, merge direct
- ⚠️ **15-19** : Bon, corrections mineures avant merge
- ❌ **< 15** : Refus, corrections majeures requises

---

## 🔄 Workflow de Review

1. **Sonnet** termine une feature et commit sur sa branche
2. **Vous** demandez à **Opus** : "Review la branche `claude/feature-xxx`"
3. **Opus** checkout la branche et analyse :
   - Compare avec `main`
   - Vérifie chaque item de cette checklist
   - Identifie les problèmes et propose des améliorations
4. **Opus** présente un rapport de review avec scoring
5. **Vous** décidez :
   - ✅ Merge si score > 20
   - ⚠️ Opus fait corrections mineures
   - ❌ Retour à Sonnet avec feedback détaillé

---

**Dernière mise à jour** : 2025-12-06
