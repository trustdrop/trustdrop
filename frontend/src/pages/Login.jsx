import React, { useState } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // TODO: Brancher l'authentification sur Shopify OAuth pour la version production

  // Déconnexion mock : supprime le token
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    window.location.reload();
  };

  // Soumission du formulaire de login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/auth/login', { email, motDePasse });
      localStorage.setItem('jwt', res.data.token);
      // Décodage du token pour extraire le rôle (optionnel, pour debug)
      const decoded = jwt_decode(res.data.token);
      // Redirection vers le dashboard
      navigate('/dashboard');
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    }
  };

  const isLoggedIn = !!localStorage.getItem('jwt');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-montserrat">
      <form className="max-w-md w-full p-6 bg-white rounded-xl shadow" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-dela text-[#FF6600] mb-6 text-center flex items-center justify-center gap-2">
          Connexion
        </h2>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="mb-3 block w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 text-base" />
        <input type="password" placeholder="Mot de passe" value={motDePasse} onChange={e => setMotDePasse(e.target.value)} required className="mb-3 block w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 text-base" />
        <button type="submit" className="w-full bg-[#FF6600] hover:bg-orange-600 text-white py-2 px-4 rounded-lg shadow transition text-base mb-2">
          Se connecter
        </button>
        {error && <div className="mt-2 text-sm text-red-600 text-center">{error}</div>}
        {isLoggedIn && (
          <button type="button" onClick={handleLogout} className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow transition text-base">
            Se déconnecter
          </button>
        )}
      </form>
    </div>
  );
} 