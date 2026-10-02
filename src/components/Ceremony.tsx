import Heading from './Heading'

const parents = [
  ['Muditha Karunamuni', 'Narmada Jayasinhe'],
  ['Kamburugamuwa Yaddehige Gunapala', 'Ashoka Perera'],
]

export default function Ceremony() {
  return (
    <section className="flex flex-col items-center gap-16 px-6 sm:gap-20">
      <Heading>Ceremony Info</Heading>
      <div className="flex w-full max-w-[700px] justify-center gap-3 text-center">
        {parents.map((p) => (
          <div key={p[0]} className="flex flex-1 flex-col gap-[5px]">
            <span className="text-base">Mr. &amp; Mrs.</span>
            {p.map((n) => (
              <span key={n} className="text-[17px] leading-tight sm:text-[23px] sm:leading-[34.5px]">
                {n}
              </span>
            ))}
          </div>
        ))}
      </div>
      <p className="text-center text-[20px] uppercase leading-[30px] sm:text-[26px] sm:leading-[39px]">
        We joyfully announce
        <br />
        the wedding of our children
      </p>
      <div className="flex flex-col items-center gap-4 text-center">
        <h3 className="font-garamond text-[40px] leading-[56px] sm:text-[64px] sm:leading-[80px]">Anudi Karunamuni</h3>
        <span className="text-xs uppercase tracking-[2.4px]">Bride</span>
        <span className="text-[52px] leading-[78px]">&amp;</span>
        <h3 className="font-garamond text-[40px] leading-[56px] sm:text-[64px] sm:leading-[80px]">Ishara Udayanga</h3>
        <span className="text-xs uppercase tracking-[2.4px]">Groom</span>
      </div>
    </section>
  )
}
