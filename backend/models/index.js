// Centralisation des modèles Sequelize pour TrustDrop
// On importe l'instance sequelize déjà configurée
import sequelize from '../config/db.js';

// Import des modèles (chacun utilise déjà l'instance sequelize)
import Commande from './commande.js';
import PreuveLivraison from './preuveLivraison.js';
import Utilisateur from './utilisateur.js';

// Définition des associations entre modèles
Commande.hasMany(PreuveLivraison, { foreignKey: 'idCommande' });
PreuveLivraison.belongsTo(Commande, { foreignKey: 'idCommande' });

Utilisateur.hasMany(Commande, { foreignKey: 'idUtilisateur' });
Commande.belongsTo(Utilisateur, { foreignKey: 'idUtilisateur' });
Utilisateur.hasMany(PreuveLivraison, { foreignKey: 'idUtilisateur' });
PreuveLivraison.belongsTo(Utilisateur, { foreignKey: 'idUtilisateur' });

// Export des modèles pour utilisation ailleurs dans le projet
export { sequelize, Commande, PreuveLivraison, Utilisateur }; 