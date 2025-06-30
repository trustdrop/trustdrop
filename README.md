# TrustDrop

**TrustDrop** est une plateforme SaaS pour e-commerçants, permettant de détecter les fraudes à la livraison grâce à une IA comportementale et des preuves photo/vidéo géolocalisées.

## Fonctionnalités principales
- Dashboard web (React.js + Tailwind) :
  - Liste des commandes
  - Score de risque (0-100)
  - Preuves photo/vidéo de livraison
  - Alertes et statistiques
- Backend API (Node.js Express) :
  - Endpoints pour commandes, preuves, authentification JWT
  - IA de scoring simple (analyse nom, email, adresse, historique)
- App mobile web pour livreurs :
  - Prise photo/vidéo, géolocalisation, upload sécurisé
- Plugins e-commerce (mock Shopify/WooCommerce)

## Stack technique
- **Frontend** : React.js, Tailwind CSS, Axios, React Router
- **Backend** : Node.js (Express), PostgreSQL, JWT, Cloudinary, Multer
- **Tests** : Jest, Supertest
- **Stockage médias** : Cloudinary (ou AWS S3)

## Structure du projet

```
trustdrop/
├── backend/           # API Express, logique IA, BDD
├── frontend/          # Application React (dashboard, mobile web)
├── plugins/           # Plugins mock Shopify/WooCommerce
│   ├── shopify-mock/
│   └── woocommerce-mock/
└── README.md
```

## Prérequis
- Node.js >= 18.x
- npm >= 9.x
- PostgreSQL >= 14

## Installation

### 1. Cloner le repo
```bash
git clone <repo-url>
cd trustdrop
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env # puis configurer les variables d'environnement
npm run dev
```

### 3. Frontend
```bash
cd ../frontend
npm install
npm run dev
```

### 4. Plugins (optionnel)
- Les plugins mock sont dans `plugins/`.

## Variables d'environnement backend (`.env`)
```
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/trustdrop
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Lancement des tests
```bash
cd backend
npm test
```

## Notes
- L'IA de scoring est un module simple, facilement remplaçable par un modèle plus avancé.
- Le frontend inclut un mode "mobile livreur" accessible via `/livreur`.

## 🔒 Intégration Shopify (OAuth) – MVP & branchement futur

### Backend
- **Route `/shopify/auth`** : simule l'authentification Shopify, accepte `?shop=xxx&token=yyy`. À remplacer par la vraie logique OAuth HMAC Shopify (voir commentaires dans le code).
- **Middleware `verifyShopToken`** : vérifie le token mocké. À remplacer par la vérification HMAC OAuth Shopify.
- **Stockage en mémoire** : à remplacer par une vraie base ou Redis pour la prod.

### Frontend
- **Bouton "Connecter votre boutique Shopify"** : visible si pas de token Shopify, déclenche la connexion mockée.
- **State `isConnected`** : contrôle l'accès à l'app, à remplacer par la vraie vérification de session Shopify.
- **Fonction `connectShopify`** : appelle `/shopify/auth` (mock), à remplacer par le vrai flow OAuth Shopify.

### À brancher plus tard
- Remplacer les TODO dans le code par la logique OAuth officielle Shopify (voir docs Shopify Partners).
- Sécuriser le stockage du token côté backend et frontend.
- Gérer le refresh/expiration du token Shopify.

---

## 📦 Publication Shopify App Store

### Fichiers à compléter avant publication :
- `shopify.app.toml` :
  - [app] client_id, client_secret, redirect_uri, scopes (voir TODO dans le fichier)
  - [contact] email
- `backend/routes/shopify.js` :
  - Remplacer tous les placeholders (API_KEY, SECRET, URL, scopes, state)
- Variables d'environnement backend (`.env`) :
  - CLOUDINARY, JWT_SECRET, DATABASE_URL, etc.
- Vérifier que tous les TODO sont traités dans le code (recherche "TODO:")

### Étapes pour build et déployer :
1. Compléter tous les champs TODO dans les fichiers ci-dessus.
2. Tester l'app en mode production (`npm run build` côté frontend, `npm start` côté backend).
3. Déployer le backend sur un serveur public (ex: Heroku, Render, AWS, GCP, etc.).
4. Déployer le frontend (Vercel, Netlify, ou sur le même domaine que le backend).
5. Mettre à jour l'URL publique dans `shopify.app.toml` et dans le code backend.
6. Créer l'app sur le Shopify Partners Dashboard, uploader le fichier `shopify.app.toml` et suivre la procédure Shopify.
7. Tester l'installation OAuth sur une boutique de test Shopify.
8. Ajouter les webhooks nécessaires dans Shopify Partners et dans le code.
9. Vérifier la conformité (branding, RGPD, sécurité, etc.).
10. Publier l'app sur le Shopify App Store.

---

## Contact
Pour toute question, contactez l'équipe TrustDrop : trustdrop.contact@gmail.com
