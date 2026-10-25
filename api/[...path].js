import app from '../server/server.js';

export default function handler(req, res) {
  // Vercel catch-all functions may pass the path with or without the /api prefix.
  if (req.url && !req.url.startsWith('/api/')) {
    req.url = `/api${req.url.startsWith('/') ? req.url : `/${req.url}`}`;
  }
  return app(req, res);
}
