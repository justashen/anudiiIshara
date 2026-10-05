import { useState } from 'react'

const a = '/assets'

export default function Hero() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  return (
    <header className="relative flex w-full flex-col items-center justify-center h-[100dvh] px-4">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-cream">
        <img 
          src="/start.jpeg" 
          alt="" 
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${videoLoaded ? 'opacity-0' : 'opacity-100'}`} 
        />
        <video 
          src="/video.mp4" 
          poster="/start.jpeg"
          autoPlay 
          loop 
          muted 
          playsInline 
          onLoadedData={() => setVideoLoaded(true)}
          className={`h-full w-full object-cover transition-opacity duration-700 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-0" />
      </div>

      {/* Text Content */}
      <div className="relative z-10 flex flex-col items-center justify-end w-full h-[100dvh] pb-12 sm:pb-20 px-4">
        <p className="text-[12px] sm:text-[18px] md:text-[22px] uppercase tracking-[4px] sm:tracking-[8px] opacity-90 text-center w-auto drop-shadow-md font-medium text-white mb-2 sm:mb-4">
          The wedding of
        </p>

        <div className="flex flex-row items-center justify-center font-script drop-shadow-lg text-white whitespace-nowrap">
          <span className="text-[60px] sm:text-[90px] md:text-[120px] leading-[0.85]">Anudi</span>
          <span className="mx-2 sm:mx-6 text-[40px] sm:text-[65px] md:text-[85px] leading-[1] opacity-90">&amp;</span>
          <span className="text-[60px] sm:text-[90px] md:text-[120px] leading-[0.85]">Ishara</span>
        </div>
      </div>
    </header>
  )
}
