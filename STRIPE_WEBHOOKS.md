# Configuration des Webhooks Stripe

## État actuel (TEMPORAIRE)

Actuellement, l'application utilise un endpoint de test `/api/payments/test-webhook` qui est appelé manuellement après chaque paiement. C'est une solution temporaire qui fonctionne mais n'est pas optimale.

**Problèmes de cette approche :**
- ❌ Dépend du client (le navigateur doit appeler l'endpoint)
- ❌ Si l'utilisateur ferme son navigateur, la réservation n'est pas créée
- ❌ Pas de gestion des événements Stripe en temps réel

## Solution recommandée : Webhooks Stripe

Les webhooks Stripe envoient automatiquement des événements à votre serveur lorsqu'un paiement est effectué, annulé, etc.

### Étapes de configuration

#### 1. Accéder au Dashboard Stripe

1. Allez sur [dashboard.stripe.com](https://dashboard.stripe.com)
2. Assurez-vous d'être en mode **Test** (pour commencer)
3. Allez dans **Développeurs** → **Webhooks**

#### 2. Créer un nouveau webhook

1. Cliquez sur **Ajouter un endpoint**
2. URL de l'endpoint : `https://new.coworkingcafe.fr/api/payments/webhook`
3. Description : `Production Webhook - Booking System`

#### 3. Sélectionner les événements à écouter

Cochez ces événements (les plus importants pour notre système) :

**Paiements :**
- ✅ `payment_intent.amount_capturable_updated` - Paiement autorisé (empreinte créée)
- ✅ `payment_intent.succeeded` - Paiement réussi
- ✅ `payment_intent.payment_failed` - Paiement échoué
- ✅ `payment_intent.canceled` - Paiement annulé
- ✅ `payment_intent.processing` - Paiement en cours

**Cartes enregistrées :**
- ✅ `setup_intent.succeeded` - Carte enregistrée avec succès

**Remboursements :**
- ✅ `charge.refunded` - Remboursement effectué

#### 4. Récupérer le secret du webhook

1. Une fois le webhook créé, Stripe vous donne un **Webhook signing secret**
2. Il commence par `whsec_...`
3. Copiez-le

#### 5. Configurer la variable d'environnement

**Heroku :**
```bash
heroku config:set STRIPE_WEBHOOK_SECRET="whsec_..."
```

**Vercel :**
1. Settings → Environment Variables
2. Ajoutez `STRIPE_WEBHOOK_SECRET` avec la valeur `whsec_...`

**Autre plateforme :**
Ajoutez la variable d'environnement dans votre dashboard.

#### 6. Tester le webhook

1. Dans le dashboard Stripe, allez dans votre webhook
2. Cliquez sur **Envoyer un événement de test**
3. Sélectionnez `payment_intent.succeeded`
4. Cliquez sur **Envoyer un événement de test**
5. Vérifiez que la réponse est `200 OK`

#### 7. Tester avec un vrai paiement

1. Faites une réservation de test sur votre site
2. Utilisez la carte de test : `4242 4242 4242 4242`
3. Vérifiez dans le dashboard Stripe → Webhooks que l'événement a été reçu
4. Vérifiez que la réservation a été créée dans votre base de données

#### 8. Activer pour la production (LIVE)

Une fois que tout fonctionne en mode Test :

1. Passez en mode **Live** dans Stripe
2. Créez un **nouveau webhook** avec la même URL
3. Récupérez le **nouveau secret** (il sera différent)
4. Mettez à jour `STRIPE_WEBHOOK_SECRET` avec le secret **LIVE**
5. Testez avec une vraie carte (petit montant)

### Vérification des webhooks

**Voir les logs des webhooks :**
1. Dashboard Stripe → Développeurs → Webhooks
2. Cliquez sur votre webhook
3. Onglet **Événements** : voir tous les événements envoyés
4. Status 200 = ✅ succès
5. Status 4xx/5xx = ❌ erreur

**Déboguer les erreurs :**
- Vérifiez que l'URL du webhook est correcte
- Vérifiez que `STRIPE_WEBHOOK_SECRET` est configuré
- Vérifiez les logs de votre application
- Testez manuellement avec `curl` :

```bash
curl -X POST https://new.coworkingcafe.fr/api/payments/webhook \
  -H "Content-Type: application/json" \
  -H "stripe-signature: test" \
  -d '{}'
```

## Nettoyage après configuration

Une fois les webhooks Stripe configurés et fonctionnels :

### 1. Supprimer l'endpoint de test

Supprimez ou désactivez `/api/payments/test-webhook/route.ts`

### 2. Retirer le trigger manuel

Dans `SuccessPageContent.tsx`, supprimez les lignes 41-45 :
```typescript
// SUPPRIMER CES LIGNES :
if (paymentIntentId && !webhookTriggeredRef.current) {
  triggerTestWebhook(paymentIntentId);
}
```

### 3. Simplifier la logique

La page de confirmation attendra simplement que le webhook crée la réservation, puis redirigera l'utilisateur.

## Sécurité

⚠️ **Important :** Ne jamais désactiver la vérification de signature des webhooks !

Le code dans `/api/payments/webhook/route.ts` vérifie que les événements viennent bien de Stripe :
```typescript
const signature = request.headers.get('stripe-signature');
event = verifyWebhookSignature(body, signature);
```

Cette vérification protège contre les faux événements envoyés par des attaquants.

## FAQ

**Q: Pourquoi mes webhooks ne fonctionnent pas en local ?**
A: En local, Stripe ne peut pas envoyer de webhooks à `localhost`. Utilisez Stripe CLI ou ngrok.

**Q: Que se passe-t-il si un webhook échoue ?**
A: Stripe réessaie automatiquement pendant 3 jours. Vous pouvez aussi renvoyer manuellement depuis le dashboard.

**Q: Dois-je configurer 2 webhooks (test et live) ?**
A: Oui, un pour le mode test et un pour le mode live. Ils ont des secrets différents.

**Q: Comment tester les webhooks en local ?**
A: Utilisez [Stripe CLI](https://stripe.com/docs/stripe-cli) :
```bash
stripe listen --forward-to localhost:3000/api/payments/webhook
```

## Ressources

- [Documentation Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Dashboard Stripe](https://dashboard.stripe.com/webhooks)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
