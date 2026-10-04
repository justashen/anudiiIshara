import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/login', {
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
    <div className="flex min-h-screen items-center justify-center bg-cream text-rose">
      <form onSubmit={handleLogin} className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-rose/20 bg-white/50 p-8 shadow-lg backdrop-blur-md">
        <h2 className="text-center font-serif text-3xl">Admin Login</h2>
        
        {error && <p className="text-center text-sm text-red-500">{error}</p>}
        
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold uppercase tracking-widest text-rose/80">Email</span>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded border border-rose/20 bg-transparent px-3 py-2 outline-none focus:border-rose/50" 
            required 
          />
        </label>
        
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold uppercase tracking-widest text-rose/80">Password</span>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded border border-rose/20 bg-transparent px-3 py-2 outline-none focus:border-rose/50" 
            required 
          />
        </label>
        
        <button type="submit" className="mt-4 rounded bg-rose px-4 py-2 text-white hover:bg-rose/90">
          Login
        </button>
      </form>
    </div>
  );
}
