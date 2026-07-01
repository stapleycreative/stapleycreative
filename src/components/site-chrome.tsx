/**
 * The site is now a single-page experience (home) plus editorial detail
 * pages/modals. No global nav/footer chrome — each surface owns its own.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return <main className="flex-1">{children}</main>;
}
