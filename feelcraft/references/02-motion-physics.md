# 02 · UI Motion Physics & Choreography

Synthesizes Disney's 12 Principles of Animation (*The Illusion of Life* by Frank Thomas & Ollie Johnston), Raphael Salaja's `userinterface.wiki`, and Emil Kowalski's design engineering rules.

---

## 1. Frequency of Use (The Master Damper)
> *The more often an element is used, the less animation it should have.* — Emil Kowalski

Before adding any animation, classify the interaction frequency:
- **High Frequency (10–100×/day):** Command menu items, table sorting, sidebar switching, text editing, volume/brightness sliders.
  - **Treatment:** `0ms`–`120ms`. Instant state swaps or ultra-fast opacity/color crossfades. No bounce, no scale dramatic entrance.
- **Medium Frequency (1–10×/day):** Opening a dialog, expanding an accordion, dismissing a toast, sliding a drawer.
  - **Treatment:** `150ms`–`260ms` with `cubic-bezier(0.22, 1, 0.36, 1)`.
- **Low Frequency (<1×/day):** First-time onboarding, checkout success, wrong passcode shake, milestone celebration.
  - **Treatment:** `250ms`–`450ms` with secondary action flourishes, follow-through, and exaggeration.

---

## 2. Snappy Timing (`<300ms`)
> *Duration sets the feel. Keep functional UI animations under 300ms.*

- **Standard Token Scale:**
  - `--duration-micro: 100ms` (button `:active` press, toggle thumb, hover state)
  - `--duration-fast: 160ms` (tooltip, dropdown menu, exit animations)
  - `--duration-base: 220ms` (modal enter, popover, toast slide-in)
  - `--duration-limit: 280ms` (drawer, sheet, shared view transition)
- **Exit Rule:** Exits should always be **20–30% faster** than entrances (`140ms–180ms` vs `220ms–260ms`) so the UI never lingers in the user's way after they dismiss something.

---

## 3. Slow In & Slow Out (Easing Curves)
> *Nothing in the physical world starts or stops instantaneously at constant velocity.*

- **Ban `linear` easing** for any spatial translation or scale (reserve `linear` only for continuous color/opacity or progress spinners).
- **Core Easing Tokens:**
  ```css
  :root {
    /* Primary UI ease-out: instant initial velocity, smooth deceleration */
    --ease-out-quart: cubic-bezier(0.22, 1, 0.36, 1);
    --ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1);
    /* For elements moving from point A to point B already on screen */
    --ease-in-out:    cubic-bezier(0.65, 0, 0.35, 1);
    /* For elements exiting the screen */
    --ease-in-fast:   cubic-bezier(0.4, 0, 1, 1);
    /* Subtle tactile overshoot (use ONLY on low-frequency / peak moments) */
    --ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  ```

---

## 4. Origin Awareness & Scale From `0.97` (Never `scale(0)`)
> *Elements grow out of the exact point where the mouse clicked or finger tapped—never from an arbitrary screen center, and never from `scale(0)`.*

- **Rule:** Every dropdown, context menu, tooltip, and popover sets its `transform-origin` pointing back to its trigger button.
- **Scale Range (`0.97` Entrance Rule):** Start entrances from **`scale(0.97)` with `opacity: 0`** (or `0.95–0.97`), **never from `scale(0)`** (which looks cartoonish and sluggish).
  ```css
  .popover[data-side="bottom"][data-align="end"] {
    transform-origin: top right;
    animation: popover-in 180ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  @keyframes popover-in {
    from { opacity: 0; transform: scale(0.97) translateY(-4px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  ```

---

## 5. Interruptible Motion & Spring Velocity Handoff
> *Let users change their mind mid-animation to cancel or redirect an action without a harsh snap, and preserve release velocity on flicks and drags.*

- **Rule:** Prefer **CSS transitions** or **velocity-preserving springs** over locked multi-step CSS `@keyframes` for interactive states (toggles, sheets, accordions, tabs).
- **Flick & Drag Velocity Handoff:** On pointer release after a drag or flick, hand off to a spring that preserves the user's release velocity (`animate(y, 0, { type: "spring", duration: 0.5, bounce: 0, velocity })`) instead of a fixed-duration ease that ignores how fast the user flicked.

---

## 6. Squash & Stretch (Tactile Weight) & GPU Text Crispness
> *Objects compress slightly on impact and deform subtly under force, giving flat pixels physical mass.*

- **UI Translation:** Keep it restrained (`2%–3%` deformation):
  - **Compact Buttons / Controls (`<=48px` tall):** `transform: scale(0.97)` on `:active` (`100ms`), snapping back to `scale(1)` on release.
  - **Switch Thumb:** Stretch horizontally by `15%` (`width: 20px -> 23px`) while pressed (`:active`), then snap to circular (`20px`) on release.
- **Critical GPU Text Rasterization Guardrail (Fixing Blurry/Jumping Fonts on Hover & Click):**
  When browsers promote an element to a GPU composite layer during a `transform` or `opacity` transition, two visual bugs happen unless prevented:
  1. **Antialiasing Mode Jump:** Without `-webkit-font-smoothing: antialiased`, the browser switches text from LCD subpixel antialiasing (ClearType) to grayscale antialiasing the instant `:hover` or `:active` triggers a `transform`, making the font visibly change thickness/color.
     - **Fix:** Always set `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;` on the root/body.
  2. **Fractional Bitmap Texture Blur:** Applying `scale(0.985)` or `hover:scale(1.02)` directly to a **card containing multi-line or small (`11px–13px`) text** forces the GPU to bilinearly resample the text bitmap at a non-integer ratio, making the text look pixelated/blurry.
     - **Fix:** Never `scale()` cards with dense body copy on hover or click. Animate `border-color`, `background-color`, or scale a dedicated background pseudo-element (`::before`) while keeping the text DOM node at `scale(1)` on integer pixel coordinates.
     - **Fix:** Never center dialogs or tooltips with `top: 50%; left: 50%; transform: translate(-50%, -50%)` (an odd pixel width/height puts every glyph at a `.5px` sub-pixel offset). Always center with Flexbox or CSS Grid.

---

## 7. Anticipation Wind-Up
> *A small counter-movement before a major action prepares the eye for what is about to happen.*

- **UI Translation:**
  - When a user holds a long-press action button or drags a card to reorder, slightly shrink (`scale(0.96)`) or lift (`translateY(-2px)` + shadow increase) during the hold before releasing into the full transition.

---

## 8. Follow-Through & Overlapping Action
> *Child elements settle a beat (`30–60ms`) after the parent container stops moving.*

- **UI Translation:** When a sheet or card slides into place (`220ms`), let the inner header/actions settle `30ms–50ms` behind the container, or let an icon badge settle slightly after its button lands.

---

## 9. Staggering
> *Bring sibling items in one after another (`20–35ms` apart), not as one monolithic slab.*

- **Rule:** Cap the total stagger cascade at **`200ms–250ms`** (if a list has 50 rows, only stagger the first 6–8 visible rows and render the rest together so the bottom of the screen is never delayed by `1.5s`).
  ```css
  .stagger-item {
    animation: fade-rise 220ms cubic-bezier(0.22, 1, 0.36, 1) backwards;
    animation-delay: calc(min(var(--index, 0), 7) * 28ms);
  }
  ```

---

## 10. Rubber Banding (Elastic Boundary Resistance)
> *Pulling past the physical limit stretches with logarithmic resistance and springs back upon release.*

- **Formula for Drag Past Boundary ($\Delta > 0$):**
  $$\Delta_{\text{damped}} = c \cdot \ln\left(1 + \frac{\Delta}{c}\right) \quad \text{or} \quad \Delta_{\text{damped}} = \frac{\Delta \cdot c}{\Delta + c}$$
  where $c \approx 40\text{–}60\text{px}$ is the maximum visual stretch limit.

---

## 11. Moving in Arcs
> *Natural movement follows curved trajectories rather than rigid diagonal straight lines.*

- **UI Translation:** When morphing an element across both X and Y axes (e.g., collapsing a floating composer window into a dock pill, or animating an item into a cart/folder), offset the X and Y timing curves (e.g. X uses `cubic-bezier(0.22, 1, 0.36, 1)` while Y uses `cubic-bezier(0.55, 0, 0.1, 1)`) so the path forms a natural parabolic arc.

---

## 12. Secondary Action
> *A small micro-flourish that reinforces the primary state change without distracting from it.*

- **Examples:**
  - **Copy button:** Icon morphs from `Copy` → `Checkmark` (`scale(0.5 -> 1)`) while the button border briefly flashes subtle green.
  - **Like / Bookmark:** The counter rolls vertically (`translateY(-100%)` digit odometer) while the heart icon pulses once.
  - **Delete / Archive:** Row collapses smoothly after the icon lid tilts open by `15deg`.

---

## 13. Exaggerated Feedback
> *Push critical feedback slightly past realism so the state change is unmistakable.*

- **Primary Example — Invalid Passcode / Form Error Shake (`360ms`):**
  Turn the field border/state red AND shake horizontally (`0 -> -10px -> 10px -> -6px -> 6px -> -3px -> 0px` over `360ms`):
  ```css
  @keyframes error-shake {
    0%, 100% { transform: translateX(0); }
    16%      { transform: translateX(-10px); }
    33%      { transform: translateX(10px); }
    50%      { transform: translateX(-6px); }
    66%      { transform: translateX(6px); }
    83%      { transform: translateX(-3px); }
  }
  .input-error {
    animation: error-shake 360ms cubic-bezier(0.36, 0.07, 0.19, 0.97);
  }
  ```

---

## 14. Pose-to-Pose, Solid Drawing in 3D & Overall Appeal
- **Pose-to-Pose:** Declare clean start and end states in CSS/state (`data-state="open" | "closed"`) and let the browser compositor interpolate between them rather than manually driving imperative frame loops.
- **Solid Drawing in 3D:** Give flat surfaces believable depth via subtle top inner highlights (`inset 0 1px 0 rgba(255,255,255,0.08)`), crisp `1px` borders, and layered surface luminance.
- **Overall Appeal:** Every detail works in harmony—no single animation shouts over the product's content.

---

## 15. Five High-Craft CSS & Interaction Mechanics

1. **Directional Stepper & Wizard Slides:**
   - Slide the incoming step in from the **direction of travel** (`translateX(20px -> 0)` when advancing to Step $N+1$; `translateX(-20px -> 0)` when returning to Step $N-1$) instead of a directionless crossfade.
2. **Smooth `height: auto` Accordions (`interpolate-size: allow-keywords` + Safari Grid Fallback):**
   - Set `:root { interpolate-size: allow-keywords; }` so `.accordion { height: 0; overflow: clip; transition: height 250ms cubic-bezier(0.77, 0, 0.175, 1); }` smoothly animates to `height: auto` in Chromium.
   - **Cross-Browser Guardrail (Safari / Firefox):** When targeting Safari/iOS or Firefox where `interpolate-size` may not yet be enabled, wrap the collapsible inner `<div>` (`overflow: hidden`) inside a parent with `display: grid; grid-template-rows: 0fr -> 1fr; transition: grid-template-rows 240ms cubic-bezier(0.22, 1, 0.36, 1)` so it never snaps on Apple devices.
   - **Standalone `scale` vs `transform` Guardrail:** If using CSS standalone `button:active { scale: 0.97 }`, ensure `scale` is listed in `transition-property: transform, scale, opacity` (otherwise a rule declaring only `transition-property: transform` will cause `scale: 0.97` to snap in `0ms`).
3. **Instant Theme Switch Guard (`.theme-switching * { transition: none !important }`):**
   - When toggling Dark/Light theme, cards (`300ms`) and text (`150ms`) with different transition durations desynchronize and flash glitchy intermediate contrast. Temporarily add `.theme-switching` to `<html>` during the toggle and remove it two `requestAnimationFrame` ticks later so the entire theme flips crisply in `0ms`.
4. **Tooltip Skip-Delay Warmup (`400ms` first, `0ms` subsequent):**
   - Delay only the **first** tooltip in a toolbar/group (`delayDuration: 400ms`); once one tooltip is open, set `skipDelayDuration` so hovering adjacent tools reveals their tooltips **instantly (`0ms`)**.
5. **Carousel Over-Drag Hyperbolic Resistance:**
   - When pulling a carousel past its first or last item by `pull` pixels, apply asymptotic resistance:
     ```ts
     const over = Math.max(0, pull - 12);
     const offset = 84 * (over / (over + 150));
     ```
     Then spring `offset` back to `0` on release.
