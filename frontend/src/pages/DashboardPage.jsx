import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Plus, LayoutDashboard } from 'lucide-react';
import TrustBadge from '../components/TrustBadge';
import PreuveUpload from '../components/PreuveUpload';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats } from '../services/api';

const COLORS = ['#FF6600', '#6366f1', '#3b82f6', '#3b3b3b'];

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const { isConnected, connectShopify } = useAuth();

  useEffect(() => {
    getDashboardStats().then(res => setStats(res.data));
  }, []);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-montserrat">
        <h1 className="text-3xl font-dela text-[#FF6600] mb-6 flex items-center gap-2">
          <span className="text-[#FF6600]">●</span> Connectez votre boutique Shopify
        </h1>
        <button
          className="bg-[#FF6600] hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg text-lg shadow transition"
          onClick={() => connectShopify()}
        >
          Connecter votre boutique Shopify
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 font-montserrat flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-dela text-[#FF6600] mb-4">Dashboard</h1>
        <p className="text-gray-700 text-lg">Aucune donnée pour l'instant – connectez votre boutique Shopify.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 space-y-8 font-montserrat">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-[#FF6600]" />
          <h1 className="text-2xl font-dela text-[#FF6600]">Dashboard</h1>
        </div>
        <PreuveUpload idCommande={1} />
      </div>
      <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center justify-center min-h-[30vh]">
        <p className="text-gray-700 text-lg">Statistiques et indicateurs à venir dès connexion à Shopify.</p>
      </div>
    </div>
  );
} 