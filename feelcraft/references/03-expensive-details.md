# 03 · 20 High-Craft Product Engineering Details & 8 Navigation Architectures

Concrete implementation blueprints for the micro-engineering patterns that separate flagship software from generic templates.

---

## 1. Skeleton Loaders (Zero Layout Shift)
- **Rule:** Never show a centered spinner on an empty page when the layout shape is known. Render quiet neutral placeholder blocks matching the exact `height`, `padding`, and `border-radius` of the real rows/cards (`CLS = 0`).
- **Avoid Slop:** Use a subtle opacity wave (`opacity: 0.5 -> 0.85` over `1.6s ease-in-out`), not a harsh white glare streak. Delay skeleton appearance by `120ms` so cached `<120ms` responses don't flash a skeleton for 1 frame.

---

## 2. Optimistic Updates with Rollback
- **Rule:** Update UI state immediately (`0ms`) when the user triggers a mutation (star, toggle, rename, archive, reorder). Snapshot the prior state and revert with a clear toast only if the request fails.
  ```ts
  async function toggleStar(itemId: string, nextValue: boolean) {
    const prev = store.get(itemId);
    store.set(itemId, { ...prev, starred: nextValue }); // 0ms optimistic
    try {
      await api.patch(`/items/${itemId}`, { starred: nextValue });
    } catch (err) {
      store.set(itemId, prev); // Rollback on failure
      toast.error("Couldn't update star. Reverted.");
    }
  }
  ```

---

## 3. Command Menu (`Cmd+K` / `Ctrl+K`)
- **Rule:** Every dense application or dashboard should expose a keyboard-first Command Menu (`Cmd+K` on macOS, `Ctrl+K` on Windows/Linux) for navigation, actions, theme toggling, and search.
- **Details:** Auto-focus the search input on open, navigate items with `ArrowUp`/`ArrowDown` (wrapping at bounds), trigger with `Enter`, close with `Esc`, and filter fuzzily in `<16ms`.

---

## 4. Shortcut Hints (`<kbd>`)
- **Rule:** Teach power users keyboard velocity passively by placing subtle mono keycap badges (`<kbd>`) inside tooltips, menu rows, and primary buttons (e.g. `New Issue` `C`, `Search` `⌘K`, `Save` `⌘S`).
  ```css
  kbd {
    font-family: var(--font-mono, ui-monospace, monospace);
    font-size: 11px;
    line-height: 1;
    padding: 3px 5px;
    border-radius: 4px;
    background: rgba(128, 128, 128, 0.12);
    border: 1px solid rgba(128, 128, 128, 0.22);
    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.18);
  }
  ```

---

## 5. Undo Toasts (Optimistic Non-Blocking Recovery)
- **Rule:** Replace blocking *"Are you sure you want to delete this?"* confirmation modals on reversible actions with immediate optimistic removal + a bottom toast containing an **`Undo`** action (`5000ms` window).
- **Implementation:** Either soft-delete on the server (`deleted_at` restored on Undo) or buffer the destructive network call for `5000ms` (flushing immediately on `beforeunload`).

---

## 6. Stale-While-Revalidate (SWR)
- **Rule:** When revisiting a view or tab, render the in-memory or local-storage cached data immediately (`0ms`), then fetch fresh data in the background and reconcile silently without blanking the screen.

---

## 7. Pre-rendering & Hover-Intent Prefetching
- **Rule:** When a user's cursor enters a navigation link or table row and dwells for `80ms` (`onPointerEnter`), prefetch the route chunk and data payload before the `mousedown`/`click` occurs—giving the user a `100–250ms` head start that makes navigation feel instantaneous.

---

## 8. BlurHash & LQIP Placeholders
- **Rule:** Never allow images to pop in from blank white rectangles. Store an explicit `aspect-ratio` on every image container and render a decoded BlurHash, CSS radial color average, or tiny base64 Low-Quality Image Placeholder (LQIP) that crossfades (`180ms`) into the decoded image on `onload`.

---

## 9. View Transitions (Shared-Element Continuity)
- **Rule:** Use the Web **View Transitions API** (`document.startViewTransition`) or shared layout IDs (`layoutId`) when morphing an item from a list/grid into a detail view, or switching active tab pills.
  ```ts
  function navigateWithTransition(updateDOM: () => void) {
    if (!document.startViewTransition) return updateDOM();
    document.startViewTransition(() => updateDOM());
  }
  ```

---

## 10. Swipe-to-Dismiss Sheets
- **Rule:** Bottom sheets and mobile drawers must track touch drag (`pointermove`), follow the finger 1:1 downward, apply **rubber banding** when pulled upward past the top snap point, and dismiss when either:
  - Drag distance exceeds `35%` of sheet height, OR
  - Downward release velocity exceeds `0.5 px/ms`.

---

## 11. Interruptible Animations
- **Rule:** All interactive transitions must support mid-flight reversal. Use CSS `transition` properties or spring solvers rather than non-cancellable keyframe animations for state toggles, drawers, and hover expansions.

---

## 12. Predictive Back
- **Rule:** On Android / mobile shells and swipe-back web drawers, tie the back-swipe gesture progress (`0.0 -> 1.0`) to a live scale-down (`1.0 -> 0.92`) and peek of the underlying screen so the user sees where they are going before committing the back gesture.

---

## 13. Hit Slop (Expanded Invisible Touch Targets)
- **Rule:** Every icon button, close `×`, checkbox, tree chevron, or resize handle smaller than `44×44px` gets an invisible hit expansion (`::after { content: ""; position: absolute; inset: -8px; }` or React Native `hitSlop={10}`).

---

## 14. Safe Area Insets
- **Rule:** Fixed headers, bottom tab bars, floating action buttons, and sheets must pad by hardware safe areas (`viewport-fit=cover` + `env(safe-area-inset-*)`):
  ```css
  .bottom-bar {
    padding-bottom: max(12px, env(safe-area-inset-bottom));
    padding-left: max(16px, env(safe-area-inset-left));
    padding-right: max(16px, env(safe-area-inset-right));
  }
  ```

---

## 15. One-Time Code (OTP) Autofill & Paste Splitting
- **Rule:** Verification code inputs must support both native SMS/Email autofill and pasting a multi-digit code into any digit box:
  ```html
  <input
    type="text"
    inputmode="numeric"
    autocomplete="one-time-code"
    pattern="\d{6}"
    maxlength="6"
  />
  ```
  - If using 6 separate visual boxes, listen to `onPaste` on every box, strip non-digits (`e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)`), distribute across all 6 boxes, focus the last box, and auto-submit when all 6 digits are filled.

---

## 16. Tabular Numbers (`tabular-nums`)
- **Rule:** Every number that changes, animates, or sits in a list/table/timer/price tag must use monospaced tabular figures so digits `1` and `8` occupy identical horizontal width and never cause layout jitter:
  ```css
  .num, table td, time, .price, .counter, .badge {
    font-variant-numeric: tabular-nums;
  }
  ```

---

## 17. Balanced Headlines (`text-wrap: balance` & `pretty`)
- **Rule:** Eliminate awkward single-word orphans on the last line of headings, hero titles, card titles, and tooltips:
  ```css
  h1, h2, h3, h4, .balance-text {
    text-wrap: balance;
  }
  p, li, .body-copy {
    text-wrap: pretty;
  }
  ```

---

## 18. Continuous & Concentric Corners
- **Rule:** When a rounded child element (`R_inner`) sits inside a rounded parent container (`R_outer`) separated by `padding` ($P$), their radii must be concentric:
  $$R_{\text{outer}} = R_{\text{inner}} + P \quad (\text{or } R_{\text{inner}} = \max(4\text{px}, R_{\text{outer}} - P))$$
  - Example: Outer card `border-radius: 20px` with `padding: 8px` → inner image or button uses `border-radius: 12px`. Never put a `16px` radius child inside a `16px` radius parent with `12px` padding (it creates pinching corner gaps).

---

## 19. Idempotency Keys (Duplicate-Mutation Guard)
- **Rule:** Every state-mutating request (checkout, form submit, create item, webhook trigger) must prevent double execution:
  1. Generate an `Idempotency-Key` (UUID v4 or hash of user + action + payload window) at the moment the user initiates the intent.
  2. Immediately lock/disable duplicate submit triggers while `inFlight === true` (whilst keeping the button width stable via an inline indicator so the button doesn't shrink).
  3. On retry after a network timeout, reuse the *same* `Idempotency-Key` so the server returns the original result instead of creating a duplicate record.

---

## 20. Safe Submenu Pointer Triangle (Diagonal Hover Corridor)
- **Rule:** When a hover menu or sidebar row opens a flyout submenu to its right/bottom, moving the cursor diagonally toward the submenu crosses over neighboring sibling rows. Without protection, the submenu immediately closes or switches.
- **Implementation Options:**
  1. **Geometric Triangle Check:** Record previous cursor coordinates $(x_0, y_0)$ and top/bottom corners of the open submenu $(x_{\text{top}}, y_{\text{top}})$, $(x_{\text{bot}}, y_{\text{bot}})$. While the current cursor $(x, y)$ lies inside that triangle and is moving toward the submenu (`dx > 0`), suppress sibling `mouseenter` switching for `250ms`.
  2. **CSS Invisible Bridge Polygon:** Render an invisible `clip-path: polygon(...)` hit bridge extending from the active trigger item to the leading edge of the submenu popover.

---

## 21. The 8 Side Navigation Architectures (Spatial Decision Matrix)
Never default to the same static 260px sidebar for every product. Match the side navigation architecture to the product's density, viewport, and workflow:

| # | Pattern | Mechanics & Motion | Best For |
| :- | :--- | :--- | :--- |
| **1** | **Overlay Drawer** | Slides over the viewport (`translateX(-100% -> 0)`) with a dimmed backdrop (`opacity: 0 -> 0.4`). | Simple mobile apps, secondary settings drawers, narrow viewports. |
| **2** | **Push Drawer** | Main content container translates/resizes aside (`translateX(260px)`) as the drawer enters so no page content is covered. | Document editors, AI co-pilot sidecars, split-pane inspection tools. |
| **3** | **Reveal Menu** | Main page canvas scales down (`scale(0.94) translateX(240px)`) with rounded corners (`16px`), revealing the navigation layer sitting beneath it. | Consumer mobile/tablet apps wanting spatial depth and physical layering. |
| **4** | **Icon Rail** | Persistent slim (`56px–64px`) vertical icon strip with instant **Tooltip Skip-Delay** labels on hover. | Canvas-first tools (Figma, IDEs, video editors, trading terminals) where horizontal space is sacred. |
| **5** | **Expanding Rail** | Docks as a slim `60px` icon rail at rest; smoothly expands to `220px` on hover-intent or toggle to reveal text labels. | Apps balancing maximum workspace width with label discoverability. |
| **6** | **Accordion Sidebar** | Single-column (`240px–260px`) sidebar with inline collapsible category groups animated via `:root { interpolate-size: allow-keywords }`. | Documentation portals, knowledge bases, nested folder/project trees. |
| **7** | **Two-Level Sidebar** | Dual-column hierarchy: a narrow primary Icon Rail (`56px`) on the far left paired with a `220px` context-specific sub-page list beside it. | Large SaaS platforms and multi-workspace tools (Linear, Slack, Discord, Notion). |
| **8** | **Floating Panel** | Detached card sidebar inset `8px–12px` from the viewport top/bottom/left edges with concentric rounded corners (`12px–16px`) and subtle border hairline. | Spatial web apps, map/canvas dashboards, lightweight modern tools. |
