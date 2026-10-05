import { useState, useEffect } from 'react'
import { API_URL } from '../config'

interface RsvpModalProps {
  isOpen: boolean
  onClose: () => void
  hash?: string
}

export default function RsvpModal({ isOpen, onClose, hash }: RsvpModalProps) {
  const [attendance, setAttendance] = useState<'yes' | 'no' | null>(null)
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && hash) {
      fetch(`${API_URL}/rsvp/${hash}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.name) {
            setName(data.name)
            if (data.attending === true) setAttendance('yes')
            if (data.attending === false) setAttendance('no')
          }
        })
        .catch(() => console.error("Could not load RSVP details"))
    }
  }, [isOpen, hash])

  const handleConfirm = async () => {
    if (!attendance) {
      setError('Please select whether you will attend.')
      return
    }
    
    setIsSubmitting(true)
    setError('')

    if (hash) {
      try {
        const res = await fetch(`${API_URL}/rsvp/${hash}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ attending: attendance === 'yes' })
        })
        
        if (res.ok) {
          setSubmitted(true)
        } else {
          setError('Failed to save your response.')
        }
      } catch (err) {
        setError('Error connecting to the server.')
      }
    } else {
      // Fallback for random visitors without a hash
      setSubmitted(true)
    }
    
    setIsSubmitting(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-[420px] rounded-2xl bg-white p-6 font-sans-google text-[#2b2b2b] shadow-2xl sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex size-7 items-center justify-center rounded-full bg-[#f1f1f1] text-[#717171] transition-colors hover:bg-[#e5e5e5]"
        >
          <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        
        {submitted ? (
          <div className="text-center py-6">
            <h2 className="mb-4 text-2xl font-bold text-[#1f2937]">Thank you!</h2>
            <p className="text-[15px] text-[#6b7280]">
              {attendance === 'yes' 
                ? "We can't wait to celebrate with you!" 
                : "We will miss you!"}
            </p>
            <button 
              onClick={onClose}
              className="mt-8 w-full rounded-xl bg-[#996247] py-3.5 text-[15px] font-bold text-white transition-opacity hover:opacity-90"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="mb-2 text-xl font-bold text-[#1f2937]">Confirm your attendance</h2>
            <p className="mb-6 text-[13px] leading-relaxed text-[#6b7280]">
              Your presence would be an honor. Please RSVP so we can prepare the warmest welcome for you.
            </p>

            {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

            <div className="mb-8">
              <label className="mb-2 block text-[13px] font-semibold text-[#374151]">Will you attend?</label>
              <div className="flex flex-col gap-3">
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-colors ${
                    attendance === 'yes' ? 'border-[#996247] bg-[#996247]/5' : 'border-[#e5e7eb] hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="attendance"
                    className="hidden"
                    checked={attendance === 'yes'}
                    onChange={() => setAttendance('yes')}
                  />
                  <div
                    className={`flex size-6 items-center justify-center rounded-full transition-colors ${
                      attendance === 'yes' ? 'bg-[#996247] text-white' : 'bg-[#f3f4f6] text-[#9ca3af]'
                    }`}
                  >
                    <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">I will attend</span>
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-colors ${
                    attendance === 'no' ? 'border-[#996247] bg-[#996247]/5' : 'border-[#e5e7eb] hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="attendance"
                    className="hidden"
                    checked={attendance === 'no'}
                    onChange={() => setAttendance('no')}
                  />
                  <div
                    className={`flex size-6 items-center justify-center rounded-full transition-colors ${
                      attendance === 'no' ? 'bg-[#996247] text-white' : 'bg-[#f3f4f6] text-[#9ca3af]'
                    }`}
                  >
                    <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Sorry, I can't make it</span>
                </label>
              </div>
            </div>

            <button 
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#996247] py-3.5 text-[15px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? 'Confirming...' : 'Confirm'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
