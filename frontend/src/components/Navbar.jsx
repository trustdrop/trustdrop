import React from 'react';

export default function Navbar() {
  return (
    <div className="flex items-center p-4 bg-white shadow-md w-full">
      <div className="flex items-center space-x-2">
        <img src="https://i.ibb.co/hR4q0FLS/favicon.png" alt="TrustDrop Logo" className="w-8 h-8" />
        <span className="text-xl font-bold text-orange-500">TrustDrop</span>
      </div>
    </div>
  );
} 