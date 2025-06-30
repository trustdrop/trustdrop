import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Ajout de 'process.env': {} pour éviter les erreurs avec certains packages
// qui attendent process côté client (Node), alors qu'il n'existe pas dans le navigateur
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
  },
}); 