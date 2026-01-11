# Auto-Publication des Articles Programmés

## Vue d'ensemble

Le système d'auto-publication permet de programmer la publication d'articles à une date et heure spécifiques. Les articles avec `status: 'scheduled'` et `scheduledFor` dans le passé seront automatiquement publiés.

## Endpoint API

**URL**: `/api/cron/publish-scheduled`  
**Méthodes**: `GET` ou `POST`  
**Authentification**: Bearer token (optionnel)

### Exemple d'appel

```bash
# Sans authentification
curl https://votre-domaine.com/api/cron/publish-scheduled

# Avec authentification
curl -H "Authorization: Bearer votre-secret" \
  https://votre-domaine.com/api/cron/publish-scheduled
```

## Configuration selon la plateforme

### Option 1: Vercel Cron Jobs (Recommandé pour Vercel)

Le fichier `vercel.json` est déjà configuré pour exécuter le cron toutes les 15 minutes.

```json
{
  "crons": [
    {
      "path": "/api/cron/publish-scheduled",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

**Note**: Les Vercel Cron Jobs sont uniquement disponibles sur les plans Pro et Enterprise.

### Option 2: cron-job.org (Gratuit, pour tous les hébergements)

1. Créez un compte sur [cron-job.org](https://cron-job.org)
2. Créez un nouveau cron job :
   - **URL**: `https://votre-domaine.com/api/cron/publish-scheduled`
   - **Schedule**: `*/15 * * * *` (toutes les 15 minutes)
   - **Headers** (optionnel): `Authorization: Bearer votre-secret`

### Option 3: EasyCron (Alternative gratuite)

1. Créez un compte sur [easycron.com](https://www.easycron.com)
2. Configurez un nouveau cron :
   - **URL**: `https://votre-domaine.com/api/cron/publish-scheduled`
   - **Cron Expression**: `*/15 * * * *`

### Option 4: Northflank Scheduled Jobs

1. Dans votre projet Northflank, allez à "Jobs"
2. Créez un "Scheduled Job" :
   - **Type**: HTTP Request
   - **URL**: `https://votre-domaine.com/api/cron/publish-scheduled`
   - **Method**: GET
   - **Schedule**: `*/15 * * * *`
   - **Headers**: `Authorization: Bearer ${CRON_SECRET}` (si activé)

### Option 5: GitHub Actions (Pour les petits projets)

Créez `.github/workflows/publish-scheduled.yml` :

```yaml
name: Publish Scheduled Articles

on:
  schedule:
    # Runs every 15 minutes
    - cron: '*/15 * * * *'
  workflow_dispatch: # Permet l'exécution manuelle

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Call publish endpoint
        run: |
          curl -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            https://votre-domaine.com/api/cron/publish-scheduled
```

## Sécurité (Optionnel)

Pour sécuriser l'endpoint, définissez une variable d'environnement :

```bash
CRON_SECRET=votre-secret-aleatoire-tres-long
```

L'endpoint vérifiera le header `Authorization: Bearer votre-secret-aleatoire-tres-long`.

## Fréquence recommandée

- **15 minutes** : Bon compromis entre réactivité et coût
- **5 minutes** : Pour une publication très précise
- **1 heure** : Pour réduire les coûts (suffisant pour la plupart des blogs)

## Monitoring

L'endpoint retourne :

```json
{
  "message": "Successfully published X article(s)",
  "count": 2,
  "articleIds": ["id1", "id2"],
  "timestamp": "2025-11-13T22:00:00.000Z"
}
```

Ou si aucun article à publier :

```json
{
  "message": "No articles to publish",
  "count": 0
}
```

## Test manuel

Pour tester localement ou manuellement :

```bash
# Sans auth
curl http://localhost:3000/api/cron/publish-scheduled

# Avec auth
curl -H "Authorization: Bearer votre-secret" \
  http://localhost:3000/api/cron/publish-scheduled
```

## Logs

L'endpoint log tous les événements :
- Nombre d'articles trouvés
- IDs des articles publiés
- Erreurs éventuelles

Consultez les logs de votre plateforme pour le monitoring.
