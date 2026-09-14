"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

let apiLoadingPromise: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (typeof window !== "undefined" && window.YT?.Player) return Promise.resolve();
  if (apiLoadingPromise) return apiLoadingPromise;

  apiLoadingPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  });

  return apiLoadingPromise;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* YT.PlayerState as plain numbers. The ambient enum is only a type here --
   reading the real values needs window.YT, which does not exist during the
   first render, and these are fixed by the API contract. */
const UNSTARTED = -1;
const ENDED = 0;
const PLAYING = 1;
const PAUSED = 2;
const CUED = 5;
/* BUFFERING (3) is intentionally absent: nothing here branches on it. */

export default function YouTubePlayer({
  videoId,
  title,
  poster,
}: {
  videoId: string;
  title: string;
  /** Frame shown before playback, in place of YouTube's branded idle state. */
  poster?: string;
}) {
  const mountId = useId().replace(/:/g, "");
  const playerRef = useRef<YT.Player | null>(null);
  const rafRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<number>(UNSTARTED);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);

  const playing = state === PLAYING;

  /* Where YouTube draws its own chrome, and so where we draw over it.
     Hover is already dealt with (pointer-events-none below), but these three
     states paint the channel avatar, channel name and end-screen grid whether
     or not the pointer is anywhere near the player. BUFFERING is deliberately
     absent: it happens mid-playback and covering it would flash the poster
     every time the network stalls. */
  const idle = state === UNSTARTED || state === CUED;
  const covered = idle || state === PAUSED || state === ENDED;

  useEffect(() => {
    let cancelled = false;

    loadYouTubeApi().then(() => {
      if (cancelled) return;
      playerRef.current = new window.YT.Player(mountId, {
        videoId,
        playerVars: {
          controls: 0,
          rel: 0,
          iv_load_policy: 3,
          disablekb: 1,
          fs: 0,
          playsinline: 1,
          // No modestbranding: YouTube retired it in 2023 and ignores it now,
          // as it ignores showinfo. Suppressing the branding is done by the
          // cover layer below, not by asking the player nicely.
        },
        events: {
          onReady: (e) => {
            setReady(true);
            setDuration(e.target.getDuration());
          },
          onStateChange: (e) => {
            setState(e.data);
            if (e.data === window.YT.PlayerState.PLAYING) {
              setDuration(e.target.getDuration());
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [mountId, videoId]);

  useEffect(() => {
    if (!playing || seeking) return;

    function tick() {
      const player = playerRef.current;
      if (player) setCurrentTime(player.getCurrentTime());
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, seeking]);

  function togglePlay() {
    const player = playerRef.current;
    if (!player) return;
    // From ENDED, playVideo() restarts from the top, which is what the
    // replay affordance promises.
    if (playing) player.pauseVideo();
    else player.playVideo();
  }

  function handleSeekChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCurrentTime(Number(e.target.value));
  }

  function handleSeekCommit(e: React.PointerEvent<HTMLInputElement>) {
    const player = playerRef.current;
    const value = Number((e.target as HTMLInputElement).value);
    player?.seekTo(value, true);
    setSeeking(false);
  }

  const label = state === ENDED ? "Replay" : playing ? "Pause" : "Play";

  return (
    <div className="absolute inset-0 overflow-hidden bg-base">
      {/* pointer-events-none keeps the mouse off YouTube's own iframe content
          entirely — otherwise hovering reveals YouTube's channel/branding
          overlay, which no player parameter can suppress. All playback here
          goes through the JS API, so the iframe never needs to receive
          pointer input. */}
      <div className="pointer-events-none h-full w-full">
        <div id={mountId} className="h-full w-full" />
      </div>

      {ready && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label={`${label} ${title}`}
          className="absolute inset-0 z-0 cursor-pointer"
        />
      )}

      {/* The cover. Sits above the iframe but below the playhead, and passes
          clicks through to the full-area button behind it so there is still
          one thing to click. Opaque in the idle state (a poster frame stands
          in for YouTube's branded thumbnail) and a heavy scrim when paused or
          ended, which is enough to bury the title bar and the end-screen grid
          without throwing the video frame away entirely. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-[5] flex items-center justify-center transition-opacity duration-300 ease-out ${
          covered ? "opacity-100" : "opacity-0"
        }`}
      >
        {idle ? (
          <Image
            // hqdefault, not maxresdefault: maxres is missing for plenty of
            // videos and 404s. hqdefault always exists, and its 4:3 frame is
            // letterboxed exactly to 16:9, so object-cover crops off the bars
            // and leaves the real frame.
            src={poster ?? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            fill
            sizes="(min-width: 768px) 60vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-base/90" />
        )}

        <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-base/85 text-ink backdrop-blur-sm md:h-20 md:w-20">
          {state === ENDED ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3 12a9 9 0 1 0 3-6.7L3 8m0 0V3m0 5h5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6 4l14 8-14 8V4z" />
            </svg>
          )}
        </span>
      </div>

      {ready && (
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-3 bg-gradient-to-t from-ink/80 to-transparent px-4 py-3">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={label}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-base/90 text-ink transition-transform duration-150 ease-out hover:scale-105 active:scale-95"
          >
            {playing ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="5" y="4" width="5" height="16" />
                <rect x="14" y="4" width="5" height="16" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6 4l14 8-14 8V4z" />
              </svg>
            )}
          </button>

          <span className="w-10 shrink-0 font-[family-name:var(--font-jetbrains-mono)] text-xs text-base/80">
            {formatTime(currentTime)}
          </span>

          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onPointerDown={() => setSeeking(true)}
            onChange={handleSeekChange}
            onPointerUp={handleSeekCommit}
            aria-label={`Seek ${title}`}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-base/30 accent-accent-animate"
          />

          <span className="w-10 shrink-0 font-[family-name:var(--font-jetbrains-mono)] text-xs text-base/60">
            {formatTime(duration)}
          </span>
        </div>
      )}
    </div>
  );
}
