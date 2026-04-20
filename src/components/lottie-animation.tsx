"use client";

import dynamic from "next/dynamic";

const Player = dynamic(
  () =>
    import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

export function LottieAnimation({
  src,
  caption,
  autoplay = true,
  loop = true,
  speed = 1,
  aspect = "1/1",
  size = 360,
  offsetX = 0,
}: {
  src: string;
  caption?: string;
  autoplay?: boolean;
  loop?: boolean;
  speed?: number;
  aspect?: string;
  /** Max width in px. Default 360px keeps the animation illustrative rather than full-bleed. */
  size?: number;
  /** Horizontal offset in px from centered position. Negative = left. */
  offsetX?: number;
}) {
  return (
    <figure
      className="my-6 not-prose mx-auto"
      style={{
        maxWidth: `${size}px`,
        transform: offsetX ? `translateX(${offsetX}px)` : undefined,
      }}
      aria-label={caption || "Animation"}
    >
      <div
        className="flex items-center justify-center"
        style={{ aspectRatio: aspect }}
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
          className="text-xs mt-3 text-center"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
