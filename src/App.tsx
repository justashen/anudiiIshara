import Ceremony from './components/Ceremony'
import Gallery from './components/Gallery'
import Guestbook from './components/Guestbook'
import Hero from './components/Hero'
import Reception from './components/Reception'
import Schedule from './components/Schedule'
import Venue from './components/Venue'

export default function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-cream text-rose">
      <main className="relative mx-auto flex w-full max-w-[900px] flex-col">
        <Hero />
        <div className="relative w-full">
          <div className="pointer-events-none absolute left-1/2 top-0 flex -translate-x-1/2 flex-col items-center opacity-10">
            <img alt="" src="/assets/97b2f.png" className="mt-[100px] h-[2300px] w-[1177px] max-w-none sm:mt-[200px]" />
            <img alt="" src="/assets/97b2f.png" className="mt-[436px] h-[2300px] w-[1177px] max-w-none -scale-100" />
          </div>
          <div className="relative flex flex-col gap-20 pt-[100px] sm:pt-[200px]">
            <Ceremony />
            <Gallery />
            <Reception />
            <Venue />
            <Schedule />
            <Guestbook />
          </div>
          <footer className="relative px-10 pb-20 pt-20 text-center text-lg">
            Your presence would be the greatest gift we could receive!
          </footer>
          <p className="relative pb-2 text-center text-xs opacity-50">♡ chungdoi.com</p>
        </div>
      </main>
    </div>
  )
}
