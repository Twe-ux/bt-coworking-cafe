# 🔄 Guide du Workflow de Review - Opus ↔ Sonnet

Ce guide explique comment faire collaborer **Claude Sonnet** (développement) et **Claude Opus** (review) efficacement.

---

## 🎯 Vue d'Ensemble

```
┌─────────────┐
│   SONNET    │ Développe une feature
│ (Dev Agent) │ Commit sur sa branche
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    VOUS     │ "Review la branche claude/feature-xxx"
│   (Human)   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    OPUS     │ Analyse le code
│ (Reviewer)  │ Vérifie la checklist
│             │ Score + Rapport
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    VOUS     │ Décision : Merge / Fix / Reject
└─────────────┘
```

---

## 📝 Workflow Détaillé

### Phase 1 : Développement (Sonnet)

**Vous demandez à Sonnet :**
```
"Implémente un système de réservation avec paiement Stripe"
```

**Sonnet travaille :**
1. Crée les modèles MongoDB
2. Implémente les API routes
3. Crée les pages et composants
4. Teste manuellement
5. Commit sur `claude/feature-booking-xxx`
6. Vous notifie : "✅ Feature booking terminée"

---

### Phase 2 : Review (Opus)

**Vous demandez à Opus :**
```
"Review la branche claude/feature-booking-xxx"
```

**Opus analyse :**
1. Checkout de la branche
2. Compare avec `main` (git diff)
3. Vérifie chaque item de `.claude/review-checklist.md`
4. Identifie :
   - ✅ Ce qui est bien fait
   - ⚠️ Warnings (améliorations suggérées)
   - ❌ Erreurs critiques (blockers)
5. Donne un score /25

**Opus retourne un rapport :**
```markdown
# 📊 Review Report - feature-booking-xxx

## Scoring
- Architecture : 5/5 ✅
- Code Quality : 4/5 ⚠️
- Sécurité : 5/5 ✅
- Performance : 3/5 ⚠️
- UX : 4/5 ⚠️

**Total : 21/25** - Bon pour merge avec corrections mineures

## ✅ Points Forts
- Modèles MongoDB bien structurés
- Auth correctement implémentée
- UI responsive et cohérente

## ⚠️ Améliorations Suggérées
1. Ajouter pagination à GET /api/bookings (perf)
2. Typage TypeScript manquant pour BookingResponse
3. Loading state manquant sur le bouton de paiement

## ❌ Blockers
(Aucun)

## 📝 Recommandation
Merge après corrections mineures (points 1-3)
```

---

### Phase 3 : Décision (Vous)

**Basé sur le score :**

#### Score 20-25 (✅ Excellent)
```
Vous : "Merge la branche"
Opus : git checkout main && git merge claude/feature-booking-xxx && git push
```

#### Score 15-19 (⚠️ Corrections mineures)
**Option A - Opus corrige :**
```
Vous : "Applique les corrections suggérées"
Opus :
  - Ajoute pagination
  - Fixe TypeScript
  - Ajoute loading state
  - Commit : "fix: apply review corrections"
  - Merge
```

**Option B - Retour à Sonnet :**
```
Vous (à Sonnet) : "Applique les corrections du review :
1. Ajouter pagination
2. Fixer types
3. Ajouter loading states"

Sonnet : Applique les corrections
```

#### Score < 15 (❌ Refus)
```
Vous (à Sonnet) : "Refactor la feature booking :
[Liste des problèmes critiques du rapport Opus]"

Sonnet : Recommence la feature
```

---

## 🛠️ Commandes Pratiques

### Pour Review

```bash
# 1. Vous demandez à Opus
"Review la branche claude/feature-xxx"

# 2. Opus exécute automatiquement :
git checkout claude/feature-xxx
git diff main...HEAD
# Analyse selon checklist
# Retourne rapport
```

### Pour Merge (après validation)

```bash
# Option 1 : Via Opus
"Merge la branche claude/feature-xxx dans main"

# Option 2 : Manuellement
git checkout main
git merge --no-ff claude/feature-xxx
git push origin main
```

### Pour Cleanup (après merge)

```bash
# Supprimer la branche locale et remote
git branch -d claude/feature-xxx
git push origin --delete claude/feature-xxx
```

---

## 📋 Checklist Rapide

Avant de demander une review à Opus :

- [ ] Sonnet a bien testé manuellement
- [ ] Sonnet a commit et push sa branche
- [ ] Vous avez le nom exact de la branche
- [ ] Pas de travaux en cours (working tree clean)

Après le rapport d'Opus :

- [ ] Lire le rapport complet
- [ ] Vérifier le score /25
- [ ] Décider : Merge / Fix / Reject
- [ ] Appliquer l'action choisie

---

## 🎨 Templates de Prompts

### Demander une Review
```
Review la branche claude/feature-xxx
```

### Review avec Focus Spécifique
```
Review la branche claude/feature-xxx en te concentrant sur :
- La sécurité des API routes
- Les performances des requêtes DB
- L'accessibilité des composants
```

### Review Rapide (Sans Scoring)
```
Fait une review rapide de claude/feature-xxx et dis-moi si c'est bon pour merge
```

### Review Comparative
```
Compare les branches claude/feature-A et claude/feature-B
et dis-moi laquelle est la meilleure implémentation
```

---

## 🚨 Situations Spéciales

### Conflit de Merge

**Si Opus détecte un conflit :**
```markdown
❌ MERGE CONFLICT DETECTED

Files in conflict:
- src/app/api/bookings/route.ts
- src/models/booking/index.ts

Recommendation: Resolve conflicts before review.
```

**Vous devez :**
```bash
git checkout main
git pull
git checkout claude/feature-xxx
git merge main
# Résoudre les conflits
git add .
git commit -m "resolve: merge conflicts from main"
git push
```

Puis redemander review.

### Feature Incomplète

**Si Sonnet dit "Pas fini" :**
```
Vous : "Continue le travail sur claude/feature-xxx"
Sonnet : Continue...
Vous : (Quand Sonnet termine) "Review la branche"
Opus : Review
```

### Urgence (Skip Review)

**Si vraiment urgent :**
```
Vous : "Merge claude/hotfix-xxx SANS review (urgence)"
Opus : [Merge direct]

⚠️ À faire ensuite :
Vous : "Fait une review post-merge de claude/hotfix-xxx"
Opus : [Review et crée des issues pour les problèmes]
```

---

## 📊 Métriques & Suivi

### Tracking des Reviews

Créer un fichier `.claude/review-history.md` :

```markdown
# Review History

## 2025-12-06
- **claude/feature-booking** : 21/25 ✅ Merged
- **claude/feature-messaging** : 18/25 ⚠️ Fixed then merged

## 2025-12-05
- **claude/hotfix-payment** : 24/25 ✅ Merged
```

### Stats Utiles

```bash
# Nombre de reviews par mois
grep "##" .claude/review-history.md | wc -l

# Score moyen
# (À calculer manuellement ou avec script)
```

---

## 🔧 Configuration Avancée

### Hook Pre-Commit (Optionnel)

Créer `.husky/pre-commit` :
```bash
#!/bin/sh
npm run lint
npm run type-check
```

### ESLint Strict

Ajouter dans `.eslintrc.json` :
```json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "no-console": ["error", { "allow": ["error"] }]
  }
}
```

---

## 💡 Best Practices

### DO ✅
- Demander review pour chaque feature majeure
- Lire le rapport complet d'Opus
- Documenter les décisions (pourquoi merge/reject)
- Garder un historique des reviews

### DON'T ❌
- Skipper la review pour "gagner du temps"
- Merge sans lire le rapport d'Opus
- Ignorer les warnings répétés
- Accumuler trop de features sans merge (risque de conflits)

---

## 🆘 FAQ

**Q : Sonnet peut-il faire la review lui-même ?**
Non. Sonnet ne peut pas être objectif sur son propre code. Opus doit faire la review.

**Q : Opus peut-il développer des features ?**
Oui, mais c'est le rôle de Sonnet. Opus devrait se concentrer sur les reviews et corrections mineures.

**Q : Combien de temps prend une review ?**
- Review rapide : 1-2 min
- Review complète : 5-10 min
- Review avec corrections : 10-20 min

**Q : Que faire si Opus et Sonnet ne sont pas d'accord ?**
Vous êtes l'arbitre final. Lisez les deux points de vue et décidez.

**Q : Peut-on automatiser complètement (pas d'intervention humaine) ?**
Non recommandé. Vous devez valider les décisions importantes (merge/reject).

---

**Dernière mise à jour** : 2025-12-06
