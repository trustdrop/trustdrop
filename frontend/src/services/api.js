import axiosInstance from '../api';

// Récupère les commandes réelles du marchand via Shopify
export const getCommandes = () => axiosInstance.get('/commande');
export const getCommande = (id) => axiosInstance.get(`/commande/${id}`);
export const postCommande = (data) => axiosInstance.post('/commande', data);

// Récupère les preuves réelles (non implémenté)
export const getPreuves = () => axiosInstance.get('/preuve');

// Envoie une preuve réelle
export const postPreuve = (data) => axiosInstance.post('/preuve', data);

// Récupère les stats (en développement)
export const getStats = () => axiosInstance.get('/stats');

// Authentification Shopify (OAuth)
export const connectShopify = (shop) => axiosInstance.get(`/shopify/auth?shop=${shop}`);

// TODO: Ajouter d'autres appels réels selon les besoins

export const getDashboardStats = () => axiosInstance.get('/stats');
export const getUtilisateurs = () => axiosInstance.get('/utilisateur'); 