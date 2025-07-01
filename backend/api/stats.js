console.log("✅ Backend démarré sans DB, prêt à recevoir des requêtes");

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
  res.status(200).json({ message: "TODO: Implémenter la logique de cette route (pas de DB connectée)" });
} 