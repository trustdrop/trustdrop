// Import de l'instance sequelize et des types Sequelize
import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

// Définition du modèle Commande pour TrustDrop
const Commande = sequelize.define('Commande', {
  // Nom du client (obligatoire)
  nomClient: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Email du client (obligatoire)
  emailClient: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Adresse de livraison (obligatoire)
  adresseLivraison: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Date de la commande (obligatoire)
  dateCommande: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  // Score de risque (obligatoire)
  scoreRisque: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // Statut de la commande (par défaut "en attente")
  statut: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'en attente',
  },
  // Source de la commande (Shopify, WooCommerce, TrustDrop, etc.)
  source: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'TrustDrop',
  },
});

export default Commande; 