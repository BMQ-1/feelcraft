/**
 * Feelcraft Live Browser DOM Auditor (`scripts/audit-dom-runtime.js`)
 * Inject into any live webpage via Playwright `page.evaluate()`, Puppeteer,
 * Chrome DevTools MCP, or the browser console to measure rendered UX craft:
 *   1. Fitts's Law / Hit Slop failures (interactive targets < 32x32px)
 *   2. Missing `tabular-nums` on elements rendering digits/prices/timers
 *   3. Multi-line `h1–h4` headings missing `text-wrap: balance`
 *   4. Concentric Corner Radius violations (`R_inner > R_outer - padding`)
 *   5. Motion violations (`transition-property: all`, any duration > 320ms, infinite loops)
 *   6. Chunky unstyled native scrollbars in scrollable containers
 *   7. WCAG 2.2 AA text contrast failures (< 4.5:1 normal text / < 3:1 large text: >=24px or >=18.66px bold)
 */

(() => {
  const results = {
    smallHitTargets: [],
    missingTabularNums: [],
    unbalancedHeadings: [],
    nonConcentricCorners: [],
    motionViolations: [],
    chunkyScrollbars: [],
    lowContrastText: [],
  };

  const describeEl = (el) => {
    const tag = el.tagName.toLowerCase();
    const id = el.id ? `#${el.id}` : '';
    const cls = typeof el.className === 'string' && el.className.trim()
      ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
      : '';
    const text = (el.textContent || '').trim().slice(0, 28);
    return `${tag}${id}${cls}${text ? ` ("${text}")` : ''}`;
  };

  const parseRgb = (str) => {
    const m = str && str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!m) return null;
    return {
      r: Number(m[1]),
      g: Number(m[2]),
      b: Number(m[3]),
      a: m[4] === undefined ? 1 : Number(m[4]),
    };
  };

  const relativeLuminance = ({ r, g, b }) => {
    const lin = [r, g, b].map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
  };

  const contrastRatio = (c1, c2) => {
    const l1 = relativeLuminance(c1);
    const l2 = relativeLuminance(c2);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };

  const blendRgba = (fg, bg) => {
    const a = fg.a + bg.a * (1 - fg.a);
    if (a <= 0) return { r: 255, g: 255, b: 255, a: 1 };
    return {
      r: Math.round((fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a),
      g: Math.round((fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a),
      b: Math.round((fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a),
      a,
    };
  };

  const resolveEffectiveBg = (el) => {
    const layers = [];
    let cur = el;
    while (cur && cur.nodeType === 1) {
      const bg = parseRgb(window.getComputedStyle(cur).backgroundColor);
      if (bg && bg.a > 0) {
        layers.push(bg);
        if (bg.a >= 0.99) break;
      }
      cur = cur.parentElement;
    }
    const rootScheme = window.getComputedStyle(document.documentElement).colorScheme;
    let acc = rootScheme === 'dark'
      ? { r: 15, g: 16, b: 18, a: 1 }
      : { r: 255, g: 255, b: 255, a: 1 };
    for (let i = layers.length - 1; i >= 0; i--) {
      acc = blendRgba(layers[i], acc);
    }
    return acc;
  };

  const parseDurationsMs = (str) =>
    (str || '0s').split(',').map((s) => {
      const t = s.trim();
      if (t.endsWith('ms')) return parseFloat(t) || 0;
      if (t.endsWith('s')) return (parseFloat(t) || 0) * 1000;
      return 0;
    });

  // 1. Fitts's Law / Hit Slop on visible interactive controls
  document.querySelectorAll('button, a[href], input, select, [role="button"], [tabindex="0"]').forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const after = window.getComputedStyle(el, '::after');
    const afterInset = parseFloat(after.top) < 0 ? Math.abs(parseFloat(after.top)) * 2 : 0;
    const effectiveW = rect.width + afterInset;
    const effectiveH = rect.height + afterInset;

    if (effectiveW < 32 || effectiveH < 32) {
      results.smallHitTargets.push({
        element: describeEl(el),
        size: `${Math.round(effectiveW)}x${Math.round(effectiveH)}px`,
        fix: 'Add invisible hit slop (`::after { content: ""; position: absolute; inset: -8px; }`) or increase padding to >=36x36px (44x44px touch).',
      });
    }
  });

  // 2. Tabular Numbers + WCAG Contrast on visible text nodes
  const textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const checkedParents = new Set();
  while (textWalker.nextNode()) {
    const node = textWalker.currentNode;
    const text = (node.nodeValue || '').trim();
    if (!text) continue;
    const el = node.parentElement;
    if (!el || checkedParents.has(el)) continue;
    checkedParents.add(el);

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    const cs = window.getComputedStyle(el);

    if (/(\$\d|\d+%|\d{2,}[:.,]\d{2}|\b\d{3,}\b)/.test(text)) {
      if (!cs.fontVariantNumeric.includes('tabular-nums') && !cs.fontFamily.toLowerCase().includes('mono')) {
        results.missingTabularNums.push({
          element: describeEl(el),
          sample: text.slice(0, 24),
          fix: 'Add `font-variant-numeric: tabular-nums` (`tabular-nums`).',
        });
      }
    }

    const fg = parseRgb(cs.color);
    if (fg && fg.a > 0) {
      const bg = resolveEffectiveBg(el);
      const effectiveFg = fg.a < 1 ? blendRgba(fg, bg) : fg;
      const ratio = contrastRatio(effectiveFg, bg);
      const fontSize = parseFloat(cs.fontSize) || 14;
      const fontWeight = parseInt(cs.fontWeight, 10) || (cs.fontWeight === 'bold' ? 700 : 400);
      // WCAG 2.2 SC 1.4.3 Large Text: >= 18pt (24px) regular OR >= 14pt (~18.66px) bold (>=700)
      const isLargeText = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
      const minRatio = isLargeText ? 3.0 : 4.5;
      if (ratio < minRatio) {
        results.lowContrastText.push({
          element: describeEl(el),
          ratio: Number(ratio.toFixed(2)),
          required: minRatio,
          fontSize: `${Math.round(fontSize * 10) / 10}px`,
          fontWeight,
          fix: 'Increase text contrast to meet WCAG AA >=4.5:1 (>=3.0:1 for large text: >=24px or >=18.66px bold).',
        });
      }
    }
  }

  // 3. Multi-line Balanced Headlines (`h1-h4`)
  document.querySelectorAll('h1, h2, h3, h4').forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const cs = window.getComputedStyle(el);
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.25;
    const isMultiLine = rect.height > lh * 1.45;
    if (isMultiLine && cs.textWrap !== 'balance') {
      results.unbalancedHeadings.push({
        element: describeEl(el),
        fix: 'Add `text-wrap: balance` (`text-balance`).',
      });
    }
  });

  // 4. Concentric Nested Border Radii
  document.querySelectorAll('*').forEach((parent) => {
    const pcs = window.getComputedStyle(parent);
    const rOuter = parseFloat(pcs.borderTopLeftRadius) || 0;
    const pad = parseFloat(pcs.paddingTop) || parseFloat(pcs.paddingLeft) || 0;
    if (rOuter < 10 || pad < 4 || pad > 32) return;

    Array.from(parent.children).forEach((child) => {
      const ccs = window.getComputedStyle(child);
      const rInner = parseFloat(ccs.borderTopLeftRadius) || 0;
      if (rInner <= 0 || rInner >= 999) return;
      const expected = Math.max(4, rOuter - pad);
      if (Math.abs(rInner - expected) > 4 && rInner >= rOuter) {
        results.nonConcentricCorners.push({
          parent: describeEl(parent),
          child: describeEl(child),
          measured: `R_outer=${rOuter}px, padding=${pad}px, R_inner=${rInner}px`,
          expected: `R_inner should be ~${expected}px (R_outer - padding)`,
        });
      }
    });
  });

  // 5. Motion Transitions & Animations (All Comma-Separated Durations + Infinite Loops)
  document.querySelectorAll('*').forEach((el) => {
    const cs = window.getComputedStyle(el);
    const prop = cs.transitionProperty;
    const maxTransMs = Math.max(0, ...parseDurationsMs(cs.transitionDuration));
    const maxAnimMs = Math.max(0, ...parseDurationsMs(cs.animationDuration));

    if (prop === 'all' && maxTransMs > 0) {
      results.motionViolations.push({
        element: describeEl(el),
        issue: `transition-property: all (${Math.round(maxTransMs)}ms)`,
        fix: 'Restrict transition to compositor properties (transform, scale, opacity, color, background-color, border-color).',
      });
    } else if (maxTransMs > 320) {
      results.motionViolations.push({
        element: describeEl(el),
        issue: `Slow functional UI transition (${Math.round(maxTransMs)}ms > 300ms ceiling)`,
        fix: 'Reduce duration to 150ms–260ms with cubic-bezier(0.22, 1, 0.36, 1).',
      });
    }

    if (
      cs.animationName !== 'none' &&
      cs.animationIterationCount === 'infinite' &&
      !/skeleton|shimmer|spin/i.test(`${cs.animationName} ${el.className}`)
    ) {
      results.motionViolations.push({
        element: describeEl(el),
        issue: `Decorative infinite animation (${cs.animationName}, ${Math.round(maxAnimMs)}ms)`,
        fix: 'Remove decorative looping animations; reserve motion for state transitions or loading indicators.',
      });
    }
  });

  // 6. Unstyled Chunky Scrollbars
  document.querySelectorAll('body, main, aside, nav, section, header, div').forEach((el) => {
    const cs = window.getComputedStyle(el);
    if ((cs.overflowY === 'auto' || cs.overflowY === 'scroll') && el.scrollHeight > el.clientHeight) {
      const sbWidth = el.offsetWidth - el.clientWidth;
      if (sbWidth >= 14 && cs.scrollbarWidth !== 'thin') {
        results.chunkyScrollbars.push({
          element: describeEl(el),
          scrollbarWidthPx: sbWidth,
          fix: 'Set `color-scheme: dark` (for dark mode) and `scrollbar-width: thin` + `::-webkit-scrollbar` 8px pill thumb.',
        });
      }
    }
  });

  return {
    summary: {
      smallHitTargets: results.smallHitTargets.length,
      missingTabularNums: results.missingTabularNums.length,
      unbalancedHeadings: results.unbalancedHeadings.length,
      nonConcentricCorners: results.nonConcentricCorners.length,
      motionViolations: results.motionViolations.length,
      chunkyScrollbars: results.chunkyScrollbars.length,
      lowContrastText: results.lowContrastText.length,
    },
    details: {
      smallHitTargets: results.smallHitTargets.slice(0, 12),
      missingTabularNums: results.missingTabularNums.slice(0, 12),
      unbalancedHeadings: results.unbalancedHeadings.slice(0, 10),
      nonConcentricCorners: results.nonConcentricCorners.slice(0, 10),
      motionViolations: results.motionViolations.slice(0, 12),
      chunkyScrollbars: results.chunkyScrollbars.slice(0, 8),
      lowContrastText: results.lowContrastText.slice(0, 12),
    },
  };
})();
