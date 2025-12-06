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
  - **Note**: Page UI `/dashboard/blog/edit/[id]/history` à créer (Priorité 2)

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
  - [ ] Créer une page `/dashboard/blog/analytics`
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

### Phase 1 : Modèles et Base de Données

- [ ] **Créer le modèle `Space` (Espace/Salle)**

  - [ ] Fields : name, description, type (desk/room/meetingRoom)
  - [ ] capacity, pricePerHour, pricePerDay, pricePerMonth
  - [ ] amenities[] (wifi, projector, whiteboard, coffee, etc.)
  - [ ] images[] (Cloudinary URLs)
  - [ ] availability: { dayOfWeek, startTime, endTime }[]
  - [ ] isActive, location (floor, building)
  - [ ] Indexes : type, isActive, pricePerHour

- [ ] **Créer le modèle `Booking` (Réservation)**

  - [ ] Fields : spaceId, userId, startDate, endDate, startTime, endTime
  - [ ] status (pending/confirmed/cancelled/completed)
  - [ ] totalPrice, paymentStatus (pending/paid/refunded)
  - [ ] stripePaymentIntentId, stripePaymentMethodId
  - [ ] specialRequests (text)
  - [ ] createdAt, updatedAt, cancelledAt
  - [ ] Indexes : userId, spaceId, status, startDate
  - [ ] Validation : empêcher les réservations qui se chevauchent

- [ ] **Créer le modèle `Payment`**

  - [ ] Fields : bookingId, userId, amount, currency
  - [ ] stripePaymentIntentId, stripeChargeId
  - [ ] status (pending/succeeded/failed/refunded)
  - [ ] paymentMethod (card/stripe)
  - [ ] metadata (card brand, last4, etc.)
  - [ ] createdAt, completedAt

- [ ] **Créer le modèle `TimeSlot` (optionnel, pour optimisation)**
  - [ ] spaceId, date, startTime, endTime, isBooked
  - [ ] Permet de gérer les disponibilités facilement

### Phase 2 : API Endpoints

- [ ] **API Spaces**

  - [ ] `GET /api/spaces` - Liste des espaces (filtres : type, capacity, price)
  - [ ] `POST /api/spaces` - Créer un espace (admin only)
  - [ ] `GET /api/spaces/[id]` - Détails d'un espace
  - [ ] `PATCH /api/spaces/[id]` - Modifier un espace (admin only)
  - [ ] `DELETE /api/spaces/[id]` - Supprimer un espace (admin only)
  - [ ] `GET /api/spaces/[id]/availability` - Vérifier disponibilités pour une date

- [ ] **API Bookings**

  - [ ] `GET /api/bookings` - Liste des réservations (user = ses réservations, admin = toutes)
  - [ ] `POST /api/bookings` - Créer une réservation
    - [ ] Vérifier disponibilité de l'espace
    - [ ] Calculer le prix total
    - [ ] Créer un Payment Intent Stripe
    - [ ] Créer la réservation avec status "pending"
  - [ ] `GET /api/bookings/[id]` - Détails d'une réservation
  - [ ] `PATCH /api/bookings/[id]` - Modifier une réservation (avant confirmation)
  - [ ] `DELETE /api/bookings/[id]` - Annuler une réservation
    - [ ] Gérer le remboursement Stripe si applicable
  - [ ] `POST /api/bookings/[id]/confirm` - Confirmer une réservation après paiement

- [ ] **API Payments (Stripe)**

  - [ ] `POST /api/payments/create-intent` - Créer un Payment Intent
  - [ ] `POST /api/payments/confirm` - Confirmer le paiement
  - [ ] `POST /api/payments/webhook` - Webhook Stripe pour les événements
    - [ ] payment_intent.succeeded
    - [ ] payment_intent.payment_failed
    - [ ] charge.refunded
  - [ ] `POST /api/payments/[id]/refund` - Rembourser un paiement (admin)

- [ ] **API Availability**
  - [ ] `POST /api/availability/check` - Vérifier si un créneau est disponible
  - [ ] `GET /api/availability/calendar/[spaceId]` - Calendrier des disponibilités

### Phase 3 : Intégration Stripe

- [ ] **Configuration Stripe**

  - [ ] Installer `@stripe/stripe-js` et `stripe`
  - [ ] Ajouter les clés Stripe dans `.env.local`
    - [ ] `STRIPE_SECRET_KEY`
    - [ ] `STRIPE_PUBLISHABLE_KEY`
    - [ ] `STRIPE_WEBHOOK_SECRET`
  - [ ] Créer un compte Stripe de test
  - [ ] Configurer les webhooks Stripe

- [ ] **Composant de paiement**

  - [ ] Créer un composant `CheckoutForm` avec Stripe Elements
  - [ ] Intégrer `CardElement` ou `PaymentElement`
  - [ ] Gérer les erreurs de paiement
  - [ ] Afficher un loader pendant le paiement
  - [ ] Rediriger vers une page de confirmation après paiement

- [ ] **Flow de paiement**
  - [ ] Utilisateur sélectionne un espace et un créneau
  - [ ] Création d'un Payment Intent côté serveur
  - [ ] Affichage du formulaire de paiement
  - [ ] Confirmation du paiement avec Stripe
  - [ ] Webhook reçu → mise à jour du statut de la réservation
  - [ ] Email de confirmation envoyé

### Phase 4 : Pages Publiques

- [ ] **Page `/booking` - Liste des espaces**

  - [ ] Grille/liste des espaces disponibles
  - [ ] Filtres : type, capacité, prix, équipements
  - [ ] Recherche par nom
  - [ ] Affichage des images, prix, capacité

- [ ] **Page `/booking/[id]` - Détails de l'espace**

  - [ ] Galerie d'images
  - [ ] Description complète
  - [ ] Liste des équipements
  - [ ] Calendrier de disponibilité (date picker)
  - [ ] Sélection d'horaires
  - [ ] Calcul du prix en temps réel
  - [ ] Bouton "Réserver maintenant"

- [ ] **Page `/booking/checkout/[bookingId]` - Paiement**

  - [ ] Résumé de la réservation
  - [ ] Détails de l'espace et horaires
  - [ ] Prix total
  - [ ] Formulaire Stripe
  - [ ] Bouton "Payer"

- [ ] **Page `/booking/confirmation/[bookingId]` - Confirmation**
  - [ ] Message de succès
  - [ ] Récapitulatif de la réservation
  - [ ] Numéro de confirmation
  - [ ] Instructions (comment accéder, contact)
  - [ ] Bouton "Voir mes réservations"

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
