import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Loader2, Lock } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Success, route to secure area
      navigate('/secret-admin-belauri');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="glass-card p-10 w-full max-w-md relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl"></div>
        
        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Lock className="w-8 h-8 text-primary-500" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight uppercase">Admin Login</h1>
          <p className="text-slate-500 text-sm mt-2">Secure access strictly prohibited to authorized personnel.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm font-medium flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Username</label>
            <input 
              type="text" 
              required
              className="input-field bg-white/5 border-white/10" 
              value={username} onChange={e => setUsername(e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
            <input 
              type="password" 
              required
              className="input-field bg-white/5 border-white/10" 
              value={password} onChange={e => setPassword(e.target.value)} 
            />
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 mt-4 mt-8">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authenticate'}
          </button>
        </form>
      </div>
    </div>
  );
}
