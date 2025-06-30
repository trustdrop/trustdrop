import React, { useState, useEffect } from 'react';
import { Package } from "lucide-react";
// import CommandesTable from '../components/CommandesTable'; // supprimé
import { getCommandes } from '../services/api';

export default function CommandesPage() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('id');
  const [order, setOrder] = useState('asc');
  const [riskScoreMin, setRiskScoreMin] = useState(0);

  const fetchCommandes = async (params = {}) => {
    setLoading(true);
    try {
      const res = await getCommandes(params);
      setCommandes(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommandes({ sortBy, order, riskScoreMin });
  }, [sortBy, order, riskScoreMin]);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-4 font-montserrat">
      <div className="flex items-center gap-2 mb-6">
        <Package className="w-6 h-6 text-[#FF6600]" />
        <h1 className="text-2xl font-dela text-[#FF6600]">Commandes</h1>
      </div>
      <div className="bg-white shadow rounded-xl p-4 overflow-x-auto">
        {loading ? (
          <div className="text-gray-700 text-lg text-center py-8">Chargement des commandes...</div>
        ) : commandes.length === 0 ? (
          <div className="text-gray-700 text-lg text-center py-8">Aucune commande pour l'instant – connectez votre boutique Shopify.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {commandes.map(cmd => (
              <li key={cmd.id} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <span className="font-semibold text-[#FF6600]">#{cmd.id}</span> – {cmd.customer?.first_name} {cmd.customer?.last_name || ''}
                  <span className="ml-2 text-gray-500 text-sm">{new Date(cmd.created_at).toLocaleDateString()}</span>
                </div>
                <div className="text-sm text-gray-700">{cmd.total_price} {cmd.currency}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 