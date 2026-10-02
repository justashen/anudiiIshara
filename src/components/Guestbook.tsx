import { useState } from 'react'
import Heading from './Heading'

export default function Guestbook() {
  const [name, setName] = useState('')
  const [wish, setWish] = useState('')
  const [wishes, setWishes] = useState<{ name: string; wish: string }[]>([])
  const field =
    'w-full rounded-lg border border-rose/40 bg-white px-[17px] py-[15px] text-sm text-rose outline-none placeholder:text-rose/50 focus:border-rose'

  return (
    <section className="flex flex-col items-center gap-6 px-4 pb-10 pt-12 sm:px-10">
      <Heading>Guestbook</Heading>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!name.trim() || !wish.trim()) return
          setWishes([{ name, wish }, ...wishes])
          setName('')
          setWish('')
        }}
        className="flex w-full max-w-[600px] flex-col gap-4 rounded-2xl border border-rose/20 bg-white p-[25px] shadow-sm"
      >
        <input className={field} placeholder="Enter your name*" value={name} onChange={(e) => setName(e.target.value)} required />
        <textarea
          className={`${field} h-[110px] resize-none py-[13px]`}
          placeholder="Enter your wishes*"
          value={wish}
          onChange={(e) => setWish(e.target.value)}
          required
        />
        <div className="flex justify-end pt-[7px]">
          <button type="submit" className="rounded-full bg-rose px-6 py-2 text-sm font-bold text-white">
            SEND WISHES
          </button>
        </div>
      </form>
      <div className="max-h-[500px] w-full max-w-[600px] overflow-auto pt-2 text-center text-sm">
        {wishes.length === 0 ? (
          <p className="opacity-70">No wishes yet. Be the first!</p>
        ) : (
          wishes.map((w, k) => (
            <div key={k} className="mb-3 rounded-lg bg-white/60 p-3 text-left">
              <div className="font-bold">{w.name}</div>
              <div>{w.wish}</div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
