"use client";

import YouTubePlayer from "./YouTubePlayer";

function extractYouTubeId(url: string): string | null {
  const match = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

export default function VideoEmbed({ embedUrl, title }: { embedUrl: string; title: string }) {
  const videoId = extractYouTubeId(embedUrl);

  if (videoId) {
    return <YouTubePlayer videoId={videoId} title={title} />;
  }

  return (
    <iframe
      src={embedUrl}
      title={title}
      className="absolute inset-0 block h-full w-full border-0"
      allow="autoplay; fullscreen"
      allowFullScreen
    />
  );
}
