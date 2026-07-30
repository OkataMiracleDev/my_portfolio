"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface StoryboardGalleryProps {
  images: string[];
  altPrefix: string;
}

export default function StoryboardGallery({ images, altPrefix }: StoryboardGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const justOpenedRef = useRef(false);
  const scrollSettleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openAt(index: number) {
    justOpenedRef.current = true;
    setOpenIndex(index);
  }

  function goTo(index: number) {
    setOpenIndex(Math.max(0, Math.min(images.length - 1, index)));
  }

  useEffect(() => {
    if (openIndex === null) return;

    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i !== null ? Math.max(0, i - 1) : i));
      if (e.key === "ArrowRight") setOpenIndex((i) => (i !== null ? Math.min(images.length - 1, i + 1) : i));
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      if (scrollSettleTimeout.current) clearTimeout(scrollSettleTimeout.current);
    };
  }, [openIndex, images.length]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (openIndex === null || !el) return;

    if (justOpenedRef.current) {
      el.scrollLeft = openIndex * el.clientWidth;
      justOpenedRef.current = false;
    } else {
      el.scrollTo({ left: openIndex * el.clientWidth, behavior: "smooth" });
    }
  }, [openIndex]);

  function handleScrollerScroll() {
    // Programmatic scrollTo (from goTo/arrow keys) fires continuous scroll
    // events too. Only commit the settled position once scrolling actually
    // stops, otherwise a mid-animation tick can snap state — and the sync
    // effect below — right back to where it started.
    if (scrollSettleTimeout.current) clearTimeout(scrollSettleTimeout.current);
    scrollSettleTimeout.current = setTimeout(() => {
      const el = scrollerRef.current;
      if (!el) return;
      const index = Math.round(el.scrollLeft / el.clientWidth);
      setOpenIndex((current) => (current !== null && current !== index ? index : current));
    }, 120);
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((url, i) => (
          <button
            key={`${url}-${i}`}
            type="button"
            onClick={() => openAt(i)}
            className="relative aspect-square overflow-hidden rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-animate"
          >
            <Image
              src={url}
              alt={`${altPrefix} frame ${i + 1}`}
              fill
              quality={90}
              className="object-cover transition-transform duration-200 ease-out hover:scale-105"
            />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[10001] flex items-center justify-center bg-ink/90 p-4"
          onClick={() => setOpenIndex(null)}
        >
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-base/10 text-2xl text-base transition-colors duration-150 hover:bg-base/20"
          >
            ×
          </button>

          {openIndex > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goTo(openIndex - 1);
              }}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-base/10 text-2xl text-base transition-colors duration-150 hover:bg-base/20"
            >
              ‹
            </button>
          )}
          {openIndex < images.length - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goTo(openIndex + 1);
              }}
              aria-label="Next image"
              className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-base/10 text-2xl text-base transition-colors duration-150 hover:bg-base/20"
            >
              ›
            </button>
          )}

          <div
            ref={scrollerRef}
            onScroll={handleScrollerScroll}
            onClick={(e) => e.stopPropagation()}
            className="flex h-[80vh] w-[80vw] snap-x snap-mandatory overflow-x-auto"
          >
            {images.map((url, i) => (
              <div key={`${url}-${i}`} className="relative h-full w-full flex-none snap-center">
                <Image
                  src={url}
                  alt={`${altPrefix} frame ${i + 1}`}
                  fill
                  quality={90}
                  className="object-contain"
                />
              </div>
            ))}
          </div>

          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-[family-name:var(--font-jetbrains-mono)] text-xs text-base/60">
            {openIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}
