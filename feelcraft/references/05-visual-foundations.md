# 05 · Standalone Visual, Color, Typographic & Copy Foundations

Feelcraft is a complete, standalone design-engineering system. Even the best `<300ms` motion physics and `<400ms` optimistic architecture will fail if the surface is painted in AI-slop purple gradients, cluttered with emoji badges, or set in low-contrast gray text. Apply these six visual and structural foundations to every screen, component, chart, and CLI view.

---

## 1. Color & Surface Physics (Luminance Depth, Never Glows)

### A. One Tinted Neutral Ramp Per Surface (Starting Scaffolds, Not a House Style)
Build every interface from **one cohesive neutral ramp** with ultra-low chroma so users can work in it for hours without eye fatigue. The three ramps below are **starting scaffolds**—always tune temperature and tint to fit the product's actual world so apps never look like copies of the same dark template:

| Role | Graphite (Technical / Apps) | Warm Stone (Human / Editorial / Craft) | Deep Ink (Systems / Developer / Night) |
| :--- | :--- | :--- | :--- |
| **Dark: Base Canvas** | `#0F1012` | `#12110F` | `#090B10` |
| **Dark: Surface / Card** | `#16181C` | `#191715` | `#10141D` |
| **Dark: Raised / Hover / Input** | `#1F2228` | `#23201D` | `#181E2B` |
| **Dark: Primary Ink (`>=10:1`)** | `#EDEDEF` | `#F2EDE4` | `#EEF1F7` |
| **Dark: Secondary Ink (`>=5.5:1`)** | `#A2A6B0` | `#ABA397` | `#A0A8B8` |
| **Dark: Muted Ink (`>=4.5:1`)** | `#7E838F` | `#877F73` | `#788196` |
| **Light: Base Canvas** | `#F8F9FA` | `#F6F3EC` | `#F4F6FA` |
| **Light: Surface / Card** | `#FFFFFF` | `#FCFBF8` | `#FFFFFF` |
| **Light: Raised / Hover / Input** | `#EFF1F4` | `#ECE7DD` | `#E9EEF5` |
| **Light: Primary Ink (`>=10:1`)** | `#141518` | `#1C1915` | `#0E131F` |
| **Light: Secondary Ink (`>=5.5:1`)** | `#4E525B` | `#595147` | `#465063` |
| **Light: Muted Ink (`>=4.5:1`)** | `#6E737E` | `#756C60` | `#667185` |

### B. Depth via Luminance Steps & Hairlines (`Solid Drawing in 3D`)
- **Dark Mode Depth:** Never use heavy drop-shadows on dark themes. Create elevation by stepping up surface luminance (`Canvas -> Card -> Raised`) and framing containers with a **`1px` hairline border** (`rgba(255, 255, 255, 0.08)`) plus an optional top inner specular highlight (`inset 0 1px 0 rgba(255, 255, 255, 0.06)`).
- **Light Mode Depth:** Use crisp `1px` dark hairlines (`rgba(15, 16, 18, 0.08)`) paired with soft, tight neutral shadows (`0 1px 2px rgba(0, 0, 0, 0.05)`).

### C. The Von Restorff Accent Budget (`90% Quiet Chrome, 1 Accent`)
- Keep 90% of navigation, buttons, borders, and surfaces in the neutral ramp.
- Choose **one purposeful accent hue** derived from the product's real brand or physical world (e.g., Cinema Amber `#D97706` for a video/subtitle tool, Signal Vermilion `#E03C1F` for a studio tool, Cobalt `#2563EB` for engineering docs, Brass `#B45309` for a ledger, or Terracotta `#C2410C` for editorial) rather than defaulting every app to the exact same color—and reserve it strictly for the primary action, active selection indicator, or focal data series.
- **Reserve Green Strictly for Semantic Meaning (Never as Generic UI Chrome):** Do not use emerald, mint, teal, lime, chartreuse, or olive-green (`#10A37F`, `#10B981`, `#00FF88`, `#BEF264`, `#D9F99D`, `emerald-*`, `teal-*`, `lime-*`) as a default brand accent, active nav highlight, or dark-mode surface tint unless the product's explicit established brand is green. Painting dark-mode UIs in emerald/teal or dark olive surfaces + pastel lime buttons is ChatGPT's #1 visual slop signature, and it destroys the semantic isolation of real positive/healthy/online status indicators.
- **One Primary CTA Per Viewport (No Competing Filled Buttons):** Never place a bright accent-filled button in the sidebar (`New item`) while simultaneously rendering another bright accent-filled CTA in the main canvas (`Create ...`), an accent logo tile, and an accent-tinted active nav row. Keep the logo tile monochrome/neutral, keep the active nav row in a raised neutral surface step (`--fc-bg-raised`) with crisp primary ink, and reserve the high-contrast fill for **one** primary action.
- **High-Craft Dark Primary CTA:** On dark interfaces, a crisp off-white primary button (`background: #EDEDEF; color: #141518`) often looks far more deliberate than a bright colored rectangle, leaving the accent color for small high-signal indicators.
- **Contrast Enforcement:** Text or icons placed on an accent fill must achieve **`>= 4.5:1` contrast** (use dark ink `#141518` on warm amber or orange fills; never force white text onto a mid-luminance background).

### D. Hard Ban on the 7 AI Color Slop Tells
1. **No ChatGPT green/olive/lime dark-mode slop:** Never tint dark backgrounds/cards in muddy olive/forest green (`bg-emerald-950`, `bg-lime-950`, `bg-green-950`, or dark RGB surfaces where the green channel noticeably exceeds red and blue), and never splash `#10A37F` / `emerald-*` / `teal-*` / pastel chartreuse-lime (`#BEF264`, `#D9F99D`, `lime-200/300/400`) across logo tiles, active nav pills, hero card borders, and multiple buttons.
2. **No Claude/Tailwind purple/indigo/violet-to-cyan palettes** (`from-indigo-500 via-purple-500 to-pink-500`).
3. **No gradient text** (`bg-clip-text text-transparent`).
4. **No colored neon glows or colored drop-shadows** (`shadow-emerald-500/40`, `shadow-indigo-500/40`, glowing borders).
5. **No decorative blurry color blobs, orbs, or radial washes** floating behind dark cards.
6. **No rainbow icon boxes** (every sidebar or feature icon wrapped in a different pastel circle).
7. **No pure `#000000` background paired with pure `#FFFFFF` text** (causes OLED smear and astigmatism halation).

---

## 2. Spacing & The `4px` Rhythm Grid

- **Base `4px` Scale:** All margins, paddings, gaps, and control dimensions sit on multiples of `4px` (`4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128px`). Allow `2px` only for micro-optical nudges inside dense controls. Eliminate arbitrary one-off values (`mt-[13px]`, `gap-[11px]`).
- **Standard Control & Row Heights:**
  - Compact density (IDEs, sidebars, dense tables): `32px`
  - Default desktop controls & inputs: `36px` to `40px`
  - Touch targets & primary buttons: `44px` to `48px`
- **Gestalt Proximity (`Inner Gap < Outer Gap`):** Space inside a related group must always be noticeably smaller than space between separate groups (e.g., `4px` between sidebar rows, `24px` above a section header, and `8px` below that section header).
- **Strict Column Alignment:** Icons align down one vertical axis, labels start down one vertical axis, and right-aligned `tabular-nums` figures align down one right edge. Equal items in a row share identical heights and padding.

---

## 3. Typography, Scale & Case Discipline

- **Font Pairing (Max 2 Families):**
  - **Primary UI Sans:** A clean, high-legibility grotesk or humanist sans (or the project's existing brand font).
  - **Monospace Partner:** Used strictly for code, `<kbd>` shortcut hints, IDs, commit hashes, and technical metadata.
  - **Optional Editorial Serif / Display:** Used only when the product's character calls for editorial contrast in top-level headlines.
- **Hierarchy via Size & Contrast, Not Heavy Weight:**
  - Use only **`400` (Regular)** and **`500` (Medium)** for 95% of the interface, with **`600` (SemiBold)** reserved for top-level titles.
  - **Ban `700/800/900` (`font-bold` / `font-extrabold` / `font-black`) shouting headings.**
- **Sentence Case Everywhere:**
  - Write `Paid this month`, `Navigation`, and `Create project`—**never wide-tracked uppercase labels (`PAID THIS MONTH`, `uppercase tracking-widest`)**.
- **Optical Tracking by Size:**
  - Large display headings (`>= 28px`): tighten tracking slightly (`-0.02em` to `-0.03em`).
  - Body text (`14px–16px`): normal tracking (`0`).
  - Small text & captions (`11px–13px`): slightly open or normal tracking (`0` to `+0.01em`)—**never apply negative letter-spacing to small text**, and never drop below `11px`.
- **Precision Rules:** Always apply `tabular-nums` to numbers, `text-wrap: balance` to headings, `text-wrap: pretty` to paragraphs, and `-webkit-font-smoothing: antialiased` on the document body.

---

## 4. Iconography & Visual Restraint

- **Zero Emoji in UI Chrome:** Never use emoji (`✨`, `🚀`, `👋`, `🔥`, `⚡`, `💡`) as navigation icons, button prefixes, section headers, or `"New ✨"` / `"Beta 🚀"` badges.
- **One Consistent Line-Icon Set:** Use a single vector icon family (Lucide, Phosphor, SF Symbols, or Material Symbols) at one consistent size (`16px` or `18px`) and stroke width (`1.5px` or `1.75px`).
- **Ink-Matched Icon Color:** Icons take the color of their adjacent text role (`Secondary Ink` or `Muted Ink`) inside a fixed-width alignment box (`18×18px` with an `8px` gap to the label). When a category needs a color cue, use a crisp `6px` status dot (`border-radius: 50%`) instead of coloring the icon.
- **Ban Decorative AI Filler Art:** Remove glowing 3D brains, floating isometric cubes, abstract neon meshes, and stock robot illustrations. In dashboards and tools, the product's own data, charts, and controls are the visual centerpiece.

---

## 5. Copy, Tone & Plausible Data Hygiene

- **Specific, Quiet Copy:** Headlines state clearly what the product or view does.
- **No Exclamation Marks or Greeting Banners:** Ban `Welcome back, Alex! 👋` and `Success!!`. Title views by their real context (`October 2026`, `Production Deployments`, `Billing & Usage`).
- **No Trailing Periods on UI Controls:** Headings, buttons, badges, nav items, and single-phrase tooltips end without a period. Keep periods only on multi-sentence body paragraphs.
- **Ban AI Hype Vocabulary:** Never write *Supercharge*, *Unleash*, *Unlock*, *Seamless*, *Revolutionize*, *Game-changing*, *Next-gen*, *Magic*, or slap *AI-Powered* onto every label.
- **Plausible Data & Comparative Deltas:**
  - Every metric change states what it compares against (`+12.4% vs last 30 days` or `3 fewer incidents vs last week`, never a bare `+12%`).
  - Mock data uses realistic names, timestamps, and domain figures formatted consistently (`$48,210` and `$124,860`, never mixing `$48,210` with `$124,860.40`, and never `[X]`, `Foo Bar`, or `123,456`).

---

## 6. Layout Proportions & Data-Viz Hierarchy

- **True Application Proportions:** Apps and dashboards fill the viewport height and width (e.g., an intentional sidebar from the **8 Side Navigation Architectures** paired with a fluid main canvas capped at `1440px–1600px`). Never squeeze a desktop web app into a narrow centered `800px` marketing column.
- **Break the 3-Equal-Card Template Rhythm:** Avoid stacking row after row of 3 identical equal-width cards. Pair a row of 3–4 compact numeric stat blocks above a wide primary chart (`>= 66%` width) alongside a narrower ranked list or activity table (`<= 34%` width).
- **Chart Hierarchy & Restraint:**
  - **One Hero Chart per View:** Draw one primary chart with care (muted gridlines, monospace axis labels, `tabular-nums` tooltips). Secondary data blocks use a different form (a ranked list with subtle progress bars or a compact table), never a second competing chart of equal size.
  - **Stat Cards Are Numbers:** A stat card holds a label, a primary `tabular-nums` figure, and a baseline comparison delta—strip out decorative mini-sparklines, background watermark icons, and circular gauges that add visual noise without precision.

---

## 7. Native Scrollbars & Browser Chrome Polish

- **Match `color-scheme` to the Theme:** Always set `color-scheme: light` on `:root` and `color-scheme: dark` on `.dark` / `[data-theme="dark"]`. Without it, Windows/Linux browsers render chunky 2005-era light-gray native scrollbars, white `<select>` menus, and jarring bright date pickers inside dark-mode apps.
- **Thin, Arrow-Free Scrollbars:**
  - Use `scrollbar-width: thin; scrollbar-color: rgba(255, 255, 255, 0.18) transparent;` plus `::-webkit-scrollbar` (`width: 8px; height: 8px;`), a rounded translucent thumb (`background-clip: content-box; border: 2px solid transparent; border-radius: 9999px;`), and `::-webkit-scrollbar-button { display: none; }` so classic `▲`/`▼` stepper arrows never appear.
  - Add `scrollbar-gutter: stable` on primary scrolling panes so appearing scrollbars never cause horizontal layout shift.

---

## 8. Modals, Sticky Action Bars & Disabled State Craft

- **Trailing Primary Commit Order (Jakob's Law):** In desktop modal footers and action bars, place the **primary commit button** (`Save edits`, `Apply`, `Confirm`) at the **inline-end (trailing edge)** and secondary or destructive actions (`Cancel`, `Unpublish`) to its start side in quieter secondary/ghost styling. Never put a bold high-contrast `Unpublish` button to the trailing side of a muted `Save edits` button.
- **High-Stakes Destructive Modals:** When an irreversible action genuinely requires confirmation (deleting a workspace, revoking an API key), name the exact verb on the destructive button (`Delete workspace`, never `OK` or `Confirm`) and require typing the resource name for catastrophic deletions.
- **Never Paint Disabled Primary Buttons in Muddy Half-Opacity Accent:** Applying `opacity: 0.4` to an accent button produces a murky, low-contrast rectangle that looks weaker than adjacent secondary buttons. When disabled, transition primary buttons to neutral raised surface (`--fc-bg-raised`) with `--fc-ink-muted` text (or hide dirty-state bars completely until edits exist).
- **Consistent Padding & Single-Border Discipline:** Match vertical and horizontal bar padding (`12px 16px`), compute concentric button radii ($R_{\text{inner}} = \max(4\text{px}, R_{\text{outer}} - P)$), and avoid stacking bordered floating boxes directly against bordered card edges (double-border collisions).

---

## 9. Bi-Directional (RTL) & Touch Adaptation (`@media (hover: hover)`)

- **CSS Logical Properties First:** Use `padding-inline`, `margin-inline-start`, `margin-inline-end`, `inset-inline-start`, `inset-inline-end`, and `text-align: start/end` instead of physical `left`/`right` so interfaces mirror automatically for Arabic, Hebrew, and mixed-script layouts.
- **RTL Motion & Geometry Mirroring:** Reverse directional stepper slides (`:dir(rtl)` flips forward/backward X signs) and flip submenu safe-triangle direction checks (`movingLeft` toward `rect.right` when `dir="rtl"`).
- **Never Trap Actions Behind Desktop Hover:** Gate hover-only reveals (`opacity: 0 -> 1` on row hover) inside `@media (hover: hover) and (pointer: fine)` so touch devices (`iPad`, `iOS`, `Android`) render row actions visibly or inside an accessible `...` trigger instead of hiding them forever.

---

## 10. Keyboard Focus, Focus Trapping & Assistive Live Regions

- **Crisp `:focus-visible` Rings:** Never remove `outline: none` without a replacement. Apply a high-contrast `2px` accent focus ring (`outline: 2px solid var(--fc-accent); outline-offset: 2px;`) strictly on `:focus-visible` so keyboard Tab navigation is unmistakable while mouse clicks stay clean.
- **Modal & Palette Focus Lifecycle:** Trap `Tab`/`Shift+Tab` inside open modals and `Cmd+K` command menus, auto-focus the primary input on open, and **restore focus to the triggering element** when closed with `Esc`.
- **Live Announcements:** Attach `role="status"` / `aria-live="polite"` to Undo Toasts and optimistic state updates (`aria-live="assertive"` for failed rollbacks) so screen-reader users hear feedback without focus theft.

---

## 11. Form Validation Timing, Empty States & Media Loading

- **Reward Early, Punish Late (Form Validation):** Never flash red validation errors on the user's first keystroke before they finish typing an email or password. Validate lazily on `blur` or first submit, preserve all entered values on error, and clear the error state *immediately* on input as soon as the field becomes valid.
- **Actionable Empty States:** Never render a dead blank canvas or a fake-populated placeholder dashboard. State clearly why the list is empty in one plain line and provide **1 direct recovery CTA** (`Create your first subtitle`, `Clear search filter`).
- **Media & Image Loading Craft:** Lock `aspect-ratio` (or explicit `width`/`height`) on every image container to guarantee `CLS = 0`, set `fetchpriority="high"` on the hero LCP visual and `loading="lazy"` below the fold, and gently balance stark white embedded screenshots in dark mode (`brightness(0.92)` when appropriate).

---

## 12. Modern Setting Cards, Form Controls & Tactile Hover/Touch Polish

- **Never Ship Stark White Default Checkboxes/Radios in Dark Mode:** Always combine `color-scheme: dark` with custom-styled `appearance: none` checkboxes, radios, and switches (`18×18px` indicator on `--fc-bg-raised` with a quiet `1px` border when unchecked; crisp `--fc-accent` fill + animated checkmark/dot scale when checked). An unchecked option must never visually shout brighter than a checked one.
- **Cap-Height Alignment on Multi-Line Option Cards:** When a checkbox or radio sits beside a title + helper description, use `align-items: flex-start` (`items-start`) with a `2px–3px` top offset so the control aligns to the first line's title—never `items-center` floating awkwardly beside line 2.
- **Mutually Exclusive State Prevention:** Never stack independent checkboxes and optional text inputs that contradict each other (e.g., *Custom output path* + *Replace original file in-place*). Model mutually exclusive destinations as a single segmented control or radio group, revealing the secondary path input or warning only when relevant.
- **Distinct Placeholder vs. Entered Value Contrast:** Render input placeholders in `--fc-ink-muted` (`~4.5:1`) and user-entered values in `--fc-ink-primary` (`>=10:1`) so empty defaults never masquerade as typed text.
- **Modern Tactile Hover & Touch Micro-Feedback (`<120ms`):**
  - Wrap the entire option card in a `<label>` for generous Fitts's Law hit area.
  - Set `-webkit-tap-highlight-color: transparent` on buttons, links, and option cards so mobile browsers never flash a blocky blue/gray tap box.
  - Under `@media (hover: hover) and (pointer: fine)`, lift the card subtly via a `--fc-bg-raised` surface step + brighter hairline border (`120ms cubic-bezier(0.22, 1, 0.36, 1)`).
  - On `:active` (both click and touch), scale only the **control indicator** (`transform: scale(0.92)` over `90ms`) while shifting card border/surface—keeping multi-line card text crisp on integer pixels.
