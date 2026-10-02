import { useEffect, useState } from 'react'
import Heading from './Heading'
import RsvpModal from './RsvpModal'

const a = '/assets'
const target = new Date('2026-11-05T19:00:00').getTime()
const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function useCountdown() {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const s = Math.max(0, Math.floor((target - now) / 1000))
  return `${Math.floor(s / 86400)} days ${Math.floor((s % 86400) / 3600)} hours ${Math.floor((s % 3600) / 60)} min ${s % 60} sec`
}

function Calendar() {
  const grid = [...Array(6).fill(null), ...Array.from({ length: 30 }, (_, k) => k + 1)]
  return (
    <div className="w-[352px] max-w-full overflow-hidden rounded-lg border border-rose/25 p-px">
      <div className="border-b border-rose/25 py-[10px] text-center text-sm font-bold tracking-[0.35px]">November 2026</div>
      <div className="flex border-b-2 border-rose pb-[2px]">
        {days.map((d) => (
          <div key={d} className="flex-1 py-1.5 text-center text-[11px] leading-[16.5px] opacity-60">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-[2px] px-1 py-2">
        {grid.map((d, k) => (
          <div key={k} className="flex h-[34px] items-center justify-center text-[13px]">
            {d === 5 ? (
              <span className="relative flex h-7 w-[30px] items-center justify-center text-xs font-bold text-white">
                <img alt="" src={`${a}/6ea6f.svg`} className="absolute inset-0 size-full drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]" />
                <span className="relative">5</span>
              </span>
            ) : (
              d
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Reception() {
  const countdown = useCountdown()
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <section className="flex flex-col items-center gap-5 px-6">
      <Heading>Reception Info</Heading>
      <p className="text-center text-[18px] uppercase tracking-[1.3px] sm:text-[26px] sm:leading-[39px]">
        The reception will take place at:
      </p>
      <p className="text-[30px] leading-[45px]">7:00 PM</p>
      <div className="flex items-center gap-6 text-base uppercase">
        <span className="text-right">Thursday</span>
        <span className="h-8 w-0.5 bg-rose" />
        <span className="text-[28px] leading-none">05</span>
        <span className="h-8 w-0.5 bg-rose" />
        <span>November</span>
      </div>
      <p className="text-2xl">2026</p>
      <div className="flex flex-col items-center pt-4 text-center">
        <h3 className="font-[Montserrat] text-base">Countdown</h3>
        <p className="pt-2 text-lg">{countdown}</p>
      </div>
      <div className="pt-2">
        <Calendar />
      </div>

      <button 
        onClick={() => setIsModalOpen(true)}
        className="mt-2 cursor-pointer rounded-full bg-rose px-6 py-2 text-base font-bold tracking-[0.8px] text-white transition-opacity hover:opacity-90"
      >
        CONFIRM ATTENDANCE
      </button>
      <RsvpModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}
