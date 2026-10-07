import { useParams } from 'react-router-dom'
import Ceremony from '../components/Ceremony'
import Gallery from '../components/Gallery'
import Guestbook from '../components/Guestbook'
import Hero from '../components/Hero'
import Reception from '../components/Reception'
import Schedule from '../components/Schedule'
import HeartButton from '../components/HeartButton'
import Venue from '../components/Venue'
import { useState, useRef, useEffect } from 'react'
import Logo from '../components/Logo'

export default function Home() {
  const { hash } = useParams();
  const [introDone, setIntroDone] = useState(false);
  const [videoFinished, setVideoFinished] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleOpen = () => {
    setIntroDone(true);
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => console.error("Audio play failed:", e));
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(e => console.error(e));
      }
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isPlaying && audioRef.current) {
          audioRef.current.pause();
        }
      } else {
        if (isPlaying && audioRef.current) {
          audioRef.current.play().catch(e => console.error("Resume failed:", e));
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isPlaying]);

  useEffect(() => {
    if (!videoFinished) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [videoFinished]);

  return (
    <div className={`relative min-h-screen bg-cream text-rose ${!videoFinished ? 'h-[100dvh] overflow-hidden' : 'overflow-clip'}`}>
      <audio ref={audioRef} src="/Ed Sheeran - Perfect.mp3" loop preload="auto" />
      <div 
        className={`fixed inset-0 z-50 flex flex-col items-center justify-end pb-24 sm:pb-32 transition-opacity duration-1000 ${
          videoFinished ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <button 
          onClick={!introDone ? handleOpen : undefined}
          className={`relative z-10 flex items-center justify-center rounded-full backdrop-blur-md px-10 py-4 text-[10px] sm:text-xs font-medium tracking-[2px] sm:tracking-[4px] uppercase transition-all duration-1000 ${
            !introDone 
              ? 'bg-white/95 text-black/90 shadow-[0_4px_20px_rgba(255,255,255,0.2)] border border-white/50 hover:bg-white hover:shadow-[0_4px_30px_rgba(255,255,255,0.4)] cursor-pointer scale-100' 
              : 'bg-black/30 text-white/90 border border-white/20 cursor-default scale-95'
          }`}
        >
          {!introDone ? 'Open Invitation' : 'Playing...'}
        </button>
      </div>
      <Hero 
        introDone={introDone} 
        videoFinished={videoFinished} 
        onVideoEnd={() => {
          if (!videoFinished) {
            setVideoFinished(true);
            setTimeout(() => {
              if (window.innerWidth >= 640) {
                window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }, 100);
          }
        }} 
      />
      <main className="relative mx-auto flex w-full max-w-[900px] flex-col">
        <div className="relative w-full">
          <div className="pointer-events-none absolute left-1/2 top-0 flex -translate-x-1/2 flex-col items-center opacity-10">
            <img alt="" src="/assets/97b2f.png" className="mt-[100px] h-[2300px] w-[1177px] max-w-none sm:mt-[200px]" />
            <img alt="" src="/assets/97b2f.png" className="mt-[436px] h-[2300px] w-[1177px] max-w-none -scale-100" />
          </div>
          <div className="relative flex flex-col gap-20 pt-4 sm:pt-8">
            <Ceremony />
            <Gallery />
            <Reception hash={hash} />
            <Venue />
            <Schedule />
            <HeartButton />
            <Guestbook hash={hash} />
          </div>
          <footer className="relative px-10 pb-20 pt-20 text-center text-lg">
            Your love and support mean the world to us as we begin this new chapter!
          </footer>
          <div className="relative pb-4 flex flex-col items-center gap-3 w-full">
            <a href="https://durowave.co" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <Logo />
            </a>
            <p className="text-xs font-medium text-rose/60">
              &copy; {new Date().getFullYear()} All Rights Reserved. +94 75 582 5678
            </p>
          </div>
        </div>
      </main>

      {videoFinished && (
        <button 
          onClick={toggleAudio}
          className="fixed top-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-black/20 border border-white/30 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-black/40"
          aria-label="Toggle audio"
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
          )}
        </button>
      )}
    </div>
  )
}
