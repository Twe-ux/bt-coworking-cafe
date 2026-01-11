# 🔄 Guide du Workflow de Review - Stratégie de Branches

Ce guide explique le workflow de développement avec review et déploiement Northflank.

---

## 🎯 Architecture des Branches

```
main         Production (Northflank) - NE JAMAIS TOUCHER SANS VALIDATION
  ↑
  │ (merge seulement après validation complète)
  │
dev          Staging/Pré-production - Accumulation features
  ↑
  │ (merge après code review)
  │
feature/*    Développement actif (ex: claude/booking-phase6-dashboard)
```

---

## 📝 Workflow Complet

### Étape 1 : Développement sur Feature Branch

**Création branche de travail :**
```bash
git checkout dev
git checkout -b claude/feature-xxx
```

**Développement avec commits réguliers**

---

### Étape 2 : Code Review (Opus)

**Demander review à Opus :**
```
Review la branche claude/feature-xxx
```

**Opus retourne un rapport /25 :**
- ✅ **20-25** : Excellent, merge direct
- ⚠️ **15-19** : Bon, corrections mineures
- ❌ **< 15** : Refus, corrections majeures

---

### Étape 3 : Merge dans dev

**⚠️ IMPORTANT : On merge dans `dev`, PAS dans `main` !**

```bash
git checkout dev
git pull origin dev
git merge --no-ff claude/feature-xxx
git push origin dev
```

---

### Étape 4 : ⏸️ PAUSE - Accumulation dans dev

**Plusieurs features sont mergées dans dev** avant de passer en production.

`dev` = environnement de pré-production

---

### Étape 5 : Tests Complets sur dev

**Avant merge dev → main :**

1. **Tests fonctionnels complets**
2. **Déploiement dev sur Northflank (Staging)**
3. **Validation en Staging**
4. **TOUT DOIT FONCTIONNER PARFAITEMENT**

---

### Étape 6 : Merge dev → main (PRODUCTION)

**⚠️ SEULEMENT après validation complète :**

```bash
git checkout main
git pull origin main
git merge --no-ff dev
git push origin main
```

**→ Déclenche déploiement production sur Northflank**

---

## 🚨 Règles Critiques

### ❌ NE JAMAIS

- Merger directement feature → main
- Merger dev → main sans tests staging
- Travailler directement sur `main`
- Force push sur `main` ou `dev`

### ✅ TOUJOURS

- Développer sur feature branch
- Passer par code review
- Merger feature → dev après validation
- Tester dev en staging
- Valider complètement avant dev → main

---

**Dernière mise à jour** : 2025-12-06
