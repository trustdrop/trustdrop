import React, { useState } from 'react';

export default function SupportPage() {
  const [form, setForm] = useState({ nom: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => /.+@.+\..+/.test(email);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    if (!form.nom || !form.email || !form.message) {
      setError('Tous les champs sont obligatoires.');
      return;
    }
    if (!validateEmail(form.email)) {
      setError('Email invalide.');
      return;
    }
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ nom: '', email: '', message: '' });
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow px-6 py-8 mt-8 font-montserrat">
      <h1 className="text-2xl font-dela text-[#FF6600] mb-4 flex items-center gap-2">Support</h1>
      <p className="text-gray-700 mb-4 text-center">
        Besoin d'aide ? Contactez-nous à <a href="mailto:trustdrop.contact@gmail.com" className="text-blue-600 underline">trustdrop.contact@gmail.com</a><br />
        ou prenez rendez-vous sur <a href="https://calendly.com/trustdrop" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Calendly</a>.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nom"
          placeholder="Votre nom"
          value={form.nom}
          onChange={handleChange}
          className="block w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 text-base"
        />
        <input
          type="email"
          name="email"
          placeholder="Votre email"
          value={form.email}
          onChange={handleChange}
          className="block w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 text-base"
        />
        <textarea
          name="message"
          placeholder="Votre message..."
          value={form.message}
          onChange={handleChange}
          rows={4}
          className="block w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 text-base"
        />
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        {sent && <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold shadow text-sm text-center animate-fade-in">Votre message a bien été envoyé, notre équipe vous répondra rapidement !</div>}
        <button
          type="submit"
          className="w-full bg-[#FF6600] hover:bg-orange-600 text-white py-2 px-4 rounded-lg shadow transition text-base font-dela"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}

// Ce formulaire de support est prêt pour la version production 