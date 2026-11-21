---
name: feelcraft
description: Standalone universal design engineering, anti-slop visual craft, <300ms motion physics, cognitive ergonomics, and tactile polish skill for all agents (Web, Mobile, Backend/API, CLI/TUI, Desktop, and QA Auditors). Synthesizes 60+ principles across product-world direction (anti-sameness), neutral color ramps & luminance depth, 4px spacing grids, typography & copy hygiene, Laws of UX, UI animation physics, 8 spatial navigation architectures, curated kinetic craft specimens (gliding segmented pills, hairline spotlights, ghost rolls, odometer rolls, task-matched context surfaces, procedural non-slop atmospheres), and 20 high-craft product engineering patterns. Use when building, auditing, redesigning, polishing, or reviewing any app, component, interaction, API workflow, or CLI so it looks distinct, feels slightly alive where appropriate, and ships with zero AI slop.
license: MIT
metadata:
  logo: logo.svg
  version: 1.0.0
---

# Feelcraft

**Feelcraft** is a standalone, all-in-one design engineering skill that governs **identity & visual craft** (product-derived color ramps, luminance depth, `4px` rhythm, typographic restraint, icon/copy hygiene), **tactile physical life** (proportional kinetic micro-interactions, procedural atmospheres without AI slop), and **runtime behavior** (`<400ms` latency perception, `<300ms` origin-aware interruptible motion, motor ergonomics, forgiving inputs)—whether the agent is building a **Web UI**, a **Mobile App**, a **Backend API**, a **CLI/TUI tool**, or running a **Full-Stack UX & Design Audit**.

---

## Step 0: Direction, Mode & Choice Gate (Read Before Touching Code)

Never build every project in the exact same default theme, and never dump animated flair onto every surface. Before writing UI code:

1. **Identify the Surface Mode:**
   - **`Operate` Mode** (dashboards, SaaS workspaces, editors, settings, tables, CLI/TUI): `95%` quiet precision, static backgrounds, and **1 subtle living detail** (e.g., gliding segmented pill, width-locked `Copy → Check` morph, `tabular-nums` odometer on the hero metric, or mechanical `<kbd>` keycaps).
   - **`Showcase / Experience` Mode** (landing pages, portfolios, launches, interactive studios): Calm neutral layout + **at most 1** architectural living backdrop (CSS 3D horizon, SVG contour drift, or `30fps` vector field) + **1–2** physical focal details (capped `±3.5°` specular foil, `:has()` notched strip, or ghost-text hero CTA).
2. **Write a 3-Line Product Direction (Anti-Sameness Guard):**
   - **World & Material:** What physical world does this product belong near? (e.g., *dark projection room + film strip* for a subtitle studio; *warm cream ledger + brass ink* for finance; *drafting grid + caliper ticks* for CAD/design).
   - **Custom Palette & Single Accent:** Pick or tint a low-chroma neutral ramp + **1 custom accent** derived from that world (never default every app to Graphite + Vermilion, and never use purple/cyan or ChatGPT green/olive/lime slop).
   - **1–2 Signature Kinetic Motifs:** Select only 1–2 fitting mechanics from [references/06-kinetic-atlas.md](references/06-kinetic-atlas.md) so the app feels distinct and slightly alive without feeling noisy.
3. **Interactive Choice Gate (Ask User When Multiple Great Options Fit):**
   - When creating a new app/landing page, redesigning an existing screen, or facing a design fork where **2–3 equally strong Directions (World + Accent), Side Navigation Architectures, or Signature Kinetic Styles** fit and the user hasn't specified a look: **stop and offer 2–3 crisp, concrete options using `ask_question` (or short numbered choices in plain text)** before writing the full implementation.
   - *Skip asking* for narrow bug fixes, single-component edits, strict audits, or when the user already gave clear visual direction or said *"just build it"*.

---

## The 3-Gate Decision Engine (Read Before Touching Code)

Never dump every visual effect or animation onto every element. Over-decorating chrome or over-animating a high-frequency control is AI slop. Every decision passes through three gates in order:

### Gate 1: The Visual & Frequency Gate (Restraint First)
*Keep 90% of the chrome quiet; the more often an action is used, the less it should animate.*
- **Surface & Color Restraint (Von Restorff Budget):**
  - Build from **one tinted neutral ramp** (`Graphite`, `Warm Stone`, or `Deep Ink` in [references/05-visual-foundations.md](references/05-visual-foundations.md)). Create depth via stepped surface luminance (`Canvas -> Card -> Raised`) and `1px` hairlines (`6–10%` opacity)—never neon glows, purple/indigo-to-cyan gradients, **ChatGPT green slop (emerald/teal `#10a37f` OR dark olive-green tinted surfaces + pastel lime/chartreuse `#bef264`/`#d9f99d`/`lime-300` buttons and active states)**, gradient text, or floating color blobs.
  - Reserve **one single accent color** for **at most one primary CTA per viewport**, the active focus ring, or hero data series (keep active sidebar rows on a neutral raised step and keep green strictly for semantic success/positive states unless the user's explicit brand is green). Enforce three strict ink contrast roles (`Primary >= 10:1`, `Secondary >= 5.5:1`, `Muted >= 4.5:1`).
- **High-Frequency Interactions (`>10× per session` — command menus, keyboard nav, row hover, switches, tab switches, warm adjacent tooltips, CLI prompts):**
  - Duration: `0ms` to `120ms`. Zero bounce, zero overshoot, zero stagger, zero wind-up anticipation.
- **Medium-Frequency Transitions (`1–5× per session` — popovers, modals, drawers, sheets, toasts, route changes):**
  - Duration: `150ms` to `260ms` (strict ceiling: `<300ms`, with exits 20–30% faster at `140–180ms`).
  - Curve: `cubic-bezier(0.22, 1, 0.36, 1)` (slow-in/slow-out, never `linear` for spatial motion).
  - Must be **origin-aware** (`transform-origin` anchored to trigger, starting at `scale(0.97)` with `opacity: 0`, never `scale(0)`) and **interruptible** (retargetable mid-flight).
- **Low-Frequency / Peak Moments (`<1× per session` — onboarding completion, payment confirmed, invalid passcode `360ms` error shake, zero-inbox celebration):**
  - Apply **Peak-End Rule**, **Exaggerated Feedback**, **Anticipation Wind-Up**, **Follow-Through**, and **Secondary Action** flourishes.

### Gate 2: The Latency Gate (Doherty Threshold `<400ms`)
*Respond within 400ms or the system breaks human flow.*
- **`0–50ms` (User Mutations — like, archive, reorder, toggle, delete, send):**
  - Apply **Optimistic Updates** immediately in UI state (`0ms`), snapshot prior state for rollback on error, pair reversible destructive actions with a non-blocking **Undo Toast** (`5s` grace window + `beforeunload` keepalive flush), and protect network mutations with an **Idempotency Key**.
- **`50–400ms` (Navigation & Reads):**
  - Serve cached data immediately via **Stale-While-Revalidate (SWR)** and trigger **Pre-rendering / Prefetching** on hover intent (`onPointerEnter` / `80ms` dwell).
- **`>400ms` (Cold Loads & Heavy Media):**
  - Render layout-matched **Skeleton Loaders** (`CLS = 0`, delayed `120ms` to avoid flash on fast cache hits) and decode **BlurHash / LQIP** placeholders for images.

### Gate 3: The Motor & Cognitive Gate
- **Fitts's Law & Hit Slop:** Every interactive target has at least a `44×44px` (`36×36px` dense desktop minimum) hit area. Small icons get invisible **Hit Slop** (`::after { inset: -8px }` or native `hitSlop`). Nested hover menus use a **Safe Submenu Pointer Triangle** so diagonal cursor travel never closes the child menu.
- **Hick's & Miller's Laws:** Present 1 primary action per surface; chunk lists into groups of `5–7` items (`Inner Gap < Outer Gap` on a `4px` grid); tuck power actions into a **Command Menu** (`Cmd+K` / `Ctrl+K`) with `<kbd>` **Shortcut Hints**; select an intentional layout from the **8 Side Navigation Architectures**.
- **Postel's & Jakob's Laws:** Accept messy human input silently (spaces/dashes in cards and phones, full pasted OTP codes across split digit boxes, flexible CLI flags) and emit clean canonical output while honoring platform conventions (**Predictive Back**, **Swipe-to-Dismiss Sheets**, **Safe Area Insets**).

---

## How to Run Feelcraft

### Mode A: `AUDIT` Mode (Reviewing an Existing App, Screen, or PR)
1. **Run the Static Scanner (if Node.js is available):**
   ```bash
   node <skill-folder>/scripts/audit-feelcraft.mjs <target-directory>
   ```
2. **Run the Live Browser DOM Inspector (if a live page or dev server is running):**
   - Inject [scripts/audit-dom-runtime.js](scripts/audit-dom-runtime.js) via browser evaluation (`page.evaluate`) to measure real rendered hit boxes (`<36px`), WCAG text contrast failures (`<4.5:1`), non-concentric nested border radii, digits missing `tabular-nums`, headings missing `text-wrap: balance`, and transitions `>300ms` or using `transition: all`.
3. **Inspect Against the 6 Reference Blueprints:**
   - [references/05-visual-foundations.md](references/05-visual-foundations.md) — Color ramps, `4px` spacing grid, typography hierarchy, icon/emoji hygiene, copy, scrollbars & setting-card rules
   - [references/06-kinetic-atlas.md](references/06-kinetic-atlas.md) — Curated tactile hover/press primitives, task-matched context surfaces, and battery-safe architectural backgrounds
   - [references/01-cognitive-laws.md](references/01-cognitive-laws.md) — 9 cognitive & ergonomic laws of UX
   - [references/02-motion-physics.md](references/02-motion-physics.md) — 15 UI animation physics & CSS mechanics
   - [references/03-expensive-details.md](references/03-expensive-details.md) — 20 high-craft product details & 8 side navigation architectures
   - [references/04-domain-adapters.md](references/04-domain-adapters.md) — Adapters for Mobile, Backend/API, CLI/TUI, AI Streaming, and Desktop agents
4. **Output the Feelcraft Scorecard & Implement Fixes** in the 6 ordered passes below, using [resources/feelcraft.css](resources/feelcraft.css) and [examples/feelcraft-primitives.tsx](examples/feelcraft-primitives.tsx).

---

### Mode B: `BUILD` Mode (6 Ordered Passes for Standalone Craft)

#### Pass 1: Color, Surface Physics & `4px` Spacing Grid
- **Tinted Neutral Ramp & Luminance Depth:** Pick `Graphite`, `Warm Stone`, or `Deep Ink` ([references/05-visual-foundations.md](references/05-visual-foundations.md)). Build depth from surface luminance steps + `1px` hairlines (`6–10%` opacity). Strip all purple-to-cyan gradients, gradient text, neon glows, and background color blobs.
- **3 Ink Roles & 1 Accent:** Enforce `Primary (`>=10:1`)`, `Secondary (`>=5.5:1`)`, and `Muted (`>=4.5:1`)` contrast. Use a single accent hue (with `>=4.5:1` ink contrast on fills).
- **`4px` Rhythm & Gestalt Grouping:** Snap all paddings, gaps, and heights (`32px` compact, `36px` desktop, `44px` touch) to multiples of `4px`. Keep inner group spacing smaller than outer section spacing, and align icons, labels, and right-aligned numbers down strict vertical columns. Use **CSS logical properties** (`padding-inline`, `margin-inline`, `text-align: start`) so mixed-language / RTL layouts mirror naturally.
- **Native Scrollbars & Browser Chrome (`color-scheme`):** Declare `color-scheme: light` / `color-scheme: dark` and style thin, arrow-free scrollbars (`scrollbar-width: thin`, `8px` `::-webkit-scrollbar` pill thumb, `::-webkit-scrollbar-button { display: none }`) so Windows/Linux dark-mode apps never show clunky 17px gray native scrollbars.

#### Pass 2: Typography, Icons, Copy & Geometric Precision
- **Typography Scale & Anti-Blur Rasterization:**
  - Use weights `400` and `500` (`600` max for top titles; ban `700–900` extrabold headings).
  - Use **Sentence case everywhere** (ban wide-tracked `UPPERCASE` labels and negative tracking on small `<=14px` text).
  - Apply `font-variant-numeric: tabular-nums` (`tabular-nums`) to every number, price, timer, counter, and table cell.
  - Apply `text-wrap: balance` to headings and `text-wrap: pretty` to body paragraphs.
  - Lock `-webkit-font-smoothing: antialiased` on `body`. Never `scale()` cards containing dense small text (`<=13px`) on hover/click, never center text containers with `translate(-50%, -50%)`, and never change `font-weight` on `:hover`/`:active`.
- **Concentric Continuous Corners:** Nested rounded containers obey $R_{\text{outer}} = R_{\text{inner}} + \text{padding}$ (minimum `4px` inner radius; `.cornerCurve(.continuous)` on native platforms).
- **Icons & Copy Hygiene:**
  - Replace all emoji in UI chrome/badges (`✨`, `🚀`, `👋`) with one consistent line-icon set (`16–18px`, `1.5px` stroke, matched to secondary/muted ink).
  - Write specific, plain copy without exclamation marks, trailing periods on labels, greeting banners, AI hype words (*"Supercharge"*, *"Unleash"*, *"Seamless"*), or fake `[X]`/`123,456` placeholder data. Always include comparison baselines on deltas (`+12.4% vs last month`).

#### Pass 3: Motor Ergonomics, Navigation Architecture & Input Forgiveness
- **Hit Slop & Safe Area Insets:** Expand compact icon controls (`<32px` visual) to `>=44×44px` via invisible hit slop (`::after { inset: -8px }` or native `hitSlop`). Pad fixed bars with `env(safe-area-inset-*)`.
- **Postel's Input Hygiene, Form Validation Timing & OTP Autofill:** Never reject user input for formatting whitespace or punctuation—strip and normalize on the fly. Validate lazily on `blur` or first submit, then clear errors immediately on input as the user fixes them (*reward early, punish late*). Model mutually exclusive modes as a single segmented/radio choice rather than contradicting checkboxes + inputs, and keep placeholders clearly muted (`--fc-ink-muted`) vs. user text (`--fc-ink-primary`). On verification inputs, set `autocomplete="one-time-code"` and `inputmode="numeric"`, and handle multi-digit `paste` events across split boxes with auto-submit.
- **Custom Setting Controls & Tactile Hover/Touch Response:** Never ship stark-white default native `<input type="checkbox">` / `<input type="radio">` controls in dark mode; use `appearance: none` controls styled on `--fc-bg-raised`, aligned to line 1 cap-height (`items-start`, never floating mid-card beside line 2), wrapped in a full-card `<label>`. Set `-webkit-tap-highlight-color: transparent`, brighten surface/border on `@media (hover: hover)` in `100–120ms`, and scale only the indicator (`scale(0.92)`) on `:active` so card text stays razor-sharp.
- **Safe Submenu Triangle & Tooltip Skip-Delay:** Protect diagonal cursor movement toward open submenus in both LTR and RTL ([examples/feelcraft-primitives.tsx](examples/feelcraft-primitives.tsx)). Delay only the first tooltip (`400ms`), then open warm sibling tooltips in `0ms`.
- **Keyboard Focus, Focus Trapping & Touch Parity (`@media (hover: hover)`):** Style `:focus-visible` with a crisp `2px` accent outline (`2px` offset); trap focus inside modals/`Cmd+K` menus and restore focus to the trigger on `Esc`; attach `role="status"` / `aria-live="polite"` to Undo Toasts. Gate hover-only action reveals inside `@media (hover: hover)` so touch screens never lose hidden controls.
- **Command Menu, Shortcut Hints & 8 Sidebar Architectures:** Expose `Cmd+K` / `Ctrl+K` with `<kbd>` hints, and choose intentionally from the **8 Side Navigation Architectures** (`Overlay`, `Push`, `Reveal`, `Icon Rail`, `Expanding Rail`, `Accordion`, `Two-Level`, `Floating Panel`).
- **Action Bar Hierarchy, Empty States & Clean Disabled States:** Place the primary commit action (`Save`, `Confirm`) at the **inline-end (trailing)** edge of footers and bars, with secondary/destructive buttons (`Cancel`, `Unpublish`) to its start side in quieter styling (and name exact verbs like `Delete workspace` on irreversible modals). Never style disabled primary buttons with muddy half-opacity accent fills (`opacity-40 bg-accent`); switch disabled states to neutral `--fc-bg-raised` with `--fc-ink-muted` text, or collapse dirty-state bars until edits exist. Give empty states one clear explanation + 1 direct CTA.

#### Pass 4: Perceived Speed & Mutation Safety (Doherty `<400ms`)
- **Optimistic Updates + Undo Toasts:** Update UI state in `0ms` on mutation with error rollback. Replace blocking *"Are you sure?"* dialogs on reversible actions with a `5000ms` **Undo Toast** backed by `visibilitychange`/`pagehide`/`beforeunload` keepalive flushes.
- **Idempotency Keys:** Attach an `Idempotency-Key` header per user mutation intent and lock duplicate submit triggers while keeping button width stable.
- **Skeleton Loaders, SWR, Prefetch & Media Loading:** Use zero-CLS layout-matched skeletons, SWR for instant cache reads, `onPointerEnter` hover-intent prefetching, BlurHash/LQIP placeholders, explicit image `aspect-ratio` (`CLS = 0`), `fetchpriority="high"` on LCP hero media, and `loading="lazy"` below the fold.

#### Pass 5: Motion Physics, Choreography (`<300ms`) & Reduced-Motion Safety
- **Accessibility Safety Valve (`prefers-reduced-motion`):** Include a `@media (prefers-reduced-motion: reduce)` override (or native `isReduceMotionEnabled`) collapsing spatial movement into `<=120ms` opacity crossfades.
- **Compositor Properties & Snappy Curves:** Never use `transition-all` or animate `width`/`height`/`top`/`left`. Use `200–260ms cubic-bezier(0.22, 1, 0.36, 1)` for entrances (`scale(0.97) -> 1`, origin-aware), `140–180ms cubic-bezier(0.4, 0, 1, 1)` for exits, and `100ms scale(0.97)` on compact button `:active` states (listing both `transform` and `scale` in `transition-property`).
- **Directional Steppers, Smooth Accordions & Instant Theme Switch:**
  - Slide steppers from the direction of travel (`+20px` forward, `-20px` back).
  - Animate accordions smoothly with `:root { interpolate-size: allow-keywords }` plus a `grid-template-rows: 0fr -> 1fr` Safari/Firefox fallback.
  - Lock transitions during dark/light toggles via `.theme-switching * { transition: none !important }` across two animation frames.
- **Interruptible Springs, Velocity Handoff & Rubber Banding:** Preserve release velocity on flicks/drags, apply hyperbolic over-drag resistance (`84 * (over / (over + 150))`), cap list stagger at `7` items (`<=200ms`), and use `document.startViewTransition` for shared layout continuity.
- **Proportional Kinetic Craft ("Slightly Alive, Zero Slop"):** Apply **only 1–2** fitting signature patterns from [references/06-kinetic-atlas.md](references/06-kinetic-atlas.md) (e.g., gliding segmented pill, width-locked `Copy → Check` morph, `tabular-nums` odometer, mechanical `<kbd>` travel, `1px` hairline spotlight, or on Showcase surfaces, 1 procedural backdrop capped at `DPR <= 2`, `<=30fps`, and frozen under `prefers-reduced-motion`). Choose the matching **Context Surface** variant (icon strip, searchable block menu, triage matrix, swatch inspector) when building right-click actions.

#### Pass 6: Peak-End & Live Verification
- Polish the **Peak moment** and **End state** (secondary action micro-flourish, 8-ray geometric peak burst, zero-inbox empty state, or aligned CLI summary table), then run the verification checklist below.

---

## Universal Domain Matrix (For All Sorts of Agents)

| Feelcraft Pillar | Web UI Agent | Mobile Agent (iOS / Android / RN) | Backend / API Agent | CLI / TUI / Bot Agent |
| :--- | :--- | :--- | :--- | :--- |
| **Visual, Color & Copy Restraint** | Tinted neutral ramp, `1px` hairlines, 1 accent, `4px` grid, sentence case, zero emoji/slop copy | Semantic platform materials, SF Symbols, Dynamic Type hierarchy, continuous squircles | Clean REST/RPC resource naming, structured error codes, zero leaked stack traces | Dim ANSI borders/meta, bold primary output, semantic `+green`/`-red`/`!yellow`, `NO_COLOR` support |
| **Doherty `<400ms` & Perceived Speed** | Optimistic UI, SWR, Skeleton loaders, Hover prefetch, BlurHash | Local-first cache, immediate haptic feedback, gesture velocity | `<100ms` p95 reads, `202 Accepted` async queues, `stale-while-revalidate` HTTP headers | Print feedback in `<50ms`, streaming spinners/progress, incremental output |
| **Forgiveness & Safety** | Undo toasts (5s + keepalive flush), OTP paste split, client idempotency keys | Shake/toast to undo, `.oneTimeCode`, offline queue deduplication | `Idempotency-Key` store, soft-delete `deleted_at` grace window, Postel schema coercion | `--dry-run`, automatic undo log / backup path instead of `[y/N]` walls, typo suggestions |
| **Motor & Navigation Ergonomics** | `44px` hit slop (`::after`), Safe submenu triangle, `0ms` warm tooltips, `Cmd+K`, 8 sidebar patterns | `hitSlop`, `SafeAreaView`, Swipe-to-dismiss rubber-band sheets, Predictive back | Cursor pagination chunked to Miller's Law (`10–25` items), batch endpoints | Short aliases, tab completion, interactive fuzzy picker, Ctrl+C clean interruptibility |
| **Typographic & Geometric Precision** | `tabular-nums`, `text-wrap: balance`, `-webkit-font-smoothing: antialiased`, concentric radii | `.monospacedDigit()`, `.cornerCurve(.continuous)`, integer-point alignment | ISO-8601 UTC timestamps, integer minor currency units (`amount_minor`), deterministic keys | Right-aligned tabular numeric columns, aligned box borders, zero horizontal jitter |

---

## Anti-Slop Guardrails (Do Not)

- **Do not use AI slop color palettes:** No purple/indigo-to-cyan gradients, **no ChatGPT green slop (neither emerald/teal `#10a37f`/`#00ff88` nor dark olive-tinted surfaces with pastel lime/chartreuse `lime-200/300/400` buttons, logo tiles, and active pills)**, no gradient text, no neon glows, no floating background blobs, no rainbow icon boxes, and no pure `#000000` + `#FFFFFF` harshness.
- **Do not use emoji as UI icons** (`✨`, `🚀`, `👋`), heavy `700–900` headings, wide-tracked `UPPERCASE` labels, exclamation marks in chrome, or AI hype words (*"Supercharge"*, *"Unleash"*, *"Seamless"*).
- **Do not animate high-frequency actions** with bounce, overshoot, or `>200ms` durations, and never start entrances from `scale(0)`.
- **Do not use `transition-all`**, animate layout geometry (`width`, `height`, `top`, `left`), scale text-heavy cards on hover/click, or center text with `translate(-50%, -50%)`.
- **Do not block reversible user actions** behind *"Are you sure?"* modals when an **Optimistic Update + Undo Toast** works.

---

## Quick Verification Checklist

- [ ] **Direction & Soul (Anti-Sameness):** Surface mode (`Operate` vs `Showcase`) and 3-line product direction set; palette/accent fit the product's world (not generic template gray) and **1–2** restrained kinetic signatures bring key controls slightly alive without clutter.
- [ ] **Color & Surface:** One tinted neutral ramp, 3 ink contrast tiers (`>=4.5:1`), 1 accent color, `1px` hairlines, zero purple/green/neon gradients or blobs, clean `color-scheme` + thin scrollbars, and instant `.theme-switching` lock.
- [ ] **Spacing, Type & Copy:** `4px` spacing grid, logical CSS (`padding-inline`, RTL support), aligned columns, weights `400–600`, sentence case, `tabular-nums`, `text-wrap: balance`, `-webkit-font-smoothing: antialiased`, concentric corners ($R_{\text{outer}} = R_{\text{inner}} + P$), zero emoji in chrome, and plain specific copy with comparison baselines.
- [ ] **Frequency & `<300ms` Motion:** High-frequency controls `<120ms`; medium transitions `150–260ms cubic-bezier(0.22, 1, 0.36, 1)`; origin-aware (`scale(0.97) -> 1`); directional steppers; smooth `interpolate-size` + grid accordions; interruptible springs; `@media (prefers-reduced-motion: reduce)` guard.
- [ ] **Doherty `<400ms` & Safety:** Optimistic mutations with rollback, 5s Undo Toasts (`visibilitychange`/`pagehide`/`beforeunload` flush), `Idempotency-Key` headers, SWR, hover prefetch, zero-CLS Skeleton Loaders, and BlurHash/LQIP.
- [ ] **Ergonomics & Controls:** `>=44px` hit slop, `:focus-visible` rings, `@media (hover: hover)` touch parity, custom `appearance: none` controls aligned to line 1, Safe Submenu Pointer Triangle, `400ms -> 0ms` tooltip skip-delay, `env(safe-area-inset-*)`, OTP autofill + paste split, `Cmd+K` + `<kbd>` hints, and an intentional sidebar from the 8 architectures.
