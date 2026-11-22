# 04 · Platform & Boundary Adapters (Mobile, Frontend-Adjacent APIs, CLI/TUI, Desktop)

Feelcraft is primarily a **UI, interaction, and client ergonomics skill**. When working across native mobile, terminal interfaces, or the API endpoints that directly back interactive UI flows, use the adapters below.

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

## 2. Frontend-Supporting API Contracts (Full-Stack Boundary)

Frontend UX patterns like Optimistic UI, 5-second Undo Toasts, and Doherty `<400ms` transitions require three specific contracts at the API boundary:

- **Doherty Threshold (`<400ms`) & Async Handoff:**
  - Interactive reads should target fast p95 latency via indexed queries and `Cache-Control: stale-while-revalidate` where appropriate.
  - Long-running mutations (`>400ms` — PDF generation, AI inference, bulk import) should return `202 Accepted` immediately with an operation ID and stream progress via SSE/WebSockets or a pollable status endpoint so the UI never hangs.
- **Idempotency Support (Safe Client Retries):**
  - Accept an `Idempotency-Key` header on state-mutating `POST`/`PATCH`/`DELETE` routes so optimistic UI retries or `pagehide`/`beforeunload` keepalive flushes never create duplicate records.
- **Undo Grace Window (Soft Delete / Deferred Commit):**
  - Back frontend Undo Toasts either by deferring the client request for `5000ms` (with `pagehide`/`beforeunload` keepalive flush) or by writing `deleted_at = NOW()` on the server and exposing a lightweight `POST /items/:id/restore` endpoint.
- **Postel's Law at Input Boundaries:**
  - Normalize human-entered strings at schema boundaries (`.trim()`, Unicode NFC normalization, flexible phone/postal whitespace stripping) rather than rejecting valid user input for formatting whitespace.

---

## 3. CLI, TUI & Developer Tool Agents

- **Doherty Threshold in the Terminal (`<50ms` Acknowledgment):**
  - Print immediate visual feedback within `50ms` of invocation. If startup imports take `>150ms`, lazy-load heavy modules after rendering the initial status line or spinner.
- **Frequency of Use & Quiet Output:**
  - High-frequency CLI commands (`status`, `list`, `diff`) must output clean, parseable text with zero artificial typing delays or ASCII splash banners.
- **Undo & Forgiveness over Modal `[y/N]` Prompts:**
  - Support `--dry-run` on mutating commands.
  - For reversible operations, log the exact rollback command (`To undo, run: tool undo <tx-id>`) rather than chaining multiple confirmation prompts.
- **Postel's Law in Argument Parsing:**
  - Allow flags before or after positional arguments (`tool build --watch dir` and `tool build dir --watch`).
  - On mistyped subcommands, suggest the closest command (`Did you mean 'deploy'?`).
- **Tabular Numbers & Visual Hierarchy:**
  - Right-align numeric columns (durations, byte sizes, counts, percentages) in fixed-width tabular columns so digits align vertically.
  - Respect `NO_COLOR` and `--json` flags automatically when stdout is piped (`!process.stdout.isTTY`).
- **Interruptible Execution:**
  - Trap `SIGINT` (`Ctrl+C`) cleanly: restore terminal cursor visibility, clean up temp files, and print a single clean cancellation line instead of an unhandled stack trace.

---

## 4. AI Streaming & Conversational UIs

- **Time-to-First-Feedback (`<400ms`):**
  - Acknowledge user input within `50ms` with a quiet phase indicator rather than a fake progress bar.
  - Stream tokens progressively (`tabular-nums` on token/latency readouts) and prevent scroll-hijacking if the user scrolls up while tokens are streaming (`isUserScrolledUp` lock).
- **Interruptible Generation:**
  - Always expose an immediate **`Stop`** (`Esc` / `Ctrl+C`) trigger that aborts in-flight streams cleanly while preserving partial output already rendered.

---

## 5. Desktop, Electron, Tauri & Native Shell Agents

- **Window Chrome & Safe Areas:**
  - Respect macOS traffic-light window controls (`titleBarStyle: 'hiddenInset'`) and Windows caption button safe zones.
- **120Hz Frame-Budget Discipline:**
  - Keep pointer-tracking interactions (split-pane resize handles, canvas pan/zoom, command menu filtering) under `8ms` per frame with zero synchronous layout thrashing (`getBoundingClientRect` batched inside `requestAnimationFrame`).

---

## 6. QA & Code Review Workflow

When acting as a reviewer or QA agent:
1. Run `node <skill-folder>/scripts/audit-feelcraft.mjs <repo-path>` as a **heuristic hint scanner** (strips comments, checks applicable signals, and penalizes motion/UX anti-patterns). Treat static regex matches as starting leads, not final proof of visual quality.
2. When a live browser or dev server is available, inject `<skill-folder>/scripts/audit-dom-runtime.js` into the page (`page.evaluate()`) to measure actual rendered `getBoundingClientRect()` hit targets (`>=32–36px` desktop / `44px` touch), WCAG 2.2 AA contrast (`>=4.5:1` normal text, `>=3.0:1` large text at `>=24px` or `>=18.66px bold`), concentric corner math ($R_{\text{outer}} - \text{padding} = R_{\text{inner}}$), `tabular-nums`, and transition durations (`<=300ms`).
3. File findings with exact CSS/code diffs rather than subjective aesthetic opinions.
