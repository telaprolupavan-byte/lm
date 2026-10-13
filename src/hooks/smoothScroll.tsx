import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react';
import { useReducedMotionPref } from './useMedia';

type ScrollApi = {
  scrollTo: (target: string | HTMLElement | number, opts?: { offset?: number; immediate?: boolean }) => void;
  lock: () => void;
  unlock: () => void;
};

const ScrollCtx = createContext<ScrollApi | null>(null);

/**
 * Page scrolling is native — it follows the wheel, trackpad and touch exactly, with no
 * smoothing lag. This provider only adds animated jumps to sections and a scroll lock for overlays.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotionPref();
  const locks = useRef(0);

  const scrollTo = useCallback<ScrollApi['scrollTo']>(
    (target, opts = {}) => {
      const offset = opts.offset ?? -72;
      let top: number;
      if (typeof target === 'number') {
        top = target;
      } else {
        const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
        if (!el) return;
        top = el.getBoundingClientRect().top + window.scrollY + offset;
      }
      window.scrollTo({ top, behavior: opts.immediate || reduced ? 'auto' : 'smooth' });
    },
    [reduced],
  );

  const lock = useCallback(() => {
    locks.current += 1;
    document.documentElement.style.overflow = 'hidden';
    // Lets ambient effects (e.g. particles) pause while an overlay covers the page.
    document.documentElement.dataset.locked = '1';
  }, []);

  const unlock = useCallback(() => {
    locks.current = Math.max(0, locks.current - 1);
    if (locks.current === 0) {
      document.documentElement.style.overflow = '';
      delete document.documentElement.dataset.locked;
    }
  }, []);

  return <ScrollCtx.Provider value={{ scrollTo, lock, unlock }}>{children}</ScrollCtx.Provider>;
}

export function useSmoothScroll() {
  const ctx = useContext(ScrollCtx);
  if (!ctx) throw new Error('useSmoothScroll must be used inside SmoothScrollProvider');
  return ctx;
}

/** Locks page scroll while `active` is true (used by overlays). */
export function useScrollLock(active: boolean) {
  const { lock, unlock } = useSmoothScroll();
  useEffect(() => {
    if (!active) return;
    lock();
    return unlock;
  }, [active, lock, unlock]);
}
