import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import DashboardPage from './pages/DashboardPage';
import CommandesPage from './pages/CommandesPage';
import StatsPage from './pages/StatsPage';
import ParametresPage from './pages/ParametresPage';
import NotFoundPage from './pages/NotFoundPage';
import SupportPage from './pages/SupportPage';
import { AuthProvider, useAuth } from './context/AuthContext';

// Règle de style : Titres en Dela Gothic One orange, texte en Montserrat

function ProtectedRoute({ children }) {
  const { isConnected } = useAuth();
  if (!isConnected) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex flex-col min-h-screen ml-20 md:ml-64">
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/commandes" element={<ProtectedRoute><CommandesPage /></ProtectedRoute>} />
                <Route path="/stats" element={<ProtectedRoute><StatsPage /></ProtectedRoute>} />
                <Route path="/parametres" element={<ProtectedRoute><ParametresPage /></ProtectedRoute>} />
                <Route path="/support" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
} 