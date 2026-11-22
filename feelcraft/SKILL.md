---
name: feelcraft
description: Frontend design engineering, interaction ergonomics, <300ms motion physics, WCAG 2.2 accessibility, and perceived-performance skill for Web, Mobile, Desktop, and CLI/TUI interfaces. Separates universal engineering standards (keyboard focus, hit targets, touch parity, reduced motion, optimistic rollback, forgiving inputs) from default greenfield visual scaffolds.
license: MIT
metadata:
  logo: logo.svg
  version: 1.1.0
---

# Feelcraft

**Feelcraft** is a design-engineering skill for building and auditing **Web UIs**, **Mobile Apps**, **Desktop Shells**, and **CLI/TUI tools** (plus the frontend-adjacent API endpoints that back them).

It separates rules into two tiers so aesthetic defaults never override an intentional brand or editorial system:

1. **Universal Engineering & Accessibility Rules (Always Enforced):**
   Keyboard `:focus-visible`, WCAG 2.2 AA contrast (`>= 4.5:1` normal text; `>= 3.0:1` large text at `>= 24px` regular or `>= 18.66px` bold `>= 700`), `>= 44×44px` (`36×36px` desktop) hit targets, `@media (hover: hover)` touch parity, `prefers-reduced-motion` safety, `< 300ms` compositor transitions (`transform`, `opacity`), input forgiveness (Postel's Law), and optimistic mutations with rollback.
2. **Default Greenfield Visual Scaffolds (Overrideable by Brand / Editorial Direction):**
   Low-chroma neutral ramps (`Graphite`, `Warm Stone`, `Deep Ink`), single-accent budgets, `400–600` UI font weights, and sentence-case labels are **starting defaults when the user provides no brand system**. When a project has an established brand palette (including green or purple brands) or calls for editorial/Swiss/display typography (`700–800` bold headings, tracked kickers), **honor that direction**.

---

## Step 0: Surface Mode & Direction

1. **Identify Surface Mode:**
   - **`Operate` Mode** (dashboards, SaaS workspaces, editors, settings, tables, CLI/TUI): Quiet precision, static backgrounds, fast keyboard/pointer ergonomics, and restrained micro-feedback.
   - **`Showcase / Experience` Mode** (landing pages, portfolios, launches, studios): Expressive editorial typography (`700–800` display weights where fitting), up to 1 battery-safe backdrop (`DPR <= 2`, `<= 30fps`, paused offscreen, frozen under `prefers-reduced-motion`), and 1–2 focal interaction details from [references/06-kinetic-atlas.md](references/06-kinetic-atlas.md).
2. **Select Visual Direction:**
   - Adopt existing design tokens or brand guidelines whenever present.
   - For greenfield apps with no specified style, pick a domain-matched neutral ramp + 1 accent from [references/05-visual-foundations.md](references/05-visual-foundations.md) rather than unprompted multi-stop neon purple/cyan or emerald/lime gradients.
   - When 2–3 distinct directions or sidebar architectures fit a greenfield build equally well, offer concise options via `ask_question` before implementing. Skip asking for bug fixes, narrow edits, or audits.

---

## The 5 Engineering Passes (`BUILD` & `REFINEMENT`)

### Pass 1: Color, Contrast, Surface Depth & `4px` Grid
*Reference: [references/05-visual-foundations.md](references/05-visual-foundations.md) · CSS: [resources/feelcraft.css](resources/feelcraft.css)*

- **WCAG 2.2 AA Contrast:** Normal text (`< 24px` regular or `< 18.66px` bold) requires **`>= 4.5:1`** contrast; large text (`>= 24px` regular or `>= 18.66px` bold `>= 700`) requires **`>= 3.0:1`** against its effective alpha-composited background.
- **Luminance Depth & Accent Budget:** Build dark-mode depth via stepped surface luminance (`Canvas -> Card -> Raised`) and `1px` hairlines (`6–10%` opacity) instead of neon glows. Reserve green for semantic success/positive states unless the brand itself is green. Avoid competing filled primary CTAs in the same viewport region.
- **`4px` Grid & Logical CSS:** Snap paddings, gaps, and control heights (`32px` compact, `36px` desktop, `44px` touch) to multiples of `4px` (`Inner Gap < Outer Gap`). Use logical properties (`padding-inline`, `margin-inline`, `text-align: start`) for LTR/RTL parity.
- **Native Chrome:** Declare `color-scheme: light` / `color-scheme: dark` and style thin scrollbars (`scrollbar-width: thin`).

### Pass 2: Typography, Geometry, Icons & Copy
*Reference: [references/05-visual-foundations.md](references/05-visual-foundations.md)*

- **Contextual Typography & Crisp Rasterization:**
  - Use `400–600` weights for dense `Operate` controls/tables; use `700–800` deliberately for editorial, display, or brand headlines.
  - Set `font-variant-numeric: tabular-nums` (`tabular-nums`) on numbers, prices, timers, and table cells; set `text-wrap: balance` on multi-line headings and `text-wrap: pretty` on body copy.
  - Lock `-webkit-font-smoothing: antialiased` on `body`. Never `scale()` cards containing dense small text (`<= 13px`) on hover/click, never center text via `translate(-50%, -50%)`, and never change `font-weight` on `:hover`/`:active`.
- **Concentric Corners:** Nested rounded containers obey $R_{\text{outer}} = R_{\text{inner}} + \text{padding}$ (min `4px` inner radius; `.cornerCurve(.continuous)` on native platforms).
- **Icons & Copy:** Use one consistent line-icon set (`16–18px`, `1.5px` stroke) rather than emoji (`✨`, `🚀`) in UI chrome. Include comparison baselines on metric deltas (`+12.4% vs last 30 days`) and avoid AI hype words (*"Supercharge"*, *"Unleash"*).

### Pass 3: Motor Ergonomics, Accessibility & Input Forgiveness
*References: [references/01-cognitive-laws.md](references/01-cognitive-laws.md), [references/03-expensive-details.md](references/03-expensive-details.md) · Helpers: [examples/feelcraft-primitives.tsx](examples/feelcraft-primitives.tsx)*

- **Hit Slop & Safe Areas (Fitts's Law):** Ensure `>= 44×44px` touch (`36×36px` desktop) hit targets. Expand compact icons via `::after { content: ""; position: absolute; inset: -8px; }` (or native `hitSlop`) and respect `env(safe-area-inset-*)`.
- **Keyboard Focus & Live Regions:** Style `:focus-visible` with a `2px` outline (`2px` offset). Trap focus inside modals/`Cmd+K` menus, restore focus to the trigger on `Esc`, and mark toasts with `role="status"` / `aria-live="polite"`.
- **Touch Parity (`@media (hover: hover)`):** Gate hover-only action reveals inside `@media (hover: hover) and (pointer: fine)` so touch devices never lose access to controls.
- **Postel's Input Forgiveness:** Strip spaces/hyphens silently on input. Validate lazily on `blur` or submit and clear errors immediately on input (*reward early, punish late*). On verification inputs, set `autocomplete="one-time-code"` and `inputmode="numeric"`, and distribute pasted digits from the active box index (`OtpInput`).
- **Tactile Controls & Navigation:** Style `appearance: none` checkboxes/radios aligned to line-1 cap-height (`items-start`) inside full-card `<label>`s. Protect diagonal submenu travel (`useSafeTriangleSubmenu` with unmount/leave timer cleanup), use **Tooltip Skip-Delay** (`400ms` first, `0ms` warm siblings), place primary commit actions at the `inline-end` of footers, and style disabled buttons with neutral `--fc-bg-raised` + `--fc-ink-muted`.

### Pass 4: Perceived Speed & Mutation Safety (Doherty `<400ms`)
*Reference: [references/03-expensive-details.md](references/03-expensive-details.md) · Helpers: [examples/feelcraft-primitives.tsx](examples/feelcraft-primitives.tsx)*

- **Optimistic Updates & Safe 5-Second Undo Queue:**
  - Update UI state in `0ms` on mutation and snapshot prior state for rollback on error.
  - Replace `window.confirm()` on reversible deletions with a **5-second Undo Toast** (`UndoMutationQueue`).
  - **Unload Lifecycle Rule:** Flush pending undo mutations via `fetch(..., { keepalive: true })` on actual page unload (`pagehide` and `beforeunload`), **never on `visibilitychange`** (switching tabs must preserve the 5-second undo window), and always invoke `rollbackUI()` if the commit or keepalive response fails (`!res.ok`).
- **Idempotency & Zero-CLS Loading:** Send an `Idempotency-Key` header on mutations while locking duplicate submit clicks at fixed button width. Use SWR caching, route prefetching, layout-matched **Skeleton Loaders** (`CLS = 0`, delayed `120ms`), and explicit media `aspect-ratio` with LQIP/BlurHash placeholders.

### Pass 5: Motion Physics (`<300ms`) & Reduced Motion
*References: [references/02-motion-physics.md](references/02-motion-physics.md), [references/06-kinetic-atlas.md](references/06-kinetic-atlas.md)*

- **Frequency-Gated Timing:**
  - **High-frequency (`>10×/session` — tabs, row hover, command menu, switches):** `0–120ms`, zero bounce, zero stagger.
  - **Medium-frequency (`1–5×/session` — popovers, modals, drawers, toasts):** `150–260ms` (`<300ms` ceiling) with `cubic-bezier(0.22, 1, 0.36, 1)`, exits `140–180ms`, origin-aware (`scale(0.97) -> 1`, never `scale(0)`), and interruptible mid-flight.
  - **Low-frequency (`<1×/session` — completion milestone, `360ms` error shake):** Purposeful secondary-action feedback.
- **Compositor & Reduced-Motion Discipline:** Never use `transition-all` or animate layout geometry (`width`, `height`, `top`, `left`). Use `:root { interpolate-size: allow-keywords }` + `grid-template-rows: 0fr -> 1fr` fallback for accordions, lock transitions during instant theme switches (`.theme-switching`), and always include `@media (prefers-reduced-motion: reduce)`.

---

## Auditing Workflow (`AUDIT` Mode)

1. **Static Heuristic Hint Scanner:**
   ```bash
   node <skill-folder>/scripts/audit-feelcraft.mjs <target-directory>
   ```
   Strips comments before scanning, scopes contextual signals (OTP, sheets, submenus) to projects where those features exist, and deducts anti-pattern violations from the net score. Use static matches as diagnostic leads, not final proof of visual quality.
2. **Live Browser DOM Inspector:**
   Inject [scripts/audit-dom-runtime.js](scripts/audit-dom-runtime.js) into a live page (`page.evaluate()`) to verify rendered hit boxes (`<32–36px`), alpha-composited WCAG 2.2 AA contrast (`<4.5:1` normal / `<3.0:1` large text at `>=24px` or `>=18.66px bold`), concentric border radii, `tabular-nums`, `text-wrap: balance`, chunky scrollbars, and transitions `>320ms` or `transition: all`.
3. **Reference Blueprints:**
   - [01-cognitive-laws.md](references/01-cognitive-laws.md) · [02-motion-physics.md](references/02-motion-physics.md) · [03-expensive-details.md](references/03-expensive-details.md) · [04-domain-adapters.md](references/04-domain-adapters.md) · [05-visual-foundations.md](references/05-visual-foundations.md) · [06-kinetic-atlas.md](references/06-kinetic-atlas.md)
