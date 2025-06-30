import React from 'react';

export default function PreuveLivraison({ preuve, onClose }) {
  if (!preuve) return null;
  const isVideo = preuve.imageUrl && (preuve.imageUrl.endsWith('.mp4') || preuve.imageUrl.includes('video'));
  const googleMapsUrl = `https://www.google.com/maps?q=${preuve.latitude},${preuve.longitude}`;

  // Ce composant est prêt à afficher une preuve réelle issue de Shopify

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">✕</button>
        <h2 className="text-lg font-bold mb-2">Preuve de livraison</h2>
        {/* Affichage image ou vidéo */}
        {isVideo ? (
          <video src={preuve.imageUrl} controls className="w-full h-48 object-cover rounded mb-2" />
        ) : (
          <img src={preuve.imageUrl} alt="preuve" className="w-full h-48 object-cover rounded mb-2" />
        )}
        <div className="text-sm text-gray-700 mb-1">
          GPS : <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{preuve.latitude}, {preuve.longitude}</a>
        </div>
        <div className="text-xs text-gray-500 mb-1">Horodatage : {new Date(preuve.horodatage).toLocaleString()}</div>
        <div className="text-xs text-gray-500">Prise par : {preuve.prisePar}</div>
      </div>
    </div>
  );
} 