import React, { useRef, useState } from 'react';
import axios from 'axios';
import { UploadCloud, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MAX_SIZE = 10 * 1024 * 1024; // 10 Mo
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'video/mp4'];

function getBadgeColor(score) {
  if (score < 30) return 'bg-green-100 text-green-700';
  if (score < 70) return 'bg-orange-100 text-orange-700';
  return 'bg-red-100 text-red-700';
}

export default function PreuveUpload({ idCommande }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [commentaire, setCommentaire] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [riskScore, setRiskScore] = useState(null);
  const inputRef = useRef();

  // Validation côté client
  const validateFile = (f) => {
    if (!f) return 'Aucun fichier sélectionné.';
    if (!ALLOWED_TYPES.includes(f.type)) return 'Type de fichier non autorisé (PNG, JPEG, MP4 uniquement).';
    if (f.size > MAX_SIZE) return 'Fichier trop volumineux (max 10 Mo).';
    return '';
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    const err = validateFile(f);
    setError(err);
    setFile(err ? null : f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setRiskScore(null); setProgress(0);
    if (!file) return setError('Veuillez sélectionner un fichier.');
    const err = validateFile(file);
    if (err) return setError(err);
    const formData = new FormData();
    formData.append('fichier', file);
    formData.append('idCommande', idCommande);
    formData.append('commentaire', commentaire);
    formData.append('prisePar', user?.email || '');
    try {
      const res = await axios.post('/preuve', formData, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` },
        onUploadProgress: (p) => setProgress(Math.round((p.loaded * 100) / p.total)),
      });
      setSuccess('Preuve déposée avec succès !');
      setRiskScore(res.data.riskScore);
      setFile(null); setCommentaire('');
      if (inputRef.current) inputRef.current.value = '';
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l’upload.');
    }
  };

  return (
    <div className="font-montserrat">
      <button
        className="flex items-center gap-2 bg-[#FF6600] hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow transition text-base"
        onClick={() => setOpen(o => !o)}
      >
        <UploadCloud className="w-5 h-5" />
        Déposer une preuve
      </button>
      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30">
          <form className="bg-white rounded-xl shadow p-6 w-full max-w-md relative flex flex-col gap-4" onSubmit={handleSubmit}>
            <button type="button" className="absolute top-3 right-3 text-gray-400 hover:text-gray-700" onClick={() => setOpen(false)}>
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-dela text-[#FF6600] mb-2 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-[#FF6600]" /> Déposer une preuve
            </h2>
            <input
              type="file"
              accept="image/png,image/jpeg,video/mp4"
              onChange={handleFileChange}
              ref={inputRef}
              className="border border-gray-300 rounded-lg px-3 py-2 text-base"
              required
            />
            <textarea
              placeholder="Commentaire (optionnel)"
              value={commentaire}
              onChange={e => setCommentaire(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-base resize-none"
              rows={2}
            />
            {progress > 0 && progress < 100 && (
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-[#FF6600] h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            )}
            {riskScore !== null && (
              <div className={`inline-block px-3 py-1 rounded-full font-bold text-sm ${getBadgeColor(riskScore)}`}>RiskScore : {riskScore}</div>
            )}
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            {success && <div className="text-green-600 text-sm text-center">{success}</div>}
            <button
              type="submit"
              className="w-full bg-[#FF6600] hover:bg-orange-600 text-white py-2 px-4 rounded-lg shadow transition text-base mt-2"
            >
              Envoyer la preuve
            </button>
          </form>
        </div>
      )}
    </div>
  );
} 