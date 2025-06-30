import { Commande, PreuveLivraison } from '../models/index.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const JWT_SECRET = process.env.JWT_SECRET || 'trustdrop_secret';

// Authentification JWT (stateless)
function checkJwt(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token manquant' });
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    res.status(401).json({ error: 'Token invalide' });
    return null;
  }
}

// Authentification Shopify (stateless)
function checkShopifyToken(req, res) {
  const shop = req.headers['x-shopify-shop-domain'];
  const token = req.headers['x-shopify-access-token'];
  if (!shop || !token) {
    res.status(401).json({ error: 'Authentification Shopify requise.' });
    return null;
  }
  return { shop, token };
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // /api/stats : stats Shopify réelles
    const shopify = checkShopifyToken(req, res);
    if (!shopify) return;
    const { shop, token } = shopify;
    try {
      // Récupérer toutes les commandes Shopify
      const response = await axios.get(`https://${shop}/admin/api/2023-10/orders.json?status=any`, {
        headers: {
          'X-Shopify-Access-Token': token,
          'Content-Type': 'application/json',
        },
      });
      const commandes = response.data.orders || [];
      // Chiffre d'affaires total (CA)
      const ca = commandes.reduce((sum, c) => sum + parseFloat(c.total_price || 0), 0);
      // Nombre de commandes livrées
      const nbLivrees = commandes.filter(c => c.fulfillment_status === 'fulfilled').length;
      // Nombre total de commandes
      const nbCommandes = commandes.length;
      // Taux de litiges (commandes annulées ou remboursées)
      const nbLitiges = commandes.filter(c => c.cancelled_at || c.financial_status === 'refunded').length;
      const tauxLitiges = nbCommandes > 0 ? (nbLitiges / nbCommandes) * 100 : 0;
      // Nombre de preuves (à récupérer via la base locale)
      const nbPreuves = await PreuveLivraison.count();
      res.status(200).json({
        ca,
        nbCommandes,
        nbLivrees,
        nbPreuves,
        tauxLitiges: Math.round(tauxLitiges * 10) / 10,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
} 