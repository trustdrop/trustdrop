import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

// Définition du modèle PreuveLivraison pour TrustDrop
// Ce modèle stocke les preuves de livraison associées à une commande
const PreuveLivraison = sequelize.define('PreuveLivraison', {
  // Clé étrangère vers la commande
  idCommande: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // Clé étrangère vers l'utilisateur ayant déposé la preuve
  idUtilisateur: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  // Chemin du fichier sur le serveur
  cheminFichier: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Type MIME du fichier (image/png, image/jpeg, video/mp4)
  typeFichier: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Commentaire optionnel
  commentaire: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // Latitude GPS de la livraison (optionnel)
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  // Longitude GPS de la livraison (optionnel)
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  // Date et heure de la prise de preuve
  horodatage: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  // Nom du livreur ou appareil ayant pris la preuve
  prisePar: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // RiskScore IA (mocké pour l'instant)
  riskScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

export default PreuveLivraison; 