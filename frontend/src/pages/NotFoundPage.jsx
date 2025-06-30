import { AlertTriangle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-4 flex flex-col items-center justify-center min-h-[60vh]">
      <AlertTriangle className="w-12 h-12 text-[#FF6600] mb-4" />
      <h1 className="text-3xl font-bold text-[#FF6600] font-dela mb-2">404</h1>
      <p className="text-gray-700 text-base">Oups, cette page n'existe pas.</p>
    </div>
  );
}

// Page 404 prête pour la version production 