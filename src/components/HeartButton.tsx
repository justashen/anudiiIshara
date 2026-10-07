import { useState, useEffect, useRef } from 'react';
import { API_URL } from '../config';

type FloatingHeart = {
  id: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  color: string;
};

export default function HeartButton() {
  const [count, setCount] = useState(0);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const clickQueue = useRef(0);
  const heartIdCounter = useRef(0);
  
  useEffect(() => {
    fetch(`${API_URL}/hearts`)
      .then(res => res.json())
      .then(data => setCount(data.count))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (clickQueue.current > 0) {
        const clicksToSend = clickQueue.current;
        clickQueue.current = 0;
        
        fetch(`${API_URL}/hearts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clicks: clicksToSend })
        }).catch(console.error);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCount(c => c + 1);
    clickQueue.current += 1;
    
    // Spawn floating heart
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const colors = ['#ef4444', '#ec4899', '#f43f5e', '#e8d5b5'];
    
    const newHeart: FloatingHeart = {
      id: heartIdCounter.current++,
      x: x + (Math.random() * 20 - 10),
      y: y + (Math.random() * 10 - 5),
      scale: 0.5 + Math.random() * 0.8,
      rotation: Math.random() * 60 - 30,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    
    setFloatingHearts(prev => [...prev, newHeart]);
    
    // Remove after animation finishes
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 w-full relative">
      <p className="text-sm font-medium tracking-widest text-rose/70 mb-6 uppercase">Send Blessings</p>
      
      <div className="relative">
        <button 
          onClick={handleClick}
          className="group relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-rose/10 border border-rose/30 shadow-lg backdrop-blur-sm transition-transform active:scale-90 hover:bg-rose/20 cursor-pointer"
        >
          <svg className="w-12 h-12 text-red-500 transform transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
        
        {floatingHearts.map(h => (
          <div 
            key={h.id}
            className="absolute pointer-events-none animate-float-up z-0"
            style={{
              left: h.x - 12, // center the 24px width icon
              top: h.y - 12,
              transform: `scale(${h.scale}) rotate(${h.rotation}deg)`,
              color: h.color,
            }}
          >
            <svg className="w-6 h-6 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        ))}
      </div>
      
      <p className="mt-8 text-3xl font-serif font-bold text-rose">{count.toLocaleString()}</p>
      <p className="text-xs text-rose/50 uppercase tracking-widest mt-2">Hearts Sent</p>
    </div>
  );
}
