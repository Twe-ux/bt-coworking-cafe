# Configuration du Logo dans les Emails

## BIMI - Brand Indicators for Message Identification

Pour afficher le logo de Coworking Café dans les boîtes mail (Gmail, Yahoo, Apple Mail, etc.), vous devez configurer BIMI.

### Étape 1 : Vérifier/Configurer DMARC

BIMI nécessite que votre domaine ait une politique DMARC configurée.

Ajoutez un enregistrement TXT DNS pour `_dmarc.coworkingcafe.fr` :

```dns
_dmarc.coworkingcafe.fr.  IN  TXT  "v=DMARC1; p=quarantine; rua=mailto:dmarc@coworkingcafe.fr; ruf=mailto:dmarc@coworkingcafe.fr; fo=1"
```

Paramètres :
- `v=DMARC1` : Version DMARC
- `p=quarantine` : Politique (peut être `none`, `quarantine`, ou `reject`)
- `rua` : Email pour recevoir les rapports agrégés
- `ruf` : Email pour recevoir les rapports forensiques
- `fo=1` : Générer un rapport si DKIM ou SPF échoue

### Étape 2 : Créer le Logo SVG

Le logo doit être au format **SVG Tiny PS** (Portable/Secure).

Spécifications :
- Format : SVG Tiny PS (version 1.2)
- Taille recommandée : Carré (ex: 512x512px)
- Pas de JavaScript
- Pas de liens externes
- Pas de balises `<foreignObject>`

Exemple de structure SVG valide :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<svg version="1.2" baseProfile="tiny-ps"
     xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 512 512"
     width="512" height="512">
  <!-- Votre logo ici -->
  <circle cx="256" cy="256" r="200" fill="#10B981"/>
  <text x="256" y="280"
        font-family="Arial"
        font-size="120"
        fill="white"
        text-anchor="middle">CC</text>
</svg>
```

### Étape 3 : Héberger le Logo

Hébergez le fichier SVG sur votre domaine en HTTPS :

```
https://coworkingcafe.fr/assets/logo/bimi-logo.svg
```

**Important :** Le fichier doit être :
- Accessible publiquement (pas d'authentification)
- Servi avec le header `Content-Type: image/svg+xml`
- En HTTPS

### Étape 4 : Ajouter l'Enregistrement DNS BIMI

Ajoutez un enregistrement TXT DNS pour `default._bimi.coworkingcafe.fr` :

```dns
default._bimi.coworkingcafe.fr.  IN  TXT  "v=BIMI1; l=https://coworkingcafe.fr/assets/logo/bimi-logo.svg;"
```

Si vous avez un certificat VMC (recommandé pour Gmail) :

```dns
default._bimi.coworkingcafe.fr.  IN  TXT  "v=BIMI1; l=https://coworkingcafe.fr/assets/logo/bimi-logo.svg; a=https://coworkingcafe.fr/assets/logo/vmc.pem"
```

### Étape 5 : Tester la Configuration

Utilisez ces outils pour vérifier :

1. **BIMI Generator** : https://bimigroup.org/bimi-generator/
2. **BIMI Inspector** : https://bimigroup.org/bimi-inspector/
3. **MxToolbox BIMI Lookup** : https://mxtoolbox.com/bimi.aspx

### Délai d'Activation

- **Yahoo/AOL** : ~24-48h après configuration
- **Gmail** : Nécessite un certificat VMC (payant ~$1500/an)
- **Apple Mail** : Support partiel, ~1 semaine

---

## Solution Alternative : Logo dans le Corps de l'Email

En attendant BIMI ou si vous ne souhaitez pas utiliser BIMI, vous pouvez ajouter le logo directement dans vos templates d'email.

### Option A : Logo Hébergé (Recommandé)

Hébergez votre logo et référencez-le dans vos emails :

```html
<img src="https://coworkingcafe.fr/assets/logo/email-logo.png"
     alt="Coworking Café"
     width="150"
     height="50"
     style="display: block; margin: 0 auto 20px;">
```

### Option B : Logo en Base64 (Moins recommandé)

Embarquez le logo directement dans l'email (augmente la taille de l'email) :

```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANS..."
     alt="Coworking Café"
     width="150"
     height="50">
```

---

## Configuration Resend

Dans Resend, vous pouvez également configurer :

1. **Domain Settings** : https://resend.com/domains
   - Configurez SPF, DKIM, DMARC
   - Vérifiez votre domaine

2. **Branding** :
   - Utilisez un nom d'expéditeur clair : `Coworking Café <reservations@coworkingcafe.fr>`
   - Avatar s'affiche automatiquement si BIMI est configuré

---

## Checklist de Configuration

- [ ] SPF configuré pour Resend
- [ ] DKIM configuré pour Resend
- [ ] DMARC configuré
- [ ] Logo SVG créé au format Tiny PS
- [ ] Logo hébergé en HTTPS
- [ ] Enregistrement DNS BIMI ajouté
- [ ] Configuration testée avec BIMI Inspector
- [ ] Test d'envoi vers Gmail/Yahoo
- [ ] Logo ajouté dans les templates d'email (solution temporaire)

---

## Ressources

- [BIMI Group](https://bimigroup.org/)
- [Resend DMARC Guide](https://resend.com/docs/dashboard/domains/dmarc)
- [Google BIMI Requirements](https://support.google.com/a/answer/10911027)
- [SVG Tiny PS Validator](https://www.w3.org/Graphics/SVG/WG/wiki/Tiny_1.2_Test_Suite)

---

## Coûts

- **BIMI de base** : Gratuit (sans VMC)
- **Certificat VMC** : ~$1,500/an (pour Gmail)
- **Hébergement logo** : Inclus dans votre hébergement web

**Recommandation** : Commencez par BIMI de base (gratuit) pour Yahoo/AOL, et ajoutez le logo dans vos templates en attendant.
