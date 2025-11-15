# Système de Messagerie - Guide d'Utilisation

## 📱 Accès à la Messagerie

### Pour les Clients (Site Public)
- **URL**: `/messages`
- **Authentification requise**: Oui
- Si vous n'êtes pas connecté, vous serez redirigé vers `/auth/login`

### Pour les Admins (Dashboard)
- **URL**: `/dashboard/messages`
- Accès direct depuis le menu latéral du dashboard

---

## 🚀 Démarrer une Nouvelle Conversation

### Option 1 : Via le Bouton "Nouvelle Conversation"
1. Accédez à `/messages`
2. Cliquez sur le bouton **➕** (Plus) dans l'en-tête de la liste des conversations
3. Une modale s'ouvre avec la liste des utilisateurs disponibles
4. Utilisez la barre de recherche pour trouver un utilisateur spécifique
5. Cliquez sur l'utilisateur avec qui vous voulez discuter
6. La conversation est créée automatiquement et s'ouvre

### Option 2 : État Vide
Si vous n'avez aucune conversation :
1. Un bouton "Démarrer une conversation" s'affiche au centre
2. Cliquez dessus pour ouvrir la modale de sélection d'utilisateurs
3. Suivez les mêmes étapes que l'Option 1

---

## 💬 Utiliser la Messagerie

### Envoyer un Message
1. Sélectionnez une conversation dans la liste de gauche
2. Tapez votre message dans le champ en bas
3. **Indicateur de saisie** : Les autres utilisateurs voient "En train d'écrire..." en temps réel
4. Appuyez sur **Entrée** ou cliquez sur l'icône d'envoi

### Lire les Messages
- Les messages apparaissent dans l'ordre chronologique
- **Vos messages** : Affichés à droite avec fond bleu
- **Messages reçus** : Affichés à gauche avec fond blanc
- Les avatars des utilisateurs sont affichés à côté des messages

### Indicateurs de Statut
- ✓ **Une coche** : Message envoyé
- ✓✓ **Deux coches grises** : Message délivré
- ✓✓ **Deux coches bleues** : Message lu

### Messages Non Lus
- Un **badge rouge** indique le nombre de messages non lus
- Il apparaît :
  - Sur chaque conversation dans la liste
  - En haut de la liste avec le total global
- Les messages sont marqués comme lus automatiquement quand vous ouvrez la conversation

---

## 🔍 Recherche

### Rechercher une Conversation
1. Utilisez la barre de recherche en haut de la liste
2. Tapez le nom de la personne ou du groupe
3. Les résultats se filtrent en temps réel

### Rechercher un Utilisateur (Nouvelle Conversation)
1. Ouvrez la modale "Nouvelle Conversation"
2. Utilisez la barre de recherche
3. Recherchez par **nom** ou **email**
4. Les résultats s'affichent instantanément

---

## ⚡ Fonctionnalités en Temps Réel

### Polling Automatique
- **Conversations** : Mise à jour toutes les 3 secondes
- **Messages** : Rechargés automatiquement dans la conversation active
- **Indicateurs de saisie** : Vérifiés toutes les 2 secondes

### Indicateurs de Saisie
- Lorsque vous tapez, les autres utilisateurs voient "En train d'écrire..."
- L'indicateur disparaît après 3 secondes d'inactivité
- Animation fluide avec 3 points qui bougent

---

## 📱 Mobile et Responsive

### Comportement Mobile
- Sur mobile, l'interface affiche :
  - **Liste des conversations** en plein écran par défaut
  - **Fenêtre de chat** en plein écran quand une conversation est sélectionnée
- Bouton **← Retour** pour revenir à la liste

### Comportement Desktop
- **Écran divisé** : Liste à gauche, chat à droite
- Les deux panneaux visibles simultanément
- Largeur optimisée : 33% liste, 67% chat

---

## 🔐 Sécurité et Permissions

### Authentification
- Seuls les utilisateurs connectés peuvent accéder à `/messages`
- Les API vérifient l'authentification via `getAuthUser()`

### Contrôle d'Accès
- Vous ne pouvez voir que vos propres conversations
- Vous ne pouvez pas accéder aux conversations des autres
- Seuls les participants d'une conversation peuvent :
  - Voir les messages
  - Envoyer des messages
  - Voir les indicateurs de saisie

### Prévention des Doublons
- Si une conversation directe existe déjà avec un utilisateur
- Le système ouvre la conversation existante
- Pas de création de doublon

---

## 🎨 Interface

### Codes Couleur
- **Bleu** : Vos messages
- **Blanc** : Messages reçus
- **Rouge** : Badges de messages non lus
- **Vert** : Points d'activité (utilisateur en ligne)

### Icônes
- ➕ : Nouvelle conversation
- 🔍 : Recherche
- ✓ : Message envoyé
- ✓✓ : Message lu
- ← : Retour (mobile)

---

## 🛠️ Dépannage

### "Je ne peux pas accéder à /messages"
1. Vérifiez que vous êtes connecté
2. Si non connecté, vous serez redirigé vers `/auth/login`
3. Après connexion, vous serez automatiquement redirigé vers `/messages`

### "Je ne vois aucune conversation"
1. C'est normal si vous n'avez pas encore démarré de conversation
2. Cliquez sur "Démarrer une conversation" pour en créer une
3. Sélectionnez un utilisateur dans la liste

### "Je ne vois aucun utilisateur dans la modale"
1. Vérifiez votre connexion internet
2. Essayez de rafraîchir la page
3. Vérifiez que d'autres utilisateurs existent dans la base de données

### "Les messages ne s'actualisent pas"
1. Le système utilise du polling (3 secondes)
2. Attendez quelques secondes pour voir les nouveaux messages
3. Si le problème persiste, rafraîchissez la page

---

## 📊 Statistiques et Infos

### Performance
- **Polling** : Toutes les 3 secondes (conversations)
- **Typing** : Toutes les 2 secondes (indicateurs)
- **Timeout saisie** : 3 secondes d'inactivité
- **Limite utilisateurs** : 20 par recherche

### Limites
- **Longueur message** : 10 000 caractères max
- **Participants conversation** : Minimum 2 utilisateurs
- **Recherche** : 20 résultats max par défaut

---

## 🚧 Fonctionnalités à Venir

- [ ] Support des pièces jointes (images, fichiers)
- [ ] Appels vidéo/vocaux
- [ ] Notifications push
- [ ] WebSocket pour vrai temps réel (actuellement polling)
- [ ] Recherche dans les messages
- [ ] Édition et suppression de messages
- [ ] Émojis et réactions
- [ ] Conversations de groupe
- [ ] Partage de localisation

---

## 📞 Support

Pour toute question ou problème :
1. Consultez ce guide
2. Vérifiez votre authentification
3. Rafraîchissez la page
4. Contactez le support technique

---

**Version** : 1.0.0
**Dernière mise à jour** : 2025-11-15
