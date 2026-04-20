"use client";

/**
 * Frameless autoplay video player for MDX. Paired with VideoPair for side-by-side
 * arrangements. Playback rules are baked in: muted, looped, plays inline, autoplays
 * (these are the only browser-supported autoplay settings for mobile). No controls
 * by default — these are illustrative loops, not long-form content.
 */
export function VideoBlock({
  src,
  caption,
  aspect = "4/5",
  size = 360,
  offsetX = 0,
}: {
  src: string;
  caption?: string;
  aspect?: string;
  /** Max width in px. Default 360px keeps it phone-sized rather than full-bleed. */
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
      aria-label={caption || "Video"}
    >
      <div
        className="overflow-hidden rounded-[20px]"
        style={{ aspectRatio: aspect }}
      >
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
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

/**
 * Two videos side by side on desktop, stacked on mobile. Use for paired
 * before/after or complementary views where both are meant to be seen together.
 */
export function VideoPair({
  src1,
  src2,
  caption,
  aspect = "4/5",
}: {
  src1: string;
  src2: string;
  caption?: string;
  aspect?: string;
}) {
  return (
    <figure
      className="my-8 not-prose mx-auto"
      aria-label={caption || "Video pair"}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-[700px] mx-auto">
        {[src1, src2].map((src, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-[20px]"
            style={{ aspectRatio: aspect }}
          >
            <video
              src={src}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        ))}
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
