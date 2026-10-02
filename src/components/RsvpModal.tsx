import { useState } from 'react'

interface RsvpModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RsvpModal({ isOpen, onClose }: RsvpModalProps) {
  const [attendance, setAttendance] = useState<'yes' | 'no' | null>(null)

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
        
        <h2 className="mb-2 text-xl font-bold text-[#1f2937]">Confirm your attendance</h2>
        <p className="mb-6 text-[13px] leading-relaxed text-[#6b7280]">
          Your presence would be an honor. Please RSVP so we can prepare the warmest welcome for you.
        </p>

        <div className="mb-5">
          <label className="mb-2 block text-[13px] font-semibold text-[#374151]">Your name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full rounded-xl border border-[#e5e7eb] px-4 py-3 text-sm placeholder:text-[#9ca3af] outline-none transition-colors focus:border-[#996247] focus:ring-1 focus:ring-[#996247]"
          />
        </div>

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

        <button className="w-full rounded-xl bg-[#d5c3b3] py-3.5 text-[15px] font-bold text-white transition-opacity hover:opacity-90">
          Confirm
        </button>
      </div>
    </div>
  )
}
