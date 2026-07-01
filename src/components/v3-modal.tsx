"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { CaseStudyDetail } from "./case-study-detail";

type Props = {
  title: string; lead?: string; eyebrow?: string; role?: string; year?: string;
  client?: string; tags?: string[]; accent?: string; isPost?: boolean; children: React.ReactNode;
};

export function V3Modal(props: Props) {
  const router = useRouter();
  const closeRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const close = () => router.back();

  useEffect(() => {
    setMounted(true);
    const y = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${y}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    setTimeout(() => closeRef.current?.focus(), 0);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { close(); return; }
      if (e.key === "Tab" && modalRef.current) {
        const f = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      window.scrollTo(0, y);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const node = (
    <div className="v3modal" ref={modalRef} role="dialog" aria-modal="true" aria-label={props.title}>
      <style>{CSS}</style>
      <button ref={closeRef} className="dx" aria-label="Close" onClick={close}>✕</button>
      <CaseStudyDetail {...props} />
    </div>
  );

  return mounted ? createPortal(node, document.body) : null;
}

const CSS = `
.v3modal{position:fixed;inset:0;z-index:9999;background:var(--color-bg-primary,#fdfcfd);overflow-y:auto;
  animation:v3mIn .32s cubic-bezier(0.16,1,0.3,1)}
@keyframes v3mIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.v3modal .dx{position:fixed;top:18px;right:20px;z-index:10;width:40px;height:40px;border-radius:50%;border:1px solid #d0cdd7;
  background:rgba(253,252,253,.85);backdrop-filter:blur(6px);cursor:pointer;font-size:17px;display:flex;align-items:center;justify-content:center;color:#211f26}
.v3modal .csd .dwrap{padding-top:88px}
@media (prefers-reduced-motion: reduce){.v3modal{animation:none}}
`;
