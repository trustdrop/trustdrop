import React, { useState, useEffect } from 'react';
import { Image } from "lucide-react";
import { getPreuves } from '../services/api';
import PreuvesTable from '../components/PreuvesTable';

export default function PreuvesPage() {
  const [preuves, setPreuves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('id');
  const [order, setOrder] = useState('asc');
  const [riskScoreMin, setRiskScoreMin] = useState(0);

  const fetchPreuves = async (params = {}) => {
    setLoading(true);
    try {
      const res = await getPreuves(params);
      setPreuves(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreuves({ sortBy, order, riskScoreMin });
  }, [sortBy, order, riskScoreMin]);

  const handleSort = (col) => {
    if (sortBy === col) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setOrder('asc');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-4 font-montserrat">
      <div className="flex items-center gap-2 mb-6">
        <Image className="w-6 h-6 text-[#FF6600]" />
        <h1 className="text-2xl font-dela text-[#FF6600]">Preuves de Livraison</h1>
      </div>
      <div className="mb-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <label htmlFor="riskScoreMin" className="font-semibold text-gray-700">Score de risque min :</label>
          <input
            id="riskScoreMin"
            type="number"
            min={0}
            max={100}
            value={riskScoreMin}
            onChange={e => setRiskScoreMin(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-1 w-20 focus:outline-none focus:ring-2 focus:ring-orange-200 text-base"
          />
        </div>
      </div>
      <div className="bg-white shadow rounded-xl p-4 overflow-x-auto">
        {loading ? (
          <div className="text-gray-700 text-lg text-center py-8">Chargement des preuves...</div>
        ) : preuves.length === 0 ? (
          <div className="text-gray-700 text-lg text-center py-8">Aucune preuve pour l'instant – connectez votre boutique Shopify.</div>
        ) : (
          <PreuvesTable
            preuves={preuves}
            loading={loading}
            sortBy={sortBy}
            order={order}
            onSort={handleSort}
          />
        )}
      </div>
    </div>
  );
} 