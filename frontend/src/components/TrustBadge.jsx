import React from 'react';

/**
 * Affiche un badge/cercle coloré avec le trust score en %
 * @param {number} score - Le trust score (0-100)
 */
export default function TrustBadge({ score }) {
  let color = 'border-green-500 text-green-600 bg-green-50';
  if (score < 50) color = 'border-red-500 text-red-600 bg-red-50';
  else if (score < 80) color = 'border-amber-400 text-amber-500 bg-amber-50';
  return (
    <span
      className={`w-10 h-10 flex items-center justify-center font-bold text-sm rounded-full border-2 ${color} transition-all duration-300 select-none`}
      aria-label={`Trust score : ${score}%`}
      title={`Trust score : ${score}%`}
    >
      {score}%
    </span>
  );
} 