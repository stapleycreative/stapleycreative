"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

export function V3Modal({
  title, lead, eyebrow, role, year, client, tags = [], accent = "#F98077", isPost = false, children,
}: {
  title: string; lead?: string; eyebrow?: string; role?: string; year?: string;
  client?: string; tags?: string[]; accent?: string; isPost?: boolean; children: React.ReactNode;
}) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [showCta, setShowCta] = useState(false);
  const [mounted, setMounted] = useState(false);

  const close = () => router.back();

  useEffect(() => {
    setMounted(true);
    const y = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${y}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);

    const sc = scrollRef.current;
    const onScroll = () => { if (sc && sc.scrollTop > 480) setShowCta(true); };
    sc?.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("keydown", onKey);
      sc?.removeEventListener("scroll", onScroll);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      window.scrollTo(0, y);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const node = (
    <div className="v3modal" ref={scrollRef} role="dialog" aria-modal="true" aria-label={title}>
      <style>{CSS}</style>
      <button ref={closeRef} className="dx" aria-label="Close" onClick={close}>✕</button>
      <div className="dwrap">
        <div className="accentbar" style={{ background: accent }} />
        {eyebrow ? <div className="deyebrow">{eyebrow}</div> : null}
        <h1 className="dtitle">{title}</h1>
        {lead ? <p className="dlead">{lead}</p> : null}

        <div className="dcols">
          <aside className="dmeta">
            {!isPost && role ? <div><div className="k">Role</div><div className="v">{role}</div></div> : null}
            {!isPost && year ? <div><div className="k">Year</div><div className="v">{year}</div></div> : null}
            {!isPost && client ? <div><div className="k">Client</div><div className="v">{client}</div></div> : null}
            {tags.length ? <div><div className="k">{isPost ? "Topics" : "Tags"}</div><div className="dtags">{tags.map((t) => <span key={t} className="tag">{t}</span>)}</div></div> : null}
            <div className={"cta" + (showCta ? " show" : "")}>
              <div className="k">Open to work</div>
              <a href="mailto:stapleycreative@gmail.com">Like this? Let’s talk →</a>
            </div>
          </aside>
          <div className="dcontent">{children}</div>
        </div>
      </div>
    </div>
  );

  return mounted ? createPortal(node, document.body) : null;
}

const CSS = `
.v3modal{position:fixed;inset:0;z-index:9999;background:var(--color-bg-primary,#fdfcfd);overflow-y:auto;
  font-family:var(--font-family),system-ui,sans-serif;color:#211f26;animation:v3mIn .32s cubic-bezier(0.16,1,0.3,1)}
@keyframes v3mIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.v3modal .dx{position:fixed;top:18px;right:20px;z-index:95;width:40px;height:40px;border-radius:50%;border:1px solid #d0cdd7;
  background:rgba(253,252,253,.85);backdrop-filter:blur(6px);cursor:pointer;font-size:17px;display:flex;align-items:center;justify-content:center;color:#211f26}
.v3modal .dwrap{max-width:1080px;margin:0 auto;padding:90px 24px 120px}
.v3modal .accentbar{width:44px;height:4px;border-radius:3px;margin-bottom:22px}
.v3modal .deyebrow{font-family:ui-monospace,Menlo,monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#84828e;margin-bottom:14px}
.v3modal .dtitle{font-family:var(--font-serif),Georgia,serif;font-size:clamp(32px,4.6vw,52px);font-weight:540;letter-spacing:-.018em;line-height:1.05;max-width:18ch;margin:0;font-variation-settings:"opsz" 96}
.v3modal .dlead{margin-top:22px;font-size:20px;line-height:1.55;color:#211f26;max-width:60ch}
.v3modal .dcols{display:grid;grid-template-columns:200px 1fr;gap:56px;margin-top:48px;align-items:start}
@media(max-width:820px){.v3modal .dcols{grid-template-columns:1fr;gap:28px}}
.v3modal .dmeta{position:sticky;top:90px;display:flex;flex-direction:column;gap:18px}
@media(max-width:820px){.v3modal .dmeta{position:static;flex-direction:row;flex-wrap:wrap;gap:24px;padding-bottom:20px;border-bottom:1px solid #eae7ec}}
.v3modal .dmeta .k{font-family:ui-monospace,Menlo,monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#84828e}
.v3modal .dmeta .v{font-size:14px;font-weight:500;margin-top:3px;color:#211f26}
.v3modal .dtags{display:flex;gap:6px;flex-wrap:wrap;margin-top:4px}
.v3modal .tag{font-family:ui-monospace,Menlo,monospace;font-size:10px;color:#65636d;background:rgba(20,20,19,.06);padding:2px 7px;border-radius:4px}
.v3modal .cta{opacity:0;transform:translateY(8px);transition:opacity .5s cubic-bezier(0.16,1,0.3,1),transform .5s cubic-bezier(0.16,1,0.3,1);
  margin-top:8px;padding-top:18px;border-top:1px solid #eae7ec}
.v3modal .cta.show{opacity:1;transform:none}
.v3modal .cta a{display:inline-block;margin-top:6px;font-size:14px;font-weight:500;color:#F98077;text-decoration:none}
.v3modal .dcontent{min-width:0;max-width:720px;font-size:16px;line-height:1.7;color:#211f26}
.v3modal .dcontent p{margin:0 0 18px;color:#65636d}
.v3modal .dcontent h2{font-family:var(--font-serif),Georgia,serif;font-size:24px;font-weight:540;letter-spacing:-.01em;margin:38px 0 12px;color:#211f26}
.v3modal .dcontent h3{font-size:18px;font-weight:600;margin:28px 0 8px}
.v3modal .dcontent a{color:#F98077;text-decoration:underline;text-underline-offset:2px}
.v3modal .dcontent img{border-radius:8px}
.v3modal .dcontent blockquote{border-left:2px solid #bcbac7;padding-left:18px;margin:24px 0;font-style:italic;color:#65636d}
@media (prefers-reduced-motion: reduce){.v3modal{animation:none}.v3modal .cta{transition:none}}
`;
