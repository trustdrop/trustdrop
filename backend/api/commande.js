console.log("✅ Backend démarré sans DB, prêt à recevoir des requêtes");

import { Commande } from '../models/index.js';
import { computeRiskScore } from '../utils/scoring.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const JWT_SECRET = process.env.JWT_SECRET || 'trustdrop_secret';

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
  // CORS : autorise uniquement le frontend TrustDrop Alpha (à adapter si tu changes d'URL !)
  res.setHeader('Access-Control-Allow-Origin', 'https://trustdrop-alpha.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).json({ message: "TODO: Implémenter la logique de cette route (pas de DB connectée)" });
} 