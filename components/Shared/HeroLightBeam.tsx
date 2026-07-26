type Accent = "build" | "animate";

const ACCENT_VAR: Record<Accent, string> = {
  build: "--color-accent-build",
  animate: "--color-accent-animate",
};

const BEAM_CIRCLE: Record<Accent, string> = {
  build: "bg-accent-build/20",
  animate: "bg-accent-animate/20",
};

function beamGradient(accentVar: string) {
  const stop = (pct: number) => `color-mix(in oklch, var(${accentVar}) ${pct}%, transparent)`;
  return `linear-gradient(90deg, transparent 0%, ${stop(2)} 18%, ${stop(34)} 42%, ${stop(12)} 62%, transparent 86%)`;
}

export default function HeroLightBeam({ accent }: { accent: Accent }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute -left-1/4 top-[-18%] h-[34rem] w-[150%] -rotate-12 blur-2xl"
        style={{ backgroundImage: beamGradient(ACCENT_VAR[accent]) }}
      />
      <div className={`absolute right-[-12%] top-[12%] h-72 w-72 rounded-full blur-3xl md:h-[30rem] md:w-[30rem] ${BEAM_CIRCLE[accent]}`} />
    </div>
  );
}
