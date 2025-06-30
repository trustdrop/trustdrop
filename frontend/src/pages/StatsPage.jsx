import { BarChart2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import React, { useState, useEffect } from 'react';
import { getStats } from '../services/api';

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleImport = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      const res = await getStats();
      setStats(res.data);
      setSuccess(true);
    } catch (e) {
      setSuccess(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleImport();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-4 font-montserrat">
      <div className="flex items-center gap-2 mb-6">
        <BarChart2 className="w-6 h-6 text-[#FF6600]" />
        <h1 className="text-2xl font-dela text-[#FF6600]">Statistiques</h1>
      </div>
      <div className="mb-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <button
          className="bg-[#FF6600] hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg text-base shadow transition font-dela"
          onClick={handleImport}
          disabled={loading}
        >
          {loading ? 'Rafraîchissement...' : 'Rafraîchir mes stats Shopify'}
        </button>
        {success && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold shadow text-sm animate-fade-in">
            Statistiques mises à jour !
          </div>
        )}
      </div>
      <div className="bg-white shadow rounded-xl p-4 overflow-x-auto flex flex-col items-center justify-center min-h-[40vh]">
        {!stats ? (
          <p className="text-gray-700 text-lg">Chargement des statistiques...</p>
        ) : (
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
                <span className="text-3xl font-dela text-[#FF6600]">{stats.ca} €</span>
                <span className="text-gray-700 text-base mt-1">Chiffre d'affaires</span>
              </div>
              <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
                <span className="text-3xl font-dela text-[#6366f1]">{stats.nbCommandes}</span>
                <span className="text-gray-700 text-base mt-1">Commandes totales</span>
              </div>
              <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
                <span className="text-3xl font-dela text-[#FF6600]">{stats.nbLivrees}</span>
                <span className="text-gray-700 text-base mt-1">Commandes livrées</span>
              </div>
              <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
                <span className="text-3xl font-dela text-[#3b82f6]">{stats.nbPreuves}</span>
                <span className="text-gray-700 text-base mt-1">Preuves fournies</span>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
              <span className="text-2xl font-dela text-[#FF6600]">Taux de litiges : {stats.tauxLitiges}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 