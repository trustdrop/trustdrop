import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';

const router = express.Router();

// GET /utilisateur : retourne des utilisateurs mockés (admin uniquement)
router.get('/', authMiddleware, authorizeRoles(['admin']), (req, res) => {
  // TODO: À brancher sur la vraie base utilisateurs Shopify
  res.json({ message: 'Utilisateurs mockés retournés' });
});

export default router; 