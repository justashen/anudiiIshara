import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Cannot connect to server.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream relative">
      {/* Background Image with Overlay for premium feel */}
      <div className="absolute inset-0 z-0">
        <img src="/start.jpeg" alt="" className="h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80" />
      </div>

      <form onSubmit={handleLogin} className="relative z-10 flex w-full max-w-md flex-col gap-5 rounded-2xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl">
        <h2 className="mb-2 text-center font-serif text-4xl text-white tracking-wide drop-shadow-sm">Admin Login</h2>
        
        {error && <p className="rounded-lg bg-red-500/20 py-2 text-center text-sm font-medium text-red-200 border border-red-500/30">{error}</p>}
        
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 ml-1">Email</span>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-white/30 outline-none backdrop-blur-sm transition-all focus:border-white/40 focus:bg-black/40" 
            placeholder="admin@example.com"
            required 
          />
        </label>
        
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 ml-1">Password</span>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-white/30 outline-none backdrop-blur-sm transition-all focus:border-white/40 focus:bg-black/40" 
            placeholder="••••••••"
            required 
          />
        </label>
        
        <button type="submit" className="mt-4 rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-[1.02] active:scale-95 shadow-lg">
          Sign In
        </button>
      </form>
    </div>
  );
}
