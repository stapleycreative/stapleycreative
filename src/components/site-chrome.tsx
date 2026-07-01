"use client";

import { usePathname } from "next/navigation";
import { Nav } from "./nav";
import { Footer } from "./footer";

/**
 * Renders the global Nav/Footer on every route EXCEPT the single-page /v3,
 * which owns its own anchor nav and footer.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = pathname === "/" || pathname?.startsWith("/v3");

  if (bare) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
