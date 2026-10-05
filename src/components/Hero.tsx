import { useState, useRef, useEffect } from 'react'

const a = '/assets'

interface HeroProps {
  introDone: boolean;
  videoFinished: boolean;
  onVideoEnd: () => void;
}

export default function Hero({ introDone, videoFinished, onVideoEnd }: HeroProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [fading, setFading] = useState(false);
  const [zooming, setZooming] = useState(false);
  const [flashWhite, setFlashWhite] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (introDone && videoRef.current) {
      videoRef.current.play().catch(e => console.error('Video play error:', e));
    }
  }, [introDone]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const { currentTime, duration } = videoRef.current;
    
    if (!videoFinished && duration) {
      if (duration - currentTime < 1.2) setZooming(true);
      if (duration - currentTime < 0.5) setFlashWhite(true);
    }
    
    if (videoFinished) {
      if (flashWhite) setFlashWhite(false);
      if (duration && duration - currentTime < 1.5) {
        setFading(true);
      } else if (currentTime < 1.5) {
        setFading(false);
      }
    }
  };


  return (
    <header className={`relative flex w-full flex-col items-center justify-center px-4 overflow-hidden transition-[height] duration-1000 ${videoFinished ? 'h-[65dvh] sm:h-[100dvh]' : 'h-[100dvh]'}`}>
      {/* Heaven Flash */}
      <div className={`pointer-events-none fixed inset-0 z-[100] bg-white transition-opacity duration-[1000ms] ease-in-out ${flashWhite ? 'opacity-100' : 'opacity-0'}`} />

      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-cream">
        <div className={`absolute inset-0 transition-transform duration-[2000ms] ease-in-out ${zooming || videoFinished ? 'scale-[1.4]' : 'scale-100'}`}>
          <img 
            src="/start.jpeg" 
            alt="" 
            className={`absolute inset-0 h-full w-full object-cover sm:object-center transition-all duration-1000 ${videoFinished ? 'object-bottom' : 'object-center'}`} 
          />
          <video 
            ref={videoRef}
            src="/video.mp4" 
            poster="/start.jpeg"
            muted 
            playsInline 
            preload="auto"
            onLoadedData={() => setVideoLoaded(true)}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => {
              onVideoEnd();
              if (videoRef.current) videoRef.current.play().catch(e => console.error(e));
            }}
            className={`absolute inset-0 h-full w-full object-cover sm:object-center transition-all duration-1000 ${videoFinished ? 'object-bottom' : 'object-center'} ${videoFinished ? 'transition-opacity' : ''} ${videoLoaded && introDone && !fading ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
        <div className={`absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-0 transition-opacity duration-1000 ${!videoFinished ? 'opacity-100' : 'opacity-0'}`} />
        {/* Intro Bottom Gradient (Black) */}
        <div className={`absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-0 transition-opacity duration-1000 ${!videoFinished ? 'opacity-100' : 'opacity-0'}`} />
        {/* Real Web Bottom Gradient (Green/Cream) */}
        <div className={`absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-cream via-cream/80 to-transparent pointer-events-none z-0 transition-opacity duration-1000 ${videoFinished ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      {/* Text Content */}
      <div className={`relative z-10 flex flex-col items-center w-full h-full px-4 transition-all duration-1000 ${
        !videoFinished ? 'justify-start pt-36 sm:pt-48' : 'justify-end pb-0 sm:pb-2'
      }`}>
        <p className={`uppercase text-center w-auto text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] transition-all duration-1000 ${
          !videoFinished 
            ? 'opacity-95 font-light tracking-[4px] sm:tracking-[8px] text-[10px] sm:text-[14px] mb-4 sm:mb-8' 
            : 'opacity-95 font-medium tracking-[2px] sm:tracking-[4px] text-[12px] sm:text-[18px] mb-2 sm:mb-4'
        }`}>
          {!videoFinished ? 'Wedding Invitation' : 'The wedding of'}
        </p>

        <div className="flex flex-row items-center justify-center font-script text-white whitespace-nowrap drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
          <span className="text-[60px] sm:text-[90px] md:text-[120px] leading-[0.85]">Anudi</span>
          <span className="mx-2 sm:mx-6 text-[40px] sm:text-[65px] md:text-[85px] leading-[1] opacity-90">&amp;</span>
          <span className="text-[60px] sm:text-[90px] md:text-[120px] leading-[0.85]">Ishara</span>
        </div>
      </div>
    </header>
  )
}
