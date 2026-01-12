# Configurer les Workflows n8n

## Workflows à importer

| Fichier | Description |
|---------|-------------|
| `01_softphone_token_generator.json` | Génère les Access Tokens Twilio |
| `02_softphone_voice_webhook.json` | TwiML pour les appels sortants |
| `03_softphone_call_status.json` | Log les appels dans Odoo |

---

## Étape 1: Importer les workflows

1. **n8n** → **Workflows** → **Import from File**
2. Sélectionner chaque fichier JSON
3. Répéter pour les 3 fichiers

---

## Étape 2: Configurer le Token Generator

### Ouvrir le workflow
1. Cliquer sur "Softphone - Token Generator"
2. Ouvrir le node **"Generate Twilio Token"**

### Modifier les constantes

```javascript
// LIGNE 7-11 - REMPLACER PAR VOS VALEURS:
const TWILIO_ACCOUNT_SID = 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const TWILIO_API_KEY = 'SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const TWILIO_API_SECRET = 'votre_api_secret_ici';
const TWIML_APP_SID = 'APxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
```

### Où trouver ces valeurs:

| Valeur | Où la trouver |
|--------|---------------|
| ACCOUNT_SID | Console Twilio → Dashboard → Account SID |
| API_KEY | Console → Account → API Keys → Votre clé → SID |
| API_SECRET | Lors de la création de l'API Key (noté précédemment) |
| TWIML_APP_SID | Console → Voice → TwiML Apps → Votre app → SID |

### Sauvegarder et activer
1. Cliquer **Save**
2. Toggle **Active** → ON

---

## Étape 3: Configurer le Voice Webhook

### Ouvrir le workflow
1. Cliquer sur "Softphone - Voice Webhook"
2. Ouvrir le node **"Generate TwiML"**

### Modifier le Caller ID

```javascript
// LIGNE 15 - REMPLACER PAR VOTRE NUMÉRO TWILIO:
const CALLER_ID = '+1XXXXXXXXXX';  // Format E.164
```

### Exemple:
```javascript
const CALLER_ID = '+16305701421';
```

### Sauvegarder et activer
1. Cliquer **Save**
2. Toggle **Active** → ON

---

## Étape 4: Configurer le Status Callback

### Ouvrir le workflow
1. Cliquer sur "Softphone - Call Status & Recording"
2. Ouvrir le node **"Odoo Auth"**

### Modifier les credentials Odoo

```json
{
  "jsonrpc": "2.0",
  "method": "call",
  "params": {
    "db": "teeptrak_prod",
    "login": "VOTRE_EMAIL@teeptrak.com",
    "password": "VOTRE_MOT_DE_PASSE"
  }
}
```

### Sauvegarder et activer
1. Cliquer **Save**
2. Toggle **Active** → ON

---

## Étape 5: Vérifier les webhooks

### URLs des webhooks

Après activation, vos webhooks seront disponibles à:

| Webhook | URL |
|---------|-----|
| Token | `https://n8n.teeptrak.com/webhook/softphone/token` |
| Voice | `https://n8n.teeptrak.com/webhook/softphone/voice` |
| Status | `https://n8n.teeptrak.com/webhook/softphone/status` |
| Recording | `https://n8n.teeptrak.com/webhook/softphone/recording` |

### Test Token Generator

```bash
curl -X POST https://n8n.teeptrak.com/webhook/softphone/token \
  -H "Content-Type: application/json" \
  -d '{"identity":"test@teeptrak.com","userId":"1","userName":"Test User"}'
```

**Réponse attendue:**
```json
{
  "token": "eyJhbGciOiJIUzI1...",
  "identity": "test@teeptrak.com",
  "success": true
}
```

### Test Voice Webhook

```bash
curl -X POST https://n8n.teeptrak.com/webhook/softphone/voice \
  -d "To=+15551234567" \
  -d "CallerId=test@teeptrak.com"
```

**Réponse attendue:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial callerId="+16305701421" record="record-from-answer">
    <Number>+15551234567</Number>
  </Dial>
</Response>
```

---

## Troubleshooting

### Workflow ne se déclenche pas

1. Vérifier que le workflow est **Active** (toggle vert)
2. Vérifier l'URL du webhook (cliquer sur le node Webhook)
3. Vérifier les logs n8n

### Token invalide

1. Vérifier TWILIO_ACCOUNT_SID
2. Vérifier TWILIO_API_KEY et TWILIO_API_SECRET
3. Vérifier TWIML_APP_SID
4. Vérifier que l'API Key est active dans Twilio

### Appels non loggués dans Odoo

1. Vérifier les credentials Odoo dans le node "Odoo Auth"
2. Vérifier que le workflow "Call Status" est actif
3. Vérifier les exécutions dans n8n (Executions → voir les erreurs)

---

## Sécurité (Recommandations)

### 1. Stocker les secrets dans les credentials n8n

Au lieu de hardcoder les secrets dans le code, utiliser les credentials n8n:
1. Settings → Credentials → Add
2. Type: "Header Auth" ou créer un custom

### 2. Limiter les IPs

Dans la configuration n8n, limiter les IPs autorisées pour les webhooks.

### 3. Ajouter une validation du token

Ajouter une vérification que la requête vient bien de Twilio ou du frontend.

---

## Monitoring

### Voir les exécutions

1. n8n → Executions
2. Filtrer par workflow
3. Voir les succès/erreurs

### Alertes

Configurer des notifications en cas d'erreur:
- Email
- Slack
- etc.
