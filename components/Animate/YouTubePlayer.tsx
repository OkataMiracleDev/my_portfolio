"use client";

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

export default function YouTubePlayer({ videoId, title }: { videoId: string; title: string }) {
  const mountId = useId().replace(/:/g, "");
  const playerRef = useRef<YT.Player | null>(null);
  const rafRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadYouTubeApi().then(() => {
      if (cancelled) return;
      playerRef.current = new window.YT.Player(mountId, {
        videoId,
        playerVars: {
          controls: 0,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
          disablekb: 1,
          fs: 0,
          playsinline: 1,
        },
        events: {
          onReady: (e) => {
            setReady(true);
            setDuration(e.target.getDuration());
          },
          onStateChange: (e) => {
            setPlaying(e.data === window.YT.PlayerState.PLAYING);
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

  return (
    <div className="absolute inset-0">
      {/* pointer-events-none keeps the mouse off YouTube's own iframe content
          entirely — otherwise hovering reveals YouTube's channel/branding
          overlay, which no player parameter can suppress. All playback here
          goes through the JS API, so the iframe never needs to receive
          pointer input. */}
      <div className="pointer-events-none h-full w-full">
        <div id={mountId} className="h-full w-full" />
      </div>

      {ready && (
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-3 bg-gradient-to-t from-ink/80 to-transparent px-4 py-3">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play"}
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
