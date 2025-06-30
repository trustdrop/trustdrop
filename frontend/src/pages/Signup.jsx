import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup({ setUser }) {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:4000/auth/inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, email, motDePasse }),
      });
      const data = await res.json();
      if (res.ok) {
        // Stocke le token JWT dans le localStorage après inscription
        localStorage.setItem('jwt', data.token);
        setUser(data.utilisateur);
        navigate('/');
      } else {
        setError(data.error || 'Erreur d’inscription');
      }
    } catch {
      setError('Erreur réseau');
    }
  };

  return (
    <form className="max-w-md mx-auto p-4 bg-white rounded shadow mt-8" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold mb-4">Inscription</h2>
      {/* Gestion utilisateur en développement – à brancher sur Shopify plus tard */}
      <input type="text" placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} required className="mb-2 block w-full border p-2 rounded" />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="mb-2 block w-full border p-2 rounded" />
      <input type="password" placeholder="Mot de passe" value={motDePasse} onChange={e => setMotDePasse(e.target.value)} required className="mb-2 block w-full border p-2 rounded" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">S’inscrire</button>
      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
    </form>
  );
} 