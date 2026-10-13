import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { sectionMeta, views, type SectionId, type ViewId } from '../data/portfolio';
import { useScrollLock, useSmoothScroll } from '../hooks/smoothScroll';
import { useDesktop } from '../hooks/useMedia';
import { LogoMark } from './Artwork';
import { ViewAvatar } from './ViewAvatar';
import { EASE } from './fx';

export default function Navbar({ order, viewId, onSwitch }: { order: SectionId[]; viewId: ViewId; onSwitch: (id: ViewId) => void }) {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [active, setActive] = useState<string>('top');
  const { scrollTo } = useSmoothScroll();
  const desktop = useDesktop();
  const menuRef = useRef<HTMLDivElement>(null);
  const viewBtn = useRef<HTMLButtonElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);

  useScrollLock(mobileNav);

  // The full-screen menu only exists below lg: don't leave the page locked if the window grows past it.
  useEffect(() => {
    if (desktop) setMobileNav(false);
  }, [desktop]);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 40);
    setHidden(y > 400 && y > prev && !menu && !mobileNav);
  });

  useEffect(() => {
    const ids = ['top', ...order];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [order]);

  useEffect(() => {
    if (!menu) return;
    const close = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenu(false);
    };
    window.addEventListener('pointerdown', close);
    return () => window.removeEventListener('pointerdown', close);
  }, [menu]);

  // Esc closes whichever menu is open and returns focus to the button that opened it.
  useEffect(() => {
    if (!menu && !mobileNav) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (menu) {
        setMenu(false);
        viewBtn.current?.focus();
      }
      if (mobileNav) {
        setMobileNav(false);
        menuBtn.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menu, mobileNav]);

  const go = (id: string) => {
    setMobileNav(false);
    // Keep the address bar on the current section so it can be shared or bookmarked.
    history.replaceState(history.state, '', id === 'top' ? location.pathname + location.search : `#${id}`);
    // Next frame: the mobile menu's scroll lock has been released by then.
    requestAnimationFrame(() => scrollTo(`#${id}`, { offset: id === 'top' ? 0 : -64 }));
  };

  const current = views.find((v) => v.id === viewId)!;

  return (
    <>
      <AnimatePresence>
        {mobileNav && (
          <motion.div
            key="scrim"
            aria-hidden
            className="fixed inset-0 z-[59] bg-black/70 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={() => setMobileNav(false)}
          />
        )}
      </AnimatePresence>
      <motion.header
        className="fixed inset-x-0 top-0 z-[60]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.45, ease: EASE, opacity: { duration: 1, ease: EASE } }}
        onBlur={(e) => {
          // Tabbing out of an open menu closes it.
          const to = e.relatedTarget as Node | null;
          if (!to) return;
          if (menu && !menuRef.current?.contains(to)) setMenu(false);
          if (mobileNav && !e.currentTarget.contains(to)) setMobileNav(false);
        }}
      >
        <div
          className={`gutter flex h-16 items-center justify-between gap-6 transition-[background] duration-500 md:h-[72px] ${
            solid || mobileNav ? 'bg-ink/95' : 'bg-gradient-to-b from-black/80 to-transparent'
          }`}
        >
          <div className="flex items-center gap-8 lg:gap-6 xl:gap-10">
            <button type="button" onClick={() => go('top')} className="text-[22px]" aria-label="Back to top">
              <LogoMark />
            </button>
            <nav className="hidden items-center gap-4 lg:flex xl:gap-6" aria-label="Sections">
              <NavLink label="Home" active={active === 'top'} onClick={() => go('top')} />
              {order.map((id) => (
                <NavLink key={id} label={sectionMeta[id].nav} active={active === id} onClick={() => go(id)} />
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => go('contact')}
              className="hidden whitespace-nowrap rounded-full border border-white/15 px-4 py-1.5 text-xs font-semibold tracking-[0.14em] text-bone transition hover:border-crimson-2 hover:text-crimson-2 sm:block"
            >
              LET&apos;S TALK
            </button>
            <div className="relative" ref={menuRef}>
              <button
                ref={viewBtn}
                type="button"
                onClick={() => setMenu((m) => !m)}
                aria-expanded={menu}
                aria-controls="view-menu"
                aria-label={`${current.name} view. Change view`}
                className="flex min-h-11 items-center gap-2 rounded-md p-1"
              >
                <ViewAvatar id={viewId} />
                <motion.span animate={{ rotate: menu ? 180 : 0 }} className="text-[10px] text-mist">
                  ▼
                </motion.span>
              </button>
              <AnimatePresence>
                {menu && (
                  <motion.div
                    id="view-menu"
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="absolute right-0 top-12 w-64 origin-top-right rounded-xl border border-white/10 bg-ink-2/95 p-2 shadow-2xl"
                  >
                    <p className="px-3 pb-2 pt-1 text-[10px] font-semibold tracking-[0.24em] text-smoke">VIEW THE PORTFOLIO AS</p>
                    {views.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        aria-current={p.id === viewId || undefined}
                        onClick={() => {
                          onSwitch(p.id);
                          setMenu(false);
                        }}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-white/5 ${p.id === viewId ? 'bg-white/[0.06]' : ''}`}
                      >
                        <ViewAvatar id={p.id} />
                        <span>
                          <span className="block text-sm text-bone">{p.name}</span>
                          <span className="block text-balance text-[11px] text-smoke">{p.blurb}</span>
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              ref={menuBtn}
              type="button"
              className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
              aria-label={mobileNav ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileNav}
              aria-controls="mobile-nav"
              onClick={() => setMobileNav((v) => !v)}
            >
              <motion.span className="block h-0.5 w-5 bg-bone" animate={{ rotate: mobileNav ? 45 : 0, y: mobileNav ? 4 : 0 }} />
              <motion.span className="block h-0.5 w-5 bg-bone" animate={{ rotate: mobileNav ? -45 : 0, y: mobileNav ? -4 : 0 }} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileNav && (
            <motion.nav
              id="mobile-nav"
              aria-label="Sections"
              className="gutter max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-b border-white/5 bg-ink/95 pb-6 pt-2 md:max-h-[calc(100dvh-72px)] lg:hidden"
              initial={{ clipPath: 'inset(0 0 100% 0)' }}
              animate={{ clipPath: 'inset(0 0 0% 0)' }}
              exit={{ clipPath: 'inset(0 0 100% 0)' }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              {[{ id: 'top', label: 'Home' }, ...order.map((id) => ({ id, label: sectionMeta[id].nav })), { id: 'contact', label: "Let's Talk" }].map((l, i) => (
                <motion.button
                  key={l.id}
                  type="button"
                  onClick={() => go(l.id)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className={`block w-full py-2.5 text-left font-display text-[1.75rem] tracking-wide ${active === l.id ? 'text-crimson-2' : 'text-bone'}`}
                >
                  {l.label}
                </motion.button>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}

function NavLink({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`relative whitespace-nowrap text-[13px] font-medium transition ${active ? 'text-bone' : 'text-mist hover:text-bone'}`}>
      {label}
      {active && <motion.span layoutId="nav-underline" className="absolute -bottom-1.5 left-0 right-0 h-[2px] rounded bg-crimson" />}
    </button>
  );
}
