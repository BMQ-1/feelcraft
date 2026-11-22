<div align="center">
  <img src="./feelcraft/logo.svg" width="96" height="96" alt="Feelcraft Logo" />
  <h1>Feelcraft</h1>
  <p>
    <strong>Frontend design-engineering, interaction ergonomics &amp; &lt;300ms motion physics skill for AI coding agents.</strong><br />
    Enforces universal accessibility, latency, and input standards while providing clean greenfield visual scaffolds.
  </p>
  <p>
    <code>v1.1.0</code> · <code>MIT</code> · Works with <strong>Antigravity</strong>, <strong>Codex</strong>, <strong>Claude Code</strong>, <strong>Cursor</strong> &amp; <strong>Gemini CLI</strong>
  </p>
</div>

<br />

## Install

```bash
# Universal CLI (installs across your coding agents)
npx skills add BMQ-1/feelcraft -g
```

**Or one-line script** (auto-detects Antigravity, Codex, Claude Code &amp; `.agents`):

```bash
# macOS / Linux / Git Bash
curl -fsSL https://raw.githubusercontent.com/BMQ-1/feelcraft/main/install.sh | bash
```

```powershell
# Windows PowerShell
irm https://raw.githubusercontent.com/BMQ-1/feelcraft/main/install.ps1 | iex
```

<details>
<summary>Other options: Zero-terminal prompt, project-local install, or Cursor / AGENTS.md rules</summary>

- **Ask your AI agent directly:**
  > *"Install the Feelcraft skill from https://github.com/BMQ-1/feelcraft into my agent skills folder, then use feelcraft on this project."*
- **Project-local only:** `npx skills add BMQ-1/feelcraft`
- **Rules-only (`.cursor/rules/feelcraft.mdc`, `CLAUDE.md`, `AGENTS.md`):** Copy [UNIVERSAL-ADAPTERS.md](./feelcraft/adapters/UNIVERSAL-ADAPTERS.md).

</details>

### Use It

- **Antigravity / Claude Code:** `/feelcraft` or *"Build a settings page using feelcraft"*
- **OpenAI Codex:** `$feelcraft` or *"Use $feelcraft to audit and polish this app"*
- **Audit any codebase:** *"Run feelcraft in audit mode on this repo"*

<p align="center">
  <img src="./assets/divider-kinematic.svg" width="100%" alt="" />
</p>

## How Feelcraft Works

Feelcraft separates **universal engineering &amp; accessibility standards** from **default greenfield visual scaffolds** so personal aesthetic rules never override an established brand or editorial system:

1. **Universal Engineering Standards (Always Enforced)** — WCAG 2.2 AA contrast (`>= 4.5:1` normal / `>= 3.0:1` large text at `>= 24px` or `>= 18.66px` bold), `:focus-visible` rings, `>= 44×44px` (`36×36px` desktop) hit targets, `@media (hover: hover)` touch parity, `prefers-reduced-motion` safety, `< 300ms` compositor transitions (`transform`, `opacity`), Postel input forgiveness, and optimistic rollback with `pagehide`/`beforeunload` undo flushes.
2. **Default Greenfield Visual Scaffolds (Overrideable by Brand)** — Low-chroma neutral ramps (`Graphite`, `Warm Stone`, `Deep Ink`), `4px` spacing rhythm, `400–600` dense UI weights (`700–800` for editorial/display), and optional kinetic motifs (`Operate` vs. `Showcase` mode) when no brand system is specified.

<p align="center">
  <img src="./assets/divider-contour.svg" width="100%" alt="" />
</p>

## Architecture (6 Blueprints)

| Pillar | What It Covers | Reference |
| :--- | :--- | :--- |
| **Visual Foundations** | Greenfield neutral ramps, brand precedence, WCAG 2.2 AA contrast, `4px` grid, contextual typography, thin scrollbars, `appearance: none` controls, RTL &amp; focus rings | [05-visual-foundations.md](./feelcraft/references/05-visual-foundations.md) |
| **Kinetic Craft Atlas** | Optional tactile micro-interactions (gliding pills, ray-intersected directional hovers, 6-wedge `atan2` radial wheels, rubber scrubbers, theme ripples), 8 context surfaces &amp; 5 battery-safe backdrops | [06-kinetic-atlas.md](./feelcraft/references/06-kinetic-atlas.md) |
| **UX Laws** | Fitts's, Hick's, Miller's (`5–7` UI chunking), Doherty (`<400ms`), Postel's, Jakob's, Von Restorff, Focus Staging &amp; Peak-End | [01-cognitive-laws.md](./feelcraft/references/01-cognitive-laws.md) |
| **Motion Physics** | Frequency gating, `<300ms` curves, `scale(0.97)` entrances, spring velocity handoff, `interpolate-size` accordions &amp; reduced-motion safety | [02-motion-physics.md](./feelcraft/references/02-motion-physics.md) |
| **Product Engineering** | 20 product details (OTP paste-split, `Cmd+K`, SWR, `Idempotency-Key`, Safe Submenu Triangle, `tabular-nums`) &amp; 8 sidebar architectures | [03-expensive-details.md](./feelcraft/references/03-expensive-details.md) |
| **Platform Adapters** | Tailored guidance for **Mobile** (SwiftUI/RN/Flutter), **Frontend-Supporting API Contracts**, **CLI/TUI**, **AI Streaming**, **Desktop** &amp; **QA Auditors** | [04-domain-adapters.md](./feelcraft/references/04-domain-adapters.md) |

<details>
<summary>Included code kit: CSS tokens, TypeScript primitives &amp; skill manifests</summary>

| File | Contents |
| :--- | :--- |
| [feelcraft/SKILL.md](./feelcraft/SKILL.md) | Compact (~9 KB), zero-repetition 5-Pass Build &amp; Audit workflow |
| [feelcraft/resources/feelcraft.css](./feelcraft/resources/feelcraft.css) | CSS foundation (ramps, scrollbars, tactile inputs, theme ripple/crossfade, radial wheel &amp; kinetic primitives) |
| [feelcraft/examples/feelcraft-primitives.tsx](./feelcraft/examples/feelcraft-primitives.tsx) | 13 TypeScript/React reference helpers (Safe Triangle, OTP Split, Undo Queue, Theme Ripple/Crossfade, Directional Hover, Radial `atan2` Solver) |
| [feelcraft/agents/openai.yaml](./feelcraft/agents/openai.yaml) | OpenAI Codex UI metadata manifest |

</details>

<p align="center">
  <img src="./assets/divider-kinematic.svg" width="100%" alt="" />
</p>

## Automated Auditing

Run the comment-stripping static hint scanner against any codebase (scopes contextual signals to matching project features and deducts anti-pattern violations from the net score):

```bash
node feelcraft/scripts/audit-feelcraft.mjs /path/to/your/project
```

For live web pages, inject [audit-dom-runtime.js](./feelcraft/scripts/audit-dom-runtime.js) via Playwright `page.evaluate()` or DevTools to measure rendered hit targets, alpha-composited WCAG 2.2 AA contrast (`>= 4.5:1` normal / `>= 3.0:1` large text at `>= 24px` or `>= 18.66px` bold), concentric radii, chunky scrollbars, and slow/infinite motion.

---

## Credits &amp; License

Synthesizes foundational work by Frank Thomas &amp; Ollie Johnston (*The Illusion of Life*), Jon Yablonski (*Laws of UX*), Emil Kowalski (*Animations on the Web*), Raphael Salaja (`userinterface.wiki`), Paco Coursey (`next-themes`), and Ben Kamens (diagonal submenu triangle).

Released under the [MIT License](./LICENSE).
