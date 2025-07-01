// Ce backend fonctionne sans base de données. Voir README pour rebrancher une DB plus tard.

// (Ancienne config Sequelize/Postgres supprimée)

// TODO: Ajouter la config Cloudinary ici si besoin (voir .env et README)
// CLOUDINARY_URL=... à compléter avant publication

// TODO: Ajouter ici d'autres clés (DATABASE_URL, JWT_SECRET, etc.) avant publication

// Import de dotenv pour charger les variables d'environnement
import dotenv from 'dotenv';
dotenv.config();

// Import de Sequelize
import { Sequelize } from 'sequelize';

// Initialise Sequelize avec l'URL de connexion Postgres depuis .env
// Exemple attendu pour DB_URL : postgres://username:password@localhost:5432/trustdrop
const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'postgres',
  logging: false,
});

// Exporte l'instance sequelize pour l'utiliser dans les modèles
export default sequelize; 