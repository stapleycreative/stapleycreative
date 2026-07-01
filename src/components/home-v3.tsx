"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Work = {
  slug: string; title: string; sub: string; role: string; year: string;
  client: string; tags: string[]; metric: string; ground: string; accent: string; lead: string;
};
type Post = { slug: string; title: string; rt: string; ground: string; accent: string };

const works: Work[] = [
  { slug: "ifit", title: "Eleven years, one proposal", sub: "NordicTrack checkout — iFIT",
    role: "Creative Director → Principal Designer", year: "2011–2022", client: "iFIT", tags: ["Scale", "Revenue", "Leadership"],
    metric: '<b class="hi">44%</b> of $1.7B hardware revenue', ground: "#0B2A3A", accent: "#00A3E0",
    lead: "I wrote a deck showing NordicTrack's checkout could go from seven steps to four. Leadership put me on the project because of it." },
  { slug: "hiki", title: "Designing for nervous systems, not user flows", sub: "Social + dating — Hiki",
    role: "Lead Product Designer (sole designer)", year: "2023–2025", client: "Hiki", tags: ["Behavioral", "Accessibility", "Consumer"],
    metric: '<b class="hi">700+</b> screens · iOS + Android', ground: "#2D1F3D", accent: "#E85C8A",
    lead: "Hiki was a social and dating platform for neurodivergent adults. As the sole designer I rebuilt it from the ground up: rebrand, design system, 700+ screens." },
  { slug: "santas-red-letter", title: "What if Santa wrote back?", sub: "Founder — Santa's Red Letter",
    role: "Founder / Designer / Operator", year: "2014–2021", client: "Santa's Red Letter", tags: ["Entrepreneurship", "Brand", "Product"],
    metric: "Built, scaled, and sold", ground: "#A8232B", accent: "#F8F6F2",
    lead: "I built a business from a bedtime question. Personalized letters from Santa: launched in two months, national TV coverage, partnered with Toys for Tots, then sold." },
  { slug: "sunday-school", title: "Designing for the hardest emotional transition there is", sub: "Social advocacy platform",
    role: "Creator / Designer / Author", year: "2016–2020", client: "Stuff You Missed in Sunday School", tags: ["Emotional Design", "Persuasion", "Content"],
    metric: "Belief change without rejection", ground: "#111318", accent: "#EC2C6E",
    lead: "How do you help people question load-bearing beliefs without triggering the reflexive rejection that protects those beliefs?" },
];

const posts: Post[] = [
  { slug: "mode-based-workflow-adhd", title: "Mode-based design: an externalized executive function for an ADHD brain", rt: "5 min", ground: "#222433", accent: "#F98077" },
  { slug: "adversarial-critic-relay", title: "Two minds are better than one: building an adversarial AI critic", rt: "5 min", ground: "#1E2A2E", accent: "#7CC4FF" },
  { slug: "five-gate-design-process", title: "The 5-Gate Design Process: forcing AI (and me) to earn each step", rt: "4 min", ground: "#2A2230", accent: "#FFC24B" },
];

const aiNodes: [string, string][] = [
  ["bisociation", "Creativity Engine"], ["adversarial review", "Claude ↔ ChatGPT relay"],
  ["procedural memory", "Mode-based workflow"], ["metacognition", "5-Gate design process"],
  ["sensorimotor loop", "Figma MCP bridge"], ["skill chunking", "25-skill plugin library"],
];

const shade = (hex: string, p: number) => {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + p));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + p));
  const b = Math.max(0, Math.min(255, (n & 255) + p));
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
};
const heroBg = (ground: string, accent: string) =>
  `radial-gradient(120% 130% at 72% 12%, ${accent}66, transparent 55%), linear-gradient(135deg, ${ground}, ${shade(ground, -18)})`;

const sections = ["home", "work", "ai", "writing", "about"];

export function HomeV3() {
  const markRef = useRef<HTMLImageElement>(null);
  const heroRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [preview, setPreview] = useState<Work | null>(works[0]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      if (!reduced && markRef.current)
        markRef.current.style.transform = `translate3d(0, ${window.scrollY * -0.2}px, 0)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });

    if (!reduced && heroRef.current) {
      heroRef.current.animate(
        [
          { textShadow: "-2px 0 0 rgba(255,40,40,.5), 2px 0 0 rgba(0,200,255,.5)", opacity: 0.6 },
          { textShadow: "0 0 0 rgba(255,40,40,0), 0 0 0 rgba(0,200,255,0)", opacity: 1 },
        ],
        { duration: 900, easing: "cubic-bezier(0.16,1,0.3,1)", fill: "backwards" }
      );
    }
    // Section fade-ups on scroll
    const rio = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); rio.unobserve(e.target); } }),
      { threshold: 0.15 }
    );
    document.querySelectorAll(".v3 [data-reveal]").forEach((el) => rio.observe(el));

    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); rio.disconnect(); };
  }, []);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="v3">
      <style>{CSS}</style>

      <img ref={markRef} className="v3-mark" src="/v2-mark.svg" alt="" aria-hidden="true" />

      <header className={"v3-nav" + (scrolled ? " scrolled" : "")}>
        <div className="v3-wrap v3-navwrap">
          <button className="v3-logo" onClick={() => go("home")}>Craig Stapley</button>
          <nav className="v3-links">
            {sections.map((s, i) => (
              <button key={s} className={active === s ? "on" : ""} onClick={() => go(s)}>
                <span className="n">{"0" + (i + 1)}</span>
                <span className="lbl">{s === "ai" ? "AI" : s[0].toUpperCase() + s.slice(1)}</span>
                <span className="u" />
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="v3-wrap">
        {/* Hero */}
        <section id="home" className="v3-hero">
          <div className="v3-status"><span className="dot" />Currently at GiveCampus · Open to staff / principal roles</div>
          <h1 ref={heroRef} className="v3-h1">Every product has two versions. The one everyone thinks they’re building, and the one users actually experience.</h1>
          <p className="v3-sub">I’m Craig. Twenty years in design taught me that interfaces rarely fail first. Models do. Lately, I’ve been focused on AI products, human review loops, and the systems that make complex workflows feel usable.</p>
          <div className="v3-cta">
            <button className="v3-btn primary" onClick={() => go("work")}>See the work ↓</button>
            <a className="v3-btn ghost" href="mailto:stapleycreative@gmail.com">Get in touch</a>
          </div>
          <div className="v3-meta3">
            <div><div className="k">Focus</div><div className="v">Cognitive interfaces</div></div>
            <div><div className="k">Location</div><div className="v">Salt Lake City, UT</div></div>
            <div><div className="k">Experience</div><div className="v">20+ years</div></div>
          </div>
        </section>

        {/* Work */}
        <section id="work" className="v3-sec">
          <div className="v3-seclabel" data-reveal><h2>Selected work</h2><span className="n">02</span></div>
          <div className="v3-workgrid">
            <div className="v3-worklist" ref={listRef} onMouseLeave={() => setPreview(works[0])}>
              {works.map((w, i) => (
                <Link key={w.slug} href={`/work/${w.slug}`} className="v3-row" onMouseEnter={() => setPreview(w)}>
                  <span className="idx">{"0" + (i + 1)}</span>
                  <div>
                    <h3><span className="ink">{w.title}</span></h3>
                    <div className="desc">{w.sub}</div>
                    <div className="tags">{w.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
                    <div className="metric" dangerouslySetInnerHTML={{ __html: w.metric }} />
                    <div className="thumb" style={{ background: heroBg(w.ground, w.accent) }} />
                  </div>
                  <span className="chev">↗</span>
                </Link>
              ))}
            </div>
            <div className="v3-preview" aria-hidden="true">
              {preview && (
                <div key={preview.slug} className="pv show" style={{ background: heroBg(preview.ground, preview.accent) }}>
                  <span className="cap">{preview.sub}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* AI */}
        <section id="ai" className="v3-sec">
          <div className="v3-seclabel" data-reveal><h2>AI</h2><span className="n">03</span></div>
          <h3 className="v3-statement">I build small minds. Then I put them to work.</h3>
          <p className="v3-lead">Not “AI-assisted design.” Small cognitive systems, each modeled on a specific part of how brains produce good work, plugged into my process as separate roles. The judgment stays with me.</p>
          <div className="v3-nodes">
            {aiNodes.map(([fn, ar]) => (
              <div key={fn} className="node"><span className="fn">{fn}</span><span className="ar">{ar}</span></div>
            ))}
          </div>
        </section>

        {/* Writing */}
        <section id="writing" className="v3-sec">
          <div className="v3-seclabel" data-reveal><h2>Writing</h2><span className="n">04</span></div>
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="v3-post">
              <span className="t">{p.title}</span><span className="rt">{p.rt}</span>
            </Link>
          ))}
        </section>

        {/* About */}
        <section id="about" className="v3-sec v3-about">
          <div className="v3-seclabel" data-reveal><h2>About</h2><span className="n">05</span></div>
          <p>I think at the system level and build at the prototype level. AI is a design material in my workflow, not a replacement for design judgment. Twenty years across consumer, B2B SaaS, and ed-tech, always at the intersection of complex systems and human behavior.</p>
          <div className="v3-contact">
            <a className="em" href="mailto:stapleycreative@gmail.com">stapleycreative@gmail.com</a>
            <a href="https://www.linkedin.com/in/stapleycreative/" target="_blank" rel="noopener">LinkedIn ↗</a>
          </div>
        </section>
      </div>
    </div>
  );
}

const CSS = `
.v3{--bg:var(--color-bg-primary);--surface:var(--color-bg-surface);--subtle:var(--color-bg-subtle);--text:var(--color-text-primary);--t2:var(--color-text-secondary);--t3:var(--color-text-tertiary);
  --border:var(--color-border-default);--border-sub:var(--color-border-subtle);--border-strong:var(--color-border-strong);--accent:var(--color-accent);--wide:1080px;
  --mono:ui-monospace,SFMono-Regular,Menlo,Monaco,monospace;--serif:var(--font-serif),Georgia,serif;
  --ease:cubic-bezier(0.16,1,0.3,1);--dq:180ms;--ds:300ms;--dl:620ms;
  position:relative;font-family:var(--font-family),system-ui,sans-serif;color:var(--text);background:var(--bg)}
.v3 *{box-sizing:border-box}
.v3-wrap{max-width:var(--wide);margin:0 auto;padding:0 24px}
@media(min-width:1100px){.v3-wrap{max-width:1240px;padding-left:240px;padding-right:24px}}
.v3-mark{position:absolute;left:0;top:0;height:760px;width:auto;z-index:70;pointer-events:none;user-select:none;will-change:transform}
@media(max-width:1099px){.v3-mark{display:none}}
.v3-nav{position:sticky;top:0;z-index:60;background:transparent;border-bottom:1px solid transparent;transition:background var(--ds) var(--ease),border-color var(--ds) var(--ease)}
.v3-nav.scrolled{background:rgba(253,252,253,.8);backdrop-filter:blur(8px);border-bottom:1px solid rgba(33,31,38,.055)}
.v3-navwrap{display:flex;align-items:center;justify-content:space-between;height:56px}
.v3-logo{font-size:15px;font-weight:600;letter-spacing:-.01em;background:none;border:0;cursor:pointer;color:var(--text);font-family:inherit}
.v3-links{display:flex;height:100%}
.v3-links button{position:relative;display:flex;align-items:center;gap:6px;padding:0 12px;font-size:13px;font-weight:500;color:var(--t2);background:none;border:0;cursor:pointer;font-family:inherit}
.v3-links .n{font-family:var(--mono);font-size:9px;letter-spacing:.1em;color:var(--t3)}
.v3-links button.on{color:var(--text)}
.v3-links button.on .n{color:var(--accent)}
.v3-links .u{position:absolute;left:8px;right:8px;bottom:-1px;height:1.5px;background:var(--text);transform:scaleX(0);transform-origin:left;transition:transform var(--dq) var(--ease)}
.v3-links button.on .u{transform:scaleX(1)}
@media(max-width:680px){.v3-links .lbl{display:none}.v3-links button{padding:0 9px}}
.v3 section{position:relative;z-index:1}
.v3-hero{min-height:84vh;display:flex;flex-direction:column;justify-content:center;padding:88px 0 56px}
.v3-status{font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--t3);display:flex;align-items:center;gap:8px;margin-bottom:22px}
.v3-status .dot{width:7px;height:7px;border-radius:50%;background:var(--accent)}
.v3-h1{font-family:var(--serif);font-size:clamp(36px,5.2vw,72px);font-weight:360;letter-spacing:-.02em;line-height:1.05;max-width:15ch;font-variation-settings:"opsz" 144;margin:0}
.v3-sub{margin-top:28px;font-size:18px;color:var(--t2);max-width:640px;line-height:1.6}
.v3-cta{margin-top:34px;display:flex;gap:12px;flex-wrap:wrap}
.v3-btn{padding:12px 20px;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;border:1px solid transparent;font-family:inherit;text-decoration:none;display:inline-block}
.v3-btn.primary{background:var(--text);color:var(--bg)}
.v3-btn.ghost{border-color:var(--border);color:var(--text);background:none}
.v3-meta3{margin-top:34px;display:flex;gap:48px;flex-wrap:wrap}
.v3-meta3 .k{font-family:var(--mono);font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--t3)}
.v3-meta3 .v{font-size:14px;font-weight:500;margin-top:3px}
.v3-sec{padding:48px 0}
.v3-seclabel{display:flex;align-items:baseline;justify-content:space-between;border-bottom:1px solid var(--border-sub);padding-bottom:12px;margin-bottom:28px}
.v3-seclabel h2{font-family:var(--mono);font-size:12px;font-weight:500;letter-spacing:.09em;text-transform:uppercase;color:var(--t3);margin:0}
.v3-seclabel .n{font-family:var(--mono);font-size:11px;letter-spacing:.12em;color:var(--t3)}
.v3-workgrid{display:grid;grid-template-columns:1fr 360px;gap:52px;align-items:start}
.v3-worklist{min-width:0}
.v3-row{position:relative;display:grid;grid-template-columns:auto 1fr auto;gap:18px;align-items:start;padding:20px 4px;border-bottom:1px solid var(--border-sub);text-decoration:none;color:inherit;transition:padding-left var(--ds) var(--ease)}
.v3-row:hover{padding-left:12px}
.v3-row .idx{font-family:var(--mono);font-size:11px;color:var(--t3);padding-top:6px}
.v3-row h3{font-family:var(--serif);font-size:clamp(21px,2.3vw,28px);font-weight:500;letter-spacing:-.005em;line-height:1.12;font-variation-settings:"opsz" 40;margin:0}
.v3-row h3 .ink{background-image:linear-gradient(var(--text),var(--text));background-repeat:no-repeat;background-position:0 100%;background-size:0% 1.5px;transition:background-size var(--ds) var(--ease);padding-bottom:2px}
.v3-row:hover h3 .ink{background-size:100% 1.5px}
.v3-row .desc{margin-top:5px;font-size:14px;color:var(--t2)}
.v3-row .tags{display:flex;gap:6px;margin-top:10px;flex-wrap:wrap}
.v3 .tag{font-family:var(--mono);font-size:10px;color:var(--t2);background:rgba(20,20,19,.06);padding:2px 7px;border-radius:4px}
.v3-row .metric{color:var(--t3);font-family:var(--mono);font-size:12px;margin-top:9px}
.v3-row .metric .hi{color:var(--accent);font-weight:600}
.v3-row .chev{color:var(--t3);font-size:17px;padding-top:4px;transition:transform var(--ds) var(--ease),color var(--ds)}
.v3-row:hover .chev{transform:translateX(4px);color:var(--text)}
.v3-preview{position:sticky;top:96px;aspect-ratio:4/3;border-radius:12px;transition:box-shadow var(--ds) var(--ease)}
.v3-preview:has(.pv.show){box-shadow:0 20px 48px -24px rgba(33,31,38,.4)}
.v3-preview .pv{position:absolute;inset:0;border-radius:12px;overflow:hidden;opacity:0;transform:scale(1.05);filter:saturate(.92);transition:opacity var(--ds) var(--ease),transform var(--dl) var(--ease),filter var(--dl) var(--ease)}
.v3-preview .pv.show{opacity:1;transform:scale(1);filter:saturate(1.05)}
.v3-preview .cap{position:absolute;left:14px;bottom:12px;color:#fff;font-family:var(--mono);font-size:11px;letter-spacing:.04em;background:rgba(20,20,19,.4);padding:3px 8px;border-radius:5px;backdrop-filter:blur(4px);z-index:2}
.v3-row .thumb{display:none;grid-column:1 / -1;width:172px;aspect-ratio:16/10;border-radius:8px;overflow:hidden;margin-top:12px}
@media(max-width:980px){.v3-workgrid{grid-template-columns:1fr}.v3-preview{display:none}.v3-row .thumb{display:block}.v3-row .chev{display:none}}
.v3-statement{font-family:var(--serif);font-size:clamp(26px,3.2vw,38px);font-weight:500;letter-spacing:-.015em;line-height:1.1;max-width:18ch;margin:0 0 20px;font-variation-settings:"opsz" 72}
.v3-lead{font-size:16px;color:var(--t2);max-width:640px;margin-bottom:26px}
.v3-nodes{display:grid;grid-template-columns:1fr 1fr;gap:0 40px}
@media(max-width:640px){.v3-nodes{grid-template-columns:1fr}}
.v3-nodes .node{display:flex;justify-content:space-between;gap:14px;padding:11px 2px;border-bottom:1px solid var(--border-sub)}
.v3-nodes .fn{font-family:var(--mono);font-size:12px;color:var(--t3)}
.v3-nodes .ar{font-size:14px;font-weight:500;text-align:right}
.v3-post{display:flex;align-items:baseline;justify-content:space-between;gap:16px;padding:15px 4px;border-bottom:1px solid var(--border-sub);text-decoration:none;color:inherit;transition:padding-left var(--ds) var(--ease)}
.v3-post:hover{padding-left:12px}
.v3-post .t{font-size:15px;font-weight:500}
.v3-post .rt{font-family:var(--mono);font-size:11px;color:var(--t3);flex-shrink:0}
.v3-about{padding-bottom:96px}
.v3-about p{font-size:17px;color:var(--t2);max-width:600px;line-height:1.6;margin:0}
.v3-contact{margin-top:24px;display:flex;gap:24px;flex-wrap:wrap;font-size:14px}
.v3-contact a.em{color:var(--text);font-weight:500;text-decoration:underline;text-underline-offset:3px}
.v3-contact a{color:var(--t2);text-decoration:none}
.v3 [data-reveal]{opacity:0;transform:translateY(12px);transition:opacity .6s var(--ease),transform .6s var(--ease)}
.v3 [data-reveal].in{opacity:1;transform:none}
@media (prefers-reduced-motion: reduce){.v3 *{animation-duration:.001ms!important;transition-duration:.001ms!important}.v3 [data-reveal]{opacity:1;transform:none}}
`;
