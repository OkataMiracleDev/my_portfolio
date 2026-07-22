export default function HeroLightBeam() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-1/4 top-[-18%] h-[34rem] w-[150%] -rotate-12 bg-[linear-gradient(90deg,transparent_0%,oklch(58%_0.24_300_/_0.02)_18%,oklch(58%_0.24_300_/_0.34)_42%,oklch(58%_0.24_300_/_0.12)_62%,transparent_86%)] blur-2xl" />
      <div className="absolute right-[-12%] top-[12%] h-72 w-72 rounded-full bg-accent-animate/20 blur-3xl md:h-[30rem] md:w-[30rem]" />
    </div>
  );
}
