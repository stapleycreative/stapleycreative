"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Writing" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{
        backgroundColor: "rgba(252, 252, 253, 0.8)",
        borderColor: "var(--color-border-subtle)",
      }}
    >
      <nav className="mx-auto px-6 h-14 flex items-center justify-between"
        style={{ maxWidth: "var(--max-width-wide)" }}>
        <Link
          href="/"
          className="flex items-center"
        >
          <Image
            src="/logo.svg"
            alt="Craig Stapley"
            width={106}
            height={50}
            className="h-5 w-auto"
            style={{ opacity: 0.85 }}
            priority
          />
        </Link>

        <ul className="flex gap-1">
          {links.map(({ href, label }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className="px-3 py-1.5 text-sm rounded-md transition-colors"
                  style={{
                    color: isActive
                      ? "var(--color-text-primary)"
                      : "var(--color-text-secondary)",
                    backgroundColor: isActive
                      ? "var(--color-bg-subtle)"
                      : "transparent",
                  }}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
