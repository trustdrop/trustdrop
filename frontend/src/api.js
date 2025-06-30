import axios from 'axios';

// Utilisation de import.meta.env pour Vite (process.env n'est pas supporté par défaut)
// Voir : https://vitejs.dev/guide/env-and-mode.html
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Création d'une instance Axios
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Intercepteur pour ajouter automatiquement le token JWT dans le header Authorization
// Ajoute le header Authorization: Bearer TOKEN à chaque requête API si le token existe dans localStorage
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs 401 globalement
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Affiche un message d'erreur si le token est invalide ou expiré
      alert('Veuillez vous reconnecter');
      localStorage.removeItem('jwt'); // Optionnel : déconnexion automatique
    }
    return Promise.reject(error);
  }
);

// Utilisation de l'instance pour tous les appels API
export const getCommandes = () => axiosInstance.get('/commande');
export const getCommande = (id) => axiosInstance.get(`/commande/${id}`);
export const postCommande = (data) => axiosInstance.post('/commande', data);
export const postPreuve = (data) => axiosInstance.post('/preuve', data);

export default axiosInstance; 