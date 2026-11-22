# Feelcraft — Universal Adapter Rules (`CLAUDE.md` / `AGENTS.md` / `.cursor/rules`)

Drop the snippet below into any workspace's `CLAUDE.md`, `AGENTS.md`, or `.cursor/rules/feelcraft.mdc` when an agent does not natively load `SKILL.md` directories:

```markdown
## Feelcraft (UI Ergonomics, <300ms Motion Physics, WCAG 2.2 Accessibility & Visual Craft)

Whenever building, refactoring, or reviewing user-facing interfaces (Web, Mobile, Desktop, CLI/TUI) and their supporting API mutations, apply these rules:

0. **Universal Rules vs. Default Scaffolds (Brand Precedence):**
   - **Always Enforce Universal Engineering & Accessibility Rules:** Keyboard `:focus-visible`, WCAG 2.2 AA contrast (`>= 4.5:1` normal text; `>= 3.0:1` large text at `>= 24px` regular or `>= 18.66px` bold `>= 700`), `>= 44×44px` (`36×36px` desktop) hit targets, `@media (hover: hover)` touch parity, `prefers-reduced-motion` safety, `< 300ms` compositor transitions (`transform`, `opacity`), forgiving Postel inputs, and optimistic rollback.
   - **Respect Existing Brand & Editorial Direction:** Low-chroma neutral ramps (`Graphite`, `Warm Stone`, `Deep Ink`), 1-accent budgets, `400–600` UI font weights, and sentence-case labels are **greenfield defaults** when no design system is specified. If a project has an established brand palette (including green or purple brands) or calls for editorial/Swiss/display typography (`700–800` bold headings, tracked kickers), honor that system.

1. **Color, Surface Depth, Typography & `4px` Grid:**
   - On greenfield UIs, build from a cohesive neutral ramp, declare `color-scheme: dark`/`light` + thin scrollbars (`scrollbar-width: thin`), and create dark-mode depth via stepped surface luminance + `1px` hairlines (`6–10%`) rather than neon glows or unprompted multi-stop purple/cyan or emerald/lime gradients. Keep green for semantic success/positive states unless the brand is green.
   - Snap spacing and control heights (`32/36/44px`) to a `4px` grid (`Inner Gap < Outer Gap`) using CSS logical properties (`padding-inline`, `text-align: start`).
   - Apply `font-variant-numeric: tabular-nums` to numbers/timers/tables, `text-wrap: balance` to multi-line headings, `text-wrap: pretty` to paragraphs, and `-webkit-font-smoothing: antialiased` on `body`. Obey concentric border radii ($R_{\text{outer}} = R_{\text{inner}} + \text{padding}$). Never `scale()` cards containing dense small text (`<= 13px`) on hover/click or center text with `translate(-50%, -50%)`.

2. **Motor Ergonomics, Accessibility & Forgiving Inputs:**
   - Expand small icon buttons to `>= 44×44px` via invisible hit slop (`::after { inset: -8px }` or native `hitSlop`) and respect `env(safe-area-inset-*)`.
   - Style `:focus-visible` with a `2px` outline, trap focus in modals/`Cmd+K` palettes (restoring focus on `Esc`), and gate hover-only action reveals inside `@media (hover: hover)` so touch screens never lose controls.
   - Strip formatting spaces/hyphens silently (Postel's Law), validate lazily (`reward early, punish late`), and support `autocomplete="one-time-code"` + paste splitting on OTP inputs.
   - Protect flyout submenus with a Safe Submenu Pointer Triangle (cleaning up timers on leave/unmount) and use Tooltip Skip-Delay (`400ms` first, `0ms` warm siblings).

3. **Perceived Speed (`<400ms`) & Safe Undo Lifecycle:**
   - Apply optimistic UI updates (`0ms`) with rollback on error, send `Idempotency-Key` headers on mutations, and use zero-CLS Skeleton Loaders + SWR/prefetching.
   - For reversible deletions, use a 5-second Undo Toast flushed via `keepalive: true` on `pagehide` and `beforeunload` (**never on `visibilitychange`**, so switching tabs preserves the 5-second undo window) and call `rollbackUI()` if the commit or keepalive request fails.

4. **Frequency-Gated Motion (`<300ms`) & Reduced Motion:**
   - High-frequency controls (`>10×/session`: tabs, row hover, command menu): `0–120ms`, zero bounce.
   - Medium-frequency transitions (`1–5×/session`: popovers, modals, drawers): `150–260ms cubic-bezier(0.22, 1, 0.36, 1)` (exits `140–180ms`), origin-aware (`scale(0.97) -> 1`), and interruptible.
   - Never use `transition-all` or animate layout geometry (`width`, `height`, `top`, `left`), and always include a `@media (prefers-reduced-motion: reduce)` override.
```
