import { serialize } from 'cookie';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict' as const,
    maxAge: -1, // Expire immediately
    path: '/',
  };
  
  const tokenCookie = serialize('admin_session', '', cookieOptions);
  
  res.setHeader('Set-Cookie', tokenCookie);
  return res.status(200).json({ success: true });
}
