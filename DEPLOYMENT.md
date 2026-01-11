# Guide de Déploiement en Production

## Variables d'environnement requises

Assurez-vous que **toutes** ces variables sont configurées sur votre plateforme de déploiement (Heroku, Vercel, etc.).

### ⚠️ Variables critiques (obligatoires)

Ces variables **DOIVENT** être configurées sinon l'application ne fonctionnera pas :

```bash
# Base de données
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/DATABASE

# NextAuth (authentification)
NEXTAUTH_URL=https://new.coworkingcafe.fr
NEXTAUTH_SECRET=YOUR_SECRET_HERE

# Stripe (paiements) - CRITIQUES!
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend (emails)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@coworkingcafe.fr
```

### Variables optionnelles

```bash
# Cloudinary (upload d'images)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Cron Jobs (tâches planifiées)
CRON_SECRET=YOUR_CRON_SECRET
```

## Erreurs fréquentes

### ❌ "Please call Stripe() with your publishable key"

**Cause :** `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` n'est pas configurée ou est vide.

**Solution :**
1. Vérifiez que la variable est configurée dans votre plateforme de déploiement
2. Elle doit commencer par `pk_live_` (production) ou `pk_test_` (test)
3. Assurez-vous qu'il n'y a pas d'espaces avant/après la clé
4. Redéployez après avoir ajouté la variable

### ❌ "Missing API key" (Resend)

**Cause :** `RESEND_API_KEY` n'est pas configurée.

**Solution :**
1. Créez un compte sur [resend.com](https://resend.com)
2. Créez une clé API
3. Ajoutez la variable d'environnement
4. Redéployez

### ❌ Erreurs de build Next.js

**Solutions :**
- Exécutez `npm run build` localement pour tester
- Vérifiez les logs de déploiement
- Assurez-vous que toutes les dépendances sont dans `package.json`

## Configuration Heroku

```bash
# Ajoutez toutes les variables d'environnement
heroku config:set MONGODB_URI="mongodb+srv://..."
heroku config:set NEXTAUTH_URL="https://new.coworkingcafe.fr"
heroku config:set NEXTAUTH_SECRET="YOUR_SECRET"
heroku config:set STRIPE_SECRET_KEY="sk_live_..."
heroku config:set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
heroku config:set STRIPE_WEBHOOK_SECRET="whsec_..."
heroku config:set RESEND_API_KEY="re_..."
heroku config:set RESEND_FROM_EMAIL="noreply@coworkingcafe.fr"

# Vérifiez la configuration
heroku config
```

## Configuration Vercel

1. Allez dans **Settings** → **Environment Variables**
2. Ajoutez chaque variable avec sa valeur
3. Sélectionnez les environnements (Production, Preview, Development)
4. Cliquez sur **Save**
5. Redéployez pour que les changements prennent effet

## Vérification post-déploiement

### Checklist :

- [ ] Le site charge correctement (pas de 500 error)
- [ ] La page de réservation `/booking/summary` affiche le formulaire Stripe
- [ ] Les emails de test sont envoyés (`/api/test-email`)
- [ ] L'authentification fonctionne (login admin)
- [ ] Les webhooks Stripe sont configurés et fonctionnels

### Test de paiement

1. Allez sur `/booking/summary`
2. Vérifiez qu'il n'y a **PAS** de message d'erreur "Configuration manquante"
3. Le formulaire Stripe devrait s'afficher
4. Testez avec une carte de test Stripe :
   - Numéro : `4242 4242 4242 4242`
   - Date : n'importe quelle date future
   - CVC : n'importe quel 3 chiffres

## Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs de production
2. Vérifiez que **toutes** les variables d'environnement sont configurées
3. Testez le build localement avec `npm run build`
4. Vérifiez que les clés Stripe sont des clés **live** (pas test) en production
