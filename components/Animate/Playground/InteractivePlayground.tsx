import PlaygroundToggle from "./PlaygroundToggle";
import PlaygroundSlider from "./PlaygroundSlider";
import PlaygroundMagneticButton from "./PlaygroundMagneticButton";
import PlaygroundShapeMorph from "./PlaygroundShapeMorph";

export default function InteractivePlayground() {
  return (
    <section className="section px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <p className="inline-flex items-center gap-2 rounded-pill border border-ink/15 px-4 py-1.5 text-sm font-medium text-ink/70">
            Just for fun — try these
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-cabinet-grotesk)] text-3xl md:text-4xl font-bold text-ink">
            A tiny motion playground
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col items-center justify-center gap-4 rounded-card bg-base-raised p-8">
            <p className="text-sm text-ink/60">Spring toggle</p>
            <PlaygroundToggle />
          </div>
          <div className="flex flex-col justify-center gap-4 rounded-card bg-base-raised p-8">
            <p className="text-sm text-ink/60">Draggable slider</p>
            <PlaygroundSlider />
          </div>
          <div className="flex flex-col items-center justify-center gap-4 rounded-card bg-base-raised p-8">
            <p className="text-sm text-ink/60">Magnetic button</p>
            <PlaygroundMagneticButton />
          </div>
          <div className="flex flex-col items-center justify-center gap-4 rounded-card bg-base-raised p-8">
            <p className="text-sm text-ink/60">Shape morph</p>
            <PlaygroundShapeMorph />
          </div>
        </div>
      </div>
    </section>
  );
}
