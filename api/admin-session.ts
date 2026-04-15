import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const cookies = parse(req.headers.cookie || '');
  const token = cookies.admin_session;

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod_12345';

  try {
    jwt.verify(token, jwtSecret);
    return res.status(200).json({ authenticated: true });
  } catch (error) {
    return res.status(401).json({ authenticated: false });
  }
}
