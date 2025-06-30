import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Stockage temporaire des tokens Shopify (clé = shop, valeur = access_token)
const shopTokens = {};

// Utilisation des variables d'environnement Shopify
const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET;
const SCOPES = process.env.SHOPIFY_SCOPES;
const APP_URL = process.env.SHOPIFY_APP_URL;
const REDIRECT_URI = `${APP_URL}/shopify/auth/callback`;

// TODO: Ajouter ici la config Cloudinary dans le .env (CLOUDINARY_URL=...)
// Voir README pour la clé à insérer

// Toutes les routes OAuth utilisent les variables d'environnement définies dans .env
// TODO: Ajouter ici d'autres configs ou clés si besoin avant publication (ex: gestion avancée du state, sécurité, etc.)

// 1️⃣ Route d'installation /auth : redirige vers Shopify OAuth
router.get('/auth', (req, res) => {
  const { shop } = req.query;
  console.log('[OAuth] /shopify/auth appelé avec shop =', shop);
  if (!shop) {
    console.error('[OAuth] /shopify/auth : paramètre shop manquant');
    return res.status(400).send('Paramètre shop manquant');
  }
  const installUrl =
    `https://${shop}/admin/oauth/authorize?client_id=${SHOPIFY_API_KEY}` +
    `&scope=${encodeURIComponent(SCOPES)}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&state=randomstring`;
  console.log('[OAuth] Redirection vers Shopify installUrl =', installUrl);
  res.redirect(installUrl);
});

// 2️⃣ Callback OAuth /auth/callback : échange le code contre un access token
router.get('/auth/callback', async (req, res) => {
  const { shop, code, state } = req.query;
  console.log('[OAuth] /shopify/auth/callback appelé avec shop =', shop, 'code =', code);
  if (!shop || !code) {
    console.error('[OAuth] /shopify/auth/callback : paramètres manquants');
    return res.status(400).send('Paramètres manquants');
  }
  try {
    // Échange du code contre un access_token
    const tokenRes = await axios.post(`https://${shop}/admin/oauth/access_token`, {
      client_id: SHOPIFY_API_KEY,
      client_secret: SHOPIFY_API_SECRET,
      code,
    });
    const accessToken = tokenRes.data.access_token;
    // Stockage du token Shopify en session (à adapter pour la prod)
    req.session.shop = shop;
    req.session.shopifyToken = accessToken;
    console.log('[OAuth] Token Shopify stocké en session pour', shop);
    // Redirige vers l'app frontend après login
    res.redirect(`${APP_URL}/dashboard`);
  } catch (err) {
    console.error('[OAuth] Erreur lors de l\'échange du code contre le token Shopify:', err.response?.data || err.message);
    res.status(500).send('Erreur OAuth Shopify: ' + (err.response?.data?.error_description || err.message));
  }
});

// Middleware pour sécuriser les routes Shopify (vérifie le token OAuth)
export const requireShopifyToken = (req, res, next) => {
  // Le token doit être stocké en session, base ou cookie sécurisé
  // TODO: Adapter la logique de stockage selon la prod (DB, Redis, etc.)
  const shop = req.session?.shop || req.headers['x-shopify-shop-domain'];
  const token = req.session?.shopifyToken || req.headers['x-shopify-access-token'];
  if (!shop || !token) {
    return res.status(401).json({ error: 'Authentification Shopify requise.' });
  }
  req.shop = shop;
  req.shopToken = token;
  next();
};

// Endpoints pour enregistrer les webhooks Shopify (commande créée, livrée, remboursée)
// TODO: Ajouter la logique d'enregistrement dynamique des webhooks lors de l'installation de l'app
router.post('/webhook/orders/create', (req, res) => {
  // TODO: Traiter la commande créée (sauvegarder, notifier, etc.)
  res.status(200).send('Webhook commande créée reçu');
});
router.post('/webhook/orders/fulfilled', (req, res) => {
  // TODO: Traiter la commande livrée
  res.status(200).send('Webhook commande livrée reçu');
});
router.post('/webhook/orders/refunded', (req, res) => {
  // TODO: Traiter la commande remboursée
  res.status(200).send('Webhook commande remboursée reçu');
});

export default router; 