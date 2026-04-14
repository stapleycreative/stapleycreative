"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useEffect, useState, ReactNode } from "react";
import gsap from "gsap";

const links = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/ai", label: "AI" },
  { href: "/blog", label: "Writing" },
  { href: "/tools", label: "Tools" },
  { href: "/about", label: "About" },
];

function DiagnosticLink({ href, label, index, isActive }: { href: string, label: string, index: number, isActive: boolean }) {
  return (
    <Link
      href={href}
      className={`relative h-full px-3 flex items-center select-none group transition-colors`}
    >
      {/* Precision Active Indicator (Static Bottom Line) */}
      <div 
        className="absolute left-0 right-0 h-[1.5px] bg-[var(--color-text-primary)] transition-all duration-300 ease-out pointer-events-none"
        style={{
          bottom: "-1px", /* Exact overlap with the 1px header border */
          width: isActive ? "100%" : "0%",
          opacity: isActive ? 1 : 0
        }}
      />
      
      {/* Inner Content */}
      <div className="flex items-baseline gap-2">
        {/* Diagnostic Index */}
        <span 
          className="font-mono text-[9px] tracking-widest transition-opacity duration-200"
          style={{ color: "var(--color-text-tertiary)", opacity: isActive ? 0.8 : 0.4 }}
        >
          0{index + 1}
        </span>

        {/* Label */}
        <span 
          className="text-[13px] font-medium transition-colors duration-200"
          style={{
            color: isActive
              ? "var(--color-text-primary)"
              : "var(--color-text-secondary)",
          }}
        >
          {label}
        </span>
      </div>
    </Link>
  );
}

function MagneticLogo() {
  const contentRef = useRef<HTMLAnchorElement>(null);
  
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    
    // QuickTo for high-performance physics-like magnetic snapping
    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

    const mouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = el.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      xTo(x * 0.15); // slightly tighter dampening for "precision" feel
      yTo(y * 0.15);
    };

    const mouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    // Attach event listeners to the PARENT container so it triggers early
    const parentContainer = el.parentElement;
    if (parentContainer) {
      parentContainer.addEventListener("mousemove", mouseMove);
      parentContainer.addEventListener("mouseleave", mouseLeave);
    }
    
    return () => {
      if (parentContainer) {
        parentContainer.removeEventListener("mousemove", mouseMove);
        parentContainer.removeEventListener("mouseleave", mouseLeave);
      }
    };
  }, []);

  return (
    <div className="flex items-center h-full px-2 -ml-2">
      <Link
        href="/"
        ref={contentRef}
        className="flex items-center"
      >
        <Image
          src="/logo.svg"
          alt="Craig Stapley"
          width={106}
          height={50}
          className="h-[30px] w-auto transition-opacity hover:opacity-100"
          style={{ opacity: 0.85 }}
          priority
        />
      </Link>
    </div>
  );
}

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Global Keyboard Shortcuts (1-6 for navigation)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        (document.activeElement as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      const key = e.key;
      const num = parseInt(key, 10);
      
      // If valid number and within range of links
      if (!isNaN(num) && num > 0 && num <= links.length) {
        const link = links[num - 1];
        if (link) {
          router.push(link.href);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{
        backgroundColor: "rgba(252, 252, 253, 0.8)",
        borderColor: "var(--color-border-subtle)",
      }}
    >
      <nav className="mx-auto px-6 h-14 flex justify-between"
        style={{ maxWidth: "var(--max-width-wide)" }}>
        
        <MagneticLogo />

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-stretch gap-2">
          {links.map(({ href, label }, index) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href} className="flex" style={{ perspective: "400px" }}>
                <DiagnosticLink href={href} label={label} index={index} isActive={isActive} />
              </li>
            );
          })}
        </ul>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden text-[10px] font-mono tracking-widest uppercase transition-colors"
          style={{ color: "var(--color-text-primary)" }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "Close" : "Menu"}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div 
          className="md:hidden absolute top-14 left-0 w-full border-b shadow-sm flex flex-col py-4 px-6 gap-4"
          style={{
            backgroundColor: "#fcfcfd",
            borderColor: "var(--color-border-subtle)"
          }}
        >
          {links.map(({ href, label }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="text-lg font-medium transition-colors"
                style={{
                  color: isActive
                    ? "var(--color-text-primary)"
                    : "var(--color-text-secondary)",
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
