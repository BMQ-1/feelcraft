# 06 · Kinetic Craft Atlas ("Slightly Alive, Zero AI Slop")

Clean interfaces fail when they feel dead, flat, and identical to every other gray template. This atlas gives agents **curated, physical, compositor-friendly craft primitives** that make software feel tactile and distinct—without crossing into over-animated AI slop.

---

## Anti-Drift Budget (Read Before Picking Any Pattern)

1. **Pick 1–2 Signature Motifs, Never All of Them:** A live product app is not a component museum. Choose **at most 1–2** kinetic patterns that match the product's world and keep 90% of surrounding chrome quiet.
2. **Respect Surface Mode:**
   - **`Operate` Mode** (dashboards, editors, settings, data tables, SaaS workspaces): Keep backgrounds completely static. Put subtle life into **high-touch micro-controls** (gliding segmented pill, width-locked `Copy → Check` morph, `tabular-nums` odometer on the hero KPI, or mechanical `<kbd>` keycaps).
   - **`Showcase / Experience` Mode** (landing pages, creative studios, product launches, portfolios): Pair a calm neutral layout with **at most 1** procedural architectural backdrop + **1–2** physical focal cards (`±3.5°` specular foil, notched `:has()` grid, or ghost-text hero CTA).
3. **Never Break Core Guardrails:** Every pattern here uses compositor-friendly `transform`/`opacity`/CSS custom properties, preserves exact button widths, keeps text on integer pixels, and freezes cleanly under `@media (prefers-reduced-motion: reduce)`.

---

## A. Tactile Hover & Spatial Reveals

### 1. Vertical Ghost-Text Roll (Hero / Primary CTA)
- **Feel:** Crisp mechanical flip-flap label roll without shifting button width.
- **How:** Wrap two identical `<span>` labels inside an `overflow: hidden` viewport with exact `height: line-height` (`20px`). On `:hover` / `:focus-visible`, translate the inner track by `-20px` in `220ms cubic-bezier(0.22, 1, 0.36, 1)` so the accent-tinted second span rolls cleanly into place (`aria-hidden="true"` on the duplicate).

### 2. Tectonic Offset Depth Plates (Icon Toolbars)
- **Feel:** Layered cardstock or machined plates separating subtly on hover.
- **How:** Stack 1–2 lightweight background plate elements behind an icon button (`z-index: 1, 0`). On hover, nudge the primary cap `(+3px, -4px)` while the back plate offsets `(-3px, +2px)` over `180ms`. Combine with **Tooltip Skip-Delay** (`400ms` first, `0ms` warm siblings).

### 3. Restrained Specular Foil Card (Capped at `±3.5°`)
- **Feel:** Collector pass / printed card catching light—never a tacky `15°` 3D flip.
- **How:** Track pointer `--mx`/`--my` inside the card (`@media (hover: hover)`) to move a soft `rgba(255, 255, 255, 0.12)` radial specular sheen across the card surface while limiting tilt to `perspective(800px) rotateX(<= ±3.5deg) rotateY(<= ±3.5deg)` so copy stays razor-sharp.

### 4. Pure-CSS `:has()` Notched Accordion Strip (Feature Showcases)
- **Feel:** Architectural chamfered panels expanding silently with zero JS.
- **How:** Arrange 3–4 columns in `display: grid; grid-template-columns: repeat(4, 1fr); transition: grid-template-columns 240ms cubic-bezier(0.22, 1, 0.36, 1)`. Use `:has(.pane:is(:hover, :focus-within, .is-pinned))` to widen the active column (`3fr` vs `0.65fr`) and apply a concentric `1px` `clip-path` chamfer corner (`polygon(...)`).

### 5. `1px` Hairline Proximity Spotlight (Bento Grids & Keyboard Matrices)
- **Feel:** Anodized aluminum edges catching ambient pointer light—zero neon glow.
- **How:** Wrap opaque inner cards (`--fc-bg-surface`) inside a `1px`-padded outer shell (`padding: 1px`) whose `::before` layer renders a neutral/accent radial gradient at `--sx`/`--sy` updated inside a single `requestAnimationFrame` callback. Only the `1px` gap illuminates.

### 6. Magnetic Parabolic Dock (Creative Toolbars)
- **Feel:** Smooth Gaussian/parabolic proximity scaling (`1 + 0.38 * falloff`) anchored at `bottom center` so dock icons swell gently under the pointer with zero layout push on sibling rows.

---

## B. Physical Presses & Morphing Micro-Controls

### 7. Mechanical Keycap Travel (Developer & Shortcut Actions)
- **Feel:** Real keyswitch travel (`translateY(3px)` over `85ms`).
- **How:** Give tactile action buttons a crisp lower shadow lip (`0 3px 0 0 var(--fc-border-strong)`) and collapse it to `0 1px 0 0` + `translateY(2px)` on `:active` (and briefly when the bound keyboard shortcut fires).

### 8. Interruptible Hold-to-Confirm Sweep (High-Stakes Destructive Actions)
- **Feel:** Deliberate physical resistance before an irreversible delete/purge.
- **How:** On `pointerdown`, shrink slightly (`scale(0.97)`) and drive a progress fill (`scaleX(0 -> 1)` over `800–1000ms`). On early `pointerup` or `pointerleave`, cancel cleanly and snap the sweep back to `0` without firing.

### 9. Width-Locked `Copy → Check` Icon Morph
- **Feel:** Quiet inline confirmation without layout jitter or noisy toast spam.
- **How:** Lock `min-width` on the button, stack the `Copy` and `Check` SVG icons inside a `16×16px` relative box, and cross-scale (`scale(0.5) opacity: 0` ↔ `scale(1) opacity: 1` over `150ms`) while holding the `Check` state for `1600ms`.

### 10. `tabular-nums` Vertical Odometer + 8-Ray Geometric Peak Burst
- **Feel:** Mechanical counter roll for live KPIs, votes, or timers—paired with a crisp Swiss radial tick burst strictly on **Peak** milestones (never confetti cannons).

### 11. Morphing Controls (`Segmented Pill`, `Squish Switch`, `Halo Checkbox`, `Left-Pivot Burger`)
- **Gliding Segmented Pill:** Measure the active tab's `offsetLeft` and `offsetWidth` to slide one shared background pill behind tab labels in `200ms cubic-bezier(0.22, 1, 0.36, 1)` (`ArrowLeft`/`ArrowRight` keyboard support included).
- **Elastic Squish Switch:** Elongate the toggle thumb horizontally (`22px → 26px`) while `:active` is held, then snap back to a circle as it crosses the track.
- **Material Halo Checkbox:** Render a `40px` subtle circular hover/focus/active halo behind an `18px` custom box, supporting all 3 states (`unchecked`, `checked`, `indeterminate`).

---

## C. Task-Matched Context Surfaces (Beyond Generic Right-Click Menus)

Choose the context surface that fits the object right-clicked (all origin-aware, viewport-flipping, and `Esc`-dismissible with focus restoration):

| Target Object | Best Context Surface Pattern | Key Ergonomic Rule |
| :--- | :--- | :--- |
| **Files & Documents** | **OS Quick-Action Strip** | Place top 4–5 high-frequency icon verbs (Cut, Copy, Rename, Share, Delete) in a compact square icon strip above secondary rows. |
| **Long Menus / Text Blocks** | **Searchable Command Context** | Embed an auto-focused filter input at the top of the menu with `ArrowUp`/`ArrowDown` keyboard nav. |
| **Messages / Comments** | **Reaction Bar + Thread Menu** | Stack a quick emoji/reaction pill row above thread actions; update counts in `0ms` optimistically. |
| **Canvas Shapes / Design Nodes** | **Inline Swatch & Slider Inspector** | Keep menu open (`stay-open`) while tuning swatches or range sliders directly on the target. |
| **Issue Rows / Tasks** | **4-Cell Priority / Status Matrix** | Replace nested submenus with a 2×2 or 1×4 quick-select matrix grid at the top of the menu. |
| **Media / Tracks / Files with Meta** | **Split-Column Live Preview** | Pair the left command list with a right-hand metadata card updating on `pointerenter`. |
| **Mobile / Spatial Cards** | **Peek-and-Pop Elevated Scrim** | Blur surrounding chrome behind a quiet scrim while lifting the target (`scale(1.02)`) above an action stack. |
| **Creative Tools / Canvas Modes** | **Radial `atan2` Wheel** | Center 6 annular wedges on pointer coordinates with a `26px` center cancel deadzone, hold-release + key fallback, and live polar ray tracking. |

### Radial Graphic-Tool Wheel (`6-Wedge atan2 Marking Menu`)
For canvas, vector, or mode-heavy creative tools, a radial marking menu beats nested dropdowns for muscle memory when engineered with these 4 guards:
1. **Viewport Clamp + Inner Cancel Deadzone:** Clamp wheel center `pad = 134px` inside viewport edges (`256×256px` surface). Ignore pointer angles while `hypot(dx, dy) < 26px` (or clicking the `r=42px` center hub) so jitter or stationary clicks cancel cleanly (`Esc` / outside click also dismisses).
2. **Annular Wedge + Polar Ray Readout:** Compute `deg = (Math.atan2(dy, dx) * 180 / Math.PI + 360 + 90) % 360` (`0°` = top) and `idx = Math.round(deg / 60) % 6`. Rotate a single SVG annular wedge by `idx * 60deg`, draw a clamped polar ray (`48px..104px`) to the cursor direction, show tabular `deg° · Key` in the hub, and separate `.is-equipped` (persistent `4px` dot) from `.is-selected` (active wedge).
3. **Hold-Release Debounce (`> 180ms`):** On `mouseup`, commit only if open `> 180ms` and a wedge is highlighted—quick right-clicks keep the palette open for deliberative click or keyboard choice.
4. **Always Provide Accessible Fallbacks:** Pair context right-click summoning with a compact inline quick-tool strip, explicit summon trigger button, `1–6`/mnemonic single-key hotkeys, and `Arrow` + `Enter` navigation.

---

## D. Living Architectural Backgrounds (Battery & Slop Safe)

Use **only on Showcase/Hero surfaces** (never behind dense tables or text editors), keep strictly within **1 neutral ramp + 1 accent**, and enforce **all 4 performance locks**:
- `DPR <= 2` (`Math.min(window.devicePixelRatio || 1, 2)`)
- Frame cap `<= 30fps` for `<canvas>` loops
- Pause automatically when offscreen (`IntersectionObserver`) or tab hidden (`visibilitychange`)
- **Freeze completely** under `@media (prefers-reduced-motion: reduce)`

**5 Zero-Slop Atmosphere Options:**
1. **CSS 3D Perspective Blueprint Horizon (`0 JS loop`):** Dual-scale hairline grid tilted via `perspective(420px) rotateX(58deg)` and faded cleanly with a radial mask (`mask-image: radial-gradient(...)`).
2. **Topographic SVG Contour Drift:** 4–6 clean cubic Bezier elevation paths with ultra-slow `stroke-dashoffset` drift (`20s+`, frozen on reduced motion).
3. **Kinetic Vector Field Matrix (`Canvas 2D`):** Quiet dot/tick lattice deflecting smoothly toward pointer `atan2(dy, dx)` within a `200px` radius.
4. **Editorial Halftone Luminance Field (`Canvas 2D`):** Print-screen dot raster whose radii swell gently around a soft pointer light source.
5. **Harmonic Interference Ribbons (`Canvas 2D`):** 4–5 low-alpha (`0.06–0.28`) Bezier sine ribbons in neutral ink + 1 accent stroke—never neon glow washes.
- **Optional Tactile Surface Finish:** A subtle micro-film SVG noise grain (`opacity: 0.025–0.035`) + `2px` top scroll-progress hairline (`scaleX`) for long editorial pages.

---

## E. High-Craft Precision Additions (Zero-CLS & Direct Manipulation)

1. **Ray-Intersected Directional Hover Wipe (Not Naive Quadrant Math):**
   - Track the trailing pointer position globally (`prevPointer`, `currPointer`). On `pointerenter`, intersect the incoming segment `(p0 -> p1)` against the card's 4 bounding edges (`Top`, `Right`, `Bottom`, `Left` with `±2px` corner tolerance), falling back to aspect-normalized quadrant coordinates only on focus or fast synthetic entry.
   - Snap the wipe overlay (`translate3d` off-edge) with `transition: none`, commit one frame, then ease into place (`240ms cubic-bezier(0.22, 1, 0.36, 1)`); on `pointerleave`, slide out through the exit edge.
2. **Kinetic Async Submit Lifecycle Pill (`idle` -> `loading` -> `done`):**
   - Lock `min-width` on async action pills across all three states so surrounding toolbars and forms suffer **zero horizontal layout shift (`CLS = 0`)**. Use a `15px` crisp arc spinner in `loading` and semantic green surface + border in `done` before returning cleanly to `idle`.
3. **Inertial Rubber-Band Scrubber Slider:**
   - Remove CSS transition via `.is-dragging` + `setPointerCapture` + `touch-action: none` during active drag so value tracks `1:1` with zero lag.
   - When dragging past `[0%, 100%]`, clamp the logical value cleanly while shifting the track via hyperbolic over-pull damping (`84 * (over / (over + 150))`), then spring back to `0px` (`260ms`) on release. Expose `role="slider"`, `aria-valuenow`, and `Arrow`/`Home`/`End` keyboard support.
4. **Calibrated Artboard Stage & Scroll-Velocity Coupling:**
   - Frame specimen/canvas stages with a quiet `16px` hairline dot grid and subtle `8×8px` outer corner crop marks (`pointer-events: none`) rather than noisy colored cards.
   - On `Showcase` canvas atmospheres, fold damped scroll-wheel impulse into the tick (`tick += 0.032 + scrollVel * 0.004`, `scrollVel *= 0.88`) so scrolling feels physically coupled—frozen completely under `prefers-reduced-motion: reduce`.
