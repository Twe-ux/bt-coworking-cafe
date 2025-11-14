# Task List - BT Coworking Café

## 📝 Blog - Tâches Restantes

### ✅ Priorité 1 (Haute) - TERMINÉ

- [x] **Auto-publication des articles programmés**
  - [x] Créer un cron job / scheduled task pour vérifier les articles avec `scheduledFor`
  - [x] Mettre à jour le statut de "scheduled" à "published" automatiquement
  - [x] Définir `publishedAt` lors de la publication automatique
  - [x] Ajouter des logs pour tracer les publications automatiques
  - [x] Option : Utiliser Vercel Cron ou Next.js API route avec cron-job.org
  - **Implémentation**: Cron job `/api/cron/publish-scheduled`, configuration `vercel.json`, documentation `CRON_SETUP.md`

- [x] **Système de likes par utilisateur**
  - [x] Créer un modèle `ArticleLike` (userId, articleId, createdAt)
  - [x] Créer un modèle `CommentLike` (userId, commentId, createdAt)
  - [x] Modifier l'API `/api/articles/id/[id]/like` pour tracker l'utilisateur
  - [x] Ajouter endpoint `DELETE` pour unlike
  - [x] Afficher l'état "liked" dans l'UI (cœur rouge/gris)
  - [x] Empêcher les likes multiples du même utilisateur
  - **Implémentation**: Models avec index unique composé, API GET/POST/DELETE, RTK Query avec optimistic updates

- [x] **UI des commentaires imbriqués**
  - [x] Créer un composant récursif pour afficher les réponses
  - [x] Ajouter un bouton "Répondre" sous chaque commentaire
  - [x] Implémenter un formulaire de réponse inline
  - [x] Afficher l'indentation visuelle pour les niveaux de réponses
  - [x] Limiter la profondeur des réponses (ex: 3 niveaux max)
  - **Implémentation**: Composant `CommentItem.tsx` récursif avec profondeur max configurable (défaut: 3)

- [x] **Historique des révisions d'articles**
  - [x] Créer un modèle `ArticleRevision` (articleId, content, title, author, createdAt)
  - [x] Sauvegarder une révision à chaque modification
  - [x] Créer API pour gérer les révisions
  - [x] Permettre la restauration d'une version précédente
  - **Implémentation**: Model `ArticleRevision`, helpers `article-revision-helpers.ts`, API `/api/articles/id/[id]/revisions`
  - **Note**: Page UI `/dashboard/post/edit/[id]/history` à créer (Priorité 2)

### Priorité 2 (Moyenne)

- [ ] **Auto-sauvegarde des brouillons**
  - [ ] Implémenter un debounce sur le formulaire (toutes les 30 secondes)
  - [ ] Sauvegarder automatiquement en localStorage
  - [ ] Afficher un indicateur "Sauvegardé automatiquement à HH:MM"
  - [ ] Restaurer le brouillon lors de la réouverture du formulaire

- [ ] **Notifications pour les commentaires**
  - [ ] Créer un modèle `Notification` (userId, type, content, read, createdAt)
  - [ ] Notifier l'auteur quand un nouveau commentaire est posté
  - [ ] Notifier l'utilisateur quand on répond à son commentaire
  - [ ] Créer une page `/dashboard/notifications`
  - [ ] Ajouter une cloche avec badge dans le header du dashboard

- [ ] **Prévisualisation d'article**
  - [ ] Ajouter un bouton "Prévisualiser" dans le formulaire de création
  - [ ] Ouvrir une modal ou nouvelle page avec le rendu de l'article
  - [ ] Permettre la prévisualisation avant publication
  - [ ] Générer un lien de prévisualisation partageable (token temporaire)

- [ ] **Analytics détaillées**
  - [ ] Créer une page `/dashboard/post/analytics`
  - [ ] Afficher les articles les plus vus
  - [ ] Afficher les articles les plus likés
  - [ ] Afficher les catégories/tags les plus populaires
  - [ ] Graphiques de vues par jour/semaine/mois
  - [ ] Taux d'engagement par article

### Priorité 3 (Basse / Polish)

- [ ] **Opérations en masse**
  - [ ] Sélection multiple d'articles (checkbox)
  - [ ] Publier/dépublier plusieurs articles en une fois
  - [ ] Supprimer plusieurs articles en une fois
  - [ ] Changer la catégorie de plusieurs articles

- [ ] **SEO & Partage social**
  - [ ] Générer automatiquement `sitemap.xml`
  - [ ] Créer un `robots.txt` personnalisé
  - [ ] Implémenter les balises Open Graph (og:image, og:title, etc.)
  - [ ] Ajouter les balises Twitter Card
  - [ ] Générer des images Open Graph dynamiques avec `@vercel/og`

- [ ] **Génération automatique d'excerpt**
  - [ ] Si l'excerpt est vide, extraire les 200 premiers caractères du contenu
  - [ ] Ajouter un bouton "Générer automatiquement" pour l'excerpt
  - [ ] Nettoyer le Markdown pour l'excerpt (supprimer les balises)

- [ ] **Recherche avancée**
  - [ ] Implémenter la recherche full-text dans MongoDB
  - [ ] Ajouter des filtres combinés (date + catégorie + tag)
  - [ ] Ajouter un tri (plus récent, plus populaire, plus commenté)
  - [ ] Ajouter une page de résultats de recherche dédiée

---

## 🏢 Plateforme de Réservation - Nouvelles Fonctionnalités

### ✅ Phase 1 : Modèles et Base de Données - TERMINÉ

- [x] **Créer le modèle `Space` (Espace/Salle)**
  - [x] Fields : name, slug, description, type (desk/meeting-room/private-office/event-space)
  - [x] capacity, pricing { hourly, daily, weekly, monthly }
  - [x] amenities[] (14 types: wifi, projector, whiteboard, coffee, printer, phone, tv, air-conditioning, natural-light, standing-desk, ergonomic-chair, locker, kitchen-access, parking)
  - [x] images[], featuredImage (Cloudinary URLs)
  - [x] availability: { dayOfWeek, startTime, endTime, isAvailable }[]
  - [x] isActive, isDeleted, floor, building, viewCount, bookingCount
  - [x] Indexes : type, isActive, pricing, capacity, full-text search
  - [x] Methods : activate(), deactivate(), softDelete(), incrementView(), incrementBooking(), isAvailableOnDay()
  - [x] Virtuals : hasPricing, minPrice, isBookable, averageRating, occupancyRate
  - [x] Hooks : auto-generate slug, set deletedAt
  - **Structure** : `src/models/space/` (document.ts, hooks.ts, methods.ts, virtuals.ts, index.ts)

- [x] **Modifier le modèle `Reservation` (Réservation)**
  - [x] Ajout référence `space: ObjectId`
  - [x] Fields : user, space, date, startTime, endTime, numberOfPeople
  - [x] status (pending/confirmed/cancelled/completed)
  - [x] totalPrice, paymentStatus (pending/paid/refunded/failed)
  - [x] specialRequests, confirmationNumber, notes
  - [x] stripePaymentIntentId, stripeSessionId, stripeCustomerId
  - [x] createdAt, updatedAt, cancelledAt, completedAt
  - [x] Indexes : userId, spaceId, status, date, stripePaymentIntentId, confirmationNumber
  - [x] Compound index : space + date + startTime + endTime + status (prévenir double booking)
  - [x] Methods : calculateDuration(), canCancel(), cancel()
  - [x] Virtuals : duration, isUpcoming, isPast, canBeCancelled
  - [x] Hooks : validate times, generate confirmation number, set completedAt
  - **Modifié** : `src/models/reservation/document.ts` & `hooks.ts`

- [x] **Créer le modèle `Payment`**
  - [x] Fields : booking, user, amount, currency (default EUR)
  - [x] stripePaymentIntentId, stripeChargeId, stripeCustomerId, stripeRefundId
  - [x] status (pending/processing/succeeded/failed/refunded/cancelled)
  - [x] paymentMethod (card/cash/bank-transfer/wallet)
  - [x] metadata: { cardBrand, cardLast4, cardExpiryMonth, cardExpiryYear, receiptUrl, receiptNumber, refundReason, refundedAmount, refundedAt }
  - [x] description, failureReason, completedAt, failedAt
  - [x] Indexes : user, booking, status, createdAt, stripePaymentIntentId
  - [x] Methods : markAsSucceeded(), markAsFailed(), markAsRefunded(), canBeRefunded(), isSuccessful()
  - [x] Virtuals : isPending, isCompleted, isRefunded, formattedAmount, processingTime, maskedCardNumber
  - [x] Hooks : set completedAt/failedAt, update booking paymentStatus automatiquement
  - **Structure** : `src/models/payment/` (document.ts, hooks.ts, methods.ts, virtuals.ts, index.ts)

- [ ] **Créer le modèle `TimeSlot` (optionnel, pour optimisation)**
  - [ ] spaceId, date, startTime, endTime, isBooked
  - [ ] Permet de gérer les disponibilités facilement
  - **Note** : Peut être implémenté plus tard si nécessaire pour la performance

### ✅ Phase 2 : API Endpoints - TERMINÉ

- [x] **API Spaces** (`src/app/api/spaces/`)
  - [x] `GET /api/spaces` - Liste des espaces avec filtres (type, capacity, minPrice, maxPrice, amenities, search, isActive)
  - [x] `POST /api/spaces` - Créer un espace (admin only, validation complète)
  - [x] `GET /api/spaces/[id]` - Détails d'un espace (par ID ou slug, auto-increment viewCount)
  - [x] `PATCH /api/spaces/[id]` - Modifier un espace (admin only, gestion slug unique)
  - [x] `DELETE /api/spaces/[id]` - Supprimer un espace (admin only, soft delete par défaut, ?permanent=true pour hard delete)
  - **Fonctionnalités**: Pagination, filtres avancés, permissions admin, validation des données
  - [ ] `GET /api/spaces/[id]/availability` - Vérifier disponibilités pour une date (TODO: Phase suivante)

- [x] **API Bookings** (`src/app/api/bookings/`)
  - [x] `GET /api/bookings` - Liste des réservations (user = ses réservations, admin = toutes, filtres: status, spaceId, userId, dates)
  - [x] `POST /api/bookings` - Créer une réservation
    - [x] Vérifier disponibilité de l'espace (check overlapping bookings)
    - [x] Calculer le prix total (basé sur durée et pricing)
    - [x] Validation complète (date future, capacité, time format)
    - [x] Créer la réservation avec status "pending"
    - [ ] Créer un Payment Intent Stripe (TODO: Phase 3)
  - [x] `GET /api/bookings/[id]` - Détails d'une réservation (permission owner/admin)
  - [x] `PATCH /api/bookings/[id]` - Modifier une réservation (users: pending only, admin: toutes, check overlap)
  - [x] `DELETE /api/bookings/[id]` - Annuler une réservation (politique 24h pour users, admin sans limite)
    - [ ] Gérer le remboursement Stripe si applicable (TODO: Phase 3)
  - **Fonctionnalités**: Permissions granulaires, validation overlap, politique d'annulation, calcul automatique prix
  - [ ] `POST /api/bookings/[id]/confirm` - Confirmer une réservation après paiement (TODO: Phase 3)

- [x] **API Payments (Stripe)** - Structure de base créée
  - [x] `POST /api/payments/create-intent` - Structure créée (implémentation Stripe Phase 3)
  - [ ] `POST /api/payments/confirm` - Confirmer le paiement (TODO: Phase 3)
  - [ ] `POST /api/payments/webhook` - Webhook Stripe pour les événements (TODO: Phase 3)
    - [ ] payment_intent.succeeded
    - [ ] payment_intent.payment_failed
    - [ ] charge.refunded
  - [ ] `POST /api/payments/[id]/refund` - Rembourser un paiement (admin) (TODO: Phase 3)
  - **Note**: L'intégration Stripe complète sera faite en Phase 3

- [ ] **API Availability** (Optionnel, peut être fait plus tard)
  - [ ] `POST /api/availability/check` - Vérifier si un créneau est disponible
  - [ ] `GET /api/availability/calendar/[spaceId]` - Calendrier des disponibilités

### ✅ Phase 3 : Intégration Stripe - TERMINÉ (Backend)

- [x] **Configuration Stripe**
  - [x] Documenter installation `@stripe/stripe-js` et `stripe` (STRIPE_SETUP.md)
  - [x] Ajouter les clés Stripe dans `.env.example`
    - [x] `STRIPE_SECRET_KEY`
    - [x] `STRIPE_PUBLISHABLE_KEY`
    - [x] `STRIPE_WEBHOOK_SECRET`
    - [x] `STRIPE_LIVE_MODE`
  - [x] Documentation complète pour créer compte Stripe de test
  - [x] Guide pour configurer les webhooks Stripe (local + production)
  - **Fichiers**: `.env.example`, `STRIPE_SETUP.md`

- [x] **Helpers Stripe** (`src/lib/stripe.ts`)
  - [x] Initialisation Stripe SDK (latest API version)
  - [x] `createPaymentIntent()` - Créer un Payment Intent
  - [x] `retrievePaymentIntent()` - Récupérer un Payment Intent
  - [x] `createRefund()` - Créer un remboursement
  - [x] `verifyWebhookSignature()` - Vérifier signature webhook
  - [x] `formatAmountForDisplay()` - Formatter montant pour affichage
  - [x] `formatAmountForStripe()` - Formatter montant pour Stripe (cents)
  - [x] `getOrCreateStripeCustomer()` - Gérer customer Stripe

- [x] **API Payment Intent** (`/api/payments/create-intent`)
  - [x] Création Payment Intent Stripe
  - [x] Gestion customer Stripe (get or create)
  - [x] Validation booking (ownership, status, not paid)
  - [x] Prévention doublons (réutilise payment intent existant si pending)
  - [x] Conversion montant en centimes
  - [x] Metadata tracking (bookingId, userId, customerId)
  - [x] Mise à jour booking avec paymentIntentId

- [x] **API Webhook** (`/api/payments/webhook`)
  - [x] Vérification signature Stripe
  - [x] Gestion événements:
    - [x] `payment_intent.succeeded` → Confirme booking, met à jour payment
    - [x] `payment_intent.payment_failed` → Marque payment failed
    - [x] `payment_intent.processing` → Met status processing
    - [x] `payment_intent.canceled` → Annule payment
    - [x] `charge.refunded` → Traite remboursement
  - [x] Extraction métadonnées carte (brand, last4, expiry)
  - [x] Logs détaillés pour debugging

- [x] **API Refund** (`/api/payments/[id]/refund`)
  - [x] Endpoint admin only
  - [x] Support remboursement partiel ou total
  - [x] Validation payment status (succeeded only)
  - [x] Prévention double refund
  - [x] Raisons de remboursement (requested_by_customer, duplicate, fraudulent)
  - [x] Mise à jour booking status automatiquement
  - [x] Annulation booking optionnelle

- [x] **Documentation**
  - [x] `STRIPE_SETUP.md` - Guide complet (30+ sections)
    - Installation packages
    - Configuration API keys
    - Setup webhooks (local + production)
    - Numéros de cartes de test
    - Endpoints API
    - Sécurité & best practices
    - Passage en production
    - Troubleshooting
    - PCI compliance
  - [x] Variables environnement documentées
  - [x] Instructions CLI Stripe pour webhooks locaux

- [ ] **Composant de paiement client-side** (TODO: Phase 4)
  - [ ] Créer un composant `CheckoutForm` avec Stripe Elements
  - [ ] Intégrer `CardElement` ou `PaymentElement`
  - [ ] Gérer les erreurs de paiement
  - [ ] Afficher un loader pendant le paiement
  - [ ] Rediriger vers une page de confirmation après paiement
  - **Note**: Sera fait en Phase 4 avec les pages publiques

**Fonctionnalités implémentées:**
- ✅ Création Payment Intent complète
- ✅ Gestion automatique des événements Stripe
- ✅ Système de remboursement admin
- ✅ Tracking customer Stripe
- ✅ Sécurité webhook (signature verification)
- ✅ Support multi-devises (EUR par défaut)
- ✅ Prévention doublons et race conditions
- ✅ Documentation exhaustive

**Requis pour utiliser:**
```bash
npm install stripe @stripe/stripe-js
```
Puis configurer les variables dans `.env.local` (voir STRIPE_SETUP.md)

### ✅ Phase 4 : Pages Publiques - TERMINÉ

- [x] **Page `/booking` - Liste des espaces**
  - [x] Grille/liste des espaces disponibles
  - [x] Filtres : type, capacité, prix, équipements
  - [x] Recherche par nom
  - [x] Affichage des images, prix, capacité
  - **Implémentation**: `src/app/(site)/booking/page.tsx` avec filtres temps réel, pagination, design responsive

- [x] **Page `/booking/[slug]` - Détails de l'espace**
  - [x] Galerie d'images (image featured + placeholder)
  - [x] Description complète
  - [x] Liste des équipements avec icônes
  - [x] Date picker (min: today, validation date future)
  - [x] Sélection d'horaires (startTime/endTime avec validation)
  - [x] Calcul du prix en temps réel (basé sur durée et pricing)
  - [x] Bouton "Réserver maintenant" (validation nombre de personnes vs capacité)
  - [x] Redirect to signin si non authentifié
  - [x] Création booking + redirect to checkout
  - **Implémentation**: `src/app/(site)/booking/[slug]/page.tsx` avec formulaire complet, validation, pricing dynamique

- [x] **Page `/booking/checkout/[bookingId]` - Paiement**
  - [x] Résumé de la réservation (espace, date, horaire, nombre de personnes)
  - [x] Détails de l'espace et horaires formatés
  - [x] Prix total affiché en euros
  - [x] Intégration Stripe Elements (PaymentElement)
  - [x] Gestion états loading/processing
  - [x] Création Payment Intent via API
  - [x] Vérification ownership et statut booking
  - [x] Prévention paiements multiples (réutilise intent existant)
  - [x] Redirect vers confirmation après paiement réussi
  - [x] Indicateurs de sécurité (SSL, Stripe, PCI DSS)
  - **Implémentation**: `src/app/(site)/booking/checkout/[bookingId]/page.tsx` avec CheckoutForm, Elements provider, gestion erreurs

- [x] **Composant `CheckoutForm` - Formulaire de paiement Stripe**
  - [x] Intégration Stripe hooks (useStripe, useElements)
  - [x] PaymentElement pour saisie carte
  - [x] Gestion états (processing, error)
  - [x] Confirmation paiement avec redirect_if_required
  - [x] Messages d'erreur localisés en français
  - [x] Bouton avec montant et spinner pendant traitement
  - [x] Badge "Paiement sécurisé par Stripe"
  - **Implémentation**: `src/components/site/booking/CheckoutForm.tsx` client component

- [x] **Page `/booking/confirmation/[bookingId]` - Confirmation**
  - [x] Animation success (icône check avec animation scaleIn)
  - [x] Message de succès personnalisé
  - [x] Affichage numéro de confirmation (généré par hook)
  - [x] Récapitulatif complet de la réservation
  - [x] Image de l'espace si disponible
  - [x] Badges de statut (réservation + paiement)
  - [x] Informations importantes (instructions d'accès)
  - [x] Boutons d'action (Voir mes réservations, Retour aux espaces)
  - [x] Informations de contact (téléphone, email)
  - [x] Design responsive avec style site
  - **Implémentation**: `src/app/(site)/booking/confirmation/[bookingId]/page.tsx` avec gestion états, formatage dates

**Fonctionnalités implémentées:**
- ✅ Interface de réservation complète côté client
- ✅ Intégration Stripe Elements côté client
- ✅ Validation formulaire complète (dates, horaires, capacité)
- ✅ Calcul prix temps réel
- ✅ Prévention erreurs (overlap detection via API)
- ✅ Gestion authentification (redirect signin)
- ✅ UX optimale (loading states, error messages, animations)
- ✅ Design cohérent avec le site (PageTitle, Bootstrap, style custom)
- ✅ Responsive mobile/desktop
- ✅ Messages en français
- ✅ Sécurité (client secret, webhook verification)

### Phase 5 : Dashboard Admin

- [ ] **Page `/dashboard/booking` - Vue d'ensemble**
  - [ ] Statistiques : réservations du jour, CA du mois, taux d'occupation
  - [ ] Graphiques : réservations par jour, revenus
  - [ ] Réservations récentes

- [ ] **Page `/dashboard/booking/spaces` - Gestion des espaces**
  - [ ] Liste des espaces avec statut (actif/inactif)
  - [ ] Bouton "Ajouter un espace"
  - [ ] Actions : éditer, activer/désactiver, supprimer
  - [ ] Upload d'images via Cloudinary

- [ ] **Page `/dashboard/booking/spaces/create` - Créer un espace**
  - [ ] Formulaire complet avec tous les champs
  - [ ] Upload multiple d'images
  - [ ] Définition des horaires d'ouverture
  - [ ] Définition des équipements (checkboxes)

- [ ] **Page `/dashboard/booking/reservations` - Gestion des réservations**
  - [ ] Liste de toutes les réservations
  - [ ] Filtres : statut, date, espace, utilisateur
  - [ ] Actions : voir détails, confirmer, annuler, rembourser
  - [ ] Calendrier vue mensuelle/hebdomadaire

- [ ] **Page `/dashboard/booking/calendar` - Calendrier global**
  - [ ] Vue calendrier de tous les espaces
  - [ ] Code couleur par type d'espace
  - [ ] Clic sur un créneau pour voir les détails
  - [ ] Drag & drop pour déplacer une réservation (optionnel)

### Phase 6 : Dashboard Client

- [ ] **Page `/[username]/bookings` - Mes réservations**
  - [ ] Liste des réservations de l'utilisateur
  - [ ] Filtres : à venir, passées, annulées
  - [ ] Actions : voir détails, annuler (si applicable)
  - [ ] Affichage du statut de paiement

- [ ] **Page `/[username]/bookings/[id]` - Détails de ma réservation**
  - [ ] Toutes les infos de la réservation
  - [ ] QR code pour l'accès (optionnel)
  - [ ] Bouton "Annuler" (avec conditions)
  - [ ] Bouton "Télécharger la facture"

### Phase 7 : Fonctionnalités Avancées

- [ ] **Notifications email**
  - [ ] Email de confirmation de réservation
  - [ ] Email de rappel 24h avant
  - [ ] Email d'annulation
  - [ ] Email de remboursement

- [ ] **Politique d'annulation**
  - [ ] Définir des règles (ex: annulation gratuite 24h avant)
  - [ ] Calculer les frais d'annulation
  - [ ] Remboursement partiel ou total selon la politique

- [ ] **Réservations récurrentes**
  - [ ] Permettre de réserver le même créneau chaque semaine
  - [ ] Créer plusieurs réservations d'un coup
  - [ ] Tarif préférentiel pour les réservations récurrentes

- [ ] **Système de codes promo**
  - [ ] Créer un modèle `PromoCode`
  - [ ] Appliquer des réductions (%, montant fixe)
  - [ ] Conditions : dates, utilisateurs, types d'espaces

- [ ] **Reviews et notes**
  - [ ] Permettre aux utilisateurs de noter les espaces après usage
  - [ ] Afficher la note moyenne sur la page de l'espace

---

## 💬 Système de Messagerie - WebSocket avec Next.js

### Phase 1 : Architecture et Configuration

- [ ] **Choisir la solution WebSocket**
  - [ ] Option 1 : Socket.io (plus simple, plus de features)
  - [ ] Option 2 : ws (natif WebSocket, plus léger)
  - [ ] Recommandation : Socket.io pour Next.js

- [ ] **Installer les dépendances**
  - [ ] `npm install socket.io socket.io-client`
  - [ ] `npm install @types/socket.io` (si TypeScript)

- [ ] **Créer un serveur WebSocket personnalisé**
  - [ ] Créer `/server.js` ou `/server.ts` à la racine
  - [ ] Initialiser Next.js en mode custom server
  - [ ] Attacher Socket.io au serveur HTTP de Next.js
  - [ ] Configurer CORS pour Socket.io

- [ ] **Configuration alternative (sans custom server)**
  - [ ] Utiliser Next.js API Routes avec long polling
  - [ ] Ou utiliser un service externe comme Pusher, Ably
  - [ ] Ou déployer un serveur WebSocket séparé (Express + Socket.io)

### Phase 2 : Modèles de Données

- [ ] **Créer le modèle `Conversation`**
  - [ ] Fields : participants[] (array de userId), type (direct/group)
  - [ ] lastMessage (ref Message), lastMessageAt
  - [ ] name (pour les groupes), avatar (pour les groupes)
  - [ ] createdAt, updatedAt
  - [ ] Indexes : participants (pour recherche rapide)

- [ ] **Créer le modèle `Message`**
  - [ ] Fields : conversationId, senderId, content, type (text/image/file)
  - [ ] attachments[] (url, type, size, name)
  - [ ] readBy[] (array de {userId, readAt})
  - [ ] status (sent/delivered/read)
  - [ ] createdAt, updatedAt, deletedAt (soft delete)
  - [ ] Indexes : conversationId + createdAt

- [ ] **Créer le modèle `UserPresence`**
  - [ ] userId, status (online/away/offline)
  - [ ] lastSeen, socketId (pour tracking)
  - [ ] currentConversation (optionnel, pour "est en train d'écrire")

### Phase 3 : API REST (Complément)

- [ ] **API Conversations**
  - [ ] `GET /api/conversations` - Liste des conversations de l'utilisateur
  - [ ] `POST /api/conversations` - Créer une conversation
  - [ ] `GET /api/conversations/[id]` - Détails d'une conversation
  - [ ] `GET /api/conversations/[id]/messages` - Charger l'historique (pagination)
  - [ ] `DELETE /api/conversations/[id]` - Supprimer une conversation

- [ ] **API Messages**
  - [ ] `POST /api/messages` - Envoyer un message (si fallback sans WS)
  - [ ] `PATCH /api/messages/[id]` - Éditer un message
  - [ ] `DELETE /api/messages/[id]` - Supprimer un message
  - [ ] `POST /api/messages/[id]/read` - Marquer comme lu

- [ ] **API Users (pour messagerie)**
  - [ ] `GET /api/users/search?q=xxx` - Rechercher des utilisateurs
  - [ ] `GET /api/users/[id]/presence` - Statut en ligne

### Phase 4 : Logique WebSocket

- [ ] **Events Socket.io côté serveur**
  - [ ] `connection` - Utilisateur connecté
    - [ ] Authentifier via le token JWT
    - [ ] Rejoindre les rooms des conversations de l'utilisateur
    - [ ] Mettre à jour le statut "online"
  - [ ] `disconnect` - Utilisateur déconnecté
    - [ ] Mettre à jour le statut "offline"
    - [ ] Broadcast aux autres utilisateurs
  - [ ] `send_message` - Envoyer un message
    - [ ] Sauvegarder en DB
    - [ ] Emit vers les participants de la conversation
    - [ ] Notification push (optionnel)
  - [ ] `typing` - Utilisateur en train d'écrire
    - [ ] Broadcast aux autres participants (sans sauvegarder)
  - [ ] `read_message` - Message lu
    - [ ] Mettre à jour le champ `readBy`
    - [ ] Emit vers l'expéditeur (pour afficher les coches bleues)
  - [ ] `join_conversation` - Rejoindre une room
  - [ ] `leave_conversation` - Quitter une room

- [ ] **Events Socket.io côté client**
  - [ ] `connect` - Connexion établie
  - [ ] `disconnect` - Déconnexion
  - [ ] `new_message` - Nouveau message reçu
  - [ ] `message_read` - Message lu par le destinataire
  - [ ] `user_typing` - Quelqu'un est en train d'écrire
  - [ ] `user_online` - Un utilisateur est passé en ligne
  - [ ] `user_offline` - Un utilisateur s'est déconnecté

### Phase 5 : Context & State Management

- [ ] **Créer un Context WebSocket**
  - [ ] `src/context/useSocketContext.tsx`
  - [ ] Initialiser la connexion Socket.io
  - [ ] Fournir les méthodes : sendMessage, joinConversation, etc.
  - [ ] Gérer la reconnexion automatique
  - [ ] Gérer les états : connected, connecting, disconnected

- [ ] **Créer un Context Messages**
  - [ ] `src/context/useMessagesContext.tsx`
  - [ ] State : conversations[], selectedConversation, messages[]
  - [ ] Méthodes : selectConversation, addMessage, markAsRead
  - [ ] Écouter les events Socket.io et mettre à jour le state

- [ ] **Intégrer avec Redux (optionnel)**
  - [ ] Créer un slice `messagesSlice`
  - [ ] Actions : setConversations, addMessage, updateMessage
  - [ ] RTK Query pour charger l'historique des messages

### Phase 6 : Composants UI

- [ ] **Composant `MessagesSidebar`**
  - [ ] Liste des conversations
  - [ ] Avatar, nom, dernier message
  - [ ] Badge pour messages non lus
  - [ ] Indicateur "en ligne" (point vert)
  - [ ] Recherche de conversations

- [ ] **Composant `MessageThread`**
  - [ ] Header avec nom du destinataire et statut
  - [ ] Liste des messages (scroll inversé)
  - [ ] Bulles de messages (left pour reçus, right pour envoyés)
  - [ ] Timestamp
  - [ ] Coches de lecture (sent/delivered/read)
  - [ ] "En train d'écrire..." indicator

- [ ] **Composant `MessageInput`**
  - [ ] TextArea avec auto-resize
  - [ ] Bouton "Envoyer"
  - [ ] Upload de fichiers/images
  - [ ] Emojis picker (optionnel)
  - [ ] Détection de "typing" avec debounce

- [ ] **Composant `UserPresence`**
  - [ ] Badge "en ligne" / "hors ligne" / "il y a X min"
  - [ ] Peut être réutilisé partout

- [ ] **Composant `NewConversationModal`**
  - [ ] Recherche d'utilisateurs
  - [ ] Sélection d'un ou plusieurs utilisateurs (pour groupe)
  - [ ] Bouton "Créer la conversation"

### Phase 7 : Pages

- [ ] **Page `/messages` - Page principale (public ou client)**
  - [ ] Layout 2 colonnes : sidebar + thread
  - [ ] Responsive : mobile = liste OU thread, pas les deux
  - [ ] Bouton "+ Nouveau message"

- [ ] **Page `/[username]/messages` - Messages du client**
  - [ ] Même fonctionnalité que `/messages`
  - [ ] Intégré dans le dashboard client

- [ ] **Page `/dashboard/messages` - Messages admin**
  - [ ] Voir toutes les conversations (surveillance)
  - [ ] Statistiques : nombre de messages, utilisateurs actifs
  - [ ] Possibilité de bannir/muter des utilisateurs

### Phase 8 : Fonctionnalités Avancées

- [ ] **Notifications**
  - [ ] Notification browser (Notification API)
  - [ ] Afficher un toast quand un message arrive
  - [ ] Badge sur l'icône de messagerie dans le header
  - [ ] Son de notification (optionnel)

- [ ] **Upload de fichiers**
  - [ ] Intégrer Cloudinary pour upload d'images/fichiers
  - [ ] Preview des images inline dans le chat
  - [ ] Liens de téléchargement pour les fichiers

- [ ] **Messages vocaux**
  - [ ] Enregistrement audio via Web Audio API
  - [ ] Upload vers Cloudinary
  - [ ] Player audio inline

- [ ] **Appels vidéo (optionnel)**
  - [ ] Intégrer WebRTC (ex: PeerJS, Simple-peer)
  - [ ] Bouton "Appel vidéo" dans le header du thread
  - [ ] Modal avec vidéo en peer-to-peer

- [ ] **Groupes de discussion**
  - [ ] Création de groupes (nom, avatar, participants)
  - [ ] Ajout/retrait de participants
  - [ ] Rôles : admin, membre
  - [ ] Quitter le groupe

- [ ] **Recherche dans les messages**
  - [ ] Full-text search dans MongoDB
  - [ ] Recherche par mot-clé
  - [ ] Filtrer par conversation, date

- [ ] **Archivage de conversations**
  - [ ] Archiver une conversation (la retirer de la liste principale)
  - [ ] Page "Conversations archivées"

### Phase 9 : Déploiement

- [ ] **Configuration pour production**
  - [ ] Si custom server : déployer sur VPS ou serveur Node.js (pas Vercel)
  - [ ] Alternatives pour Vercel :
    - [ ] Utiliser un service WebSocket externe (Pusher, Ably, etc.)
    - [ ] Déployer le serveur WebSocket séparément (Railway, Render, Heroku)
    - [ ] Utiliser des API Routes avec Server-Sent Events (SSE) au lieu de WS
  - [ ] Configurer les variables d'environnement
  - [ ] Activer HTTPS pour WSS (WebSocket Secure)

- [ ] **Optimisations**
  - [ ] Pagination de l'historique des messages
  - [ ] Lazy loading des conversations
  - [ ] Compression des messages (gzip)
  - [ ] Limiter la taille des uploads
  - [ ] Rate limiting sur les messages (anti-spam)

---

## 🔗 Dépendances Transverses

### Notifications système (pour toutes les features)
- [ ] Créer un système de notifications centralisé
- [ ] Modèle `Notification` avec type, userId, data, read
- [ ] API pour récupérer et marquer comme lues
- [ ] Composant NotificationCenter dans le header
- [ ] Intégration avec Socket.io pour notifications en temps réel

### Emails
- [ ] Configurer un service d'email (Resend, SendGrid, Nodemailer)
- [ ] Templates d'emails HTML
- [ ] Queue système pour les emails (Bull, BullMQ)

### Webhooks
- [ ] Système de webhooks pour intégrations tierces
- [ ] Logs de webhooks

---

## 📊 Priorités Globales

### Sprint 1 (2-3 semaines)
1. Finir les tâches blog Priorité 1
2. Commencer Réservation Phase 1 + 2

### Sprint 2 (2-3 semaines)
1. Réservation Phase 3 + 4 (intégration Stripe + pages publiques)
2. Tâches blog Priorité 2

### Sprint 3 (2-3 semaines)
1. Réservation Phase 5 (dashboard admin)
2. Messagerie Phase 1 + 2 + 3 (architecture + modèles + API)

### Sprint 4 (2-3 semaines)
1. Messagerie Phase 4 + 5 + 6 (WebSocket + state + UI)
2. Réservation Phase 6 (dashboard client)

### Sprint 5 (2 semaines)
1. Messagerie Phase 7 (pages)
2. Tests et bug fixes

### Sprint 6+ (itératif)
1. Fonctionnalités avancées selon priorités business
2. Optimisations et améliorations UX

---

## Notes Techniques

### Stripe
- Utiliser Stripe Checkout pour une intégration rapide (alternative au Payment Intent)
- Configurer les webhooks en local avec Stripe CLI : `stripe listen --forward-to localhost:3000/api/payments/webhook`

### WebSocket avec Next.js
- **Important** : Vercel ne supporte pas les WebSockets natifs
- Solutions :
  1. Custom server déployé ailleurs (VPS, Railway, Render)
  2. Service tiers (Pusher, Ably, Socket.io Managed)
  3. Server-Sent Events (SSE) comme alternative partielle

### MongoDB
- Créer des indexes pour les requêtes fréquentes
- Utiliser des transactions pour les opérations critiques (paiements)
- Mettre en place des backups automatiques

### Performance
- Implémenter du caching avec Redis (conversations, disponibilités)
- Utiliser Next.js ISR pour les pages statiques (blog)
- CDN pour les assets (Cloudinary déjà en place)

---

**Dernière mise à jour** : 2025-11-13
