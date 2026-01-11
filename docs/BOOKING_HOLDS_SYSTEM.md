# 💳 Système d'Empreintes Bancaires Automatiques (Option 5)

## 📋 Vue d'ensemble

Ce système créé automatiquement des empreintes bancaires (payment holds) **7 jours avant** chaque réservation pour les bookings effectués à plus de 7 jours.

### 🎯 Objectif

Garantir le paiement en cas de no-show tout en respectant la limitation technique des réseaux de cartes bancaires (empreinte max 7 jours).

## 🔄 Flux Complet

### Réservation ≤ 7 jours
```
Client réserve
    ↓
Payment Intent créé immédiatement
    ↓
Empreinte bancaire active
    ↓
J-0: Présence → Annulé | Absence → Encaissé
```

### Réservation > 7 jours (NOUVEAU - Option 5)
```
Client réserve à J-30
    ↓
Setup Intent créé (enregistre carte)
    ↓
Aucune empreinte (0€ bloqué)
    ↓
J-7: Cron job s'exécute automatiquement
    ↓
Payment Intent créé (empreinte 85€)
    ↓
Email envoyé au client
    ↓
J-0: Présence → Annulé | Absence → Encaissé
```

## 🏗️ Architecture Technique

### Fichiers créés/modifiés

1. **`/api/cron/create-holds/route.ts`** (NOUVEAU)
   - Endpoint appelé quotidiennement par Vercel Cron
   - Trouve les réservations à J-7
   - Crée les Payment Intents automatiquement
   - Envoie les emails de notification

2. **`vercel.json`** (MODIFIÉ)
   - Configuration du cron job
   - S'exécute tous les jours à 00:00 UTC

3. **Base de données MongoDB**
   - Champs existants utilisés: `stripeSetupIntentId`, `stripePaymentIntentId`
   - Pas de modification de schéma nécessaire

## ⚙️ Configuration

### Variables d'environnement

Ajoutez à `.env.local` et Vercel :

```bash
# Sécurité du cron (OPTIONNEL mais recommandé en production)
CRON_SECRET=votre-secret-tres-long-et-aleatoire

# Stripe (déjà configuré)
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...

# Email (déjà configuré)
RESEND_API_KEY=re_...
```

### Activation du Cron

**Sur Vercel** (automatique après déploiement) :
1. Le fichier `vercel.json` configure automatiquement le cron
2. Vercel appelle `/api/cron/create-holds` chaque jour à 00:00 UTC
3. Vérifiez dans Vercel Dashboard > Cron Jobs

**En développement** (manuel) :
```bash
# Tester l'endpoint localement
curl http://localhost:3000/api/cron/create-holds

# Ou via navigateur
http://localhost:3000/api/cron/create-holds
```

## 🔐 Sécurité

### Protection du endpoint cron

Le endpoint est protégé en production :

```typescript
// Vérification du secret
if (process.env.NODE_ENV === 'production' && process.env.CRON_SECRET) {
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return 401 Unauthorized
  }
}
```

**Configuration Vercel :**
1. Ajoutez `CRON_SECRET` dans les variables d'environnement
2. Vercel l'enverra automatiquement dans le header `Authorization`

## 📧 Emails envoyés

Le système envoie un email au client quand l'empreinte est créée à J-7 :

**Sujet :** "Empreinte bancaire effectuée - Coworking Café"

**Contenu :**
- Montant de l'empreinte
- Date et détails de la réservation
- Explication : annulé si présence / encaissé si absence

## 🧪 Tests

### Test manuel en développement

```bash
# 1. Créer une réservation > 7 jours dans le dashboard
# 2. Appeler le cron manuellement
curl http://localhost:3000/api/cron/create-holds

# Ou dans le navigateur
http://localhost:3000/api/cron/create-holds
```

### Vérifier les logs

Le cron affiche des logs détaillés :

```
🔍 Searching for bookings on: 2026-01-11T00:00:00.000Z
📋 Found 3 bookings to process

💳 Processing booking 507f1f77bcf86cd799439011...
✅ Payment Intent created: pi_ABC123
📧 Sending email notification to client@email.com...
✅ Successfully processed booking 507f1f77bcf86cd799439011

📊 Summary:
Total: 3
Success: 3
Failed: 0
```

## 📊 Monitoring

### Vérifier le cron dans Vercel

1. Allez dans Vercel Dashboard
2. Cliquez sur votre projet
3. Onglet "Cron Jobs"
4. Vérifiez les exécutions et logs

### Requêtes MongoDB utiles

```javascript
// Trouver les réservations qui auront une empreinte demain
db.reservations.find({
  date: { $gte: new Date(Date.now() + 6*24*60*60*1000),
          $lt: new Date(Date.now() + 8*24*60*60*1000) },
  stripeSetupIntentId: { $exists: true },
  stripePaymentIntentId: { $exists: false }
})

// Vérifier les empreintes créées aujourd'hui
db.payments.find({
  createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) },
  description: /J-7/
})
```

## ⚡ Performance

- **Temps d'exécution :** ~500ms par réservation
- **Limite Vercel Cron :** 10 secondes max (gratuit) / 5 minutes (Pro)
- **Optimisation :** Traitement parallèle si > 20 réservations

## 🐛 Dépannage

### Le cron ne s'exécute pas

**Vérifiez :**
1. `vercel.json` est bien committé et déployé
2. Le cron apparaît dans Vercel Dashboard
3. Les logs Vercel pour voir les erreurs

**Solution :** Redéployer le projet sur Vercel

### Emails non envoyés

**Vérifiez :**
1. `RESEND_API_KEY` configuré
2. Email du client valide dans la DB
3. Logs pour voir les erreurs d'envoi

### Empreintes non créées

**Vérifiez :**
1. `STRIPE_SECRET_KEY` configuré
2. `stripeCustomerId` présent dans la réservation
3. Carte du client toujours valide

**Logs utiles :**
```bash
# Voir les logs du dernier cron
vercel logs --follow
```

## 🔄 Workflow Complet

### Exemple réel : Réservation le 15 janvier pour le 15 février

```
15 jan 14h00 : Client réserve
  → Setup Intent créé
  → Carte enregistrée (pm_ABC123)
  → Email "Demande reçue" envoyé
  → DB: { stripeSetupIntentId: "seti_ABC", stripePaymentIntentId: null }

08 fév 00h00 : Cron s'exécute (J-7)
  → Trouve la réservation
  → Crée Payment Intent (pi_DEF456)
  → Empreinte 85€ bloquée
  → Email "Empreinte créée" envoyé
  → DB: { stripeSetupIntentId: "seti_ABC", stripePaymentIntentId: "pi_DEF" }

15 fév 14h00 : Client se présente
  → Staff marque "Présent" dans le dashboard
  → Webhook capture ou cancel
  → Empreinte annulée
  → Email "Merci de votre visite" envoyé

OU

15 fév 14h30 : Client absent (no-show)
  → Staff marque "Absent" dans le dashboard
  → Empreinte encaissée (85€)
  → Email "Empreinte encaissée + lien facture" envoyé
```

## 📈 Statistiques & Métriques

Pour suivre l'efficacité du système, monitorer :

1. **Taux de création réussie**
   - Combien d'empreintes créées / trouvées
   - Taux d'échec et raisons

2. **Taux de no-show**
   - Avant Option 5 vs après
   - Revenus récupérés grâce aux empreintes

3. **Délai moyen de réservation**
   - Combien de réservations > 7 jours
   - Impact sur le business

## ✅ Checklist de déploiement

- [ ] Code committé et pushe
- [ ] Variables d'environnement configurées sur Vercel
  - [ ] `CRON_SECRET` (recommandé)
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `RESEND_API_KEY`
- [ ] `vercel.json` committé avec le cron configuré
- [ ] Déploiement sur Vercel effectué
- [ ] Vérifier que le cron apparaît dans Vercel Dashboard
- [ ] Tester manuellement avec une réservation test
- [ ] Monitorer les logs les premiers jours

## 🎓 Formation Staff

Points clés à communiquer à l'équipe :

1. **Nouveau processus** : Empreintes créées automatiquement à J-7
2. **Email client** : Ils recevront un email supplémentaire 7 jours avant
3. **Dashboard** : Rien ne change pour le staff
4. **Support** : Si client appelle, expliquer que c'est normal et automatique

---

**Questions ?** Consultez la documentation Stripe ou contactez le développeur.
