# 🚀 TeepTrak Softphone - Quick Start

## Ce que tu reçois

```
teeptrak-softphone.zip
├── frontend/               → Application React (à déployer sur Vercel)
├── n8n-workflows/          → 3 workflows à importer dans n8n
├── docs/                   → Documentation détaillée
└── README.md               → Guide complet
```

---

## ⏱️ Timeline (30-45 minutes)

| Étape | Temps | Action |
|-------|-------|--------|
| 1 | 15 min | Configurer Twilio (API Key, TwiML App) |
| 2 | 10 min | Importer et configurer les workflows n8n |
| 3 | 10 min | Déployer le frontend sur Vercel |
| 4 | 5 min | Test du premier appel |

---

## 📋 Checklist

### Twilio (tu as déjà un compte?)
- [ ] Créer une API Key (Console → Account → API Keys)
- [ ] Noter le **API Key SID** (SK...)
- [ ] Noter le **API Key Secret** (une seule fois!)
- [ ] Créer une TwiML App avec ces URLs:
  - Voice URL: `https://n8n.teeptrak.com/webhook/softphone/voice`
  - Status URL: `https://n8n.teeptrak.com/webhook/softphone/status`
- [ ] Noter le **TwiML App SID** (AP...)
- [ ] Configurer ton numéro Twilio avec la TwiML App

### n8n
- [ ] Importer `01_softphone_token_generator.json`
- [ ] Importer `02_softphone_voice_webhook.json`
- [ ] Importer `03_softphone_call_status.json`
- [ ] Modifier les credentials Twilio dans le Token Generator
- [ ] Modifier le CALLER_ID dans le Voice Webhook
- [ ] Modifier les credentials Odoo dans Call Status
- [ ] Activer les 3 workflows

### Vercel
- [ ] Créer un repo GitHub avec le dossier `frontend/`
- [ ] Connecter à Vercel
- [ ] Ajouter variable: `VITE_TOKEN_URL=https://n8n.teeptrak.com/webhook/softphone/token`
- [ ] Déployer

### Test
- [ ] Ouvrir le softphone
- [ ] Se connecter avec un SDR
- [ ] Faire un appel test
- [ ] Vérifier le log dans Odoo

---

## 🔧 Valeurs à remplacer

### Dans n8n - Token Generator:
```javascript
const TWILIO_ACCOUNT_SID = 'ACxxxxxxxx';  // Ton Account SID
const TWILIO_API_KEY = 'SKxxxxxxxx';      // API Key SID
const TWILIO_API_SECRET = 'xxxxx';        // API Key Secret
const TWIML_APP_SID = 'APxxxxxxxx';       // TwiML App SID
```

### Dans n8n - Voice Webhook:
```javascript
const CALLER_ID = '+16305701421';  // Ton numéro Twilio
```

### Dans n8n - Call Status:
```json
{
  "login": "rav@teeptrak.com",
  "password": "ton_mot_de_passe"
}
```

---

## 💰 Coûts

| Élément | Coût |
|---------|------|
| Vercel | $0/mois |
| n8n | $0/mois (déjà payé) |
| Twilio Number | ~$1.15/mois |
| Twilio Voice | ~$0.014/min |
| **TOTAL (500 min/mois)** | **~$8/mois** |

vs Aircall: $250/mois → **Économie: ~$240/mois = $2,880/an**

---

## ❓ Besoin d'aide?

1. Consulte les docs dans le dossier `docs/`
2. Vérifie les logs n8n si un workflow ne fonctionne pas
3. Vérifie la console du navigateur si le frontend a des erreurs

Bonne chance! 🎉
