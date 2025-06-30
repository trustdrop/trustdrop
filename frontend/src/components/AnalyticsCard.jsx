import React from 'react';

export default function AnalyticsCard({ titre, valeur, icone, couleur = 'bg-gray-100' }) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-lg shadow p-4 ${couleur} min-w-[120px]`}>
      {icone && <div className="mb-2 text-3xl">{icone}</div>}
      <div className="text-lg font-bold">{valeur}</div>
      <div className="text-sm text-gray-700 font-semibold mt-1">{titre}</div>
    </div>
  );
} 