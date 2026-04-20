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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {images.map((src, i) => (
          <div
            key={src}
            className="relative aspect-[9/16] overflow-hidden rounded-xl"
          >
            <Image
              src={src}
              alt={`${alt} ${i + 1}`}
              fill
              sizes="(min-width: 1024px) 260px, (min-width: 640px) 30vw, 45vw"
              className="object-contain"
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

const HIKI_SCREENS = [
  "/work/hiki/screens/screen-630.png",
  "/work/hiki/screens/screen-631.png",
  "/work/hiki/screens/screen-632.png",
  "/work/hiki/screens/screen-633.png",
  "/work/hiki/screens/screen-634.png",
  "/work/hiki/screens/screen-635.png",
  "/work/hiki/screens/screen-636.png",
  "/work/hiki/screens/screen-637.png",
  "/work/hiki/screens/screen-639.png",
  "/work/hiki/screens/screen-640.png",
  "/work/hiki/screens/screen-641.png",
  "/work/hiki/screens/screen-643.png",
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
