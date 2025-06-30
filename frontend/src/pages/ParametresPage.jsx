import React, { useState, useEffect } from 'react';
import { Settings, Trash2 } from "lucide-react";
import { useAuth } from '../context/AuthContext';
import { getUtilisateurs } from '../services/api';

export default function ParametresPage() {
  const { user } = useAuth();
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user && user.role === 'admin') {
      setLoading(true);
      getUtilisateurs()
        .then(res => setUtilisateurs(res.data))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleDelete = (id) => {
    setUtilisateurs(utilisateurs.filter(u => u.id !== id));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-4 font-montserrat">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-6 h-6 text-[#FF6600]" />
        <h1 className="text-2xl font-dela text-[#FF6600]">Paramètres</h1>
      </div>
      <div className="bg-white shadow rounded-xl p-4">
        <div className="mb-4">
          <span className="font-dela text-[#FF6600]">Email :</span> <span className="font-semibold">{user?.email}</span><br />
          <span className="font-dela text-[#FF6600]">Rôle :</span> <span className="font-semibold uppercase">{user?.role}</span>
        </div>
        {user?.role === 'admin' ? (
          <div className="text-gray-700 mt-2">Gestion des utilisateurs en développement.</div>
        ) : (
          <div className="text-gray-700 mt-2">Contactez un administrateur pour toute modification de votre compte.</div>
        )}
      </div>
    </div>
  );
} 