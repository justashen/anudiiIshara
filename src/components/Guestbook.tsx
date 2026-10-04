import { useState } from 'react'
import Heading from './Heading'

export default function Guestbook({ hash }: { hash?: string }) {
  const [name, setName] = useState('')
  const [wish, setWish] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  
  const field =
    'w-full rounded-lg border border-rose/40 bg-white px-[17px] py-[15px] text-sm text-rose outline-none placeholder:text-rose/50 focus:border-rose'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !wish.trim()) return
    
    setStatus('loading')
    try {
      const res = await fetch('http://localhost:5000/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message: wish, hash }),
      })
      
      if (res.ok) {
        setStatus('success')
        setName('')
        setWish('')
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <section className="flex flex-col items-center gap-6 px-4 pb-10 pt-12 sm:px-10">
      <Heading>Guestbook</Heading>
      
      {status === 'success' ? (
        <div className="flex w-full max-w-[600px] flex-col items-center gap-4 rounded-2xl border border-rose/20 bg-white p-[25px] shadow-sm text-center">
          <p className="font-bold text-lg text-rose">Thank you for your wishes!</p>
          <button onClick={() => setStatus('idle')} className="text-sm underline opacity-70">
            Submit another message
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-[600px] flex-col gap-4 rounded-2xl border border-rose/20 bg-white p-[25px] shadow-sm"
        >
          <input className={field} placeholder="Enter your name*" value={name} onChange={(e) => setName(e.target.value)} required disabled={status === 'loading'} />
          <textarea
            className={`${field} h-[110px] resize-none py-[13px]`}
            placeholder="Enter your wishes*"
            value={wish}
            onChange={(e) => setWish(e.target.value)}
            required
            disabled={status === 'loading'}
          />
          {status === 'error' && <p className="text-sm text-red-500">Failed to send wish. Please try again.</p>}
          <div className="flex justify-end pt-[7px]">
            <button type="submit" disabled={status === 'loading'} className="rounded-full bg-rose px-6 py-2 text-sm font-bold text-white disabled:opacity-50">
              {status === 'loading' ? 'SENDING...' : 'SEND WISHES'}
            </button>
          </div>
        </form>
      )}
    </section>
  )
}
