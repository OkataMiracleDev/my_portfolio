// Minimal ambient types for the subset of the YouTube IFrame Player API used
// by components/Animate/YouTubePlayer.tsx. Not the full API surface —
// https://developers.google.com/youtube/iframe_api_reference
declare namespace YT {
  enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
  }

  interface OnStateChangeEvent {
    data: PlayerState;
    target: Player;
  }

  interface OnReadyEvent {
    target: Player;
  }

  interface PlayerOptions {
    videoId?: string;
    playerVars?: {
      controls?: 0 | 1;
      modestbranding?: 0 | 1;
      rel?: 0 | 1;
      iv_load_policy?: 1 | 3;
      disablekb?: 0 | 1;
      fs?: 0 | 1;
      playsinline?: 0 | 1;
    };
    events?: {
      onReady?: (event: OnReadyEvent) => void;
      onStateChange?: (event: OnStateChangeEvent) => void;
    };
  }

  class Player {
    constructor(elementId: string, options: PlayerOptions);
    playVideo(): void;
    pauseVideo(): void;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    getCurrentTime(): number;
    getDuration(): number;
    destroy(): void;
  }
}

interface Window {
  YT: typeof YT;
  onYouTubeIframeAPIReady?: () => void;
}
