// Chargement des variables d'environnement depuis .env
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { sequelize } from './models/index.js';
import commandeRoutes from './routes/commande.js';
import preuveRoutes from './routes/preuve.js';
import authRoutes from './routes/auth.js';
import statsRoutes from './routes/stats.js';
import webhookRoutes from './routes/webhook.js';
import shopifyRouter from './routes/shopify.js';
import utilisateurRoutes from './routes/utilisateur.js';

const app = express();
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Configuration de la session pour stocker le token Shopify
app.use(session({
  secret: process.env.SESSION_SECRET || 'trustdrop_session_secret', // TODO: Remplacer avant prod
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true en prod HTTPS
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 jours
  }
}));

app.use('/commande', commandeRoutes);
app.use('/preuve', preuveRoutes);
app.use('/auth', authRoutes);
app.use('/stats', statsRoutes);
app.use('/webhook', webhookRoutes);
app.use('/shopify', shopifyRouter); // TODO: Ici, brancher la logique OAuth Shopify réelle
app.use('/utilisateur', utilisateurRoutes);

const PORT = process.env.PORT || 4000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}); 