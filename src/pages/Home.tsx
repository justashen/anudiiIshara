import { useParams } from 'react-router-dom'
import Ceremony from '../components/Ceremony'
import Gallery from '../components/Gallery'
import Guestbook from '../components/Guestbook'
import Hero from '../components/Hero'
import Reception from '../components/Reception'
import Schedule from '../components/Schedule'
import Venue from '../components/Venue'
import { useState } from 'react'
import Logo from '../components/Logo'

export default function Home() {
  const { hash } = useParams();
  const [introDone, setIntroDone] = useState(false);

  return (
    <div className={`relative min-h-screen bg-cream text-rose ${!introDone ? 'h-screen overflow-hidden' : 'overflow-hidden'}`}>
      {!introDone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <button 
            onClick={() => setIntroDone(true)}
            className="relative z-10 border border-white/60 bg-black/30 px-8 py-4 text-sm sm:text-lg tracking-[4px] uppercase text-white transition-all hover:bg-white/20 hover:scale-105"
          >
            Open Invitation
          </button>
        </div>
      )}
      <Hero />
      <main className="relative mx-auto flex w-full max-w-[900px] flex-col">
        <div className="relative w-full">
          <div className="pointer-events-none absolute left-1/2 top-0 flex -translate-x-1/2 flex-col items-center opacity-10">
            <img alt="" src="/assets/97b2f.png" className="mt-[100px] h-[2300px] w-[1177px] max-w-none sm:mt-[200px]" />
            <img alt="" src="/assets/97b2f.png" className="mt-[436px] h-[2300px] w-[1177px] max-w-none -scale-100" />
          </div>
          <div className="relative flex flex-col gap-20 pt-[40px] sm:pt-[200px]">
            <Ceremony />
            <Gallery />
            <Reception hash={hash} />
            <Venue />
            <Schedule />
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
    </div>
  )
}
