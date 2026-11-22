# 05 · Visual, Color, Typographic & Copy Foundations

> **Design System Precedence Rule:** Separate **universal engineering & accessibility rules** (WCAG contrast, `:focus-visible`, `@media (hover: hover)`, `tabular-nums`, `4px` spacing alignment, `color-scheme`) from **default visual scaffolds** (color ramps, single-accent budgets, and typographic weights). Whenever a project already has an established brand system, design tokens, or intentional editorial direction (including brand greens/purples, brutalist/Swiss display typography, or custom palettes), **honor the project's brand system**. Use the scaffolds below as defaults for greenfield apps or unstyled prototypes so the agent avoids generic LLM purple/emerald gradient clichés.

---

## 1. Color & Surface Physics (Luminance Depth, Never Glows)

### A. Tinted Neutral Ramps (Greenfield Scaffolds, Not a Mandatory House Style)
When building a new interface without pre-existing brand tokens, start from **one cohesive neutral ramp** with low chroma so users can work for hours without eye fatigue. Tune temperature and tint to fit the product's domain:

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
- **Dark Mode Depth:** Avoid heavy drop-shadows on dark themes. Create elevation by stepping up surface luminance (`Canvas -> Card -> Raised`) and framing containers with a **`1px` hairline border** (`rgba(255, 255, 255, 0.08)`) plus an optional top inner highlight (`inset 0 1px 0 rgba(255, 255, 255, 0.06)`).
- **Light Mode Depth:** Use crisp `1px` dark hairlines (`rgba(15, 16, 18, 0.08)`) paired with soft, tight neutral shadows (`0 1px 2px rgba(0, 0, 0, 0.05)`).

### C. The Von Restorff Accent Budget (`90% Quiet Chrome`)
- In dense workspaces (`Operate` mode), keep ~90% of navigation, buttons, borders, and surfaces in the neutral ramp so key interactive states stand out immediately.
- Choose a purposeful accent hue derived from the product's brand or domain (e.g., Cinema Amber `#D97706`, Signal Vermilion `#E03C1F`, Cobalt `#2563EB`, Brass `#B45309`, Terracotta `#C2410C`, or the user's brand primary) and reserve high-contrast fills for primary actions, active focus rings, or focal data series.
- **Intentional vs. Default Green & Purple:**
  - **Semantic & Brand Use (Encouraged):** Use green (`#16A34A`, `#4CC38A`, `emerald-*`, `green-*`) freely for semantic positive/success/online states, financial gains, diffs, or when the product's actual brand is green (e.g., finance, sustainability, audio, or messaging brands). Likewise, use purple/indigo freely when it is part of the user's brand identity.
  - **Unprompted LLM Slop (Avoid):** When the user has *not* requested a green or purple theme, do not default to multi-stop purple/indigo-to-cyan gradients (`from-indigo-500 via-purple-500 to-cyan-500`) or generic neon emerald/lime-to-cyan dark-mode washes (`#10A37F` / `#00FF88` / `from-emerald-400 to-cyan-400`).
- **Primary CTA Hierarchy:** Avoid competing primary buttons in the same viewport region (e.g., a bright filled sidebar button next to a bright filled header CTA and a filled active nav pill). Keep active sidebar rows on a raised surface step (`--fc-bg-raised`) with crisp primary ink.
- **WCAG 2.2 AA Contrast Enforcement:** Normal text (`< 24px` regular or `< 18.66px` bold) must achieve **`>= 4.5:1`** contrast against its effective background; large text (`>= 24px` regular or `>= 18.66px` bold `>= 700`) and UI components must achieve **`>= 3.0:1`**.

### D. Common Unprompted LLM Visual Clichés to Avoid
Unless explicitly requested by the user, avoid these default LLM habits:
1. **Unprompted multi-stop neon gradients** (`from-indigo-500 via-purple-500 to-pink-500` or `from-emerald-400 to-cyan-400`).
2. **Low-contrast gradient text** (`bg-clip-text text-transparent`) on functional headings.
3. **Colored neon box-shadow glows** (`shadow-emerald-500/50`, `shadow-purple-500/50`) used in place of surface hierarchy.
4. **Decorative blurry color blobs/orbs** floating behind dark data cards.
5. **Rainbow icon boxes** (every sidebar icon wrapped in a different saturated circle without semantic meaning).
6. **Pure `#000000` canvas paired with pure `#FFFFFF` body copy** (causes OLED halation; prefer `#090B10`–`#12110F` with `#EDEDEF` ink).

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

- **Font Pairing (Max 2–3 Purposeful Families):**
  - **Primary UI Sans:** A high-legibility grotesk or humanist sans (or the project's existing brand font).
  - **Monospace Partner:** Used for code, `<kbd>` shortcut hints, IDs, commit hashes, and technical metadata.
  - **Editorial Serif / Display:** Used when the product's character calls for editorial, Swiss-grid, or display contrast in headlines.
- **Contextual Weight Hierarchy:**
  - **Dense UI & `Operate` Workspaces:** Prefer **`400` (Regular)** and **`500` (Medium)** for controls, tables, and body text, with **`600` (SemiBold)** for section and view titles so dense screens stay calm.
  - **Editorial, Marketing & Display (`Showcase` / Brand Surfaces):** **`700–800` (`font-bold` / `font-extrabold`)** is completely appropriate when used deliberately for display headlines, poster/Swiss typography, or established brand hierarchy—just avoid applying `font-bold` indiscriminately to every card label, badge, and paragraph.
- **Case Discipline:**
  - Default to **Sentence case** (`Paid this month`, `Create project`) for standard UI controls, buttons, and menus for fast scannability. Reserve tracked uppercase (`uppercase tracking-wider`) for intentional editorial kickers, mono metadata tags, or table column headers where it fits the design language.
- **Optical Tracking by Size:**
  - Large display headings (`>= 28px`): tighten tracking slightly (`-0.02em` to `-0.03em`).
  - Body text (`14px–16px`): normal tracking (`0`).
  - Small text & captions (`11px–13px`): normal or slightly open tracking (`0` to `+0.01em`)—**never apply negative letter-spacing to small text**, and never drop below `11px`.
- **Precision Rules:** Always apply `tabular-nums` to numbers/timers/tables, `text-wrap: balance` to multi-line headings, `text-wrap: pretty` to body paragraphs, and `-webkit-font-smoothing: antialiased` on `body`.

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
