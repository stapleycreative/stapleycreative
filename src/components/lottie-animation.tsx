"use client";

import { Player } from "@lottiefiles/react-lottie-player";

export function LottieAnimation({
  src,
  caption,
  autoplay = true,
  loop = true,
  speed = 1,
  aspect = "16/9",
}: {
  src: string;
  caption?: string;
  autoplay?: boolean;
  loop?: boolean;
  speed?: number;
  aspect?: string;
}) {
  return (
    <figure className="my-8 not-prose" aria-label={caption || "Animation"}>
      <div
        className="rounded-lg overflow-hidden flex items-center justify-center"
        style={{
          aspectRatio: aspect,
          backgroundColor: "var(--color-bg-surface)",
          border: "1px solid var(--color-border-subtle)",
        }}
      >
        <Player
          autoplay={autoplay}
          loop={loop}
          speed={speed}
          src={src}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      {caption && (
        <figcaption
          className="text-xs mt-3"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
