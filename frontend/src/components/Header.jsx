import React from 'react';

export default function Header() {
  return (
    <header className="sticky top-0 left-0 w-full h-16 bg-white shadow flex items-center justify-between px-6 z-10">
      <div className="flex items-center space-x-2">
        <img src="https://i.ibb.co/hR4q0FLS/favicon.png" alt="TrustDrop Logo" className="w-8 h-8" />
        <span className="text-xl font-bold text-orange-500">TrustDrop</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-gray-700 font-medium hidden sm:inline">Bonjour, Alice</span>
        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="avatar" className="w-10 h-10 rounded-full border-2 border-primary shadow-sm" />
      </div>
    </header>
  );
} 