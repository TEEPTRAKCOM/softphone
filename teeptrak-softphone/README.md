# TeepTrak Softphone

Softphone WebRTC pour l'équipe commerciale TeepTrak - Appels sortants et entrants directement depuis le navigateur.

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│   FRONTEND (Vercel - Gratuit)                                    │
│   https://phone.teeptrak.com                                     │
│   ┌──────────────────────────────────────────────────────────┐   │
│   │  React + Twilio Voice SDK (WebRTC)                       │   │
│   │  - Login SDR                                              │   │
│   │  - Dialer / Keypad                                        │   │
│   │  - Call Controls (mute, end, DTMF)                       │   │
│   │  - Incoming Call Modal                                    │   │
│   └──────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              │ HTTPS                              │
│                              ▼                                    │
│   BACKEND (n8n - Déjà en place)                                  │
│   https://n8n.teeptrak.com                                       │
│   ┌──────────────────────────────────────────────────────────┐   │
│   │  /webhook/softphone/token     → Génère Access Token      │   │
│   │  /webhook/softphone/voice     → TwiML pour appels        │   │
│   │  /webhook/softphone/status    → Log dans Odoo            │   │
│   │  /webhook/softphone/recording → Sauvegarde recordings    │   │
│   └──────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   TWILIO                     │                                    │
│   ┌──────────────────────────────────────────────────────────┐   │
│   │  - TwiML App                                              │   │
│   │  - Phone Number (+1 XXX-XXX-XXXX)                        │   │
│   │  - Voice WebRTC                                           │   │
│   │  - Recording                                              │   │
│   └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

## 📦 Contenu du Package

```
teeptrak-softphone/
├── frontend/                    # Application React
│   ├── src/
│   │   ├── components/
│   │   │   ├── Softphone.tsx   # Composant principal
│   │   │   ├── Dialer.tsx      # Clavier numérique
│   │   │   ├── CallPanel.tsx   # Contrôles d'appel actif
│   │   │   ├── IncomingCall.tsx # Modal appel entrant
│   │   │   └── Login.tsx       # Sélection SDR
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
│
├── n8n-workflows/               # Workflows n8n (backend)
│   ├── 01_softphone_token_generator.json
│   ├── 02_softphone_voice_webhook.json
│   └── 03_softphone_call_status.json
│
└── docs/
    ├── 01_TWILIO_SETUP.md
    ├── 02_DEPLOY_FRONTEND.md
    └── 03_DEPLOY_N8N.md
```

---

## 🚀 Guide d'Installation (Step by Step)

### Étape 1: Configuration Twilio (15 min)

#### 1.1 Créer un compte Twilio
- Aller sur https://www.twilio.com/try-twilio
- Créer un compte (gratuit pour commencer)

#### 1.2 Acheter un numéro de téléphone
1. Console Twilio → Phone Numbers → Buy a Number
2. Sélectionner un numéro US (+1)
3. Coût: ~$1.15/mois

#### 1.3 Créer une API Key
1. Console Twilio → Account → API Keys & Tokens
2. Cliquer "Create API Key"
3. Type: Standard
4. Noter:
   - **API Key SID** (commence par SK...)
   - **API Key Secret** (affiché une seule fois!)

#### 1.4 Créer une TwiML App
1. Console Twilio → Voice → TwiML Apps
2. Cliquer "Create new TwiML App"
3. Configurer:
   - **Friendly Name**: TeepTrak Softphone
   - **Voice Request URL**: `https://n8n.teeptrak.com/webhook/softphone/voice`
   - **Voice Request Method**: POST
   - **Status Callback URL**: `https://n8n.teeptrak.com/webhook/softphone/status`
4. Sauvegarder et noter le **TwiML App SID** (commence par AP...)

#### 1.5 Configurer le numéro de téléphone
1. Console Twilio → Phone Numbers → Active Numbers
2. Cliquer sur votre numéro
3. Sous "Voice Configuration":
   - **Configure With**: TwiML App
   - **TwiML App**: TeepTrak Softphone

---

### Étape 2: Déployer les Workflows n8n (10 min)

#### 2.1 Importer les workflows
1. n8n → Workflows → Import from File
2. Importer les 3 fichiers JSON:
   - `01_softphone_token_generator.json`
   - `02_softphone_voice_webhook.json`
   - `03_softphone_call_status.json`

#### 2.2 Configurer le Token Generator
Ouvrir le workflow "Softphone - Token Generator" → Node "Generate Twilio Token":

```javascript
// REMPLACER CES VALEURS:
const TWILIO_ACCOUNT_SID = 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';  // Votre Account SID
const TWILIO_API_KEY = 'SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';      // API Key SID
const TWILIO_API_SECRET = 'votre_api_secret_ici';                  // API Key Secret
const TWIML_APP_SID = 'APxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';       // TwiML App SID
```

#### 2.3 Configurer le Voice Webhook
Ouvrir le workflow "Softphone - Voice Webhook" → Node "Generate TwiML":

```javascript
// REMPLACER:
const CALLER_ID = '+1XXXXXXXXXX';  // Votre numéro Twilio
```

#### 2.4 Configurer le Status Callback
Ouvrir le workflow "Softphone - Call Status" → Node "Odoo Auth":

```json
{
  "login": "votre_email@teeptrak.com",
  "password": "votre_mot_de_passe"
}
```

#### 2.5 Activer les workflows
Pour chaque workflow: Toggle → Active

---

### Étape 3: Déployer le Frontend sur Vercel (10 min)

#### 3.1 Prérequis
- Compte GitHub (https://github.com)
- Compte Vercel (https://vercel.com) - gratuit avec GitHub

#### 3.2 Créer le repo GitHub
1. Aller sur GitHub → New Repository
2. Nom: `teeptrak-softphone`
3. Private (recommandé)
4. Créer

#### 3.3 Pusher le code
```bash
cd frontend
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/VOTRE_USERNAME/teeptrak-softphone.git
git push -u origin main
```

#### 3.4 Déployer sur Vercel
1. Aller sur https://vercel.com
2. "Add New Project"
3. Importer le repo GitHub `teeptrak-softphone`
4. Configurer:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Environment Variables:
   - `VITE_TOKEN_URL` = `https://n8n.teeptrak.com/webhook/softphone/token`
6. Deploy!

#### 3.5 Configurer le domaine (optionnel)
1. Vercel → Project Settings → Domains
2. Ajouter: `phone.teeptrak.com`
3. Configurer le DNS:
   - Type: CNAME
   - Name: phone
   - Value: cname.vercel-dns.com

---

### Étape 4: Test (5 min)

#### 4.1 Ouvrir le softphone
- https://votre-projet.vercel.app OU
- https://phone.teeptrak.com

#### 4.2 Se connecter
- Sélectionner un SDR dans la liste
- Cliquer "Connect"

#### 4.3 Faire un appel test
- Entrer un numéro (ex: votre mobile)
- Cliquer le bouton vert d'appel
- Vérifier que l'appel arrive

#### 4.4 Vérifier les logs Odoo
- Aller dans le CRM Odoo
- Vérifier qu'un message a été ajouté au lead

---

## 💰 Coûts

| Service | Coût |
|---------|------|
| Vercel (Frontend) | $0 (free tier) |
| n8n (Backend) | $0 (déjà payé) |
| Twilio Number | ~$1.15/mois |
| Twilio Voice (outbound) | ~$0.014/min |
| Twilio Voice (inbound) | ~$0.0085/min |
| **Total fixe** | **~$1.15/mois** |
| **Estimé 500 min/mois** | **~$8/mois** |

---

## 🔧 Troubleshooting

### Erreur "Device not registered"
- Vérifier que les credentials Twilio sont corrects
- Vérifier que le workflow Token Generator est actif
- Vérifier la console du navigateur pour plus de détails

### Pas de son
- Vérifier les permissions du microphone dans le navigateur
- Vérifier que le bon périphérique audio est sélectionné

### Appel ne se connecte pas
- Vérifier que le numéro Twilio est configuré avec la TwiML App
- Vérifier que le workflow Voice est actif
- Vérifier les logs n8n pour les erreurs

### Appels non loggués dans Odoo
- Vérifier les credentials Odoo dans le workflow Status
- Vérifier que le workflow Status est actif
- Vérifier que le numéro de téléphone correspond à un lead dans Odoo

---

## 📞 Support

Pour toute question:
- Email: rav@teeptrak.com
- Documentation Twilio: https://www.twilio.com/docs/voice/sdks/javascript

---

## 🔄 Mises à jour futures

- [ ] Historique des appels dans l'interface
- [ ] Click-to-call depuis Odoo
- [ ] Transfert d'appel
- [ ] Conférence à 3
- [ ] Intégration calendrier pour heures d'appel
