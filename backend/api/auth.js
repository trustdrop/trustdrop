import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Utilisateur } from '../models/index.js';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'trustdrop_secret';

export default async function handler(req, res) {
  if (req.method === 'POST' && req.url.endsWith('/inscription')) {
    try {
      const { nom, email, motDePasse, role } = req.body;
      const hash = await bcrypt.hash(motDePasse, SALT_ROUNDS);
      const utilisateur = await Utilisateur.create({
        nom,
        email,
        motDePasse: hash,
        role: role || 'marchand',
      });
      const token = jwt.sign({ id: utilisateur.id, email: utilisateur.email, role: utilisateur.role }, JWT_SECRET, { expiresIn: '7d' });
      res.status(201).json({ token, utilisateur: { id: utilisateur.id, nom: utilisateur.nom, email: utilisateur.email, role: utilisateur.role } });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
    return;
  }
  if (req.method === 'POST' && req.url.endsWith('/connexion')) {
    try {
      const { email, motDePasse } = req.body;
      const utilisateur = await Utilisateur.findOne({ where: { email } });
      if (!utilisateur) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      const match = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
      if (!match) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      const token = jwt.sign({ id: utilisateur.id, email: utilisateur.email, role: utilisateur.role }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, utilisateur: { id: utilisateur.id, nom: utilisateur.nom, email: utilisateur.email, role: utilisateur.role } });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
    return;
  }
  if (req.method === 'POST' && req.url.endsWith('/login')) {
    const { email, motDePasse } = req.body;
    try {
      const user = await Utilisateur.findOne({ where: { email } });
      if (!user) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      const match = await bcrypt.compare(motDePasse, user.motDePasse);
      if (!match) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
    return;
  }
  res.status(405).json({ error: 'Méthode non autorisée' });
} 