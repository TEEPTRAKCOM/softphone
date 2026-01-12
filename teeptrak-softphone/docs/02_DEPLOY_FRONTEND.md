# Déployer le Frontend sur Vercel

## Prérequis

- Compte GitHub
- Compte Vercel (gratuit avec GitHub)

---

## Option 1: Deploy avec GitHub (Recommandé)

### 1. Créer un repo GitHub

```bash
# Dans le dossier frontend/
cd frontend

# Initialiser git
git init
git add .
git commit -m "Initial commit - TeepTrak Softphone"

# Créer le repo sur GitHub puis:
git remote add origin https://github.com/VOTRE_USERNAME/teeptrak-softphone.git
git branch -M main
git push -u origin main
```

### 2. Connecter à Vercel

1. Aller sur https://vercel.com
2. Sign in avec GitHub
3. "Add New Project"
4. Sélectionner le repo `teeptrak-softphone`

### 3. Configurer le build

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `frontend` (si le repo contient tout) OU `.` (si juste le frontend) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### 4. Variables d'environnement

Cliquer "Environment Variables" et ajouter:

| Key | Value |
|-----|-------|
| `VITE_TOKEN_URL` | `https://n8n.teeptrak.com/webhook/softphone/token` |

### 5. Deploy

Cliquer **Deploy** et attendre ~1-2 minutes.

---

## Option 2: Deploy via CLI

### 1. Installer Vercel CLI

```bash
npm install -g vercel
```

### 2. Login

```bash
vercel login
```

### 3. Deploy

```bash
cd frontend
vercel
```

Suivre les prompts:
- Set up and deploy? → Y
- Which scope? → (ton compte)
- Link to existing project? → N
- Project name? → teeptrak-softphone
- Directory? → ./
- Override settings? → N

### 4. Deploy en production

```bash
vercel --prod
```

---

## Configurer un domaine personnalisé

### 1. Dans Vercel

1. Project Settings → Domains
2. Ajouter: `phone.teeptrak.com`
3. Vercel te donnera les instructions DNS

### 2. Dans ton DNS (Cloudflare, etc.)

Ajouter un enregistrement:

| Type | Name | Value |
|------|------|-------|
| CNAME | phone | cname.vercel-dns.com |

### 3. Attendre la propagation

Peut prendre 1-24h selon le TTL.

---

## Mise à jour

Pour déployer une nouvelle version:

```bash
git add .
git commit -m "Update: description"
git push
```

Vercel détecte automatiquement le push et redéploie.

---

## Troubleshooting

### Build failed

Vérifier les logs dans Vercel:
- Project → Deployments → Cliquer sur le deployment failed

### 404 après deploy

S'assurer que:
- `dist` contient bien un `index.html`
- Le root directory est correct

### Variables d'env non reconnues

- Les variables Vite doivent commencer par `VITE_`
- Redéployer après avoir ajouté des variables

---

## URLs finales

Après deploy réussi:

| Environment | URL |
|-------------|-----|
| Preview | `https://teeptrak-softphone-xxx.vercel.app` |
| Production | `https://phone.teeptrak.com` (après config DNS) |
