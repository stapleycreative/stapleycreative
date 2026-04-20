import Image from "next/image";

/**
 * Responsive phone-screenshot gallery. Used in case studies to show the breadth
 * of a shipped product. Grid — 2 cols mobile, 3 tablet, 4 desktop. Each item
 * preserves its natural aspect ratio.
 *
 * MDX can't reliably pass array literals through next-mdx-remote, so we export
 * named variants (e.g. <HikiScreenshots />) that wrap this component with a
 * hardcoded list. Add new variants at the bottom of this file when new case
 * studies need galleries.
 */
function GalleryBase({
  images,
  caption,
  alt = "Product screenshots",
}: {
  images: string[];
  caption?: string;
  alt?: string;
}) {
  return (
    <figure className="not-prose my-12" aria-label={alt}>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
        {images.map((src, i) => (
          <div
            key={src}
            className="relative aspect-[975/2113] overflow-hidden rounded-[28px]"
            style={{
              boxShadow: "0 1px 3px rgba(28, 32, 36, 0.06), 0 0 1px rgba(28, 32, 36, 0.04)",
            }}
          >
            <Image
              src={src}
              alt={`${alt} ${i + 1}`}
              fill
              sizes="(min-width: 1024px) 260px, (min-width: 640px) 30vw, 45vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      {caption && (
        <figcaption
          className="text-xs mt-6 text-center"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// Order mirrors the original Squarespace site's "Pulling it all together"
// 4-column layout: row 1 = positions 1-4, row 2 = 5-8, row 3 = 9-12.
const HIKI_SCREENS = [
  "/work/hiki/screens/screen-639.png",
  "/work/hiki/screens/screen-637.png",
  "/work/hiki/screens/screen-634.png",
  "/work/hiki/screens/screen-636.png",
  "/work/hiki/screens/screen-633.png",
  "/work/hiki/screens/screen-632.png",
  "/work/hiki/screens/screen-635.png",
  "/work/hiki/screens/screen-630.png",
  "/work/hiki/screens/screen-community.png",
  "/work/hiki/screens/screen-640.png",
  "/work/hiki/screens/screen-631.png",
  "/work/hiki/screens/screen-641.png",
];

export function HikiScreenshots({ caption }: { caption?: string }) {
  return (
    <GalleryBase
      images={HIKI_SCREENS}
      alt="Hiki redesign product screens"
      caption={
        caption ??
        "From research to rebrand. UX, UI, design system, flows, animations, and illustrations — every surface rebuilt."
      }
    />
  );
}
