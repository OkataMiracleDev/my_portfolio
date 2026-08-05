import Image from "next/image";
import Link from "next/link";

export default function MimiLogo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Mimi Studios — home"
      className={`flex items-center gap-2.5 ${className}`}
    >
      <Image src="/mimi-logo.svg" alt="" width={28} height={28} className="h-7 w-7" priority />
      <span className="font-[family-name:var(--font-cabinet-grotesk)] text-lg font-bold text-ink">
        Mimi Studios
      </span>
    </Link>
  );
}
