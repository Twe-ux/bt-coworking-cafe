# Vérification Base de Données Production

## Problème

- **Dev** : API retourne `{count: 1}` ✅
- **Prod** : API retourne `{count: 0}` ❌
- **Même base de données normalement** mais résultats différents

## Action urgente à faire

### 1. Vérifier les logs serveur de production

Cherchez dans vos logs de production (Heroku/Railway/Northflank) :

```
✅ MongoDB connected successfully
📊 Database: XXXX @ Host: YYYY
🔗 Connection string preview: mongodb+srv://...
```

Et lors de l'appel API :

```
🔢 [Unread Count] Using collection: XXXX in database: YYYY
🔢 [Unread Count] Total messages in DB: X
🔢 [Unread Count] Status breakdown: [...]
```

### 2. Comparer avec les logs de dev

**En dev, vous devriez avoir :**

```
📊 Database: coworking-cafe
🔢 [Unread Count] Total messages in DB: 6
🔢 [Unread Count] Found 1 unread messages out of 6
```

**Si en prod c'est différent :**

- Nom de database différent → Variable `MONGODB_URI` incorrecte
- Total = 0 → Base de données vide
- Total > 0 mais unread = 0 → Les messages ont des statuts différents

### 3. Solutions possibles

#### A. Vérifier la variable MONGODB_URI en production

Dans votre plateforme de déploiement, vérifiez la variable `MONGODB_URI`.

Elle devrait être **identique** à celle de `.env.local` :

```

```

**Vérifier spécifiquement :**

1. Le nom de la database : `coworking-cafe`
2. Le cluster : `coworking.jhxdixz.mongodb.net`
3. Les credentials

#### B. Si la variable est correcte mais les résultats différents

Cela peut signifier que :

1. **Cache de connexion** : Redémarrez l'application en prod
2. **Connexion persistante** : L'app est connectée à une vieille DB

#### C. Comment corriger

**Sur Heroku :**

```bash
heroku config:set MONGODB_URI="mongodb+srv://dev:2Sz748OACxL7TvP5@coworking.jhxdixz.mongodb.net/coworking-cafe?retryWrites=true&w=majority"
heroku restart
```

**Sur Railway/Render :**

1. Dashboard → Variables
2. Éditer `MONGODB_URI`
3. Redéployer

**Sur Northflank :**

1. Settings → Environment Variables
2. Éditer `MONGODB_URI`
3. Restart

### 4. Test rapide

Une fois la variable corrigée, testez :

```bash
# Appeler l'API directement
curl https://new.coworkingcafe.fr/api/contact-mails/unread-count
```

Devrait retourner : `{"count": 1}` (ou le bon nombre de messages non lus)

### 5. Si le problème persiste

Ajoutez temporairement un endpoint de debug :

Créer `/src/app/api/debug-db/route.ts` :

```typescript
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  return NextResponse.json({
    database: mongoose.connection.db?.databaseName || mongoose.connection.name,
    host: mongoose.connection.host,
    collections: await mongoose.connection.db?.listCollections().toArray(),
    mongoUri: process.env.MONGODB_URI?.substring(0, 50) + "...",
  });
}
```

Puis appelez : `https://new.coworkingcafe.fr/api/debug-db`

Cela vous montrera exactement quelle DB est utilisée et quelles collections existent.

---

## Résumé

Le problème est **100% une différence de base de données** entre dev et prod.

**Action immédiate :**

1. ✅ Vérifier les logs serveur prod (chercher "Database:")
2. ✅ Comparer `MONGODB_URI` entre `.env.local` et les variables de prod
3. ✅ Corriger la variable en prod si nécessaire
4. ✅ Redémarrer l'application
5. ✅ Tester que l'API retourne le bon count
