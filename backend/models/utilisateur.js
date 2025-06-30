// Import de l'instance sequelize et des types Sequelize
import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

// Définition du modèle Utilisateur pour TrustDrop
const Utilisateur = sequelize.define('Utilisateur', {
  // Identifiant unique
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  // Nom de l'utilisateur
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Email unique
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  // Mot de passe hashé
  motDePasse: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Rôle de l'utilisateur
  role: {
    type: DataTypes.ENUM('admin', 'merchant', 'support'),
    defaultValue: 'merchant',
  },
  // Date d'inscription
  dateInscription: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

export default Utilisateur; 