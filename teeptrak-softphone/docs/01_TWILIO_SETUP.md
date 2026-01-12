# Configuration Twilio pour TeepTrak Softphone

## 1. Informations à collecter

À la fin de cette configuration, tu auras besoin de:

| Information | Format | Exemple |
|-------------|--------|---------|
| Account SID | ACxxxxxxxx... | AC1234567890abcdef... |
| API Key SID | SKxxxxxxxx... | SK1234567890abcdef... |
| API Key Secret | (string) | a1b2c3d4e5f6... |
| TwiML App SID | APxxxxxxxx... | AP1234567890abcdef... |
| Phone Number | +1XXXXXXXXXX | +16305551234 |

---

## 2. Créer une API Key

### Pourquoi?
L'API Key est plus sécurisée que d'utiliser l'Auth Token principal.

### Comment:
1. **Console Twilio** → https://console.twilio.com
2. **Account** → **API Keys & Tokens**
3. **Create API Key**
4. **Type**: Standard
5. **Friendly Name**: TeepTrak Softphone

### ⚠️ IMPORTANT:
L'**API Key Secret** n'est affiché qu'**UNE SEULE FOIS**!
Copie-le immédiatement dans un endroit sécurisé.

---

## 3. Créer une TwiML App

### Pourquoi?
La TwiML App définit comment gérer les appels sortants depuis le navigateur.

### Comment:
1. **Console Twilio** → **Voice** → **TwiML Apps**
2. **Create new TwiML App**
3. Configurer:

| Champ | Valeur |
|-------|--------|
| **Friendly Name** | TeepTrak Softphone |
| **Voice Request URL** | `https://n8n.teeptrak.com/webhook/softphone/voice` |
| **Voice Request Method** | POST |
| **Status Callback URL** | `https://n8n.teeptrak.com/webhook/softphone/status` |
| **Status Callback Method** | POST |

4. **Save**
5. Noter le **SID** (commence par AP...)

---

## 4. Configurer le Numéro de Téléphone

### Si tu n'as pas encore de numéro:
1. **Console Twilio** → **Phone Numbers** → **Buy a Number**
2. Chercher un numéro US
3. S'assurer que **Voice** est coché
4. Acheter (~$1.15/mois)

### Configurer le numéro:
1. **Console Twilio** → **Phone Numbers** → **Active Numbers**
2. Cliquer sur ton numéro
3. Sous **Voice Configuration**:

| Champ | Valeur |
|-------|--------|
| **Configure With** | TwiML App |
| **TwiML App** | TeepTrak Softphone |

4. **Save Configuration**

---

## 5. Vérification

### Test API Key:
```bash
curl -X GET "https://api.twilio.com/2010-04-01/Accounts/ACCOUNT_SID.json" \
  -u "API_KEY_SID:API_KEY_SECRET"
```

Devrait retourner les infos de ton compte.

### Test TwiML App:
```bash
curl -X POST "https://n8n.teeptrak.com/webhook/softphone/voice" \
  -d "To=+15551234567" \
  -d "From=+16305551234"
```

Devrait retourner du XML TwiML.

---

## 6. Récapitulatif des URLs n8n

| Webhook | URL |
|---------|-----|
| Token Generator | `https://n8n.teeptrak.com/webhook/softphone/token` |
| Voice (TwiML) | `https://n8n.teeptrak.com/webhook/softphone/voice` |
| Status Callback | `https://n8n.teeptrak.com/webhook/softphone/status` |
| Recording Callback | `https://n8n.teeptrak.com/webhook/softphone/recording` |

---

## 7. Prochaine étape

→ Configurer les workflows n8n avec ces informations
→ Voir `03_DEPLOY_N8N.md`
