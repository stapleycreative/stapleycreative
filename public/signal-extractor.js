// extractor.js — v0.2
// Runs in page context via chrome.scripting.executeScript(files).
// Returns a plain-object feature bundle with evidence samples for rule evaluation.
// No DOM references escape this IIFE.

(function extractFeatures() {
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;
  const viewportArea = viewportW * viewportH;

  // ---------- helpers ----------
  const isVisible = (el) => {
    if (!el || !(el instanceof Element)) return false;
    const s = getComputedStyle(el);
    if (s.display === "none" || s.visibility === "hidden") return false;
    if (parseFloat(s.opacity || "1") <= 0.05) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  const inFirstViewport = (el) => {
    const r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < viewportH && r.width * r.height >= 16;
  };

  const shortSelector = (el) => {
    if (!el || !el.tagName) return "";
    const id = el.id ? `#${el.id}` : "";
    const cls = el.className && typeof el.className === "string"
      ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
      : "";
    return `${el.tagName.toLowerCase()}${id}${cls}`.slice(0, 80);
  };

  const parseColor = (str) => {
    if (!str) return null;
    const m = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\)/);
    if (!m) return null;
    return { r: +m[1], g: +m[2], b: +m[3], a: m[4] != null ? +m[4] : 1 };
  };

  const luminance = ({ r, g, b }) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  };

  const contrast = (c1, c2) => {
    const l1 = luminance(c1), l2 = luminance(c2);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };

  const rgbToHsl = ({ r, g, b }) => {
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (mx + mn) / 2;
    if (mx !== mn) {
      const d = mx - mn;
      s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
      switch (mx) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
        case g: h = ((b - r) / d + 2); break;
        case b: h = ((r - g) / d + 4); break;
      }
      h *= 60;
    }
    return { h, s, l };
  };

  const walkUpForOpaqueBg = (el) => {
    let cur = el;
    while (cur) {
      const cs = getComputedStyle(cur);
      const c = parseColor(cs.backgroundColor);
      if (c && c.a > 0.5) return c;
      cur = cur.parentElement;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };

  const INTERACTIVE_SELECTOR = [
    'a[href]', 'button', 'input:not([type="hidden"])', 'select', 'textarea',
    'summary', '[role="button"]', '[role="link"]', '[role="tab"]',
    '[role="checkbox"]', '[role="radio"]', '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  const HEADING_SELECTOR = 'h1,h2,h3,h4,h5,h6,[role="heading"]';

  const mainRoot =
    document.querySelector('main,[role="main"]') || document.body;

  // ---------- visible element universe ----------
  const allVisible = [];
  const walker = document.createTreeWalker(mainRoot, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (n) => isVisible(n) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
  });
  let node; let cap = 5000;
  while ((node = walker.nextNode()) && cap-- > 0) allVisible.push(node);

  const visibleInFirstViewport = allVisible.filter(inFirstViewport);

  const visibleInteractives = allVisible.filter(el => el.matches(INTERACTIVE_SELECTOR));
  const firstViewportInteractives = visibleInteractives.filter(inFirstViewport);
  const visibleHeadings = allVisible.filter(el => el.matches(HEADING_SELECTOR));

  // ---------- viewport-prioritized sampling for text nodes ----------
  // Priority: all in-viewport visible text candidates + top N by (area × textLen) beyond viewport
  const bodyTextCandidates = allVisible.filter(el => {
    if (el.matches(HEADING_SELECTOR)) return false;
    if (el.closest(INTERACTIVE_SELECTOR)) return false;
    const txt = (el.innerText || "").trim();
    if (txt.length < 20 || txt.length > 2000) return false;
    // leaf-ish: avoid wrapper divs that contain many children with text
    if (el.children.length > 6) return false;
    return true;
  });

  const MAX_TEXT_SAMPLE = 500;
  const inViewText = bodyTextCandidates.filter(inFirstViewport);
  const outOfViewText = bodyTextCandidates.filter(el => !inFirstViewport(el));
  const prioritized = outOfViewText.map(el => {
    const r = el.getBoundingClientRect();
    const txt = (el.innerText || "").trim();
    return { el, score: Math.max(1, r.width * r.height) * Math.min(txt.length, 1000) };
  }).sort((a, b) => b.score - a.score);
  const textSample = inViewText.concat(prioritized.slice(0, Math.max(0, MAX_TEXT_SAMPLE - inViewText.length)).map(p => p.el));
  const sampling = {
    text_total_candidates: bodyTextCandidates.length,
    text_sampled: textSample.length,
    text_sample_basis: "viewport-first, then area×textLen",
    dom_truncated: cap <= 0
  };

  // ========== PS — Perceptual Structure ==========

  // PS-1 heading/body prominence
  const headingProminence = visibleHeadings.filter(inFirstViewport).map(h => {
    const s = getComputedStyle(h);
    const fs = parseFloat(s.fontSize) || 14;
    const fw = parseFloat(s.fontWeight) || 400;
    const fg = parseColor(s.color) || { r: 0, g: 0, b: 0, a: 1 };
    const bg = walkUpForOpaqueBg(h);
    const cr = contrast(fg, bg);
    return {
      value: fs * (fw / 400) * cr,
      fontSize: fs,
      fontWeight: fw,
      contrast: +cr.toFixed(2),
      selector: shortSelector(h),
      text: (h.innerText || "").trim().slice(0, 60)
    };
  });
  const maxHeadingProminence = headingProminence.length ? Math.max(...headingProminence.map(x => x.value)) : 0;

  const bodyProminenceValues = inViewText.slice(0, 40).map(el => {
    const s = getComputedStyle(el);
    const fs = parseFloat(s.fontSize) || 14;
    const fw = parseFloat(s.fontWeight) || 400;
    const fg = parseColor(s.color) || { r: 0, g: 0, b: 0, a: 1 };
    const bg = walkUpForOpaqueBg(el);
    const cr = contrast(fg, bg);
    return fs * (fw / 400) * cr;
  }).sort((a, b) => a - b);
  const medianBodyProminence = bodyProminenceValues.length
    ? bodyProminenceValues[Math.floor(bodyProminenceValues.length / 2)]
    : 0;

  // PS-2 primary CTA dominance
  const ctaCandidates = firstViewportInteractives.filter(el => {
    if (el.closest('header,nav,footer')) return false;
    const s = getComputedStyle(el);
    const bg = parseColor(s.backgroundColor);
    const hasFill = bg && bg.a > 0.15;
    const hasBorder = parseFloat(s.borderTopWidth) >= 1;
    const r = el.getBoundingClientRect();
    return (r.width * r.height >= 1600) || hasFill || hasBorder;
  }).map(el => {
    const s = getComputedStyle(el);
    const fg = parseColor(s.color) || { r: 0, g: 0, b: 0, a: 1 };
    const bg = parseColor(s.backgroundColor) || walkUpForOpaqueBg(el);
    const bgOuter = walkUpForOpaqueBg(el.parentElement || el);
    const borderColor = parseColor(s.borderTopColor) || bg;
    const r = el.getBoundingClientRect();
    const area = r.width * r.height;
    const textContrast = contrast(fg, bg.a > 0.15 ? bg : bgOuter);
    const borderContrast = parseFloat(s.borderTopWidth) > 0 ? contrast(borderColor, bgOuter) : 1;
    const visualWeight = area * (textContrast + borderContrast + 1);
    return {
      el, visualWeight, area,
      text: (el.innerText || "").trim().slice(0, 40),
      selector: shortSelector(el),
      styleSignature: {
        bg: `${bg.r},${bg.g},${bg.b}`,
        fg: `${fg.r},${fg.g},${fg.b}`,
        radius: Math.round(parseFloat(s.borderTopLeftRadius) || 0),
        border: s.borderTopStyle + ":" + Math.round(parseFloat(s.borderTopWidth) || 0),
        shadow: s.boxShadow === "none" ? "none" : "has"
      }
    };
  }).sort((a, b) => b.visualWeight - a.visualWeight);

  // PS-3 alignment edge variance
  const blockCandidates = [];
  {
    let count = 0;
    const walker2 = document.createTreeWalker(mainRoot, NodeFilter.SHOW_ELEMENT);
    let n;
    while ((n = walker2.nextNode()) && count < 40) {
      if (!isVisible(n)) continue;
      if (!inFirstViewport(n)) continue;
      const s = getComputedStyle(n);
      if (s.display === "inline" || s.display === "inline-block") continue;
      const r = n.getBoundingClientRect();
      if (r.width < 120) continue;
      if (r.width >= viewportW * 0.9) continue;
      blockCandidates.push({ el: n, left: r.left, selector: shortSelector(n) });
      count++;
      if (blockCandidates.length >= 8) break;
    }
  }
  const leftEdges = blockCandidates.map(b => b.left);
  const stdDevLeft = (() => {
    if (leftEdges.length < 2) return 0;
    const m = leftEdges.reduce((a, v) => a + v, 0) / leftEdges.length;
    return Math.sqrt(leftEdges.reduce((a, v) => a + (v - m) ** 2, 0) / leftEdges.length);
  })();

  // PS-4 intra vs inter cluster gap
  const containers = allVisible.filter(el => {
    const kids = Array.from(el.children).filter(isVisible);
    return kids.length >= 3;
  }).slice(0, 30);
  const intraGaps = [];
  const sectionTops = [];
  for (const c of containers) {
    const kids = Array.from(c.children).filter(isVisible)
      .map(k => k.getBoundingClientRect())
      .sort((a, b) => a.top - b.top);
    for (let i = 1; i < kids.length; i++) {
      const g = kids[i].top - kids[i - 1].bottom;
      if (g >= 0 && g < 200) intraGaps.push(g);
    }
    const r = c.getBoundingClientRect();
    sectionTops.push({ top: r.top, bottom: r.bottom });
  }
  sectionTops.sort((a, b) => a.top - b.top);
  const interGaps = [];
  for (let i = 1; i < sectionTops.length; i++) {
    const g = sectionTops[i].top - sectionTops[i - 1].bottom;
    if (g > 0 && g < 400) interGaps.push(g);
  }
  const median = arr => {
    if (!arr.length) return 0;
    const s = [...arr].sort((a, b) => a - b);
    return s[Math.floor(s.length / 2)];
  };
  const intraClusterGap = median(intraGaps);
  const interClusterGap = median(interGaps);

  // ========== CL — Cognitive Load ==========

  // CL-1 object density
  let fvObjects = 0;
  for (const el of visibleInFirstViewport) {
    if (el.matches(HEADING_SELECTOR)) { fvObjects++; continue; }
    const txt = (el.innerText || "").trim();
    if (el.matches('p,li') && txt.length >= 20) { fvObjects++; continue; }
    if (el.matches('img,video,canvas,svg')) {
      const r = el.getBoundingClientRect();
      if (r.width * r.height >= 4000) { fvObjects++; continue; }
    }
    if (el.matches(INTERACTIVE_SELECTOR)) { fvObjects++; continue; }
    const s = getComputedStyle(el);
    const bg = parseColor(s.backgroundColor);
    const hasCardLook = (bg && bg.a > 0.2) || s.boxShadow !== "none" || parseFloat(s.borderTopWidth) > 0;
    if (hasCardLook) fvObjects++;
  }
  const objectDensity = fvObjects / Math.max(1, viewportArea / 100000);

  // CL-2 visible choice load (dedupe pagination dots)
  const logicalInteractives = firstViewportInteractives.filter(el => !el.closest('footer'));
  let paginationCluster = 0;
  const seenPaginationParents = new Set();
  for (const el of logicalInteractives) {
    const p = el.parentElement;
    if (p && /pagin|carousel|dots/i.test(p.className || "")) {
      if (!seenPaginationParents.has(p)) {
        seenPaginationParents.add(p);
        paginationCluster++;
      }
    }
  }
  const dedupedChoiceCount =
    logicalInteractives.filter(el => {
      const p = el.parentElement;
      return !(p && /pagin|carousel|dots/i.test(p.className || ""));
    }).length + paginationCluster;

  // CL-3 chunking / paragraph load
  const textBlocks = textSample.slice(0, 200);
  let overloadedBlocks = 0;
  for (const el of textBlocks) {
    const words = (el.innerText || "").trim().split(/\s+/).length;
    if (words > 90) overloadedBlocks++;
  }
  // section-level overload: words between headings in main tree
  let sectionOverloaded = 0;
  let sectionTotal = 0;
  {
    const sections = [mainRoot, ...mainRoot.querySelectorAll('section,article')];
    for (const sec of sections.slice(0, 20)) {
      if (!isVisible(sec)) continue;
      const headings = sec.querySelectorAll(HEADING_SELECTOR);
      if (headings.length === 0) {
        const words = (sec.innerText || "").trim().split(/\s+/).length;
        sectionTotal++;
        if (words > 220) sectionOverloaded++;
        continue;
      }
      for (let i = 0; i < headings.length; i++) {
        const start = headings[i];
        const end = headings[i + 1];
        let text = "";
        let cur = start.nextSibling;
        while (cur && cur !== end) {
          text += cur.textContent || "";
          cur = cur.nextSibling;
        }
        const words = text.trim().split(/\s+/).length;
        sectionTotal++;
        if (words > 220) sectionOverloaded++;
      }
    }
  }
  const overloadRate = (overloadedBlocks + sectionOverloaded) /
    Math.max(1, textBlocks.length + sectionTotal);

  // CL-4 form support coverage
  const formControls = allVisible.filter(el => el.matches('input:not([type="hidden"]),select,textarea'));
  let unsupportedControls = 0;
  for (const c of formControls) {
    const id = c.id;
    const hasLabelFor = id && document.querySelector(`label[for="${CSS.escape(id)}"]`);
    const wrappingLabel = c.closest('label');
    const ariaLabel = c.getAttribute('aria-label');
    const ariaLabelledBy = c.getAttribute('aria-labelledby');
    const hasLabel = hasLabelFor || wrappingLabel || ariaLabel || ariaLabelledBy;
    const describedBy = c.getAttribute('aria-describedby');
    const hasDescribedBy = describedBy && document.getElementById(describedBy);
    const container = c.closest('.field,.form-field,.form-group') || c.parentElement;
    const siblingHelp = container && container.querySelector('.help,.hint,.description,small');
    const fieldsetLegend = c.closest('fieldset')?.querySelector('legend');
    const hasHelper = hasDescribedBy || siblingHelp || fieldsetLegend;
    if (!hasLabel || !hasHelper) unsupportedControls++;
  }

  // ========== TC — Trust & Confidence ==========

  // TC-1 text contrast compliance
  let contrastSamples = 0, contrastPass = 0;
  const contrastFailureEvidence = [];
  for (const el of textSample) {
    const s = getComputedStyle(el);
    const fs = parseFloat(s.fontSize) || 14;
    const fw = parseFloat(s.fontWeight) || 400;
    const isLarge = fs >= 24 || (fs >= 18.66 && fw >= 700);
    const fg = parseColor(s.color);
    if (!fg) continue;
    const bg = walkUpForOpaqueBg(el);
    const cr = contrast(fg, bg);
    const threshold = isLarge ? 3 : 4.5;
    contrastSamples++;
    if (cr >= threshold) contrastPass++;
    else if (contrastFailureEvidence.length < 5) {
      contrastFailureEvidence.push({
        selector: shortSelector(el),
        text: (el.innerText || "").trim().slice(0, 50),
        ratio: +cr.toFixed(2),
        required: threshold
      });
    }
  }
  const textContrastComplianceRate = contrastSamples ? contrastPass / contrastSamples : 1;

  // TC-2 control contrast rate
  let controlSamples = 0, controlPass = 0;
  const controlFailureEvidence = [];
  for (const el of visibleInteractives.slice(0, 300)) {
    const s = getComputedStyle(el);
    const fg = parseColor(s.color);
    const bg = parseColor(s.backgroundColor);
    const borderW = parseFloat(s.borderTopWidth) || 0;
    const parentBg = walkUpForOpaqueBg(el.parentElement || el);
    controlSamples++;
    let bestIndicator = 1;
    if (borderW >= 1) {
      const bc = parseColor(s.borderTopColor) || fg;
      if (bc) bestIndicator = Math.max(bestIndicator, contrast(bc, parentBg));
    }
    if (bg && bg.a > 0.15) {
      bestIndicator = Math.max(bestIndicator, contrast(bg, parentBg));
    }
    if (fg && bg && bg.a > 0.15) {
      bestIndicator = Math.max(bestIndicator, contrast(fg, bg));
    }
    if (bestIndicator >= 3) controlPass++;
    else if (controlFailureEvidence.length < 5) {
      controlFailureEvidence.push({
        selector: shortSelector(el),
        indicator_contrast: +bestIndicator.toFixed(2)
      });
    }
  }
  const controlContrastRate = controlSamples ? controlPass / controlSamples : 1;

  // TC-3 target size & spacing
  let targetSamples = 0, targetPass = 0;
  const targetFailEvidence = [];
  const interactiveRects = visibleInteractives.map(el => ({ el, r: el.getBoundingClientRect() }));
  for (const item of interactiveRects) {
    // skip inline text links inside paragraphs
    if (item.el.closest('p') && item.el.tagName === 'A') continue;
    targetSamples++;
    const ok = item.r.width >= 24 && item.r.height >= 24;
    if (ok) { targetPass++; continue; }
    // check nearest-neighbor spacing
    let saved = false;
    for (const other of interactiveRects) {
      if (other === item) continue;
      const dx = (item.r.left + item.r.width / 2) - (other.r.left + other.r.width / 2);
      const dy = (item.r.top + item.r.height / 2) - (other.r.top + other.r.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 24) { saved = false; break; }
      saved = true;
    }
    if (saved) targetPass++;
    else if (targetFailEvidence.length < 5) {
      targetFailEvidence.push({
        selector: shortSelector(item.el),
        size: `${Math.round(item.r.width)}×${Math.round(item.r.height)}`
      });
    }
  }
  const targetComplianceRate = targetSamples ? targetPass / targetSamples : 1;

  // TC-4 primary action style consistency
  const pageCtaCandidates = visibleInteractives.filter(el => {
    if (el.closest('header,nav,footer')) return false;
    const s = getComputedStyle(el);
    const bg = parseColor(s.backgroundColor);
    const hasFill = bg && bg.a > 0.15;
    const r = el.getBoundingClientRect();
    return hasFill && r.width * r.height >= 1600;
  });
  const styleSignatures = new Set();
  for (const el of pageCtaCandidates) {
    const s = getComputedStyle(el);
    const bg = parseColor(s.backgroundColor) || { r: 255, g: 255, b: 255 };
    const fg = parseColor(s.color) || { r: 0, g: 0, b: 0 };
    const rad = parseFloat(s.borderTopLeftRadius) || 0;
    const radBucket = rad === 0 ? "0" : rad <= 4 ? "1-4" : rad <= 8 ? "5-8" : rad <= 16 ? "9-16" : "17+";
    const shadowBucket = s.boxShadow === "none" ? "none" : s.boxShadow.length > 40 ? "heavy" : "subtle";
    const quantBg = `${Math.round(bg.r / 16)},${Math.round(bg.g / 16)},${Math.round(bg.b / 16)}`;
    const quantFg = `${Math.round(fg.r / 16)},${Math.round(fg.g / 16)},${Math.round(fg.b / 16)}`;
    styleSignatures.add(`${quantBg}|${quantFg}|${radBucket}|${shadowBucket}`);
  }

  // ========== Stylesheet-dependent rules (TC-5, MF-3, MF-4, MF-5) ==========

  const stylesheetRules = [];
  let accessibleSheets = 0, totalSheets = 0;
  // v0.3 patch: walk nested rule containers (@layer, @media, @supports).
  // Tailwind v4 wraps all utilities in @layer blocks, which have no
  // selectorText and were invisible to the v0.2 flat walk.
  const collectRules = (rules) => {
    for (const r of rules) {
      if (r.selectorText) stylesheetRules.push({ selector: r.selectorText, cssText: r.style?.cssText || "" });
      if (r.cssRules && r.cssRules.length) collectRules(r.cssRules);
    }
  };
  for (const sheet of document.styleSheets) {
    totalSheets++;
    try {
      const rules = sheet.cssRules || [];
      accessibleSheets++;
      collectRules(rules);
    } catch {
      // CORS-blocked; skip
    }
  }
  const stylesheetAccess = {
    total: totalSheets,
    accessible: accessibleSheets,
    rate: totalSheets ? accessibleSheets / totalSheets : 1,
    confidence: totalSheets === 0 ? "na"
      : accessibleSheets === totalSheets ? "full"
      : accessibleSheets === 0 ? "none"
      : "partial"
  };

  // TC-5 focus indicator coverage (stylesheet)
  const focusRules = stylesheetRules.filter(r => /:focus(-visible)?/.test(r.selector));
  const focusCovered = focusRules.length > 0; // binary for v0.2; per-element mapping is v0.3
  const focusCoverageRate = focusCovered ? 1 : (stylesheetAccess.confidence === "none" ? null : 0);

  // MF-3 easing discipline — collect timing functions from computed styles too (fallback)
  const timingFns = [];
  for (const el of visibleInteractives.slice(0, 200)) {
    const s = getComputedStyle(el);
    const tf = s.transitionTimingFunction || "";
    const af = s.animationTimingFunction || "";
    tf.split(",").forEach(x => x.trim() && timingFns.push(x.trim()));
    af.split(",").forEach(x => x.trim() && timingFns.push(x.trim()));
  }
  const easingAllowed = timingFns.filter(fn => {
    if (/^(ease|ease-in-out|linear|ease-in|ease-out)$/.test(fn)) return true;
    const m = fn.match(/cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/);
    if (m) {
      const y1 = +m[2], y2 = +m[4];
      return y1 <= 1.2 && y2 <= 1.2 && y1 >= -0.2 && y2 >= -0.2;
    }
    if (/^steps\(/.test(fn)) return false;
    return true; // unknown = allowed
  }).length;
  const easingAllowedRate = timingFns.length ? easingAllowed / timingFns.length : null;

  // MF-4 interactive state coverage — stylesheet rules that hit :hover/:focus/:active
  const stateRules = stylesheetRules.filter(r => /:hover|:focus|:focus-visible|:active/.test(r.selector));
  const stateCoverageRate = stylesheetAccess.confidence === "none" ? null
    : stateRules.length > 0 ? Math.min(1, stateRules.length / 10) : 0;

  // MF-5 error support coverage
  const invalidControls = allVisible.filter(el =>
    el.matches('[aria-invalid="true"],.error,.invalid,[data-invalid="true"]')
  );
  let supportedErrors = 0;
  for (const c of invalidControls) {
    const describedBy = c.getAttribute('aria-describedby');
    const described = describedBy && document.getElementById(describedBy);
    const container = c.closest('.field,.form-field,.form-group') || c.parentElement;
    const siblingText = container && Array.from(container.querySelectorAll('.error-text,.error-message,[role="alert"],small,.help,.hint'))
      .find(el => (el.innerText || "").trim().length >= 12);
    if (described || siblingText) supportedErrors++;
  }
  const errorSupportRate = invalidControls.length === 0 ? null : supportedErrors / invalidControls.length;

  // Durations (MF-2)
  const durations = [];
  for (const el of visibleInteractives.slice(0, 400)) {
    const s = getComputedStyle(el);
    [s.transitionDuration, s.animationDuration].forEach(str => {
      str.split(",").forEach(x => {
        const v = parseFloat(x);
        if (!isNaN(v) && v > 0) durations.push(v * (/ms$/.test(x.trim()) ? 1 : 1000));
      });
    });
  }
  const durationsInRange = durations.filter(d => d >= 120 && d <= 500).length;
  const durationInRangeRate = durations.length ? durationsInRange / durations.length : null;

  // MF-1 ambient motion — already in first viewport
  let ambientMotion = 0;
  let animatedTotal = 0;
  for (const el of visibleInFirstViewport) {
    const s = getComputedStyle(el);
    const ad = parseFloat(s.animationDuration);
    if (!isNaN(ad) && ad > 0) {
      animatedTotal++;
      if (s.animationIterationCount === "infinite") ambientMotion++;
    }
    if (el.tagName === "VIDEO" && el.hasAttribute("autoplay")) ambientMotion++;
  }

  // ========== ET — Emotional Tone ==========

  // ET-1 palette restraint (non-neutral hue buckets, 15°)
  const hueBucketSet = new Set();
  const rawHues = [];
  for (const el of allVisible.slice(0, 800)) {
    const s = getComputedStyle(el);
    for (const key of ["color", "backgroundColor", "borderTopColor"]) {
      const c = parseColor(s[key]);
      if (!c || c.a < 0.2) continue;
      const hsl = rgbToHsl(c);
      if (hsl.s < 0.1) continue;
      const bucket = Math.floor(hsl.h / 15);
      hueBucketSet.add(bucket);
      rawHues.push({ h: hsl.h, s: hsl.s, l: hsl.l });
    }
  }
  const hueBuckets = hueBucketSet.size;

  // ET-2 chroma discipline on large surfaces
  let largeSurfaces = 0, highChromaLarge = 0;
  for (const el of allVisible.slice(0, 500)) {
    const r = el.getBoundingClientRect();
    const area = r.width * r.height;
    if (area < viewportArea * 0.05) continue;
    const s = getComputedStyle(el);
    const c = parseColor(s.backgroundColor);
    if (!c || c.a < 0.3) continue;
    largeSurfaces++;
    const hsl = rgbToHsl(c);
    if (hsl.s > 0.85) highChromaLarge++;
  }
  const highChromaRate = largeSurfaces ? highChromaLarge / largeSurfaces : 0;

  // ET-3 radius × shadow coherence
  const shapePairs = new Set();
  for (const el of allVisible.slice(0, 400)) {
    const s = getComputedStyle(el);
    const rad = parseFloat(s.borderTopLeftRadius) || 0;
    const radBucket = rad === 0 ? "0" : rad <= 4 ? "1-4" : rad <= 8 ? "5-8" : rad <= 16 ? "9-16" : "17+";
    const shadow = s.boxShadow || "none";
    const shadowBucket = shadow === "none" ? "none"
      : shadow.length < 30 ? "subtle"
      : shadow.length < 60 ? "medium" : "heavy";
    // only for card-like elements
    const r = el.getBoundingClientRect();
    const isCardLike = rad > 0 || shadow !== "none" || el.matches('button,input,select,textarea,[role="button"]');
    if (isCardLike && r.width * r.height >= 400) {
      shapePairs.add(`${radBucket}|${shadowBucket}`);
    }
  }

  // ET-4 typography system restraint
  const fontFamilies = new Set();
  const fontSizeBuckets = new Set();
  const typoSamples = [];
  for (const el of allVisible.slice(0, 800)) {
    const txt = (el.textContent || "").trim();
    if (!txt) continue;
    const s = getComputedStyle(el);
    const family = s.fontFamily.split(",")[0].trim().replace(/['"]/g, "");
    fontFamilies.add(family);
    const size = Math.round((parseFloat(s.fontSize) || 14) / 2) * 2;
    fontSizeBuckets.add(size);
    if (typoSamples.length < 5) typoSamples.push({ selector: shortSelector(el), family, size });
  }

  // ET-5 all-caps emphasis load
  let emphaticChars = 0, totalChars = 0;
  for (const el of allVisible.slice(0, 600)) {
    const txt = (el.innerText || "").trim();
    if (txt.length < 12) continue;
    const s = getComputedStyle(el);
    const letterSpacing = parseFloat(s.letterSpacing) || 0;
    const fs = parseFloat(s.fontSize) || 14;
    const lsEm = letterSpacing / fs;
    const isEmphatic = txt === txt.toUpperCase() || s.textTransform === "uppercase" || lsEm >= 0.12;
    totalChars += txt.length;
    if (isEmphatic) emphaticChars += txt.length;
  }
  const allCapsRate = totalChars ? emphaticChars / totalChars : 0;

  // ========== derived character metrics (v0.2) ==========

  // chroma presence: % of saturated visible surfaces
  let saturatedCount = 0;
  for (const hsl of rawHues) if (hsl.s > 0.4) saturatedCount++;
  const chromaPresence = rawHues.length ? +(saturatedCount / rawHues.length * 100).toFixed(1) : 0;

  // ---------- return bundle ----------
  return {
    meta: {
      url: location.href,
      title: document.title,
      viewport: { w: viewportW, h: viewportH },
      totalVisibleElements: allVisible.length,
      viewportElements: visibleInFirstViewport.length,
      timestamp: Date.now(),
      sampling,
      stylesheet_access: stylesheetAccess
    },
    perceptual: {
      headings: headingProminence.slice(0, 5),
      max_heading_prominence: maxHeadingProminence,
      median_body_prominence: medianBodyProminence,
      heading_ratio: medianBodyProminence ? +(maxHeadingProminence / medianBodyProminence).toFixed(2) : 0,
      cta_candidates_first_viewport: ctaCandidates.slice(0, 5).map(c => ({
        text: c.text, selector: c.selector, visualWeight: Math.round(c.visualWeight), area: Math.round(c.area)
      })),
      cta_dominance_ratio: ctaCandidates.length >= 2
        ? +(ctaCandidates[0].visualWeight / ctaCandidates[1].visualWeight).toFixed(2)
        : (ctaCandidates.length === 1 ? 1.5 : 0),
      cta_count_first_viewport: ctaCandidates.length,
      block_candidates: blockCandidates.map(b => ({ left: Math.round(b.left), selector: b.selector })),
      std_dev_left: +stdDevLeft.toFixed(2),
      intra_cluster_gap: intraClusterGap,
      inter_cluster_gap: interClusterGap,
      gap_ratio: intraClusterGap ? +(interClusterGap / intraClusterGap).toFixed(2) : 0
    },
    cognitive: {
      first_viewport_objects: fvObjects,
      object_density: +objectDensity.toFixed(2),
      visible_choice_count: dedupedChoiceCount,
      overloaded_blocks: overloadedBlocks,
      overloaded_sections: sectionOverloaded,
      total_blocks_evaluated: textBlocks.length + sectionTotal,
      overload_rate: +overloadRate.toFixed(3),
      form_controls: formControls.length,
      unsupported_controls: unsupportedControls,
      unsupported_rate: formControls.length ? +(unsupportedControls / formControls.length).toFixed(3) : null
    },
    trust: {
      text_contrast_samples: contrastSamples,
      text_contrast_pass: contrastPass,
      text_contrast_rate: +textContrastComplianceRate.toFixed(3),
      text_contrast_failures: contrastFailureEvidence,
      control_contrast_samples: controlSamples,
      control_contrast_rate: +controlContrastRate.toFixed(3),
      control_contrast_failures: controlFailureEvidence,
      target_samples: targetSamples,
      target_compliance_rate: +targetComplianceRate.toFixed(3),
      target_failures: targetFailEvidence,
      primary_cta_style_signatures: styleSignatures.size,
      primary_cta_total: pageCtaCandidates.length,
      focus_coverage_rate: focusCoverageRate,
      focus_rules_count: focusRules.length
    },
    tone: {
      hue_buckets: hueBuckets,
      raw_hue_samples: rawHues.length,
      large_surfaces: largeSurfaces,
      high_chroma_large: highChromaLarge,
      high_chroma_rate: +highChromaRate.toFixed(3),
      shape_pair_count: shapePairs.size,
      font_family_count: fontFamilies.size,
      font_families: Array.from(fontFamilies).slice(0, 6),
      font_size_buckets: fontSizeBuckets.size,
      typo_samples: typoSamples,
      all_caps_rate: +allCapsRate.toFixed(3),
      chroma_presence: chromaPresence
    },
    motion: {
      ambient_motion_count: ambientMotion,
      animated_total: animatedTotal,
      durations_sampled: durations.length,
      duration_in_range_rate: durationInRangeRate !== null ? +durationInRangeRate.toFixed(3) : null,
      timing_fns_sampled: timingFns.length,
      easing_allowed_rate: easingAllowedRate !== null ? +easingAllowedRate.toFixed(3) : null,
      state_coverage_rate: stateCoverageRate !== null ? +stateCoverageRate.toFixed(3) : null,
      invalid_controls: invalidControls.length,
      error_support_rate: errorSupportRate !== null ? +errorSupportRate.toFixed(3) : null
    }
  };
})();
