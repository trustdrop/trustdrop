import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// Création du contexte Auth
const AuthContext = createContext();

// Hook pour utiliser le contexte plus facilement
export function useAuth() {
  return useContext(AuthContext);
}

// Provider global
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, email, role }
  const [token, setToken] = useState(null);
  const [shopifyToken, setShopifyToken] = useState(() => localStorage.getItem('shopifyToken'));
  const [isConnected, setIsConnected] = useState(!!localStorage.getItem('shopifyToken'));

  // Au chargement, vérifie si un token est présent
  useEffect(() => {
    const storedToken = localStorage.getItem('jwt');
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setUser({ id: decoded.id, email: decoded.email, role: decoded.role });
        setToken(storedToken);
      } catch {
        setUser(null);
        setToken(null);
      }
    }
    // Vérifie la connexion Shopify
    const shopify = localStorage.getItem('shopifyToken');
    setShopifyToken(shopify);
    setIsConnected(!!shopify);
  }, []);

  // Login : stocke le token et l'utilisateur
  const login = (jwt) => {
    localStorage.setItem('jwt', jwt);
    const decoded = jwtDecode(jwt);
    setUser({ id: decoded.id, email: decoded.email, role: decoded.role });
    setToken(jwt);
  };

  // Logout : supprime le token et l'utilisateur
  const logout = () => {
    localStorage.removeItem('jwt');
    setUser(null);
    setToken(null);
  };

  // Connexion Shopify réelle : redirige vers le backend pour OAuth
  const connectShopify = (shop = '') => {
    // On construit l'URL du backend (VITE_BACKEND_URL doit être défini dans le .env du frontend)
    // Exemple : VITE_BACKEND_URL=https://api.trustdrop.io
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    // On demande le nom de la boutique si non fourni
    let shopDomain = shop;
    if (!shopDomain) {
      shopDomain = prompt('Entrez le nom de votre boutique Shopify (ex: monshop.myshopify.com) :');
      if (!shopDomain) return;
    }
    // Redirige le navigateur vers l'auth backend
    window.location.href = `${backendUrl}/shopify/auth?shop=${encodeURIComponent(shopDomain)}`;
  };

  // Déconnexion Shopify
  const disconnectShopify = () => {
    localStorage.removeItem('shopifyToken');
    setShopifyToken(null);
    setIsConnected(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user, shopifyToken, isConnected, connectShopify, disconnectShopify }}>
      {children}
    </AuthContext.Provider>
  );
} 