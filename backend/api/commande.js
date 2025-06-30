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
  // /api/commande/client : liste les clients Shopify
  if (req.method === 'GET' && req.url.endsWith('/client')) {
    const shopify = checkShopifyToken(req, res);
    if (!shopify) return;
    const { shop, token } = shopify;
    try {
      const response = await axios.get(`https://${shop}/admin/api/2023-10/customers.json`, {
        headers: {
          'X-Shopify-Access-Token': token,
          'Content-Type': 'application/json',
        },
      });
      res.status(200).json(response.data.customers);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        return res.status(401).json({ error: 'Token expiré, veuillez vous reconnecter.' });
      }
      res.status(500).json({ error: err.message });
    }
    return;
  }

  // /api/commande/:id : détail, update, delete
  const idMatch = req.url.match(/^\/api\/commande\/(\w+)/);
  if (idMatch && idMatch[1] && req.method === 'GET') {
    const shopify = checkShopifyToken(req, res);
    if (!shopify) return;
    const { shop, token } = shopify;
    try {
      const response = await axios.get(`https://${shop}/admin/api/2023-10/orders/${idMatch[1]}.json`, {
        headers: {
          'X-Shopify-Access-Token': token,
          'Content-Type': 'application/json',
        },
      });
      res.status(200).json(response.data.order);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        return res.status(401).json({ error: 'Token expiré, veuillez vous reconnecter.' });
      }
      res.status(500).json({ error: err.message });
    }
    return;
  }
  if (idMatch && idMatch[1] && req.method === 'PUT') {
    const user = checkJwt(req, res);
    if (!user) return;
    try {
      const commande = await Commande.findByPk(idMatch[1]);
      if (!commande) return res.status(404).json({ error: 'Commande non trouvée' });
      if (user.role !== 'admin' && commande.idUtilisateur !== user.id) {
        return res.status(403).json({ error: 'Accès interdit' });
      }
      await commande.update(req.body);
      res.status(200).json(commande);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
    return;
  }
  if (idMatch && idMatch[1] && req.method === 'DELETE') {
    const user = checkJwt(req, res);
    if (!user) return;
    try {
      const commande = await Commande.findByPk(idMatch[1]);
      if (!commande) return res.status(404).json({ error: 'Commande non trouvée' });
      if (user.role !== 'admin' && commande.idUtilisateur !== user.id) {
        return res.status(403).json({ error: 'Accès interdit' });
      }
      await commande.destroy();
      res.status(200).json({ message: 'Commande supprimée' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
    return;
  }

  // /api/commande : GET (Shopify) ou POST (TrustDrop)
  if (req.method === 'GET') {
    const shopify = checkShopifyToken(req, res);
    if (!shopify) return;
    const { shop, token } = shopify;
    try {
      const response = await axios.get(`https://${shop}/admin/api/2023-10/orders.json?status=any`, {
        headers: {
          'X-Shopify-Access-Token': token,
          'Content-Type': 'application/json',
        },
      });
      res.status(200).json(response.data.orders);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        return res.status(401).json({ error: 'Token expiré, veuillez vous reconnecter.' });
      }
      res.status(500).json({ error: err.message });
    }
    return;
  }
  if (req.method === 'POST') {
    const user = checkJwt(req, res);
    if (!user) return;
    try {
      const { nomClient, emailClient, adresseLivraison, dateCommande, statut } = req.body;
      const scoreRisque = computeRiskScore(nomClient, emailClient, adresseLivraison);
      const commande = await Commande.create({
        nomClient,
        emailClient,
        adresseLivraison,
        dateCommande,
        scoreRisque,
        statut: statut || 'en attente',
        idUtilisateur: user.id,
      });
      res.status(201).json(commande);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
    return;
  }
  res.status(405).json({ error: 'Méthode non autorisée' });
} 