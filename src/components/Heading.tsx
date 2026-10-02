export default function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-center text-[22px] uppercase tracking-[1.3px] text-rose sm:text-[26px] sm:leading-[39px]">
      {children}
    </h2>
  )
}
