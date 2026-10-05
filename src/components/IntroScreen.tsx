import { useState, useRef } from 'react';

export default function IntroScreen({ onComplete }: { onComplete: () => void }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleOpen = () => {
    setPlaying(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Fallback if video fails to play
        onComplete();
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream">
      {!playing && (
        <>
          <img src="/start.jpeg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <video
            src="/video.mp4"
            poster="/start.jpeg"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <button 
            onClick={handleOpen}
            className="relative z-10 border border-white/60 bg-black/30 px-8 py-4 text-sm sm:text-lg tracking-[4px] uppercase text-white transition-all hover:bg-white/20 hover:scale-105"
          >
            Open Invitation
          </button>
        </>
      )}
      <video
        ref={videoRef}
        src="/video.mp4"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${playing ? 'opacity-100' : 'opacity-0'}`}
        onEnded={onComplete}
        playsInline
        muted
      />
    </div>
  );
}
