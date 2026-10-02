import Heading from './Heading'

const items = [
  ['5:45 PM', 'Poruwa Ceremony'],
  ['6:40 PM', 'Registration'],
  ['7:00 PM', 'Reception'],
  ['8:30 PM', 'Dinner'],
  ['9:30 PM', 'Farewell'],
]

export default function Schedule() {
  return (
    <section className="flex flex-col items-center gap-8 px-4">
      <Heading>Wedding Day Schedule</Heading>
      <ol className="w-full max-w-[460px]">
        {items.map(([t, label], k) => (
          <li key={t} className="grid grid-cols-[minmax(0,1fr)_16px_minmax(0,1fr)] items-center gap-x-8">
            <span className="py-4 text-right text-[17px] tracking-[0.425px]">{t}</span>
            <span className="relative flex items-center justify-center self-stretch">
              <span
                className={`absolute left-1/2 w-px -translate-x-1/2 bg-rose ${
                  k === 0 ? 'top-1/2 bottom-0' : k === items.length - 1 ? 'top-0 bottom-1/2' : 'inset-y-0'
                }`}
              />
              <span className="relative size-2.5 rounded-full bg-rose" />
            </span>
            <span className="py-4 text-[19px]">{label}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
