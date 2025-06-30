import axios from 'axios';

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
const SCOPES = process.env.SHOPIFY_SCOPES;
const APP_URL = process.env.SHOPIFY_APP_URL;
const REDIRECT_URI = `${APP_URL}/api/shopify-auth-callback`;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { shop } = req.query;
    console.log('[OAuth] /api/shopify-auth appelé avec shop =', shop);
    if (!shop) {
      console.error('[OAuth] /api/shopify-auth : paramètre shop manquant');
      return res.status(400).send('Paramètre shop manquant');
    }
    const installUrl =
      `https://${shop}/admin/oauth/authorize?client_id=${SHOPIFY_API_KEY}` +
      `&scope=${encodeURIComponent(SCOPES)}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&state=randomstring`;
    console.log('[OAuth] Redirection vers Shopify installUrl =', installUrl);
    res.writeHead(302, { Location: installUrl });
    res.end();
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
} 