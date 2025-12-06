# 📁 .claude/ - Documentation du Workflow de Review

Ce dossier contient tous les documents relatifs au workflow de review entre Sonnet (dev) et Opus (review).

---

## 📄 Fichiers

### `review-checklist.md`
La checklist complète utilisée par Opus pour reviewer le code.
**Usage** : Référence lors de chaque review

### `workflow-guide.md`
Guide détaillé du workflow Opus ↔ Sonnet.
**Usage** : Lire en premier pour comprendre le processus

### `review-history.md` (à créer)
Historique de toutes les reviews avec scores et décisions.
**Usage** : Tracking et métriques

---

## 🚀 Quick Start

1. **Sonnet termine une feature** → commit sur `claude/feature-xxx`
2. **Vous demandez à Opus** : "Review la branche claude/feature-xxx"
3. **Opus analyse** → Retourne un rapport avec score /25
4. **Vous décidez** : Merge / Fix / Reject

---

## 📚 Documentation Complète

- `workflow-guide.md` : Processus complet
- `review-checklist.md` : Critères de review

---

**Setup date** : 2025-12-06
