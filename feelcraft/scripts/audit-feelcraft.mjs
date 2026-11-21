#!/usr/bin/env node
/**
 * Feelcraft Static Auditor (`audit-feelcraft.mjs`)
 * Zero-dependency scanner that audits Web, Mobile, Backend/API, and CLI projects
 * for Feelcraft's 20 expensive UX details, reduced-motion accessibility, and
 * motion/latency anti-patterns (<300ms rule, no transition-all, tabular-nums, etc.).
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

const SIGNALS = [
  { id: 'tabular-nums', name: 'Tabular Numbers (tabular-nums)', regex: /tabular-nums|monospacedDigit/i, category: 'Typography & Geometry' },
  { id: 'text-balance', name: 'Balanced Headlines (text-wrap: balance/pretty)', regex: /text-wrap:\s*(balance|pretty)|text-(balance|pretty)/i, category: 'Typography & Geometry' },
  { id: 'continuous-corners', name: 'Continuous / Concentric Corners', regex: /cornerCurve|\.continuous|borderCurve|calc\(var\(--.*radius/i, category: 'Typography & Geometry' },
  { id: 'dark-scrollbar-polish', name: 'Native Color-Scheme & Thin Scrollbar Styling', regex: /color-scheme:\s*(dark|light)|scrollbar-width:\s*thin|::-webkit-scrollbar/i, category: 'Typography & Geometry' },
  { id: 'tactile-form-controls', name: 'Custom Tactile Checkboxes/Radios & Tap Highlight Cleanse', regex: /appearance:\s*none|appearance-none|-webkit-tap-highlight-color/i, category: 'Ergonomics & Navigation' },
  { id: 'kinetic-craft-primitives', name: 'Restrained Kinetic Craft (Segmented Pill / Keycap / Spotlight)', regex: /fc-seg-thumb|glideSegmentedThumb|fc-hairline-spot|usePointerSpotlight|fc-keycap|fc-copy-icon-box/i, category: 'Motion & Physics (<300ms)' },
  { id: 'skeleton-loader', name: 'Skeleton Loaders', regex: /skeleton|shimmer/i, category: 'Perceived Speed (<400ms)' },
  { id: 'optimistic-ui', name: 'Optimistic Updates', regex: /useOptimistic|optimistic|onMutate/i, category: 'Perceived Speed (<400ms)' },
  { id: 'swr-cache', name: 'Stale-While-Revalidate (SWR)', regex: /useSWR|stale-while-revalidate|staleTime/i, category: 'Perceived Speed (<400ms)' },
  { id: 'prefetch', name: 'Pre-rendering / Hover Prefetch', regex: /prefetch|prerender|onPointerEnter/i, category: 'Perceived Speed (<400ms)' },
  { id: 'blurhash-lqip', name: 'BlurHash / LQIP Placeholders', regex: /blurDataURL|blurhash|placeholder=["']blur["']/i, category: 'Perceived Speed (<400ms)' },
  { id: 'command-menu', name: 'Command Menu (Cmd+K / Ctrl+K)', regex: /cmdk|CommandMenu|metaKey\s*&&\s*['"]k['"]/i, category: 'Ergonomics & Navigation' },
  { id: 'shortcut-hints', name: 'Keyboard Shortcut Hints (<kbd>)', regex: /<kbd[\s>]/i, category: 'Ergonomics & Navigation' },
  { id: 'hit-slop', name: 'Expanded Hit Slop Targets', regex: /hitSlop|after:-inset-|inset:\s*-\d+px|fc-hit-slop/i, category: 'Ergonomics & Navigation' },
  { id: 'safe-area', name: 'Safe Area Insets', regex: /safe-area-inset|SafeAreaView|useSafeAreaInsets/i, category: 'Ergonomics & Navigation' },
  { id: 'safe-triangle', name: 'Safe Triangle Submenu Protection', regex: /safeTriangle|safe-triangle|isPointInSafeTriangle/i, category: 'Ergonomics & Navigation' },
  { id: 'swipe-dismiss', name: 'Swipe-to-Dismiss Sheets', regex: /swipeToDismiss|presentationDetents|vaul|shouldDismissSheet/i, category: 'Motion & Physics (<300ms)' },
  { id: 'view-transitions', name: 'View Transitions / Shared Layout', regex: /startViewTransition|view-transition-name|layoutId/i, category: 'Motion & Physics (<300ms)' },
  { id: 'origin-awareness', name: 'Origin-Aware Transforms', regex: /transform-origin|origin-(top|bottom|left|right)|--radix-.*-transform-origin/i, category: 'Motion & Physics (<300ms)' },
  { id: 'custom-easing', name: 'Custom Cubic-Bezier / Spring Easing', regex: /cubic-bezier\(|spring\(/i, category: 'Motion & Physics (<300ms)' },
  { id: 'smooth-auto-height', name: 'Smooth Height:Auto (interpolate-size)', regex: /interpolate-size:\s*allow-keywords|grid-rows-\[0fr\]/i, category: 'Motion & Physics (<300ms)' },
  { id: 'instant-theme-switch', name: 'Instant Theme Switch Guard (.theme-switching)', regex: /theme-switching|disableTransitionOnChange|switchThemeInstant/i, category: 'Motion & Physics (<300ms)' },
  { id: 'tooltip-skip-delay', name: 'Tooltip Skip-Delay Warmup', regex: /skipDelayDuration|TooltipWarmupCoordinator|tooltipWarmup/i, category: 'Ergonomics & Navigation' },
  { id: 'reduced-motion', name: 'Reduced Motion Accessibility Guard', regex: /prefers-reduced-motion|motion-reduce:|isReduceMotionEnabled|accessibilityReduceMotion/i, category: 'Motion & Physics (<300ms)' },
  { id: 'focus-visible-ring', name: 'Keyboard Focus-Visible Ring', regex: /:focus-visible|focus-visible:/i, category: 'Ergonomics & Navigation' },
  { id: 'rtl-logical-css', name: 'Bi-Directional / Logical CSS Properties', regex: /padding-inline|margin-inline|inset-inline|:dir\(rtl\)|text-align:\s*(start|end)/i, category: 'Ergonomics & Navigation' },
  { id: 'undo-toast', name: 'Undo Toasts (Non-Blocking Recovery)', regex: /toast.*undo|onUndo|UndoMutationQueue|--dry-run/i, category: 'Forgiveness & Safety' },
  { id: 'otp-autofill', name: 'One-Time Code Autofill & Paste Split', regex: /one-time-code|oneTimeCode/i, category: 'Forgiveness & Safety' },
  { id: 'idempotency', name: 'Idempotency Keys', regex: /Idempotency-Key|idempotencyKey|idempotency_key/i, category: 'Forgiveness & Safety' }
];

const ANTI_PATTERNS = [
  { id: 'ai-gradient-text', name: 'AI Slop Gradient Text (`bg-clip-text text-transparent`)', regex: /bg-clip-text[^;\n]*text-transparent|text-transparent[^;\n]*bg-clip-text/g, fix: 'Use solid primary ink from your neutral ramp instead of gradient text.' },
  { id: 'ai-purple-gradient', name: 'AI Slop Purple/Indigo/Cyan Surface Gradient', regex: /from-(purple|indigo|violet|fuchsia)-\d00\s+(via-[^\s]+\s+)?to-(cyan|pink|blue|purple|indigo)-\d00/g, fix: 'Replace hue-to-hue gradients with stepped neutral luminance surfaces and 1px hairlines.' },
  { id: 'ai-chatgpt-green-slop', name: 'ChatGPT Green/Olive/Lime UI Slop (`#10a37f`, `emerald-500`, `lime-300`, `bg-*-950`)', regex: /#10a37f|#00ff88|#bef264|#d9f99d|#a3e635|from-(emerald|teal|green|lime)-[23456]00\s+(via-[^\s]+\s+)?to-(teal|cyan|emerald|green|lime)-[23456]00|\b(bg|text|border)-(emerald|teal|lime|green)-(200|300|400|500|900|950)\b|\bborder-(emerald|teal|lime)-[45]00\/[3456789]0\b/gi, fix: 'Reserve green strictly for semantic success/positive metrics; keep dark surfaces on a neutral ramp (Graphite/Warm Stone/Deep Ink), keep active nav rows neutral raised, and use one non-slop accent or crisp off-white primary CTA.' },
  { id: 'ai-neon-glow', name: 'Colored Neon Shadow / Glow (`shadow-*-500/...`)', regex: /shadow-(purple|indigo|violet|fuchsia|cyan|pink|blue|emerald|teal|green)-[456]00\/[23456789]0/g, fix: 'Use neutral luminance steps on dark themes and soft neutral shadows on light themes.' },
  { id: 'ui-emoji-slop', name: 'Emoji Used in UI Chrome / Badges (`✨ 🚀 👋 🔥`)', regex: /[✨🚀👋🔥⚡💡🎉]/g, fix: 'Replace decorative emoji with a single consistent 16-18px line-icon set (1.5px stroke).' },
  { id: 'shouting-font-weight', name: 'Heavy Shouting Font Weight (`700/800/900` / `font-bold` / `font-black`)', regex: /\bfont-(bold|extrabold|black)\b|font-weight:\s*(700|800|900)\b/g, fix: 'Derive hierarchy from size and ink contrast; use weights 400 and 500 (600 max).' },
  { id: 'muddy-disabled-accent', name: 'Muddy Half-Opacity Disabled Control (`disabled:opacity-40/50`)', regex: /disabled:opacity-[345]0\b/g, fix: 'Use neutral raised surface (--fc-bg-raised) + muted ink (--fc-ink-muted) on disabled primary buttons instead of muddy half-opacity accent fills.' },
  { id: 'hover-only-trap', name: 'Hover-Only Action Reveal (`group-hover:opacity-100` without Touch Fallback)', regex: /opacity-0[^"\n]*group-hover:opacity-100/g, fix: 'Gate hover-only reveals with `@media (hover: hover)` or keep actions accessible on touch devices.' },
  { id: 'tracked-uppercase', name: 'Wide-Tracked Uppercase Label (`uppercase tracking-widest`)', regex: /\buppercase\s+tracking-(wider|widest)\b|\btracking-(wider|widest)\s+uppercase\b/g, fix: 'Use sentence case for labels and section headers.' },
  { id: 'ai-hype-copy', name: 'AI Hype Copy (`Supercharge`, `Unleash`, `Revolutionize`, `Game-changing`)', regex: /\b(supercharge|unleash|revolutionize|game-changing)\b/gi, fix: 'Write plain, specific product copy stating what the feature actually does.' },
  { id: 'transition-all', name: 'Forbidden `transition-all` / `transition: all`', regex: /transition-all|transition:\s*all\b/g, fix: 'Specify exact compositor properties (transform, opacity, colors).' },
  { id: 'layout-animation', name: 'Layout-Thrashing Animation (width/height/top/left/margin)', regex: /transition-property:\s*[^;]*(width|height|top|left|margin|padding)/g, fix: 'Animate `transform` (scale/translate) or grid-template-rows instead of layout geometry.' },
  { id: 'linear-spatial', name: 'Robotic Linear Easing on Spatial Transform', regex: /transform[^;\n]*\blinear\b/g, fix: 'Use slow-in/slow-out (`cubic-bezier(0.22, 1, 0.36, 1)`) instead of linear easing.' },
  { id: 'hover-scale-blur', name: 'Hover Scale or Sub-Pixel Translate (Causes GPU Text Blur)', regex: /hover:scale-|-translate-x-1\/2\s+-translate-y-1\/2|translate\(-50%,\s*-50%\)/g, fix: 'Avoid scaling cards on hover or centering text via translate(-50%,-50%); use Flexbox/Grid centering and surface/border steps so glyphs stay on integer pixels.' },
  { id: 'hover-font-weight', name: 'Font-Weight Change on Hover/Active (Causes Text Reflow Jitter)', regex: /(hover|active):font-(medium|semibold|bold)/g, fix: 'Keep font-weight constant across hover/active states; use color or background contrast instead.' },
  { id: 'scale-zero-entrance', name: 'Cartoonish `scale(0)` / `scale-0` Entrance', regex: /\bscale-0\b|transform:\s*scale\(0\)/g, fix: 'Start entrances from `scale(0.97)` with `opacity: 0`, never from `scale(0)`.' },
  { id: 'slow-duration', name: 'UI Animation Duration > 350ms', regex: /duration-(500|700|1000)|transition-duration:\s*([4-9]\d\d|\d{4,})ms/g, fix: 'Keep functional UI transitions under 300ms (150-260ms).' },
  { id: 'blocking-confirm', name: 'Blocking `window.confirm()` Dialog', regex: /\b(window\.)?confirm\s*\(/g, fix: 'Use an Optimistic Update + 5s Undo Toast for reversible actions.' }
];

const files = walk(targetDir);
const signalCounts = Object.fromEntries(SIGNALS.map(s => [s.id, 0]));
const violations = [];

for (const file of files) {
  let content = '';
  try {
    content = fs.readFileSync(file, 'utf8');
  } catch {
    continue;
  }

  for (const sig of SIGNALS) {
    if (sig.regex.test(content)) {
      signalCounts[sig.id]++;
    }
  }

  const lines = content.split(/\r?\n/);
  lines.forEach((line, idx) => {
    for (const anti of ANTI_PATTERNS) {
      anti.regex.lastIndex = 0;
      if (anti.regex.test(line)) {
        violations.push({
          rule: anti.name,
          file: path.relative(targetDir, file),
          line: idx + 1,
          fix: anti.fix
        });
      }
    }
  });
}

const presentCount = SIGNALS.filter(s => signalCounts[s.id] > 0).length;
const score = files.length === 0 ? 0 : Math.round((presentCount / SIGNALS.length) * 100);

if (jsonMode) {
  console.log(JSON.stringify({
    targetDir,
    filesScanned: files.length,
    scorePercent: score,
    signals: SIGNALS.map(s => ({ ...s, matchedFiles: signalCounts[s.id] })),
    violations: violations.slice(0, 50)
  }, null, 2));
  process.exit(0);
}

console.log(`\nFEELCRAFT AUDIT REPORT`);
console.log(`Target:        ${targetDir}`);
console.log(`Files Scanned: ${files.length}`);
console.log(`Craft Coverage: ${presentCount}/${SIGNALS.length} signals detected (${score}%)\n`);

console.log(`${SIGNALS.length} EXPENSIVE UX, MOTION & ACCESSIBILITY SIGNALS:`);
for (const sig of SIGNALS) {
  const count = signalCounts[sig.id];
  const status = count > 0 ? '[PASS]' : '[MISS]';
  const countStr = String(count).padStart(3, ' ');
  console.log(`  ${status} ${sig.name.padEnd(48, ' ')} (${countStr} files)`);
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
  console.log(`\nZERO MOTION ANTI-PATTERNS DETECTED.`);
}
