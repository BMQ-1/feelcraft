# 01 · Cognitive & Ergonomic Laws of UX

Every rule in this reference translates human perception, motor control, and cognitive psychology into concrete interface and systems engineering constraints (drawing on foundational HCI research by Paul Fitts, William Edmund Hick, George A. Miller, Walter J. Doherty, Jon Postel, Jakob Nielsen, Hedwig von Restorff, and Daniel Kahneman, as cataloged in Jon Yablonski's *Laws of UX*).

---

## 1. Fitts's Law & Expanded Hit Slop
> *Target acquisition speed depends directly on how large the target is and how close it sits to the pointer or thumb.*

- **Rule:** Primary actions must be sizable and positioned near the user's active pointer path or natural thumb arc. Compact visual controls (`16px–24px` close icons, action buttons, checkboxes, resize handles) must expand their invisible clickable/tappable area to at least **`44×44px`** on touch screens and **`32×32px` to `36×36px`** on desktop.
- **Web CSS Implementation:**
  ```css
  .icon-btn {
    position: relative;
  }
  .icon-btn::after {
    content: "";
    position: absolute;
    inset: -8px; /* Expands a 28px visual button to a 44px hit target */
  }
  ```
- **React Native / Expo Implementation:**
  ```tsx
  <Pressable hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={onClose}>
    <CloseIcon size={20} />
  </Pressable>
  ```
- **Distance Optimization:** Place contextual actions near the selected item (inline action bars, context menus, or mobile bottom sheets) rather than forcing full-screen pointer travel to a distant corner.

---

## 2. Hick's Law
> *Decision latency grows logarithmically with the number and complexity of simultaneous options.*

- **Rule:** Never crowd a primary surface with a dozen equal-weight buttons. Present **1 primary action** and **at most 1–2 secondary actions**; tuck power actions and rare settings behind progressive disclosure or a **`Cmd+K` / `Ctrl+K` Command Menu**.
- **Onboarding & Forms:** Break complex configurations into focused stages or sensible defaults rather than rendering 20 form fields at once.

---

## 3. Miller's Law
> *Working memory comfortably holds roughly 5 to 7 distinct items at one time.*

- **Rule:** Group navigation links, menu items, settings rows, and dashboard metrics into visual clusters of **5 to 7 items**, separated by clear whitespace (`16px–24px` between clusters vs. `2px–6px` within a cluster).
- **String Chunking:** Visually group long digit sequences (payment cards `4242 •••• •••• 4242`, phone numbers, 6-digit verification codes `123 456`).

---

## 4. Doherty Threshold (`<400ms`)
> *Human flow state requires the system to acknowledge and respond to actions within 400 milliseconds.*

- **Response Budget Tiers:**
  - **`0–100ms` (Immediate):** Tactile press feedback (`:active`), hover highlights, local tab switches, **Optimistic UI mutations**.
  - **`100–300ms` (Snappy):** **Stale-While-Revalidate (SWR)** reads, **hover-intent prefetched** routes, popover/drawer transitions.
  - **`300–400ms` (Flow Ceiling):** Hard cutoff before rendering a layout-matched **Skeleton Loader**.
  - **`>400ms` (Asynchronous):** Provide immediate optimistic state or progressive streaming/skeletons; never freeze the interface or flash a blank container.

---

## 5. Postel's Law (The Robustness Principle)
> *Accept flexible, forgiving input from humans; emit strict, normalized output from your system.*

- **Rule:** Never throw validation errors at users for formatting habits your parser can normalize automatically.
- **Concrete Applications:**
  - **Credit cards, phones, IBANs, tax IDs:** Accept spaces, hyphens, parentheses, and pasted formatting; strip non-digits silently and format the display cleanly.
  - **One-Time Codes (OTP):** Accept a full 6-digit paste into any digit box, strip whitespace, and configure `autocomplete="one-time-code"`.
  - **Search & Command Palettes:** Trim leading/trailing spaces, ignore case and accents, and tolerate minor typos.
  - **APIs & CLIs:** Normalize input strings at schema boundaries while emitting strict canonical types in responses.

---

## 6. Jakob's Law
> *Users bring mental models built across every other app they use daily; honor standard interaction conventions.*

- **Rule:** Preserve established platform mechanics:
  - `Esc` dismisses modals, popovers, and command menus.
  - `Cmd+K` / `Ctrl+K` or `/` focuses search or the command palette.
  - Clicking the backdrop or swiping down dismisses a bottom sheet.
  - Hardware/browser back gestures close temporary overlays or trigger **Predictive Back**.
  - Preserve native scroll physics—never hijack scroll velocity (`scroll-jacking`).

---

## 7. Von Restorff Effect (Isolation Principle)
> *Among a group of similar elements, the single visually distinct item captures immediate attention and recall.*

- **Rule:** If everything shouts, nothing is heard. Keep 90% of the chrome in quiet tinted neutrals so the **single primary CTA** or **single critical metric** carries the high-contrast accent and reads in `<50ms`.

---

## 8. Staging the Focus
> *Guide the user's attention to one unmistakable focal point at a time.*

- **Rule:** When a modal, popover, or guided step opens, quiet the background layer, auto-focus the primary input, and prevent unrelated background animations from competing for peripheral vision.

---

## 9. Peak-End Rule
> *Users evaluate an experience primarily by its most intense moment (the peak) and its final state (the end).*

- **Rule:** Concentrate your richest tactile and visual polish in two moments:
  1. **The Peak Moment:** The core value delivery of the product (completing a deployment, confirming a transfer, publishing an artifact).
  2. **The End State:** The completion receipt, zero-inbox empty state, or final CLI summary table. Make the ending crisp, reassuring, and memorable.
