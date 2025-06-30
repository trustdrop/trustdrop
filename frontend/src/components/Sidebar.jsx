import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PackageCheck, BarChart3, Settings } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
  { to: '/commandes', label: 'Commandes', icon: <PackageCheck /> },
  { to: '/stats', label: 'Stats', icon: <BarChart3 /> },
  { to: '/parametres', label: 'Paramètres', icon: <Settings /> },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  return (
    <>
      {/* Sidebar responsive : bouton toggle sur mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 bg-white rounded-full shadow p-2 border border-gray-200"
        onClick={() => setOpen(!open)}
        aria-label="Ouvrir/fermer le menu"
      >
        <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      <aside className={`fixed top-0 left-0 h-full bg-white shadow-lg flex flex-col items-center py-6 z-20 transition-all duration-200 w-64 md:w-56 ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        {/* Logo TrustDrop */}
        <div className="mb-10 flex items-center gap-2">
          <img src="https://i.ibb.co/hR4q0FLS/favicon.png" alt="TrustDrop Logo" className="w-10 h-10" />
          <span className="hidden md:inline text-xl text-orange-500" style={{ fontFamily: 'Dela Gothic One, sans-serif' }}>TrustDrop</span>
        </div>
        <nav className="flex-1 w-full">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-gray-900 hover:bg-orange-100 hover:text-orange-500 transition font-sans text-base ${isActive ? 'bg-orange-100 text-orange-500 font-bold' : ''}`
                  }
                  style={{ fontFamily: 'inherit' }}
                >
                  <span className="w-7 h-7 flex items-center justify-center text-gray-600 group-hover:text-orange-500 transition">
                    {item.icon}
                  </span>
                  <span className="hidden md:inline">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {/* Overlay mobile */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-10 z-10 md:hidden" onClick={() => setOpen(false)} />
      )}
    </>
  );
} 