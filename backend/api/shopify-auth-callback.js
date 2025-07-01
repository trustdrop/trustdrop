import axios from 'axios';

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET;
const APP_URL = process.env.SHOPIFY_APP_URL;

// TODO : changer SHOPIFY_APP_URL pour https://trustdrop.io lors du passage en prod

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { shop, code, state } = req.query;
    console.log('[OAuth] /api/shopify-auth-callback appelé avec shop =', shop, 'code =', code);
    if (!shop || !code) {
      console.error('[OAuth] /api/shopify-auth-callback : paramètres manquants');
      return res.status(400).send('Paramètres manquants');
    }
    try {
      // Échange du code contre un access_token
      const tokenRes = await axios.post(`https://${shop}/admin/oauth/access_token`, {
        client_id: SHOPIFY_API_KEY,
        client_secret: SHOPIFY_API_SECRET,
        code,
      });
      const accessToken = tokenRes.data.access_token;
      // Ici, on ne peut pas stocker en session (stateless). On retourne le token au frontend (à stocker côté client)
      // Redirige vers le frontend avec le token en query (à sécuriser en prod)
      const redirectUrl = `${APP_URL}/dashboard?shopifyToken=${accessToken}&shop=${shop}`;
      console.log('[OAuth] Redirection finale vers', redirectUrl);
      res.writeHead(302, { Location: redirectUrl });
      res.end();
    } catch (err) {
      console.error('[OAuth] Erreur lors de l\'échange du code contre le token Shopify:', err.response?.data || err.message);
      res.status(500).send('Erreur OAuth Shopify: ' + (err.response?.data?.error_description || err.message));
    }
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
} 