"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  altPrefix: string;
  /**
   * `cover` fills the thumbnail box and crops to do it; `contain` letterboxes
   * so the whole frame is visible. Storyboards want `contain` -- a 16:9 board
   * centre-cropped into a square loses about 44% of its width, and the result
   * reads as "bad quality" when it is really just a magnified fragment.
   */
  fit?: "cover" | "contain";
  aspect?: "square" | "video";
  /**
   * Must describe the thumbnail's real rendered width. Next builds its srcset
   * from this, so understating it is the single easiest way to end up serving
   * a genuinely low-resolution file no amount of `quality` can rescue.
   */
  sizes?: string;
  accent?: "animate" | "build";
  /** Offers the untouched blob alongside the optimised render. */
  allowOriginal?: boolean;
}

const ASPECT = {
  square: "aspect-square",
  video: "aspect-[16/9]",
} as const;

/**
 * A grid of images that open full-screen.
 *
 * Previously components/Animate/StoryboardGallery, used only by motion case
 * studies. The retainer portal needs exactly the same thing for progress
 * images, so it moved here rather than being copied.
 *
 * Changes made on the way over:
 * - The backdrop was `bg-ink/90`, which since the dark rebrand means a nearly
 *   white overlay (ink is #f4f3ef) with near-black controls on it -- a leftover
 *   from when ink and base were the other way round. It is now the dark stage
 *   colour, which is both what was intended and what a frame should be judged
 *   against.
 * - Closing returns focus to the thumbnail that opened it, instead of dumping
 *   the caret at the top of the document.
 * - The overlay is a labelled dialog, so a screen reader announces it as one.
 * - Optionally links the original file, so a client reviewing artwork can
 *   always get the untouched upload rather than a re-encode.
 */
export default function ImageGallery({
  images,
  altPrefix,
  fit = "cover",
  aspect = "square",
  sizes = "(min-width: 1024px) 320px, (min-width: 640px) 33vw, 50vw",
  accent = "animate",
  allowOriginal = false,
}: ImageGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const justOpenedRef = useRef(false);
  const scrollSettleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const openedFrom = useRef<number | null>(null);

  const accentRing =
    accent === "build" ? "focus-visible:outline-accent-build" : "focus-visible:outline-accent-animate";

  function openAt(index: number) {
    justOpenedRef.current = true;
    openedFrom.current = index;
    setOpenIndex(index);
  }

  function close() {
    setOpenIndex(null);
    const origin = openedFrom.current;
    if (origin !== null) thumbRefs.current[origin]?.focus();
    openedFrom.current = null;
  }

  function goTo(index: number) {
    setOpenIndex(Math.max(0, Math.min(images.length - 1, index)));
  }

  useEffect(() => {
    if (openIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenIndex(null);
        const origin = openedFrom.current;
        if (origin !== null) thumbRefs.current[origin]?.focus();
        openedFrom.current = null;
      }
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i !== null ? Math.max(0, i - 1) : i));
      if (e.key === "ArrowRight")
        setOpenIndex((i) => (i !== null ? Math.min(images.length - 1, i + 1) : i));
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
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
    // stops, otherwise a mid-animation tick can snap state -- and the sync
    // effect above -- right back to where it started.
    if (scrollSettleTimeout.current) clearTimeout(scrollSettleTimeout.current);
    scrollSettleTimeout.current = setTimeout(() => {
      const el = scrollerRef.current;
      if (!el) return;
      const index = Math.round(el.scrollLeft / el.clientWidth);
      setOpenIndex((current) => (current !== null && current !== index ? index : current));
    }, 120);
  }

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((url, i) => (
          <button
            key={`${url}-${i}`}
            ref={(node) => {
              thumbRefs.current[i] = node;
            }}
            type="button"
            onClick={() => openAt(i)}
            aria-label={`Open ${altPrefix} ${i + 1} of ${images.length} full screen`}
            className={`group relative ${ASPECT[aspect]} overflow-hidden rounded-xl bg-stage focus-visible:outline-2 focus-visible:outline-offset-4 ${accentRing}`}
          >
            <Image
              src={url}
              alt={`${altPrefix} ${i + 1}`}
              fill
              sizes={sizes}
              quality={90}
              className={`${
                fit === "contain" ? "object-contain" : "object-cover"
              } transition-transform duration-200 ease-out group-hover:scale-105`}
            />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${altPrefix} viewer`}
          className="fixed inset-0 z-[10001] flex items-center justify-center bg-stage/95 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            autoFocus
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-ink/10 text-2xl leading-none text-ink transition-colors duration-150 hover:bg-ink/20"
          >
            &times;
          </button>

          {openIndex > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goTo(openIndex - 1);
              }}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/10 text-2xl leading-none text-ink transition-colors duration-150 hover:bg-ink/20"
            >
              &lsaquo;
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
              className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/10 text-2xl leading-none text-ink transition-colors duration-150 hover:bg-ink/20"
            >
              &rsaquo;
            </button>
          )}

          <div
            ref={scrollerRef}
            onScroll={handleScrollerScroll}
            onClick={(e) => e.stopPropagation()}
            className="flex h-[84vh] w-[92vw] snap-x snap-mandatory overflow-x-auto md:w-[84vw]"
          >
            {images.map((url, i) => (
              <div key={`${url}-${i}`} className="relative h-full w-full flex-none snap-center">
                <Image
                  src={url}
                  alt={`${altPrefix} ${i + 1}`}
                  fill
                  // No width hint here on purpose: `fill` with no `sizes`
                  // defaults to 100vw, which is what a full-screen viewer
                  // actually wants.
                  quality={90}
                  className="object-contain"
                  priority={i === openIndex}
                />
              </div>
            ))}
          </div>

          <div className="absolute inset-x-0 bottom-5 flex flex-col items-center gap-2">
            <p className="font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] uppercase tracking-[0.18em] text-ink/50">
              {openIndex + 1} / {images.length}
            </p>
            {allowOriginal && (
              <a
                href={images[openIndex]}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] uppercase tracking-[0.18em] text-ink/35 underline underline-offset-4 transition-colors duration-200 ease-out hover:text-ink"
              >
                Open original
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}
