"use client";

import { useEffect, useRef, useState } from "react";

export function CaseStudyDetail({
  title, lead, eyebrow, role, year, client, tags = [], accent = "#F98077", isPost = false, inModal = false, children,
}: {
  title: string; lead?: string; eyebrow?: string; role?: string; year?: string;
  client?: string; tags?: string[]; accent?: string; isPost?: boolean; inModal?: boolean; children: React.ReactNode;
}) {
  const [showCta, setShowCta] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) setShowCta(true);
    });
    if (sentinel.current) io.observe(sentinel.current);
    return () => io.disconnect();
  }, []);

  return (
    <div className="csd">
      <style>{CSS}</style>
      <div className="dwrap">
        <a className="dback" href="/">← Craig Stapley</a>
        {!inModal ? <a className="dxlink" href="/" aria-label="Close">✕</a> : null}
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
              <div className="k">Get in touch</div>
              <a href="mailto:stapleycreative@gmail.com">Start a conversation →</a>
            </div>
          </aside>
          <div className="dcontent">
            <div ref={sentinel} className="sentinel" aria-hidden="true" />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

const CSS = `
.csd{font-family:var(--font-family),system-ui,sans-serif;color:#211f26}
.csd .dwrap{max-width:1080px;margin:0 auto;padding:56px 24px 120px}
.csd .dback{display:inline-block;font-family:ui-monospace,Menlo,monospace;font-size:12px;color:#84828e;text-decoration:none;margin-bottom:26px}
.csd .dback:hover{color:#211f26}
.csd .dxlink{position:fixed;top:18px;right:20px;z-index:30;width:40px;height:40px;border-radius:50%;border:1px solid #d0cdd7;background:rgba(253,252,253,.85);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;color:#211f26;text-decoration:none;font-size:15px}
.csd .dxlink:hover{border-color:#211f26}
.csd .accentbar{width:44px;height:4px;border-radius:3px;margin-bottom:22px}
.csd .deyebrow{font-family:ui-monospace,Menlo,monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#84828e;margin-bottom:14px}
.csd .dtitle{font-family:var(--font-serif),Georgia,serif;font-size:clamp(32px,4.6vw,52px);font-weight:460;letter-spacing:-.025em;line-height:1.04;max-width:18ch;margin:0;font-variation-settings:"opsz" 110}
.csd .dlead{margin-top:22px;font-size:20px;line-height:1.55;color:#211f26;max-width:60ch}
.csd .dcols{display:grid;grid-template-columns:200px 1fr;gap:56px;margin-top:48px;align-items:start}
@media(max-width:820px){.csd .dcols{grid-template-columns:1fr;gap:28px}}
.csd .dmeta{position:sticky;top:90px;display:flex;flex-direction:column;gap:18px}
@media(max-width:820px){.csd .dmeta{position:static;flex-direction:row;flex-wrap:wrap;gap:24px;padding-bottom:20px;border-bottom:1px solid #eae7ec}}
.csd .dmeta .k{font-family:ui-monospace,Menlo,monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#84828e}
.csd .dmeta .v{font-size:14px;font-weight:500;margin-top:3px;color:#211f26}
.csd .dtags{display:flex;gap:6px;flex-wrap:wrap;margin-top:4px}
.csd .tag{font-family:ui-monospace,Menlo,monospace;font-size:10px;color:#65636d;background:rgba(20,20,19,.06);padding:2px 7px;border-radius:4px}
.csd .cta{opacity:0;transform:translateY(8px);transition:opacity .5s cubic-bezier(.16,1,.3,1),transform .5s cubic-bezier(.16,1,.3,1);margin-top:8px;padding-top:18px;border-top:1px solid #eae7ec}
.csd .cta.show{opacity:1;transform:none}
.csd .cta a{display:inline-block;margin-top:6px;font-size:14px;font-weight:500;color:#F98077;text-decoration:none}
.csd .dcontent{position:relative;min-width:0;max-width:720px;font-size:16px;line-height:1.7;color:#211f26}
.csd .sentinel{position:absolute;top:560px;left:0;width:1px;height:1px}
.csd .dcontent p{margin:0 0 18px;color:#65636d}
.csd .dcontent h2{font-size:22px;font-weight:600;letter-spacing:-.01em;margin:38px 0 12px;color:#211f26}
.csd .dcontent h3{font-size:18px;font-weight:600;margin:28px 0 8px}
.csd .dcontent a{color:#F98077;text-decoration:underline;text-underline-offset:2px}
.csd .dcontent img{border-radius:8px;max-width:100%;height:auto}
.csd .dcontent blockquote{border-left:2px solid #bcbac7;padding-left:18px;margin:24px 0;font-style:italic;color:#65636d}
`;
