export default function Heading({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`text-center text-[22px] uppercase tracking-[1.3px] text-rose sm:text-[26px] sm:leading-[39px] ${className || ''}`}>
      {children}
    </h2>
  )
}
