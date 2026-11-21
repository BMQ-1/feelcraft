<div align="center">
  <img src="./feelcraft/logo.svg" width="96" height="96" alt="Feelcraft Logo" />
  <h1>Feelcraft</h1>
  <p>
    <strong>Standalone design-engineering skill for AI coding agents.</strong><br />
    Makes software look intentional, feel slightly alive, and ship with zero AI slop.
  </p>
  <p>
    <code>v1.0.0</code> · <code>MIT</code> · Works with <strong>Antigravity</strong>, <strong>Codex</strong>, <strong>Claude Code</strong>, <strong>Cursor</strong> &amp; <strong>Gemini CLI</strong>
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

## Why Feelcraft Exists

Most AI UIs fail in one of two ways: **loud AI slop** (purple/cyan or ChatGPT emerald/olive-lime gradients, emoji badges, `transition-all`, robotic delays) or **soulless gray templates** that feel flat and identical.

Feelcraft prevents both by running every task through **Step 0** (product direction + asking you when multiple strong directions fit) and **3 engineering gates**:

1. **Restraint &amp; Identity Gate** — World-derived color ramps, `4px` spacing, sentence case, and **1–2** fitting kinetic details (`Operate` vs. `Showcase` mode).
2. **Doherty Latency Gate (`<400ms`)** — Optimistic updates, 5s Undo Toasts, SWR caching, hover prefetching, and zero-CLS skeletons.
3. **Motor &amp; Cognitive Gate** — `>=44px` hit slop, `:focus-visible` rings, `@media (hover: hover)` touch parity, RTL logical CSS, and forgiving Postel inputs.

<p align="center">
  <img src="./assets/divider-contour.svg" width="100%" alt="" />
</p>

## Architecture (6 Blueprints)

| Pillar | What It Enforces | Reference |
| :--- | :--- | :--- |
| **Visual Foundations** | Tinted neutral ramps, ChatGPT green &amp; purple slop bans, `4px` grid, typography, thin scrollbars, `appearance: none` controls, RTL &amp; focus rings | [05-visual-foundations.md](./feelcraft/references/05-visual-foundations.md) |
| **Kinetic Craft Atlas** | 11 restrained micro-interactions (gliding pills, ghost rolls, `1px` spotlights, odometers), 8 context surfaces &amp; 5 battery-safe backdrops | [06-kinetic-atlas.md](./feelcraft/references/06-kinetic-atlas.md) |
| **UX Laws** | Fitts's, Hick's, Miller's (`5–7` chunking), Doherty (`<400ms`), Postel's, Jakob's, Von Restorff, Focus Staging &amp; Peak-End | [01-cognitive-laws.md](./feelcraft/references/01-cognitive-laws.md) |
| **Motion Physics** | Frequency gating, `<300ms` curves, `scale(0.97)` entrances, spring velocity handoff, `interpolate-size` accordions &amp; reduced-motion safety | [02-motion-physics.md](./feelcraft/references/02-motion-physics.md) |
| **Product Engineering** | 20 flagship details (OTP paste-split, `Cmd+K`, SWR, `Idempotency-Key`, Safe Submenu Triangle, `tabular-nums`) &amp; 8 sidebar architectures | [03-expensive-details.md](./feelcraft/references/03-expensive-details.md) |
| **Domain Adapters** | Tailored rules for **Mobile** (SwiftUI/RN/Flutter), **Backend/API**, **CLI/TUI**, **AI Streaming**, **Desktop** &amp; **QA Auditors** | [04-domain-adapters.md](./feelcraft/references/04-domain-adapters.md) |

<details>
<summary>Included code kit: CSS tokens, TypeScript primitives &amp; skill manifests</summary>

| File | Contents |
| :--- | :--- |
| [feelcraft/SKILL.md](./feelcraft/SKILL.md) | Step 0 Direction &amp; Choice Gate, 3-Gate Engine, `AUDIT` &amp; `BUILD` workflows |
| [feelcraft/resources/feelcraft.css](./feelcraft/resources/feelcraft.css) | 24-section CSS foundation (ramps, scrollbars, tactile inputs, kinetic primitives) |
| [feelcraft/examples/feelcraft-primitives.tsx](./feelcraft/examples/feelcraft-primitives.tsx) | 9 TypeScript/React helpers (Safe Triangle, OTP Split, Undo Queue, Spotlight, Segmented Pill) |
| [feelcraft/agents/openai.yaml](./feelcraft/agents/openai.yaml) | OpenAI Codex UI metadata manifest |

</details>

<p align="center">
  <img src="./assets/divider-kinematic.svg" width="100%" alt="" />
</p>

## Automated Auditing

Run the zero-dependency scanner against any codebase (**29** craft signals, **18** slop anti-patterns):

```bash
node feelcraft/scripts/audit-feelcraft.mjs /path/to/your/project
```

For live web pages, inject [audit-dom-runtime.js](./feelcraft/scripts/audit-dom-runtime.js) via Playwright `page.evaluate()` or DevTools to measure **9** rendered checks (hit targets, WCAG contrast, concentric radii, chunky scrollbars, tinted dark surfaces, and slow/infinite motion).

---

## Credits &amp; License

Synthesizes foundational work by Frank Thomas &amp; Ollie Johnston (*The Illusion of Life*), Jon Yablonski (*Laws of UX*), Emil Kowalski (*Animations on the Web*), Raphael Salaja (`userinterface.wiki`), Paco Coursey (`next-themes`), and Ben Kamens (diagonal submenu triangle).

Released under the [MIT License](./LICENSE).
