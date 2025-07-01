# TrustDrop Backend (Vercel Serverless)

## Ajouter une nouvelle route API (serverless)

1. Crée un fichier dans le dossier `api/` à la racine du backend, par exemple `api/ma-nouvelle-route.js`.
2. Exporte une fonction handler au format Vercel :

```js
export default async function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ message: 'Hello from ma-nouvelle-route!' });
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}
```
3. Déploie sur Vercel. La route sera accessible via :
   `https://<ton-backend>.vercel.app/api/ma-nouvelle-route`

4. Pour utiliser des middlewares (auth, etc.), copie le modèle des autres handlers (`api/commande.js`, `api/stats.js`, etc.).

5. Les variables d'environnement sont accessibles via `process.env`.

6. Pour les routes dynamiques (ex: `/api/commande/[id].js`), gère la logique dans le handler avec `req.url` ou `req.query`.

---

**Exemple de handler avec authentification JWT :**

```js
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;
function checkJwt(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token manquant' });
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    res.status(401).json({ error: 'Token invalide' });
    return null;
  }
}
```

---

## 🔌 Rebrancher une vraie base de données plus tard (Sequelize/Postgres)

1. **Restaurer la config Sequelize**
   - Remets le contenu d'origine dans `backend/config/db.js` (voir l'historique git ou le backup).
   - Mets à jour la variable d'environnement `DB_URL` dans Vercel ou dans un `.env` local :
     ```
     DB_URL=postgres://username:password@host:5432/nomdelabase
     ```

2. **Restaurer les modèles**
   - Remets le code d'origine dans `backend/models/commande.js`, `backend/models/preuveLivraison.js`, `backend/models/utilisateur.js`.
   - Restaure la centralisation dans `backend/models/index.js`.

3. **Réactiver la logique dans les handlers**
   - Remets la logique d'accès à la DB dans les fichiers `api/commande.js`, `api/preuve.js`, `api/stats.js`, etc.
   - Supprime les messages TODO et réactive les appels Sequelize (`findAll`, `create`, etc.).

4. **Déployer**
   - Vérifie que la base est bien accessible depuis Vercel (ou ton environnement local).
   - Les endpoints fonctionneront alors avec la vraie base de données.

**Astuce** : utilise l'historique git pour restaurer les fichiers supprimés ou modifiés.

--- 