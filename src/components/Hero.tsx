import { useState, useRef, useEffect } from 'react'

const a = '/assets'

interface HeroProps {
  introDone: boolean;
  videoFinished: boolean;
  onVideoEnd: () => void;
}

export default function Hero({ introDone, videoFinished, onVideoEnd }: HeroProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (introDone && videoRef.current) {
      videoRef.current.play().catch(e => console.error('Video play error:', e));
    }
  }, [introDone]);


  return (
    <header className="relative flex w-full flex-col items-center justify-center h-[100dvh] px-4 overflow-hidden">
      {/* Background Video */}
      <div className={`absolute inset-0 z-0 overflow-hidden bg-cream transition-transform duration-[3000ms] ease-in-out ${videoFinished ? 'scale-110' : 'scale-100'}`}>
        <img 
          src="/start.jpeg" 
          alt="" 
          className="absolute inset-0 h-full w-full object-cover" 
        />
        <video 
          ref={videoRef}
          src="/video.mp4" 
          poster="/start.jpeg"
          muted 
          playsInline 
          preload="auto"
          onLoadedData={() => setVideoLoaded(true)}
          onEnded={() => {
            onVideoEnd();
            if (videoRef.current) videoRef.current.play().catch(e => console.error(e));
          }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${videoLoaded && introDone ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className={`absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-0 transition-opacity duration-1000 ${!videoFinished ? 'opacity-100' : 'opacity-0'}`} />
        {/* Intro Bottom Gradient (Black) */}
        <div className={`absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-0 transition-opacity duration-1000 ${!videoFinished ? 'opacity-100' : 'opacity-0'}`} />
        {/* Real Web Bottom Gradient (Green/Cream) */}
        <div className={`absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-cream via-cream/80 to-transparent pointer-events-none z-0 transition-opacity duration-1000 ${videoFinished ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      {/* Text Content */}
      <div className={`relative z-10 flex flex-col items-center w-full h-[100dvh] px-4 transition-all duration-1000 ${
        !videoFinished ? 'justify-start pt-36 sm:pt-48' : 'justify-end pb-4 sm:pb-8'
      }`}>
        <p className={`uppercase text-center w-auto text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] transition-all duration-1000 ${
          !videoFinished 
            ? 'opacity-95 font-light tracking-[4px] sm:tracking-[8px] text-[10px] sm:text-[14px] mb-4 sm:mb-8' 
            : 'opacity-0 h-0 m-0 p-0 text-[0px]'
        }`}>
          Wedding Invitation
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
