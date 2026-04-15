import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { username, password } = req.body;
  
  const validUser = process.env.ADMIN_USER;
  const validPass = process.env.ADMIN_PASS;
  const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod_12345';

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  if (username === validUser && password === validPass) {
    // Generate secure token
    const token = jwt.sign({ admin: true, username }, jwtSecret, { expiresIn: '12h' });
    
    // Set HTTPOnly cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // HTTPS in production
      sameSite: 'strict' as const,
      maxAge: 60 * 60 * 12, // 12 hours
      path: '/',
    };
    
    const tokenCookie = serialize('admin_session', token, cookieOptions);
    
    res.setHeader('Set-Cookie', tokenCookie);
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
}
