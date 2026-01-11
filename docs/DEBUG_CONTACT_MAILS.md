# Debug Contact Mails - Production

## Problème 1 : Pastille d'alerte ne s'affiche pas

### Vérifications à faire :

1. **Ouvrir la console du navigateur** (F12)
   - Chercher les logs commençant par `[Menu Badge]`
   - Vous devriez voir :
     ```
     🎯 [Menu Badge] User role: dev
     ✅ [Menu Badge] Setting up badge polling for admin/dev
     🔄 [Menu Badge] Fetching unread count...
     🔄 [Menu Badge] Response status: 200
     🔄 [Menu Badge] Received data: {count: X}
     🔄 [Menu Badge] Setting unread count to: X
     ```

2. **Vérifier l'onglet Network**
   - Chercher la requête `GET /api/contact-mails/unread-count`
   - Status Code devrait être `200`
   - Response devrait être `{"count": X}`

3. **Si vous voyez "Skipping badge setup"**
   - Votre rôle utilisateur n'est pas `dev` ou `admin`
   - Vérifier dans MongoDB que votre utilisateur a le bon rôle

### Solutions possibles :

**Si l'API retourne 500 :**
- Vérifier les logs serveur pour l'erreur MongoDB
- Vérifier que `MONGODB_URI` est bien configurée en production

**Si l'API ne se déclenche pas :**
- Vérifier que votre rôle est bien `dev` ou `admin`
- Vérifier dans la console les logs `[Menu Badge]`

---

## Problème 2 : Email de réponse non reçu

### Vérifications à faire :

1. **Vérifier les logs serveur** lors de l'envoi d'une réponse
   - Chercher les logs commençant par `[Send Reply]`
   - Vous devriez voir :
     ```
     📝 [Update Message] ID: xxx Status: xxx Has reply: true
     📧 [Send Reply] To: email@example.com
     📧 [Send Reply] API Key configured: true
     📧 [Send Reply] From email: votre-email@domain.com
     ✅ [Send Reply] Email sent successfully: {...}
     ```

2. **Si vous voyez une erreur RESEND API KEY :**
   ```
   ❌ [Send Reply] RESEND API KEY ISSUE - Check your configuration!
   ```
   - La clé API Resend n'est pas configurée en production
   - Ou la clé est invalide

### Solutions :

#### A. Configurer les variables d'environnement en production

Votre plateforme de déploiement doit avoir ces variables :

```bash
RESEND_API_KEY=re_VOTRE_CLE_API_RESEND
RESEND_FROM_EMAIL=votre-email-verifie@votredomaine.com
```

**IMPORTANT pour RESEND_FROM_EMAIL :**
- Ne PAS utiliser `onboarding@resend.dev` en production
- Utiliser un email vérifié dans votre compte Resend
- Ou utiliser un domaine vérifié (ex: `noreply@coworkingcafe.fr`)

#### B. Vérifier votre clé Resend

1. Aller sur https://resend.com/api-keys
2. Créer une nouvelle clé si nécessaire
3. Copier la clé et l'ajouter dans les variables d'environnement de production

#### C. Vérifier le domaine d'envoi

1. Aller sur https://resend.com/domains
2. Ajouter et vérifier votre domaine `coworkingcafe.fr`
3. Utiliser un email de ce domaine dans `RESEND_FROM_EMAIL`

#### D. Configuration selon votre plateforme

**Vercel :**
```bash
vercel env add RESEND_API_KEY
vercel env add RESEND_FROM_EMAIL
```

**Docker/Railway/Render :**
Ajouter dans le dashboard ou dans `.env.production`

**Netlify :**
Site settings > Environment variables

---

## Tests rapides

### Test 1 : Vérifier l'API unread-count
```bash
curl https://new.coworkingcafe.fr/api/contact-mails/unread-count
```
Devrait retourner : `{"count": X}`

### Test 2 : Vérifier la configuration Resend en local
```bash
# Dans votre terminal local
node -e "console.log(process.env.RESEND_API_KEY ? '✅ API Key present' : '❌ API Key missing')"
```

---

## Après déploiement

1. **Vérifier les logs serveur** pour :
   - `🔢 [Unread Count]` - Confirme que l'API compte fonctionne
   - `📧 [Send Reply]` - Confirme les tentatives d'envoi d'email

2. **Vérifier la console navigateur** pour :
   - `🔄 [Menu Badge]` - Confirme que le badge se met à jour
   - `🔔 [Menu Badge] Refresh event triggered` - Confirme les rafraîchissements

3. **Créer un message de test** et vérifier que :
   - Le compteur augmente
   - La pastille rouge apparaît avec le bon nombre
   - En cliquant sur le message, il passe à "Lu" et la pastille se met à jour
   - En répondant au message, l'email est bien envoyé
