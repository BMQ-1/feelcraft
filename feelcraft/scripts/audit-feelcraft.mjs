#!/usr/bin/env node
/**
 * Feelcraft Static Auditor (`audit-feelcraft.mjs`)
 * Zero-dependency static scanner that strips comments before scanning for
 * UX ergonomics, reduced-motion accessibility, latency/mutation safety, and
 * motion/styling anti-patterns (<300ms ceiling, no transition-all, etc.).
 *
 * Usage: node scripts/audit-feelcraft.mjs [target-dir] [--json]
 */

import fs from 'node:fs';
import path from 'node:path';

const targetDir = path.resolve(process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : '.');
const jsonMode = process.argv.includes('--json');

const IGNORE_DIRS = new Set([
  'node_modules', '.git', '.next', '.svelte-kit', '.nuxt', '.output', 'dist', 'build', 'out',
  '.turbo', 'coverage', '.venv', 'vendor', 'target', 'Pods', 'feelcraft'
]);

const CODE_EXTS = new Set([
  '.tsx', '.jsx', '.ts', '.js', '.mjs', '.css', '.scss', '.vue', '.svelte', '.html',
  '.swift', '.kt', '.dart', '.py', '.go', '.rs', '.rb'
]);

function walk(dir, files = []) {
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (CODE_EXTS.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Strips comments while preserving line breaks so line numbers remain accurate
 * and comments-only files cannot spoof signal detection or trigger false matches.
 */
function stripCommentsPreservingLines(source, ext) {
  const preserveNewlines = (match) => match.replace(/[^\r\n]/g, ' ');
  let out = source;

  // HTML / Vue / Svelte template comments
  if (ext === '.html' || ext === '.vue' || ext === '.svelte') {
    out = out.replace(/<!--[\s\S]*?-->/g, preserveNewlines);
  }

  // Python / Ruby hash comments and Python docstrings
  if (ext === '.py' || ext === '.rb') {
    if (ext === '.py') {
      out = out.replace(/("""[\s\S]*?"""|'''[\s\S]*?''')/g, preserveNewlines);
    }
    out = out.replace(/(^|\s)#[^\r\n]*/gm, (m, p1) => p1);
    return out;
  }

  // C/JS/TS/CSS family: state-machine scan to strip /* */ and // outside string literals
  const chars = Array.from(out);
  const len = chars.length;
  let i = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;

  while (i < len) {
    const ch = chars[i];
    const next = i + 1 < len ? chars[i + 1] : '';

    if (inSingle) {
      if (ch === '\\') { i += 2; continue; }
      if (ch === "'" || ch === '\n') inSingle = false;
      i++;
      continue;
    }
    if (inDouble) {
      if (ch === '\\') { i += 2; continue; }
      if (ch === '"' || ch === '\n') inDouble = false;
      i++;
      continue;
    }
    if (inTemplate) {
      if (ch === '\\') { i += 2; continue; }
      if (ch === '`') inTemplate = false;
      i++;
      continue;
    }

    // Block comment /* ... */
    if (ch === '/' && next === '*') {
      chars[i] = ' ';
      chars[i + 1] = ' ';
      i += 2;
      while (i < len && !(chars[i] === '*' && chars[i + 1] === '/')) {
        if (chars[i] !== '\n' && chars[i] !== '\r') chars[i] = ' ';
        i++;
      }
      if (i < len) {
        chars[i] = ' ';
        if (i + 1 < len) chars[i + 1] = ' ';
        i += 2;
      }
      continue;
    }

    // Line comment // ... (not supported in pure CSS, valid in JS/TS/SCSS/Swift/Go/Rust)
    if (ext !== '.css' && ch === '/' && next === '/') {
      while (i < len && chars[i] !== '\n' && chars[i] !== '\r') {
        chars[i] = ' ';
        i++;
      }
      continue;
    }

    if (ch === "'") { inSingle = true; i++; continue; }
    if (ch === '"') { inDouble = true; i++; continue; }
    if (ch === '`') { inTemplate = true; i++; continue; }
    i++;
  }

  return chars.join('');
}

const SIGNALS = [
  { id: 'tabular-nums', name: 'Tabular Numbers (tabular-nums)', regex: /\btabular-nums\b|monospacedDigit\s*\(/, category: 'Typography & Geometry', core: true },
  { id: 'text-balance', name: 'Balanced Headlines (text-wrap: balance/pretty)', regex: /text-wrap:\s*(balance|pretty)|\btext-(balance|pretty)\b/, category: 'Typography & Geometry', core: true },
  { id: 'continuous-corners', name: 'Continuous / Concentric Corners', regex: /cornerCurve\s*\(|\.continuous\b|borderCurve\s*:|calc\(var\(--[a-z0-9-]*radius/i, category: 'Typography & Geometry', core: true },
  { id: 'dark-scrollbar-polish', name: 'Native Color-Scheme & Thin Scrollbar Styling', regex: /color-scheme:\s*(dark|light)|scrollbar-width:\s*thin|::-webkit-scrollbar\b/, category: 'Typography & Geometry', core: true },
  { id: 'tactile-form-controls', name: 'Custom Tactile Checkboxes/Radios & Tap Highlight Cleanse', regex: /appearance:\s*none|\bappearance-none\b|-webkit-tap-highlight-color/, category: 'Ergonomics & Navigation', core: true },
  { id: 'kinetic-craft-primitives', name: 'Restrained Kinetic Craft (Pills, Radial, Scrubber, Dir-Wipe)', regex: /\bfc-(seg-thumb|hairline-spot|keycap|copy-icon-box|dir-wipe|submit-pill|rubber-track|radial-wheel)\b|\b(glideSegmentedThumb|usePointerSpotlight|bindDirectionalHover|computeRubberScrub|resolveRadialWheelHit)\b/, category: 'Motion & Physics (<300ms)', when: /\bfc-|segmented|spotlight|scrubber|radial/i },
  { id: 'skeleton-loader', name: 'Skeleton Loaders', regex: /<[A-Z]\w*Skeleton\b|class(Name)?=["'][^"']*\b(fc-skeleton|skeleton|animate-pulse)\b|@keyframes\s+(skeleton|shimmer)/, category: 'Perceived Speed (<400ms)', when: /\bfetch\s*\(|useQuery\b|useSWR\b|isLoading\b/ },
  { id: 'optimistic-ui', name: 'Optimistic Updates', regex: /\buseOptimistic\b|\bonMutate\s*:|\brollbackUI\b|\boptimisticUpdate\b/, category: 'Perceived Speed (<400ms)', when: /\bfetch\s*\(|axios\.|useMutation\b|method:\s*['"](POST|PUT|PATCH|DELETE)['"]/ },
  { id: 'swr-cache', name: 'Stale-While-Revalidate (SWR)', regex: /\buseSWR\b|stale-while-revalidate|\bstaleTime\s*:/, category: 'Perceived Speed (<400ms)', when: /\bfetch\s*\(|useQuery\b|useSWR\b|Cache-Control/i },
  { id: 'prefetch', name: 'Pre-rendering / Hover Prefetch', regex: /rel=["']prefetch["']|\brouter\.prefetch\b|\bprefetchRoute\b|onPointerEnter=\{[^}]*prefetch/i, category: 'Perceived Speed (<400ms)', when: /\brouter\.|<Link\b|createBrowserRouter/ },
  { id: 'blurhash-lqip', name: 'BlurHash / LQIP Placeholders', regex: /\bblurDataURL\b|\bblurhash\b|placeholder=["']blur["']/i, category: 'Perceived Speed (<400ms)', when: /<img\b|<Image\b/ },
  { id: 'command-menu', name: 'Command Menu (Cmd+K / Ctrl+K)', regex: /\bcmdk\b|<CommandMenu\b|metaKey\s*&&\s*[a-zA-Z.]*key\s*===\s*['"]k['"]/i, category: 'Ergonomics & Navigation', when: /\bonKeyDown\b|addEventListener\s*\(\s*['"]keydown['"]/ },
  { id: 'shortcut-hints', name: 'Keyboard Shortcut Hints (<kbd>)', regex: /<kbd[\s>]/i, category: 'Ergonomics & Navigation', when: /\bonKeyDown\b|addEventListener\s*\(\s*['"]keydown['"]|<kbd[\s>]/ },
  { id: 'hit-slop', name: 'Expanded Hit Slop Targets', regex: /\bhitSlop\b|\bafter:-inset-\d|\binset:\s*-\d+px|\bfc-hit-slop\b/, category: 'Ergonomics & Navigation', core: true },
  { id: 'safe-area', name: 'Safe Area Insets', regex: /env\(\s*safe-area-inset-|\bSafeAreaView\b|\buseSafeAreaInsets\b/, category: 'Ergonomics & Navigation', when: /position:\s*fixed|\bfixed\b|\bSafeAreaView\b|safe-area-inset/ },
  { id: 'safe-triangle', name: 'Safe Triangle Submenu Protection', regex: /\buseSafeTriangleSubmenu\b|\bisPointInSafeTriangle\b|\bfc-safe-triangle\b/, category: 'Ergonomics & Navigation', when: /submenu|flyout|useSafeTriangleSubmenu|isPointInSafeTriangle/i },
  { id: 'swipe-dismiss', name: 'Swipe-to-Dismiss Sheets', regex: /\bshouldDismissSheet\b|\bapplyRubberBand\b|\bpresentationDetents\b|\bvaul\b/, category: 'Motion & Physics (<300ms)', when: /bottom-sheet|BottomSheet|Drawer|shouldDismissSheet|presentationDetents|\bvaul\b/i },
  { id: 'view-transitions', name: 'View Transitions / Shared Layout', regex: /\bstartViewTransition\b|view-transition-name:|::view-transition-|\blayoutId=/, category: 'Motion & Physics (<300ms)', when: /startViewTransition|view-transition|layoutId=/ },
  { id: 'origin-awareness', name: 'Origin-Aware Transforms', regex: /transform-origin:|\borigin-(top|bottom|left|right)\b|--radix-[a-z-]+-transform-origin/, category: 'Motion & Physics (<300ms)', core: true },
  { id: 'custom-easing', name: 'Custom Cubic-Bezier / Spring Easing', regex: /cubic-bezier\s*\(\s*0\.\d+/, category: 'Motion & Physics (<300ms)', core: true },
  { id: 'smooth-auto-height', name: 'Smooth Height:Auto (interpolate-size)', regex: /interpolate-size:\s*allow-keywords|\bgrid-rows-\[0fr\]|grid-template-rows:\s*0fr/, category: 'Motion & Physics (<300ms)', when: /accordion|collapsible|<details|interpolate-size|grid-template-rows:\s*0fr/i },
  { id: 'instant-theme-switch', name: 'Synchronized Theme Switch (Instant / Crossfade / Ripple)', regex: /\.theme-switching\b|\bfc-theme-crossfade\b|\bdisableTransitionOnChange\b|\bswitchTheme(Instant|Crossfade|Ripple)\b/, category: 'Motion & Physics (<300ms)', when: /data-theme|color-scheme:\s*dark|\.dark\b|switchTheme/ },
  { id: 'tooltip-skip-delay', name: 'Tooltip Skip-Delay Warmup', regex: /\bskipDelayDuration\b|\bTooltipWarmupCoordinator\b|\btooltipWarmup\b/, category: 'Ergonomics & Navigation', when: /Tooltip|tooltip/ },
  { id: 'reduced-motion', name: 'Reduced Motion Accessibility Guard', regex: /prefers-reduced-motion|\bmotion-reduce:|\bisReduceMotionEnabled\b|\baccessibilityReduceMotion\b/, category: 'Motion & Physics (<300ms)', core: true },
  { id: 'focus-visible-ring', name: 'Keyboard Focus-Visible Ring', regex: /:focus-visible\b|\bfocus-visible:/, category: 'Ergonomics & Navigation', core: true },
  { id: 'rtl-logical-css', name: 'Bi-Directional / Logical CSS Properties', regex: /\b(padding|margin|inset)-inline\b|:dir\(rtl\)|text-align:\s*(start|end)\b/, category: 'Ergonomics & Navigation', core: true },
  { id: 'undo-toast', name: 'Undo Toasts (Non-Blocking Recovery)', regex: /\bUndoMutationQueue\b|\bundoQueue\b|\bonUndo\b|--dry-run\b/, category: 'Forgiveness & Safety', when: /method:\s*['"]DELETE['"]|\bUndoMutationQueue\b|\bundoQueue\b|--dry-run/ },
  { id: 'otp-autofill', name: 'One-Time Code Autofill & Paste Split', regex: /autocomplete=["']one-time-code["']|autoComplete=\{[^}]*one-time-code|\boneTimeCode\b/, category: 'Forgiveness & Safety', when: /\bOtpInput\b|one-time-code|oneTimeCode|verification.*code/i },
  { id: 'idempotency', name: 'Idempotency Keys', regex: /['"]Idempotency-Key['"]|\bidempotencyKey\b|\bidempotency_key\b/, category: 'Forgiveness & Safety', when: /\bfetch\s*\(|axios\.|method:\s*['"](POST|PATCH|DELETE)['"]/ }
];

const ANTI_PATTERNS = [
  { id: 'ai-gradient-text', name: 'AI Slop Gradient Text (`bg-clip-text text-transparent`)', regex: /\bbg-clip-text\b[^;\n]*\btext-transparent\b|\btext-transparent\b[^;\n]*\bbg-clip-text\b/g, fix: 'Use solid primary ink from your color ramp instead of gradient text.' },
  { id: 'ai-purple-gradient', name: 'AI Slop Multi-Stop Purple/Indigo/Cyan Surface Gradient', regex: /\bfrom-(purple|indigo|violet|fuchsia)-\d00\s+(via-[^\s]+\s+)?to-(cyan|pink|blue|purple|indigo)-\d00\b/g, fix: 'Replace default hue-to-hue gradients with stepped luminance surfaces and 1px hairlines (unless explicitly required by brand).' },
  { id: 'ai-chatgpt-green-slop', name: 'AI Slop Emerald/Lime-to-Cyan Multi-Stop Gradient', regex: /\bfrom-(emerald|teal|lime)-[23456]00\s+(via-[^\s]+\s+)?to-(teal|cyan|emerald|lime)-[23456]00\b/gi, fix: 'Reserve green for semantic success/positive states or intentional brand tokens rather than generic multi-stop neon gradients.' },
  { id: 'ai-neon-glow', name: 'Colored Neon Shadow / Glow (`shadow-*-500/...`)', regex: /\bshadow-(purple|indigo|violet|fuchsia|cyan|pink|emerald|teal)-[456]00\/[3456789]0\b/g, fix: 'Use luminance steps on dark themes and soft neutral shadows on light themes.' },
  { id: 'ui-emoji-slop', name: 'Decorative Emoji in Code / UI Chrome (`✨ 🚀 👋 🔥`)', regex: /[✨🚀👋🔥⚡💡🎉]/g, fix: 'Replace decorative emoji in UI chrome with a consistent 16-18px line-icon set (1.5px stroke).' },
  { id: 'muddy-disabled-accent', name: 'Muddy Half-Opacity Disabled Control (`disabled:opacity-40/50`)', regex: /\bdisabled:opacity-[345]0\b/g, fix: 'Use neutral raised surface (--fc-bg-raised) + muted ink (--fc-ink-muted) on disabled primary buttons.' },
  { id: 'hover-only-trap', name: 'Hover-Only Action Reveal (`group-hover:opacity-100` without Touch Fallback)', regex: /\bopacity-0\b[^"\n]*\bgroup-hover:opacity-100\b/g, fix: 'Gate hover-only reveals with `@media (hover: hover)` or keep actions accessible on touch devices.' },
  { id: 'tracked-uppercase', name: 'Wide-Tracked Uppercase Label (`uppercase tracking-widest`)', regex: /\buppercase\s+tracking-widest\b|\btracking-widest\s+uppercase\b/g, fix: 'Prefer sentence case for UI labels unless part of an intentional editorial/Swiss typographic system.' },
  { id: 'ai-hype-copy', name: 'AI Hype Copy (`Supercharge`, `Unleash`, `Revolutionize`, `Game-changing`)', regex: /\b(supercharge|unleash|revolutionize|game-changing)\b/gi, fix: 'Write plain, specific product copy stating what the feature actually does.' },
  { id: 'transition-all', name: 'Forbidden `transition-all` / `transition: all`', regex: /\btransition-all\b|transition:\s*all\b/g, fix: 'Specify exact compositor properties (transform, opacity, colors).' },
  { id: 'layout-animation', name: 'Layout-Thrashing Animation (width/height/top/left/margin)', regex: /transition-property:\s*[^;]*(width|height|top|left|margin|padding)\b/g, fix: 'Animate `transform` (scale/translate) or grid-template-rows instead of layout geometry.' },
  { id: 'linear-spatial', name: 'Robotic Linear Easing on Spatial Transform', regex: /transition:[^;\n]*\btransform\b[^;\n]*\blinear\b/g, fix: 'Use slow-in/slow-out (`cubic-bezier(0.22, 1, 0.36, 1)`) instead of linear easing for spatial motion.' },
  { id: 'hover-scale-blur', name: 'Hover Scale or Sub-Pixel Translate (Causes GPU Text Blur)', regex: /\bhover:scale-105\b|-translate-x-1\/2\s+-translate-y-1\/2|translate\(-50%,\s*-50%\)/g, fix: 'Avoid scaling text-heavy cards on hover or centering text via translate(-50%,-50%); use Flexbox/Grid centering.' },
  { id: 'hover-font-weight', name: 'Font-Weight Change on Hover/Active (Causes Text Reflow Jitter)', regex: /\b(hover|active):font-(medium|semibold|bold)\b/g, fix: 'Keep font-weight constant across hover/active states; use color or background contrast instead.' },
  { id: 'scale-zero-entrance', name: 'Cartoonish `scale(0)` / `scale-0` Entrance', regex: /\bscale-0\b|transform:\s*scale\(0\)/g, fix: 'Start entrances from `scale(0.97)` with `opacity: 0`, never from `scale(0)`.' },
  { id: 'slow-duration', name: 'UI Animation Duration > 350ms', regex: /\bduration-(500|700|1000)\b|transition-duration:\s*([4-9]\d\d|\d{4,})ms\b/g, fix: 'Keep functional UI transitions under 300ms (150-260ms).' },
  { id: 'blocking-confirm', name: 'Blocking `window.confirm()` Dialog', regex: /\b(window\.)?confirm\s*\(/g, fix: 'Use an Optimistic Update + 5s Undo Toast for reversible actions, or an accessible focus-trapped modal for high-stakes actions.' }
];

const files = walk(targetDir);
const signalCounts = Object.fromEntries(SIGNALS.map(s => [s.id, 0]));
const signalApplicable = Object.fromEntries(SIGNALS.map(s => [s.id, Boolean(s.core)]));
const violations = [];
let nonEmptyCodeFiles = 0;

for (const file of files) {
  let rawContent = '';
  try {
    rawContent = fs.readFileSync(file, 'utf8');
  } catch {
    continue;
  }

  const ext = path.extname(file).toLowerCase();
  const content = stripCommentsPreservingLines(rawContent, ext);

  // Skip files that contain only comments/whitespace after comment stripping
  if (content.replace(/\s+/g, '').length === 0) {
    continue;
  }
  nonEmptyCodeFiles++;

  for (const sig of SIGNALS) {
    if (!signalApplicable[sig.id] && sig.when && sig.when.test(content)) {
      signalApplicable[sig.id] = true;
    }
    if (sig.regex.test(content)) {
      signalCounts[sig.id]++;
      signalApplicable[sig.id] = true;
    }
  }

  const lines = content.split(/\r?\n/);
  lines.forEach((line, idx) => {
    for (const anti of ANTI_PATTERNS) {
      anti.regex.lastIndex = 0;
      if (anti.regex.test(line)) {
        violations.push({
          ruleId: anti.id,
          rule: anti.name,
          file: path.relative(targetDir, file),
          line: idx + 1,
          fix: anti.fix
        });
      }
    }
  });
}

const applicableList = SIGNALS.filter(s => signalApplicable[s.id]);
const presentCount = applicableList.filter(s => signalCounts[s.id] > 0).length;
const totalPresentAll = SIGNALS.filter(s => signalCounts[s.id] > 0).length;

const rawCoverage = nonEmptyCodeFiles === 0 || applicableList.length === 0
  ? 0
  : Math.round((presentCount / applicableList.length) * 100);

const uniqueViolationRules = new Set(violations.map(v => v.ruleId)).size;
const violationPenalty = nonEmptyCodeFiles === 0
  ? 0
  : Math.min(100, uniqueViolationRules * 8 + violations.length * 3);

const netScore = Math.max(0, rawCoverage - violationPenalty);

if (jsonMode) {
  console.log(JSON.stringify({
    targetDir,
    filesScanned: files.length,
    codeFilesWithExecutableContent: nonEmptyCodeFiles,
    applicableSignals: applicableList.length,
    detectedSignals: totalPresentAll,
    rawCoveragePercent: rawCoverage,
    violationCount: violations.length,
    violationPenaltyPercent: violationPenalty,
    scorePercent: netScore,
    signals: SIGNALS.map(s => ({
      id: s.id,
      name: s.name,
      category: s.category,
      applicable: signalApplicable[s.id],
      matchedFiles: signalCounts[s.id]
    })),
    violations: violations.slice(0, 50)
  }, null, 2));
  process.exit(0);
}

console.log(`\nFEELCRAFT STATIC AUDIT REPORT (Heuristic Hint Scanner)`);
console.log(`Target:             ${targetDir}`);
console.log(`Files Scanned:      ${files.length} (${nonEmptyCodeFiles} with non-comment code)`);
console.log(`Applicable Signals: ${presentCount}/${applicableList.length} detected (${rawCoverage}% raw coverage)`);
console.log(`Violations Found:   ${violations.length} (${uniqueViolationRules} distinct rules, -${violationPenalty}% penalty)`);
console.log(`Net Quality Score:  ${netScore}%\n`);

console.log(`UX, MOTION & ACCESSIBILITY SIGNALS (Comments Stripped):`);
for (const sig of SIGNALS) {
  const count = signalCounts[sig.id];
  const isApp = signalApplicable[sig.id];
  const status = count > 0 ? '[PASS]' : (isApp ? '[MISS]' : '[N/A ]');
  const countStr = String(count).padStart(3, ' ');
  console.log(`  ${status} ${sig.name.padEnd(50, ' ')} (${countStr} files)`);
}

if (violations.length > 0) {
  console.log(`\nMOTION & UX ANTI-PATTERNS FOUND (${violations.length}):`);
  for (const v of violations.slice(0, 15)) {
    console.log(`  - ${v.file}:${v.line} -> ${v.rule}`);
    console.log(`    Fix: ${v.fix}`);
  }
  if (violations.length > 15) {
    console.log(`  ...and ${violations.length - 15} more.`);
  }
} else {
  console.log(`\nZERO MOTION OR UX ANTI-PATTERNS DETECTED.`);
}
