import { useState, useEffect } from 'react'

const a = '/assets'
const ChevL = `${a}/8b149.svg`
const ChevR = `${a}/2d14c.svg`

const photos = [
  { src: `/1.webp` },
  { src: `/2.webp`, position: 'object-top' },
  { src: `/3.webp` },
  { src: `/4.webp` },
  { src: `/5.webp`, position: 'object-top' },
  { src: `/6.webp` },
]

function GalleryImage({ p, idx }: { p: typeof photos[0], idx: number }) {
  const [loaded, setLoaded] = useState(false)
  
  return (
    <div className="relative h-full min-w-full flex-[0_0_100%] shrink-0 bg-black/5">
      {!loaded && <div className="absolute inset-0 animate-pulse bg-rose/20" />}
      <img
        alt={`Wedding photo ${idx + 1}`}
        src={p.src}
        loading="eager"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-700 ${p.position || 'object-center'} ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none opacity-60" />
    </div>
  )
}

export default function Gallery() {
  const [i, setI] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [transitioning, setTransitioning] = useState(true)
  
  const go = (d: number) => {
    setTransitioning(true)
    setI((prev) => {
      const next = prev + d
      if (next < 0) return photos.length - 1
      if (next > photos.length) return 1
      return next
    })
  }

  useEffect(() => {
    if (i === photos.length) {
      const t = setTimeout(() => {
        setTransitioning(false)
        setI(0)
      }, 1000)
      return () => clearTimeout(t)
    } else if (!transitioning) {
      const t = setTimeout(() => setTransitioning(true), 50)
      return () => clearTimeout(t)
    }
  }, [i, transitioning])

  useEffect(() => {
    if (isHovered) return
    const timer = setInterval(() => {
      go(1)
    }, 4000)
    return () => clearInterval(timer)
  }, [isHovered])
  
  const extendedPhotos = [...photos, photos[0]]

  return (
    <section className="flex w-full flex-col items-center py-10 sm:py-16">
      <h2 className="mb-6 sm:mb-10 text-sm sm:text-base font-medium tracking-[0.1em] text-rose/80 uppercase">Memories</h2>
      <div className="w-full max-w-5xl px-4 sm:px-8 lg:px-12">
        <div 
          className="group relative h-[55vh] min-h-[350px] max-h-[600px] w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl ring-1 ring-black/5 bg-black/5"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div 
            className={`flex h-full w-full will-change-transform ${transitioning ? 'transition-transform duration-1000 ease-in-out' : ''}`}
            style={{ transform: `translate3d(-${i * 100}%, 0, 0)` }}
          >
            {extendedPhotos.map((p, idx) => (
              <GalleryImage key={idx} p={p} idx={idx} />
            ))}
          </div>
          
          {/* Previous button */}
          <button
            aria-label="Previous photo"
            onClick={() => go(-1)}
            className="absolute left-3 sm:left-6 top-1/2 z-20 flex size-10 sm:size-12 -translate-y-1/2 items-center justify-center rounded-full bg-rose/80 text-white backdrop-blur-md transition-all duration-300 hover:bg-rose hover:scale-110 sm:opacity-0 sm:group-hover:opacity-100 shadow-lg border border-white/20"
          >
            <img alt="" src={ChevL} className="size-4 sm:size-5 brightness-0" />
          </button>
          
          {/* Next button */}
          <button
            aria-label="Next photo"
            onClick={() => go(1)}
            className="absolute right-3 sm:right-6 top-1/2 z-20 flex size-10 sm:size-12 -translate-y-1/2 items-center justify-center rounded-full bg-rose/80 text-white backdrop-blur-md transition-all duration-300 hover:bg-rose hover:scale-110 sm:opacity-0 sm:group-hover:opacity-100 shadow-lg border border-white/20"
          >
            <img alt="" src={ChevR} className="size-4 sm:size-5 brightness-0" />
          </button>
        </div>
        
        {/* Pagination Dots */}
        <div className="mt-6 sm:mt-8 flex justify-center gap-2.5 sm:gap-3">
          {photos.map((_, d) => (
            <button
              key={d}
              aria-label={`Go to photo ${d + 1}`}
              onClick={() => {
                setTransitioning(true)
                setI(d)
              }}
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-500 ease-out ${
                (i === photos.length ? 0 : i) === d 
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
