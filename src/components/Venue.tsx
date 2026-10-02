import Heading from './Heading'

const a = '/assets'


export default function Venue() {
  return (
    <section className="flex flex-col items-center gap-8 px-4 pb-16">
      <div className="flex flex-col items-center gap-3">
        <Heading>Wedding Reception Venue</Heading>
        <div className="h-[13px] w-[500px] max-w-full border-b border-rose/[0.13]" />
      </div>
      <div className="relative h-[380px] w-full max-w-[560px] overflow-hidden rounded-2xl bg-[#e5e3df]">
        <iframe
          src="https://maps.google.com/maps?q=Vinrich%20Lake%20Resort&t=&z=13&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Vinrich Lake Resort Map"
        ></iframe>
      </div>
      <a
        href="https://maps.google.com/?q=Vinrich+Lake+Resort"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 rounded-full px-5 py-2 text-base font-bold hover:opacity-80 transition-opacity"
      >
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="size-5">
          <path d="M16 0c-5.523 0-10 4.477-10 10 0 7.5 10 22 10 22s10-14.5 10-22c0-5.523-4.477-10-10-10z" fill="#ea4335" />
          <circle cx="16" cy="10" r="4.5" fill="#5c0000" />
          <circle cx="16" cy="10" r="5" fill="#fff" />
        </svg>
        Get directions
      </a>
    </section>
  )
}
