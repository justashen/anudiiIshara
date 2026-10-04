import { useState, useEffect } from 'react'

const a = '/assets'
const ChevL = `${a}/8b149.svg`
const ChevR = `${a}/2d14c.svg`

const photos = [
  { src: `${a}/5ddaf.png` },
  { src: `${a}/dae4b.png` },
  { src: `${a}/85b40.png` },
]

export default function Gallery() {
  const [i, setI] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  
  const go = (d: number) => setI((prev) => (prev + d + photos.length) % photos.length)

  useEffect(() => {
    if (isHovered) return
    const timer = setInterval(() => {
      go(1)
    }, 4000)
    return () => clearInterval(timer)
  }, [isHovered])
  
  return (
    <section className="flex w-full flex-col items-center py-10 sm:py-16">
      <h2 className="mb-6 sm:mb-10 text-sm sm:text-base font-medium tracking-[0.1em] text-rose/80 uppercase">Memories</h2>
      <div className="w-full max-w-5xl px-4 sm:px-8 lg:px-12">
        <div 
          className="group relative h-[55vh] min-h-[350px] max-h-[600px] w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl ring-1 ring-black/5 bg-black/5"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Images container */}
          <div 
            className="flex h-full w-full transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${i * 100}%)` }}
          >
            {photos.map((p, idx) => (
              <div key={idx} className="relative h-full min-w-full flex-[0_0_100%] shrink-0">
                {/* Image */}
                <img
                  alt={`Wedding photo ${idx + 1}`}
                  src={p.src}
                  className="h-full w-full object-cover"
                />
                {/* Gradient overlay for better button visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none opacity-60" />
              </div>
            ))}
          </div>
          
          {/* Previous button */}
          <button
            aria-label="Previous photo"
            onClick={() => go(-1)}
            className="absolute left-3 sm:left-6 top-1/2 z-20 flex size-10 sm:size-12 -translate-y-1/2 items-center justify-center rounded-full bg-rose/80 text-white backdrop-blur-md transition-all duration-300 hover:bg-rose hover:scale-110 sm:opacity-0 sm:group-hover:opacity-100 shadow-lg border border-white/20"
          >
            <img alt="" src={ChevL} className="size-4 sm:size-5 brightness-0 invert" />
          </button>
          
          {/* Next button */}
          <button
            aria-label="Next photo"
            onClick={() => go(1)}
            className="absolute right-3 sm:right-6 top-1/2 z-20 flex size-10 sm:size-12 -translate-y-1/2 items-center justify-center rounded-full bg-rose/80 text-white backdrop-blur-md transition-all duration-300 hover:bg-rose hover:scale-110 sm:opacity-0 sm:group-hover:opacity-100 shadow-lg border border-white/20"
          >
            <img alt="" src={ChevR} className="size-4 sm:size-5 brightness-0 invert" />
          </button>
        </div>
        
        {/* Pagination Dots */}
        <div className="mt-6 sm:mt-8 flex justify-center gap-2.5 sm:gap-3">
          {photos.map((_, d) => (
            <button
              key={d}
              aria-label={`Go to photo ${d + 1}`}
              onClick={() => setI(d)}
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-500 ease-out ${
                d === i 
                  ? 'w-8 sm:w-10 bg-rose shadow-md' 
                  : 'w-2 sm:w-2.5 bg-rose/30 hover:bg-rose/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
