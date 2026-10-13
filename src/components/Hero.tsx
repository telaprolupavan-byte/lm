import { useRef } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { education, experience, profile } from '../data/portfolio';
import { useFinePointer, useReducedMotionPref } from '../hooks/useMedia';
import { useSmoothScroll } from '../hooks/smoothScroll';
import { EASE, Magnetic, Particles } from './fx';
import { Portrait } from './Portrait';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } } };
const item = {
  hidden: { opacity: 0, y: 28, filter: 'blur(10px)' },
  // transitionEnd clears the filter: even blur(0px) keeps a filter on the element.
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' }, transition: { duration: 0.9, ease: EASE } },
};

const now = experience[0];
const degree = education[0];

/** Who, where, what — the facts a recruiter scans for first. Lower-priority items drop out on narrow screens. */
const meta = [
  { text: `Now at ${now.company}`, className: 'flex' },
  { text: now.place, className: 'flex' },
  { text: `M.S. CS · GVSU ${degree.period.slice(-4)}`, className: 'hidden sm:flex' },
];

const floating = [
  { text: '1M+ rows', sub: 'Queried in Snowflake', pos: 'left-[0%] top-[50%]', depth: 1 },
  { text: '10 hrs/week', sub: 'Saved by automation', pos: 'right-[0%] top-[18%]', depth: -1 },
];

export default function Hero({ onTour, onResume }: { onTour: () => void; onResume: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotionPref();
  const { scrollTo } = useSmoothScroll();
  const photo = Boolean(profile.portrait);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const blackout = useTransform(scrollYProgress, [0.35, 1], [0, 1]);

  // pointer parallax (desktop)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 60, damping: 18 });
  const py = useSpring(my, { stiffness: 60, damping: 18 });
  const imgRotY = useTransform(px, [-1, 1], [-4, 4]);
  const imgRotX = useTransform(py, [-1, 1], [3, -3]);
  const imgShiftX = useTransform(px, [-1, 1], [-10, 10]);
  const chipX = useTransform(px, [-1, 1], [18, -18]);
  const chipY = useTransform(py, [-1, 1], [12, -12]);
  const glowX = useTransform(px, [-1, 1], ['-6%', '6%']);

  // Touch screens get no scroll fade on the copy, so the buttons never dim under a thumb.
  const copyStyle = !fine ? undefined : reduced ? { opacity: fade } : { y: textY, opacity: fade };

  return (
    <section
      id="top"
      ref={ref}
      className="relative min-h-[100svh] overflow-hidden"
      onPointerMove={(e) => {
        if (!fine || reduced) return;
        mx.set((e.clientX / window.innerWidth) * 2 - 1);
        my.set((e.clientY / window.innerHeight) * 2 - 1);
      }}
    >
      {/* atmosphere */}
      <motion.div aria-hidden className="absolute inset-0" style={{ x: glowX }}>
        <div className="absolute right-[-10%] top-[-10%] h-[90vh] w-[80vw] rounded-full bg-[radial-gradient(closest-side,rgba(229,19,43,0.38),rgba(229,19,43,0.08)_55%,transparent)] blur-2xl lg:right-[-4%] lg:w-[60vw]" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[70vh] w-[60vw] rounded-full bg-[radial-gradient(closest-side,rgba(90,20,120,0.25),transparent)] blur-2xl" />
      </motion.div>
      <Particles className="z-[1]" />
      {/* desktop only: on narrow screens the streaks would cross the intro text */}
      <div aria-hidden className="absolute inset-0 z-[1] hidden overflow-hidden lg:block">
        <span className="light-streak left-[40%] top-[22%] w-[50vw]" style={{ animationDelay: '1.2s' }} />
        <span className="light-streak left-[52%] top-[72%] w-[40vw]" style={{ animationDelay: '3.6s' }} />
        <span className="light-streak left-[55%] top-[44%] w-[30vw]" style={{ animationDelay: '5.2s' }} />
      </div>

      {/* portrait */}
      <motion.div
        className="absolute inset-x-0 top-12 z-[2] flex h-[42svh] items-end justify-center sm:h-[70svh] lg:bottom-0 lg:left-auto lg:right-[3vw] lg:top-20 lg:h-auto lg:w-[54vw] xl:right-[6vw] xl:w-[48vw]"
        style={reduced ? { opacity: fade } : { y: imgY, opacity: fade }}
      >
        <motion.div
          className="relative h-full w-full lg:h-[86vh]"
          style={{ rotateY: imgRotY, rotateX: imgRotX, x: imgShiftX, transformPerspective: 1200 }}
          initial={{ clipPath: 'inset(100% -30% -10% -30%)', opacity: 0 }}
          animate={{ clipPath: 'inset(-30% -30% -10% -30%)', opacity: 1 }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.1 }}
        >
          {/* rim light ring — frames a photo; the data art draws its own glow */}
          {photo && (
            <div aria-hidden className="absolute bottom-[8%] left-1/2 h-[78%] w-[78%] -translate-x-1/2 rounded-full border border-crimson-2/20 shadow-[0_0_120px_rgba(229,19,43,0.35),inset_0_0_80px_rgba(229,19,43,0.18)]" />
          )}
          <Portrait
            sizes="(max-width: 1024px) 100vw, 54vw"
            className="absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 object-contain object-bottom drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)] [mask-image:linear-gradient(to_bottom,black_62%,transparent_97%)]"
          />
          {/* crimson rim light on the photo's edge, sized to fade out inside the box */}
          {photo && (
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_38%_at_60%_40%,rgba(255,61,90,0.16),transparent)] mix-blend-screen" />
          )}

          {/* floating UI chips */}
          {floating.map((f, i) => (
            <FloatChip key={f.text} {...f} index={i} mx={chipX} my={chipY} />
          ))}
        </motion.div>
      </motion.div>

      {/* readability gradients */}
      <div aria-hidden className="absolute inset-x-0 top-[24svh] z-[3] h-[36svh] bg-gradient-to-b from-transparent via-ink/70 to-ink sm:top-[40svh] lg:hidden" />
      <div aria-hidden className="absolute inset-0 z-[3] hidden bg-[linear-gradient(90deg,var(--color-ink)_0%,rgba(7,7,10,0.7)_32%,transparent_58%)] lg:block" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 z-[3] h-48 bg-gradient-to-t from-ink to-transparent" />

      {/* copy */}
      <motion.div
        className="gutter relative z-[4] flex min-h-[100svh] flex-col justify-end pb-16 pt-[36svh] sm:pb-20 sm:pt-[54svh] lg:max-w-[52vw] lg:justify-center lg:pb-24 lg:pt-24"
        style={copyStyle}
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.h1 variants={item} className="font-display leading-[0.82] tracking-[0.02em] text-bone" style={{ fontSize: 'clamp(4rem, 12vw, 11rem)' }}>
          <span className="shimmer-text block">{profile.firstName}</span>{' '}
          <span className="mt-[0.08em] block text-[0.4em] leading-none tracking-[0.14em] text-bone/90">{profile.lastName}</span>
        </motion.h1>
        <motion.p variants={item} className="mt-3 font-sans text-sm font-bold tracking-[0.5em] text-crimson-2 sm:text-base">
          {profile.role.toUpperCase()}
        </motion.p>

        {/* Each item carries its own leading dot; the negative margin + overflow clip hides the dot that starts a line. */}
        <motion.div variants={item} className="mt-5 overflow-hidden">
          <ul className="-ml-4 flex flex-wrap items-center gap-y-1 text-[13px] font-medium text-mist">
            {meta.map((m) => (
              <li
                key={m.text}
                className={`items-center whitespace-nowrap before:mx-1.5 before:h-1 before:w-1 before:rounded-full before:bg-smoke before:content-[''] ${m.className}`}
              >
                {m.text}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.p variants={item} className="mt-4 max-w-xl text-[15px] leading-relaxed text-bone/80 sm:text-base">
          {profile.intro}
        </motion.p>

        <motion.div variants={item} className="mt-6 flex items-center gap-3 sm:mt-8">
          <Magnetic className="flex-1 sm:flex-none">
            <button
              type="button"
              data-cursor="play"
              onClick={onTour}
              className="flex min-h-12 w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-md bg-bone px-4 py-3 text-[15px] font-bold text-ink transition hover:bg-white sm:gap-3 sm:px-8"
            >
              <span className="text-lg" aria-hidden>
                ▶
              </span>{' '}
              Quick Tour
            </button>
          </Magnetic>
          <Magnetic className="flex-1 sm:flex-none">
            <button
              type="button"
              onClick={onResume}
              className="glass flex min-h-12 w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-md px-4 py-3 text-[15px] font-semibold text-bone transition hover:bg-white/15 sm:gap-3 sm:px-8"
            >
              <DocumentIcon /> View Resume
            </button>
          </Magnetic>
          <button
            type="button"
            onClick={() => scrollTo('#about')}
            aria-label="More info"
            className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/30 text-lg text-bone transition hover:border-bone hover:bg-white/10 sm:flex"
          >
            ⓘ
          </button>
        </motion.div>

        {profile.email && (
          <motion.p variants={item} className="mt-4 text-sm text-mist">
            <a
              href={`mailto:${profile.email}`}
              className="underline decoration-white/25 underline-offset-4 transition hover:text-bone hover:decoration-crimson-2"
            >
              {profile.email}
            </a>
          </motion.p>
        )}
      </motion.div>

      <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-[5] bg-ink" style={{ opacity: blackout }} />
    </section>
  );
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 16 20" className="h-[18px] w-auto" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2.5 1.5H10l4.5 4.5v11.5a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1z" />
      <path d="M10 1.5V6h4.5M4.5 10h7M4.5 13h7M4.5 16h4" />
    </svg>
  );
}

type MV = ReturnType<typeof useTransform<number, number>>;

function FloatChip({ text, sub, pos, depth, index, mx, my }: { text: string; sub: string; pos: string; depth: number; index: number; mx: MV; my: MV }) {
  const x = useTransform(mx, (n: number) => n * depth);
  const y = useTransform(my, (n: number) => n * depth);
  return (
    <motion.div
      className={`glass absolute hidden rounded-xl px-4 py-2.5 xl:block ${pos}`}
      style={{ x, y }}
      initial={{ opacity: 0, filter: 'blur(6px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
      transition={{ duration: 0.9, delay: 1.2 + index * 0.18, ease: EASE }}
    >
      {/* CSS float: runs on the compositor instead of a JavaScript frame loop */}
      <div className="float-y" style={{ animationDuration: `${5 + index}s` }}>
        <p className="text-sm font-semibold text-bone">{text}</p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-mist">{sub}</p>
      </div>
    </motion.div>
  );
}
