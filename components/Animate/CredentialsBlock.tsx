const credentials = [
  // Placeholder-honest figures for the motion route until real numbers are supplied.
  { label: "Years creating", value: "2+" },
  { label: "Projects shipped", value: "12+" },
  { label: "Tools mastered", value: "6" },
  { label: "Resource drops", value: "3" },
];

export default function CredentialsBlock() {
  return (
    <div className="mt-20 border-t border-base/15 pt-12">
      <h3 className="font-[family-name:var(--font-cabinet-grotesk)] text-5xl font-black leading-none text-base md:text-7xl">
        Bragging <span className="italic">rights.</span>
      </h3>
      <div className="mt-10 grid gap-6 md:grid-cols-4">
        {credentials.map((item) => (
          <div key={item.label} className="border-t border-base/20 pt-5">
            <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.1em] text-base/45">
              {item.label}
            </p>
            <p className="mt-4 font-[family-name:var(--font-cabinet-grotesk)] text-4xl font-black text-base">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
