const a = '/assets'

export default function Hero() {
  return (
    <header className="relative flex w-full flex-col items-center justify-center min-h-screen sm:min-h-[85vh] py-20 sm:py-32 px-4">
      {/* Background Flower Design */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-100 z-0 sm:flex sm:items-center sm:justify-end">
        <img
          alt=""
          src={`${a}/65399.png`}
          className="absolute -right-[35%] top-[5%] w-[90%] h-[90%] object-contain object-right-top sm:relative sm:right-auto sm:top-auto sm:w-[80%] sm:h-full sm:max-w-[800px] sm:object-right sm:mt-0 md:mt-[80px] lg:mt-[100px] sm:translate-x-[10%] -rotate-[30deg] sm:-rotate-12"
        />
      </div>

      {/* Text Content */}
      <div className="relative z-10 flex flex-col items-start justify-center text-left w-full max-w-4xl pl-6 sm:pl-10 h-[100dvh] sm:h-full pt-60 pb-10 sm:py-0">
        <p className="text-[12px] sm:text-[22px] md:text-[26px] uppercase tracking-[4px] sm:tracking-[8px] opacity-90 sm:opacity-75 text-left w-auto drop-shadow-sm sm:drop-shadow-none font-medium text-[#ad785d] sm:text-rose mb-2 sm:mb-10">
          The wedding of
        </p>

        <div className="flex flex-col items-start font-script drop-shadow-sm text-rose sm:ml-0">
          <span className="text-[72px] sm:text-[120px] md:text-[140px] leading-[0.85]">Anudi</span>
          <span className="self-center sm:self-start text-[48px] sm:text-[80px] md:text-[100px] leading-[1] my-2 sm:my-0 sm:ml-20 text-[#bd8d76] sm:text-rose opacity-90">&amp;</span>
          <span className="text-[72px] sm:text-[120px] md:text-[140px] leading-[0.85]">Ishara</span>
        </div>
      </div>
    </header>
  )
}
