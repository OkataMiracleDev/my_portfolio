import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function PlaygroundOrbit() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      className="relative h-16 w-16 shrink-0"
      style={{ perspective: "600px" }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          animation: prefersReducedMotion ? "none" : "playground-orbit 6s linear infinite",
        }}
      >
        <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-animate" />
      </div>
      <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/30" />
    </div>
  );
}
