const capabilities = [
  { id: "brand", title: "Brand Animation", description: "Logo reveals, brand videos, motion identity systems." },
  { id: "ui", title: "UI Micro-interactions", description: "The small moments that make software feel considered." },
  { id: "social", title: "Social & Explainer", description: "Short-form video built to hold attention and explain fast." },
];

export default function CapabilitiesStrip() {
  return (
    <section className="section px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-12 text-center font-[family-name:var(--font-cabinet-grotesk)] text-3xl md:text-4xl font-bold text-ink">
          What I do
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {capabilities.map((cap, i) => (
            <div
              key={cap.id}
              className={`rounded-card bg-base-raised p-8 ${i === 0 ? "md:col-span-2" : ""}`}
            >
              <h3 className="mb-3 font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold text-ink">
                {cap.title}
              </h3>
              <p className="text-ink/70">{cap.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
