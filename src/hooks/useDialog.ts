import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), iframe, input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Open dialogs, innermost last — only the top one reacts to Esc and Tab. */
const stack: symbol[] = [];

/**
 * Accessible dialog behaviour for an overlay rendered into `ref`:
 * moves focus in on open (to `initialFocus`, else the first focusable element),
 * keeps Tab / Shift+Tab inside, closes on Esc when it's the topmost dialog,
 * and returns focus to whatever was focused before it opened.
 * The container should have `tabIndex={-1}` so it can hold focus when it has no controls.
 */
export function useDialog(ref: RefObject<HTMLElement | null>, opts: { onClose: () => void; initialFocus?: RefObject<HTMLElement | null> }) {
  const onClose = useRef(opts.onClose);
  onClose.current = opts.onClose;
  const initialFocus = opts.initialFocus;

  useEffect(() => {
    const id = Symbol('dialog');
    stack.push(id);
    const previous = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(ref.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter((el) => el.offsetParent !== null || el === document.activeElement);

    const raf = requestAnimationFrame(() => {
      const target = initialFocus?.current ?? focusables()[0] ?? ref.current;
      target?.focus({ preventScroll: true });
    });

    const onKey = (e: KeyboardEvent) => {
      if (stack[stack.length - 1] !== id) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose.current();
        return;
      }
      if (e.key !== 'Tab' || !ref.current) return;
      const items = focusables();
      if (!items.length) {
        e.preventDefault();
        ref.current.focus({ preventScroll: true });
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (!ref.current.contains(active)) {
        e.preventDefault();
        first.focus({ preventScroll: true });
      } else if (e.shiftKey && (active === first || active === ref.current)) {
        e.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus({ preventScroll: true });
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey);
      stack.splice(stack.indexOf(id), 1);
      if (previous && document.contains(previous)) previous.focus({ preventScroll: true });
    };
    // Runs once per open: the dialog's identity doesn't change while it's mounted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
