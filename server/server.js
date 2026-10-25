import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pg from 'pg';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { Pool } = pg;
const app = express();
const port = Number(process.env.PORT || 3000);
const here = path.dirname(fileURLToPath(import.meta.url));
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: true } : undefined });
const allowedRoles = new Set(['channel_partner', 'college', 'worker', 'business', 'customer']);

export function isValidSignup({ role, name, phone, email, city, details, consent }) {
  return allowedRoles.has(role)
    && typeof name === 'string' && name.trim().length >= 2 && name.length <= 120
    && typeof phone === 'string' && phone.trim().length >= 7 && phone.length <= 30
    && typeof city === 'string' && city.trim().length >= 2 && city.length <= 100
    && (!email || (typeof email === 'string' && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))
    && (!details || (typeof details === 'string' && details.length <= 2000))
    && consent === true;
}

app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '12kb' }));
app.use('/api/signups', rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false }));
if (!process.env.VERCEL) app.use(express.static(path.join(here, '..', 'public')));

app.get('/', (_req, res) => res.redirect('/index.html'));

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch {
    res.status(503).json({ status: 'unavailable' });
  }
});

app.post('/api/signups', async (req, res) => {
  const { role, name, phone, email, city, details, consent } = req.body ?? {};
  if (!isValidSignup({ role, name, phone, email, city, details, consent })) {
    return res.status(400).json({ error: 'Please check your details and consent, then try again.' });
  }
  try {
    await pool.query(
      `INSERT INTO signups (role, full_name, phone, email, city, details, consent_at)
       VALUES ($1, $2, $3, $4, $5, $6, now())`,
      [role, name.trim(), phone.trim(), email?.trim() || null, city.trim(), details?.trim() || null],
    );
    return res.status(201).json({ message: 'Signup received' });
  } catch (error) {
    console.error('Signup could not be saved', error);
    return res.status(500).json({ error: 'We could not save your details right now. Please try again later.' });
  }
});

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun && !process.env.VERCEL) app.listen(port, () => console.log(`OnePlace is available at http://localhost:${port}`));

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, async () => {
    await pool.end();
    process.exit(0);
  });
}

export default app;
