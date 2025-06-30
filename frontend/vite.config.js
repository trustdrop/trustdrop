import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Chargement automatique des variables d'environnement Vite (.env, .env.production, etc.)
export default defineConfig(({ mode }) => {
  // Charge les variables d'env selon le mode (dev, production...)
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return {
    plugins: [react()],
    define: {
      'process.env': {},
    },
  };
});
// Les variables VITE_BACKEND_URL seront injectées automatiquement par Vercel lors du build 