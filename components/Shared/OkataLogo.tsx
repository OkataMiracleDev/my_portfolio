import Image from "next/image";
import Link from "next/link";

export default function OkataLogo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Okata Studios — home"
      className={`flex items-center gap-2.5 ${className}`}
    >
      {/* okata-logomark.png, not okata-logo.png: the latter is the black-ring
          variant (#17140F), which was all but invisible here -- this site has
          one theme and --color-base is #0d0d10. */}
      <Image
        src="/okata-logomark.png"
        alt=""
        width={28}
        height={28}
        className="h-7 w-7"
        priority
      />
      <span className="font-[family-name:var(--font-cabinet-grotesk)] text-lg font-bold text-ink">
        Okata Studios
      </span>
    </Link>
  );
}
