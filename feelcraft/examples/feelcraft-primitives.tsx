/**
 * Feelcraft Reference Implementations (`examples/feelcraft-primitives.tsx`)
 * Battle-tested implementations for the 4 high-craft algorithms that agents
 * most frequently get subtly wrong when coding from scratch:
 *   1. Amazon Safe Triangle (2D Barycentric / Cross-Product Cursor Corridor)
 *   2. 6-Digit OTP Input (Postel Paste-Split + Backspace Nav + `one-time-code`)
 *   3. Optimistic Mutation + Undo Toast Queue with `beforeunload` Flush & Idempotency Key
 *   4. Rubber-Band Drag & Velocity Projection Solver for Swipe-to-Dismiss Sheets
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';

/* ============================================================================
 * 1. AMAZON SAFE TRIANGLE SOLVER
 * Prevents diagonal cursor travel toward an open submenu from triggering
 * sibling menu items.
 * ========================================================================== */
export interface Point { x: number; y: number; }

export function isPointInSafeTriangle(p: Point, a: Point, b: Point, c: Point): boolean {
  const sign = (p1: Point, p2: Point, p3: Point) =>
    (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
  const d1 = sign(p, a, b);
  const d2 = sign(p, b, c);
  const d3 = sign(p, c, a);
  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(hasNeg && hasPos);
}

export function useSafeTriangleSubmenu(
  submenuRef: React.RefObject<HTMLElement | null>,
  side: 'auto' | 'right' | 'left' = 'auto'
) {
  const lastMouse = useRef<Point>({ x: 0, y: 0 });
  const currentMouse = useRef<Point>({ x: 0, y: 0 });
  const delayTimer = useRef<number | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      lastMouse.current = currentMouse.current;
      currentMouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const handleRowEnter = useCallback((onActivate: () => void) => {
    if (delayTimer.current) window.clearTimeout(delayTimer.current);
    const menuEl = submenuRef.current;
    if (!menuEl) {
      onActivate();
      return;
    }
    const rect = menuEl.getBoundingClientRect();
    const resolvedSide =
      side === 'auto'
        ? (window.getComputedStyle(menuEl).direction === 'rtl' ? 'left' : 'right')
        : side;

    const edgeX = resolvedSide === 'right' ? rect.left : rect.right;
    const topCorner: Point = { x: edgeX, y: rect.top - 12 };
    const bottomCorner: Point = { x: edgeX, y: rect.bottom + 12 };

    const movingTowardMenu =
      resolvedSide === 'right'
        ? currentMouse.current.x > lastMouse.current.x
        : currentMouse.current.x < lastMouse.current.x;

    const insideCorridor = isPointInSafeTriangle(
      currentMouse.current,
      lastMouse.current,
      topCorner,
      bottomCorner
    );

    if (movingTowardMenu && insideCorridor) {
      delayTimer.current = window.setTimeout(onActivate, 240);
    } else {
      onActivate();
    }
  }, [submenuRef, side]);

  return { handleRowEnter };
}

/* ============================================================================
 * 2. ONE-TIME CODE (OTP) INPUT WITH POSTEL PASTE-SPLIT & AUTO-SUBMIT
 * ========================================================================== */
export function OtpInput({
  length = 6,
  onComplete,
}: {
  length?: number;
  onComplete: (code: string) => void;
}) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const updateDigits = (next: string[], focusIndex?: number) => {
    setDigits(next);
    if (typeof focusIndex === 'number' && focusIndex >= 0 && focusIndex < length) {
      inputsRef.current[focusIndex]?.focus();
    }
    const joined = next.join('');
    if (joined.length === length && next.every(Boolean)) {
      onComplete(joined);
    }
  };

  const handleChange = (index: number, raw: string) => {
    // Allow clearing via mobile soft-keyboard deletion or text selection
    if (raw === '') {
      const next = [...digits];
      next[index] = '';
      updateDigits(next, index);
      return;
    }
    // Postel's Law: strip any non-digit characters silently
    const clean = raw.replace(/\D/g, '');
    if (!clean) return;

    // Handle multi-character autofill or fast typing into a single box
    if (clean.length > 1) {
      const next = [...digits];
      const slice = clean.slice(0, length - index).split('');
      slice.forEach((char, offset) => {
        next[index + offset] = char;
      });
      updateDigits(next, Math.min(index + slice.length, length - 1));
      return;
    }

    const next = [...digits];
    next[index] = clean[0];
    updateDigits(next, index + 1);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const next = [...digits];
      if (next[index]) {
        next[index] = '';
        updateDigits(next, index);
      } else if (index > 0) {
        next[index - 1] = '';
        updateDigits(next, index - 1);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '');
    if (!pasted) return;
    const next = [...digits];
    const chars = pasted.slice(0, length).split('');
    chars.forEach((ch, i) => {
      next[i] = ch;
    });
    updateDigits(next, Math.min(chars.length, length - 1));
  };

  return (
    <div className="flex items-center gap-2" role="group" aria-label="One-time verification code">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={el => { inputsRef.current[i] = el; }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          pattern="\d*"
          maxLength={length}
          value={digit}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={e => handlePaste(i, e)}
          className="w-11 h-12 text-center text-lg font-medium tabular-nums rounded-lg border focus:outline-none"
        />
      ))}
    </div>
  );
}

/* ============================================================================
 * 3. OPTIMISTIC UNDO TOAST MANAGER WITH `beforeunload` FLUSH & IDEMPOTENCY KEY
 * Ensures deferred destructive mutations never get lost if the user closes
 * the tab during the 5-second Undo grace window.
 * ========================================================================== */
export interface PendingUndoMutation {
  idempotencyKey: string;
  commitUrl: string;
  method?: 'DELETE' | 'POST' | 'PATCH';
  payload?: unknown;
  rollbackUI: () => void;
}

class UndoMutationQueue {
  private pending = new Map<string, { timer: ReturnType<typeof setTimeout>; task: PendingUndoMutation }>();

  constructor() {
    if (typeof window !== 'undefined') {
      const flush = () => this.flushAllKeepalive();
      window.addEventListener('pagehide', flush);
      window.addEventListener('beforeunload', flush);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') flush();
      });
    }
  }

  schedule(task: PendingUndoMutation, graceMs = 5000): () => void {
    const timer = setTimeout(() => {
      this.commit(task.idempotencyKey);
    }, graceMs);

    this.pending.set(task.idempotencyKey, { timer, task });

    // Return the `undo()` handler for the toast button
    return () => {
      const entry = this.pending.get(task.idempotencyKey);
      if (!entry) return;
      clearTimeout(entry.timer);
      this.pending.delete(task.idempotencyKey);
      entry.task.rollbackUI();
    };
  }

  private async commit(key: string) {
    const entry = this.pending.get(key);
    if (!entry) return;
    this.pending.delete(key);
    const { task } = entry;
    try {
      const res = await fetch(task.commitUrl, {
        method: task.method ?? 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': task.idempotencyKey,
        },
        body: task.payload ? JSON.stringify(task.payload) : undefined,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch {
      task.rollbackUI();
    }
  }

  private flushAllKeepalive() {
    for (const [key, { timer, task }] of this.pending.entries()) {
      clearTimeout(timer);
      this.pending.delete(key);
      fetch(task.commitUrl, {
        method: task.method ?? 'DELETE',
        keepalive: true,
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': task.idempotencyKey,
        },
        body: task.payload ? JSON.stringify(task.payload) : undefined,
      }).catch(() => {});
    }
  }
}

export const undoQueue = new UndoMutationQueue();

/* ============================================================================
 * 4. RUBBER-BAND DAMPING & SWIPE-TO-DISMISS VELOCITY SOLVER
 * ========================================================================== */
export function applyRubberBand(delta: number, maxStretch = 84): number {
  if (delta >= 0) return delta; // Normal downward drag
  const over = Math.max(0, Math.abs(delta) - 12);
  // Asymptotic hyperbolic resistance: offset = maxStretch * (over / (over + 150))
  return -maxStretch * (over / (over + 150));
}

export function shouldDismissSheet(
  dragOffsetY: number,
  velocityY_pxPerMs: number,
  sheetHeight: number
): boolean {
  const distanceRatio = dragOffsetY / Math.max(sheetHeight, 1);
  // Dismiss on fast downward flick (>0.5 px/ms) or dragging past 35% height
  return (velocityY_pxPerMs > 0.5 && dragOffsetY > 24) || distanceRatio > 0.35;
}

/* ============================================================================
 * 5. INSTANT THEME SWITCHER (Zero Mismatched Color/Background Transition Lag)
 * Temporarily applies `.theme-switching` to `documentElement` across two
 * animation frames so dark/light toggles snap cleanly in 0ms.
 * ========================================================================== */
export function switchThemeInstant(applyThemeChange: () => void) {
  const root = document.documentElement;
  root.classList.add('theme-switching');
  applyThemeChange();
  // Force style recalc before removing the transition lock
  void window.getComputedStyle(root).opacity;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      root.classList.remove('theme-switching');
    });
  });
}

/* ============================================================================
 * 6. TOOLTIP SKIP-DELAY WARMUP COORDINATOR
 * Delays the first tooltip by 400ms so stray mouse movement doesn't flash popups;
 * once one tooltip opens, adjacent tooltips open in 0ms for the next 350ms.
 * ========================================================================== */
class TooltipWarmupCoordinator {
  private isWarm = false;
  private cooldownTimer: ReturnType<typeof setTimeout> | null = null;

  getDelay(initialDelayMs = 400): number {
    return this.isWarm ? 0 : initialDelayMs;
  }

  notifyOpen() {
    if (this.cooldownTimer) clearTimeout(this.cooldownTimer);
    this.isWarm = true;
  }

  notifyClose(warmWindowMs = 350) {
    if (this.cooldownTimer) clearTimeout(this.cooldownTimer);
    this.cooldownTimer = setTimeout(() => {
      this.isWarm = false;
    }, warmWindowMs);
  }
}

export const tooltipWarmup = new TooltipWarmupCoordinator();

/* ============================================================================
 * 7. GLIDING SEGMENTED PILL POSITIONER
 * Measures active tab offsetLeft/offsetWidth and glides a single thumb element.
 * ========================================================================== */
export function glideSegmentedThumb(
  containerEl: HTMLElement | null,
  thumbEl: HTMLElement | null,
  activeBtnEl: HTMLElement | null
) {
  if (!containerEl || !thumbEl || !activeBtnEl) return;
  thumbEl.style.width = `${activeBtnEl.offsetWidth}px`;
  thumbEl.style.transform = `translateX(${activeBtnEl.offsetLeft}px)`;
}

/* ============================================================================
 * 8. 1px HAIRLINE PROXIMITY SPOTLIGHT (Single rAF Batched Pointer Tracking)
 * Updates `--sx` and `--sy` on sibling cells without causing layout reflow.
 * ========================================================================== */
export function usePointerSpotlight(gridRef: React.RefObject<HTMLElement | null>, cellSelector = '.fc-hairline-spot') {
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !window.matchMedia('(hover: hover)').matches) return;

    let rafId = 0;
    let lastX = -9999;
    let lastY = -9999;

    const update = () => {
      rafId = 0;
      const cells = grid.querySelectorAll<HTMLElement>(cellSelector);
      cells.forEach((cell) => {
        const rect = cell.getBoundingClientRect();
        cell.style.setProperty('--sx', `${lastX - rect.left}px`);
        cell.style.setProperty('--sy', `${lastY - rect.top}px`);
      });
    };

    const onMove = (e: PointerEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!rafId) rafId = window.requestAnimationFrame(update);
    };

    const onLeave = () => {
      lastX = -9999;
      lastY = -9999;
      if (!rafId) rafId = window.requestAnimationFrame(update);
    };

    grid.addEventListener('pointermove', onMove, { passive: true });
    grid.addEventListener('pointerleave', onLeave);
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      grid.removeEventListener('pointermove', onMove);
      grid.removeEventListener('pointerleave', onLeave);
    };
  }, [gridRef, cellSelector]);
}

/* ============================================================================
 * 9. INTERRUPTIBLE HOLD-TO-CONFIRM ANTICIPATION HOOK
 * Drives progress `0 -> 1` while held; releasing early snaps cleanly back to 0.
 * ========================================================================== */
export function useHoldToConfirm(onConfirm: () => void, holdMs = 850) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const rafRef = useRef<number>(0);

  const cancel = useCallback(() => {
    if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    setIsHolding(false);
    setProgress(0);
  }, []);

  const start = useCallback(() => {
    cancel();
    setIsHolding(true);
    const startTime = performance.now();

    const step = (now: number) => {
      const ratio = Math.min(1, (now - startTime) / holdMs);
      setProgress(ratio);
      if (ratio >= 1) {
        setIsHolding(false);
        setProgress(0);
        onConfirm();
        return;
      }
      rafRef.current = window.requestAnimationFrame(step);
    };
    rafRef.current = window.requestAnimationFrame(step);
  }, [cancel, holdMs, onConfirm]);

  useEffect(() => cancel, [cancel]);

  return {
    progress,
    isHolding,
    handlers: {
      onPointerDown: start,
      onPointerUp: cancel,
      onPointerLeave: cancel,
      onPointerCancel: cancel,
    },
  };
}

/* ============================================================================
 * 10. SMOOTH THEME TRANSITION MODES (Crossfade & Origin-Ripple View Transition)
 * Choose proportional to the app: `switchThemeInstant` for dense Operate tools,
 * `switchThemeCrossfade` (~360ms) for celestial/tactile toggles, and
 * `switchThemeRipple` (~440ms radial View Transition) for Showcase surfaces.
 * ========================================================================== */
export function switchThemeCrossfade(applyThemeChange: () => void, durationMs = 360) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    switchThemeInstant(applyThemeChange);
    return;
  }
  const root = document.documentElement;
  root.classList.add('fc-theme-crossfade');
  applyThemeChange();
  window.setTimeout(() => {
    root.classList.remove('fc-theme-crossfade');
  }, durationMs + 20);
}

export function switchThemeRipple(
  applyThemeChange: () => void,
  origin?: { clientX: number; clientY: number } | HTMLElement | null
) {
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => unknown;
  };
  if (!doc.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    switchThemeInstant(applyThemeChange);
    return;
  }

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  if (origin && 'clientX' in origin && (origin.clientX || origin.clientY)) {
    x = origin.clientX;
    y = origin.clientY;
  } else if (origin && 'getBoundingClientRect' in origin) {
    const r = origin.getBoundingClientRect();
    x = r.left + r.width / 2;
    y = r.top + r.height / 2;
  }

  const maxRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );
  const root = document.documentElement;
  root.style.setProperty('--fc-vt-x', `${x}px`);
  root.style.setProperty('--fc-vt-y', `${y}px`);
  root.style.setProperty('--fc-vt-r', `${maxRadius}px`);
  doc.startViewTransition(applyThemeChange);
}

/* ============================================================================
 * 11. RAY-INTERSECTED DIRECTIONAL ENTRY-AWARE HOVER SOLVER
 * Intersects the incoming pointer segment `(p0 -> p1)` against the target box's
 * 4 edges so fast pointer sweeps detect the true entry side accurately.
 * ========================================================================== */
const DIR_VECTORS: Record<0 | 1 | 2 | 3, { x: string; y: string }> = {
  0: { x: '0%', y: '-100%' }, // Top
  1: { x: '100%', y: '0%' },  // Right
  2: { x: '0%', y: '100%' },  // Bottom
  3: { x: '-100%', y: '0%' }, // Left
};

export function detectBoxEntryEdge(
  rect: DOMRect,
  current: Point,
  previous?: Point | null
): 0 | 1 | 2 | 3 {
  if (previous && (previous.x !== current.x || previous.y !== current.y)) {
    const dx = current.x - previous.x;
    const dy = current.y - previous.y;
    const hits: Array<{ t: number; edge: 0 | 1 | 2 | 3 }> = [];

    if (dy > 0 && previous.y <= rect.top && current.y >= rect.top) {
      const t = (rect.top - previous.y) / dy;
      const ix = previous.x + dx * t;
      if (ix >= rect.left - 2 && ix <= rect.right + 2) hits.push({ t, edge: 0 });
    }
    if (dx < 0 && previous.x >= rect.right && current.x <= rect.right) {
      const t = (rect.right - previous.x) / dx;
      const iy = previous.y + dy * t;
      if (iy >= rect.top - 2 && iy <= rect.bottom + 2) hits.push({ t, edge: 1 });
    }
    if (dy < 0 && previous.y >= rect.bottom && current.y <= rect.bottom) {
      const t = (rect.bottom - previous.y) / dy;
      const ix = previous.x + dx * t;
      if (ix >= rect.left - 2 && ix <= rect.right + 2) hits.push({ t, edge: 2 });
    }
    if (dx > 0 && previous.x <= rect.left && current.x >= rect.left) {
      const t = (rect.left - previous.x) / dx;
      const iy = previous.y + dy * t;
      if (iy >= rect.top - 2 && iy <= rect.bottom + 2) hits.push({ t, edge: 3 });
    }

    if (hits.length > 0) {
      hits.sort((a, b) => a.t - b.t);
      return hits[0].edge;
    }
  }

  const nx = (current.x - (rect.left + rect.width / 2)) / Math.max(1, rect.width / 2);
  const ny = (current.y - (rect.top + rect.height / 2)) / Math.max(1, rect.height / 2);
  if (Math.abs(ny) >= Math.abs(nx)) return ny < 0 ? 0 : 2;
  return nx >= 0 ? 1 : 3;
}

export function bindDirectionalHover(cardEl: HTMLElement, wipeEl: HTMLElement) {
  let prev: Point | null = null;
  let curr: Point | null = null;

  const trackMove = (e: PointerEvent) => {
    if (!curr || curr.x !== e.clientX || curr.y !== e.clientY) {
      prev = curr;
      curr = { x: e.clientX, y: e.clientY };
    }
  };
  const onEnter = (e: PointerEvent) => {
    const p1 = { x: e.clientX, y: e.clientY };
    const p0 = curr && (curr.x !== p1.x || curr.y !== p1.y) ? curr : prev;
    const vec = DIR_VECTORS[detectBoxEntryEdge(cardEl.getBoundingClientRect(), p1, p0)];
    wipeEl.style.transition = 'none';
    wipeEl.style.setProperty('--fc-dx', vec.x);
    wipeEl.style.setProperty('--fc-dy', vec.y);
    wipeEl.style.setProperty('--fc-dop', '1');
    void wipeEl.offsetWidth;
    wipeEl.style.transition = '';
    wipeEl.style.setProperty('--fc-dx', '0%');
    wipeEl.style.setProperty('--fc-dy', '0%');
  };
  const onLeave = (e: PointerEvent) => {
    const vec = DIR_VECTORS[detectBoxEntryEdge(cardEl.getBoundingClientRect(), { x: e.clientX, y: e.clientY }, null)];
    wipeEl.style.setProperty('--fc-dx', vec.x);
    wipeEl.style.setProperty('--fc-dy', vec.y);
    wipeEl.style.setProperty('--fc-dop', '0');
  };

  window.addEventListener('pointermove', trackMove, { passive: true, capture: true });
  cardEl.addEventListener('pointerenter', onEnter);
  cardEl.addEventListener('pointerleave', onLeave);

  return () => {
    window.removeEventListener('pointermove', trackMove, true);
    cardEl.removeEventListener('pointerenter', onEnter);
    cardEl.removeEventListener('pointerleave', onLeave);
  };
}

/* ============================================================================
 * 12. INERTIAL RUBBER-BAND SCRUBBER SOLVER (Clamped Value + Over-Pull Tension)
 * Keeps [0, 100] bounded while stretching track via `84 * (over / (over + 150))`.
 * ========================================================================== */
export function computeRubberScrub(clientX: number, rect: DOMRect, maxStretch = 84) {
  const ratio = (clientX - rect.left) / Math.max(1, rect.width);
  const value = Math.max(0, Math.min(100, ratio * 100));
  let stretchPx = 0;

  if (clientX < rect.left) {
    const over = rect.left - clientX;
    stretchPx = -maxStretch * (over / (over + 150));
  } else if (clientX > rect.right) {
    const over = clientX - rect.right;
    stretchPx = maxStretch * (over / (over + 150));
  }

  return { value, stretchPx };
}

/* ============================================================================
 * 13. RADIAL atan2 GRAPHIC-TOOL WHEEL SOLVER (Deadzone + Clamping + Polar Ray)
 * Computes 0..sectorCount-1 from 12 o'clock clockwise with center cancel guard.
 * ========================================================================== */
export interface RadialWheelHit {
  sectorIndex: number; // -1 inside center cancel deadzone
  angleDeg: number;
  distancePx: number;
  rayEndpoint: Point;
}

export function clampRadialCenter(
  pointerX: number,
  pointerY: number,
  padding = 134
): Point {
  return {
    x: Math.min(window.innerWidth - padding, Math.max(padding, pointerX)),
    y: Math.min(window.innerHeight - padding, Math.max(padding, pointerY)),
  };
}

export function resolveRadialWheelHit(
  pointerX: number,
  pointerY: number,
  wheelCenter: Point,
  sectorCount = 6,
  deadzonePx = 26,
  svgCenter = 128
): RadialWheelHit {
  const dx = pointerX - wheelCenter.x;
  const dy = pointerY - wheelCenter.y;
  const distancePx = Math.hypot(dx, dy);
  const angleDeg = (Math.atan2(dy, dx) * (180 / Math.PI) + 360 + 90) % 360;

  if (distancePx < deadzonePx) {
    return {
      sectorIndex: -1,
      angleDeg,
      distancePx,
      rayEndpoint: { x: svgCenter, y: svgCenter },
    };
  }

  const sectorDeg = 360 / sectorCount;
  const sectorIndex = Math.round(angleDeg / sectorDeg) % sectorCount;
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  const clampedRay = Math.min(104, Math.max(48, distancePx));

  return {
    sectorIndex,
    angleDeg,
    distancePx,
    rayEndpoint: {
      x: svgCenter + Math.cos(rad) * clampedRay,
      y: svgCenter + Math.sin(rad) * clampedRay,
    },
  };
}

export function shouldCommitRadialRelease(openedAtMs: number, debounceMs = 180): boolean {
  return performance.now() - openedAtMs > debounceMs;
}
