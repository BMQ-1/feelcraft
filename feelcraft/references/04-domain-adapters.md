# 04 · Universal Domain Adapters (Mobile, Backend/API, CLI/TUI, QA Agents)

Feelcraft is built for **all sorts of agents**, not only browser frontend agents. When an agent operates in a non-web domain, translate the 55+ Feelcraft principles using the adapters below.

---

## 1. Mobile App Agents (React Native / Expo, SwiftUI, Jetpack Compose, Flutter)

- **Continuous Squircles:**
  - SwiftUI: `.clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))`
  - Expo / iOS: `borderCurve: 'continuous'`
- **Haptic Detents (Secondary Action & Physical Weight):**
  - Pair threshold crossings (pull-to-refresh trigger point, swipe-to-archive threshold, toggle snap, picker detent) with subtle system haptics (`UIImpactFeedbackGenerator(style: .light)` / `Haptics.selectionAsync()`).
  - Never fire heavy haptics on high-frequency scrolling without a detent catch.
- **Tabular Figures:**
  - SwiftUI: `.monospacedDigit()`
  - React Native: `fontVariant: ['tabular-nums']`
- **Hit Slop & Thumb Zone (Fitts's Law):**
  - Enforce `44×44pt` (iOS) / `48×48dp` (Android) minimum touch targets via `hitSlop`.
  - Anchor primary actions in the bottom thumb arc, respecting `SafeAreaView` / `useSafeAreaInsets()`.
- **Gesture Physics (Interruptible, Rubber Banding, Predictive Back):**
  - Run sheet and pan gestures on the UI thread (`react-native-reanimated` + `react-native-gesture-handler` or native SwiftUI `.presentationDetents([.medium, .large])`).
  - Project final snap point using release velocity (`projectedY = currentY + velocityY * 0.15`), not distance alone.

---

## 2. Backend, API & Full-Stack Agents

- **Doherty Threshold (`<400ms`) at the System Boundary:**
  - Reads should target `<100ms` p95 via indexed queries, edge/memory caching, and HTTP `Cache-Control: max-age=0, s-maxage=60, stale-while-revalidate=86400`.
  - Long-running mutations (`>400ms` — PDF generation, AI inference, bulk import, email dispatch) must return `202 Accepted` immediately with an operation ID and stream status via SSE/WebSockets or pollable status endpoints.
- **Idempotency Middleware (Duplicate-Request Guard):**
  - Accept `Idempotency-Key` header on `POST`/`PATCH` routes. Store `{ key, payloadHash, status, responseBody }` with a `24h` TTL. If an identical key arrives while in flight, return `409 Conflict` or await the active promise; if completed, replay the cached status and body.
- **Undo Grace Window (Soft Delete Architecture):**
  - Support Undo Toasts by writing `deleted_at = NOW()` (or queuing hard deletion by `10s–30s`) and exposing a lightweight `POST /items/:id/restore` endpoint.
- **Postel's Law at API Parsers:**
  - Normalize input strings at schema boundaries (`.trim()`, Unicode NFC normalization, flexible phone/postal whitespace stripping) while returning strict, deterministic, strongly-typed payloads (ISO-8601 UTC timestamps, integer minor currency units, `camelCase` or `snake_case` consistently).
- **Miller's Law in Pagination:**
  - Default cursor pagination pages to `20–25` items and support field selection or summary projections so initial payloads stay fast and digestible.

---

## 3. CLI, TUI & Developer Tool Agents

- **Doherty Threshold in the Terminal (`<50ms` Acknowledgment):**
  - Print immediate visual feedback within `50ms` of invocation. If startup imports take `>150ms`, lazy-load heavy modules after rendering the initial status line or spinner.
- **Frequency of Use & Quiet Output:**
  - High-frequency CLI commands (`status`, `list`, `diff`) must output clean, parseable text with zero artificial typing delays or ASCII splash banners.
- **Undo & Forgiveness over Modal `[y/N]` Prompts:**
  - Support `--dry-run` on every mutating command.
  - For reversible operations, perform the action, log the exact rollback command (`To undo, run: tool undo <tx-id>`), and store a local backup snapshot rather than nagging the user with 5 sequential confirmation prompts.
- **Postel's Law in Argument Parsing:**
  - Allow flags before or after positional arguments (`tool build --watch dir` and `tool build dir --watch`).
  - On mistyped subcommands, calculate Levenshtein distance and suggest the closest command (`Did you mean 'deploy'?`).
- **Tabular Numbers & Visual Hierarchy:**
  - Right-align all numeric columns (durations, byte sizes, counts, percentages) in fixed-width tabular columns so digits align vertically.
  - Respect `NO_COLOR` and `--json` flags automatically when stdout is piped (`!process.stdout.isTTY`).
- **Interruptible Execution:**
  - Trap `SIGINT` (`Ctrl+C`) cleanly: restore terminal cursor visibility, clean up temp files, and print a single clean cancellation line instead of an unhandled stack trace.

---

## 4. AI, LLM Streaming & Conversational Agents

- **Doherty Threshold for Token Streaming (`<400ms` Time-to-First-Feedback):**
  - Acknowledge user input within `50ms` with a quiet phase indicator (not a fake multi-second progress bar).
  - Stream tokens progressively (`tabular-nums` on token/latency readouts) and prevent scroll-hijacking if the user scrolls up while tokens are streaming (`isUserScrolledUp` lock).
- **Interruptible Generation:**
  - Always expose an immediate **`Stop`** (`Esc` / `Ctrl+C`) trigger that aborts in-flight streams cleanly while preserving partial output already rendered.
- **Postel's Law for Tool & Prompt Parsing:**
  - Coerce slightly malformed tool arguments (trailing commas, stringified booleans/numbers) safely before failing a tool call.
- **Peak-End Rule in Agent Replies:**
  - End complex runs with a scannable summary, clickable file links, and verifiable evidence rather than trailing boilerplate filler.

---

## 5. Desktop, Electron, Tauri & Native Shell Agents

- **Window Chrome & Safe Areas:**
  - Respect macOS traffic-light window controls (`titleBarStyle: 'hiddenInset'`) and Windows caption button safe zones.
- **120Hz Frame-Budget Discipline:**
  - Keep pointer-tracking interactions (split-pane resize handles, canvas pan/zoom, command menu filtering) under `8ms` per frame with zero synchronous layout thrashing (`getBoundingClientRect` batched inside `requestAnimationFrame`).

---

## 6. QA, Code Review & Autonomous Auditor Agents

When acting as a read-only reviewer or QA agent:
1. Run `node <skill-folder>/scripts/audit-feelcraft.mjs <repo-path>` to gather static signals across Web, Mobile, Backend, and CLI files.
2. When a live browser or dev server is available, inject `<skill-folder>/scripts/audit-dom-runtime.js` into the page (`page.evaluate()`) to measure actual computed `getBoundingClientRect()` hit targets (`>=36px`), concentric corner math ($R_{\text{outer}} - \text{padding} = R_{\text{inner}}$), `tabular-nums`, and transition durations (`<=300ms`).
3. Evaluate every user-facing flow against the **3 Gates** (Frequency, Doherty `<400ms`, Motor/Cognitive).
4. File findings with **exact CSS/code diffs** rather than vague design opinions (e.g., *"Add `tabular-nums` to `.price-ticker` at `PricingCard.tsx:42` to prevent horizontal layout jitter"*).
