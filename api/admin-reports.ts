import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Validate Session Middleware
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.admin_session;
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod_12345';
  try {
    jwt.verify(token, jwtSecret);
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Initialize Supabase Admin Client
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Server misconfiguration: Missing Supabase Admin Key' });
  }

  // Bypasses Row Level Security (RLS) entirely
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    if (req.method === 'GET') {
      const [reportsData, volunteersData] = await Promise.all([
        supabase.from('reports').select('*, assigned_to:profiles!assigned_to(id, full_name)').order('created_at', { ascending: false }),
        supabase.from('profiles').select('id, full_name, email, role').in('role', ['admin', 'volunteer'])
      ]);
      
      if (reportsData.error) throw reportsData.error;
      
      return res.status(200).json({ 
        reports: reportsData.data || [], 
        volunteers: volunteersData.data || [] 
      });
    }

    if (req.method === 'PUT') {
      const { id, status, resolution_note, assigned_to } = req.body;
      const { error } = await supabase.from('reports').update({
        status, 
        resolution_note: resolution_note || null, 
        assigned_to: assigned_to || null, 
        updated_at: new Date().toISOString()
      }).eq('id', id);
      
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('reports').delete().eq('id', id);
      
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
    
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal API Error' });
  }
}
